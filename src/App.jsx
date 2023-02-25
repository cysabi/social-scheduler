import { useState, useEffect, useMemo } from "react";
import {
  format,
  isSameDay,
  add,
  differenceInMinutes,
  areIntervalsOverlapping,
  startOfDay,
} from "date-fns";
import ical from "ical";
import { rrulestr } from "rrule";
import Redirect from "./components/Redirect";
import FilterSection, { DayFilter, TopicsFilter } from "./components/filters";
import BlockSection from "./components/block";
import ConfirmDialog from "./components/ConfirmDialog";
import config from "./config";

const weeks = 3;

const rules = {
  lunch: (b) => b.summary?.includes("Lunch"),
  dinner: (b) => b.summary?.includes("Dinner"),
  work: (b) => b.summary?.includes("Work") && b.date.getHours() < 17,
  afternoon: (b) => b.date.getHours() >= 12 && b.date.getHours() < 18,
  evening: (b) => b.date.getHours() >= 18,
};

const App = () => {
  const cal = useCalendar(config.cal);
  const plans = config.plans.map((plan) => useCalendar(plan));

  const [day, setDay] = useState("");
  const [block, setBlock] = useState("");
  const [topics, setTopics] = useState([]);

  const blocks = useBlocks(
    cal?.data,
    plans?.map((p) => p?.data),
    topics
  );
  const [dates, enabledDates] = useDates(blocks);

  useEffect(() => {
    if (
      enabledDates.length > 0 &&
      (day === "" || !enabledDates.find((d) => isSameDay(d.date, day)))
    ) {
      setDay(enabledDates[0].date);
    }
  }, [enabledDates, day]);

  return (
    <Redirect error={cal?.error}>
      <div className="max-w-xl h-screen p-4 mx-auto flex flex-col gap-4 sm:gap-8">
        <h1 className="font-bold text-xl sm:text-2xl text-center">
          {config.name}'s Social Scheduler
        </h1>
        <div className="border-t-2 border-slate-700" />
        <div className="bg-slate-800 items-center justify-between">
          <FilterSection>
            <TopicsFilter topics={topics} setTopics={setTopics} />
            <DayFilter
              value={day}
              onChange={setDay}
              dates={dates}
              disabled={(d) => !enabledDates.includes(d)}
            />
          </FilterSection>
        </div>
        <div className="border-t-2 border-slate-700" />
        <BlockSection
          day={day}
          value={block}
          onChange={setBlock}
          blocks={blocks}
        />
      </div>
      <ConfirmDialog block={block} setBlock={setBlock} />
    </Redirect>
  );
};

const useBlocks = (data, plansData, topics) => {
  const blocks = useMemo(() => {
    if (!data || plansData.includes(undefined)) return [];

    const now = new Date();
    const then = add(now, { weeks });
    const blocks = [];
    Object.values(data)
      .filter((event) => event.type === "VEVENT")
      .forEach((event) => {
        if (event.rrule) {
          rrulestr(event.rrule.toString())
            .between(now, then)
            .forEach((occurrence) => {
              blocks.push({
                ...event,
                date: occurrence,
                endDate: add(occurrence, {
                  minutes: differenceInMinutes(event.end, event.start),
                }),
                id: event.uid + occurrence.toString(),
              });
            });
        } else if (then > event.start && event.start > now) {
          blocks.push({
            ...event,
            date: event.start,
            endDate: event.end,
            id: event.uid,
          });
        }
      });

    const planBlocks = [];
    plansData
      .flatMap((p) => Object.values(p))
      .filter((event) => (event.type = "VEVENT"))
      .forEach((event) => {
        if (event.recurrences) {
          Object.entries(event.recurrences).forEach((val) => {
            const occurrence = val[1].start;
            if (then > occurrence && occurrence > now) {
              planBlocks.push({
                ...event,
                date: occurrence,
                endDate: add(occurrence, {
                  minutes: differenceInMinutes(event.end, event.start),
                }),
                id: event.uid + occurrence.toString(),
              });
            }
          });
        }
        if (then > event.start && event.start > now) {
          planBlocks.push({
            ...event,
            date: event.start,
            endDate: event.end,
            id: event.uid,
          });
        }
      });
    return blocks.filter(
      (b) =>
        planBlocks.filter((p) =>
          areIntervalsOverlapping(
            { start: b.date, end: b.endDate },
            { start: p.date, end: p.endDate }
          )
        ).length === 0
    );
  }, [data, plansData]);

  const filteredBlocks = useMemo(() => {
    if (!blocks.length) return [];

    return blocks.filter((b) => {
      return topics.length === 0
        ? true
        : topics.reduce((p, t) => (p ? p : rules[t](b)), false);
    });
  }, [blocks, topics]);

  return filteredBlocks;
};

const useDates = (blocks) => {
  const [dates, enabledDates] = useMemo(() => {
    const today = startOfDay(new Date());
    const dates = Array.from({ length: weeks * 7 }, (_, i) => {
      const nextDate = add(today, { days: i });
      return {
        date: nextDate,
        month: format(nextDate, "LLL"),
        day: format(nextDate, "d"),
        weekDay: format(nextDate, "EEE"),
        altLabel:
          nextDate.getTime() === today.getTime()
            ? "Today"
            : nextDate.getTime() === today.getTime() + 60 * 60 * 24000
            ? "Tmrw"
            : undefined,
      };
    });
    const enabledDates = dates.filter(
      (d) => blocks.filter((b) => isSameDay(b.date, d.date)).length !== 0
    );
    return [dates, enabledDates];
  }, [blocks]);

  return [dates, enabledDates];
};

const useCalendar = (url) => {
  const [cal, setCal] = useState();

  useEffect(() => {
    fetch("https://corsproxy.io/?" + url)
      .then((resp) => {
        if (resp.ok) {
          resp.text().then((text) => setCal({ data: ical.parseICS(text) }));
        } else {
          resp.text().then((text) => setCal({ error: text }));
        }
      })
      .catch((error) => {
        setCal({ error: error.message });
      });
  }, [url]);

  return cal;
};

export default App;
