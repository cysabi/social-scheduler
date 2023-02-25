import { useState, useEffect, useMemo } from "react";
import {
  format,
  isSameDay,
  add,
  differenceInMinutes,
  getDay,
  areIntervalsOverlapping,
} from "date-fns";
import ical from "ical";
import { rrulestr } from "rrule";
import { Redirect } from "./components/request";
import FilterSection, { DayFilter, TopicsFilter } from "./components/filters";
import BlockSection from "./components/block";
import DetailsSection from "./components/DetailsSection";
import config from "./config";

const App = () => {
  const cal = useCalendar(config.cal);
  const plans = config.plans.map((plan) => useCalendar(plan));

  const [day, setDay] = useState("");
  const [block, setBlock] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
      !enabledDates.find((d) => isSameDay(d.date, day))
    ) {
      setDay(enabledDates[0].date);
    }
  }, [enabledDates, day]);

  useEffect(() => {
    const queryParams = window.location.search;
    if (queryParams.includes("lunch")) {
      setLunch(true);
    }
    if (queryParams.includes("dinner")) {
      setDinner(true);
    }
    if (queryParams.includes("work")) {
      setWork(true);
    }
    if (queryParams.includes("afternoon")) {
      setAfternoon(true);
    }
    if (queryParams.includes("evening")) {
      setEvening(true);
    }
  }, []);

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
          onChange={(v) => {
            setBlock(v);
            setIsOpen(true);
          }}
          blocks={blocks}
        />
      </div>
      <DetailsSection block={block} isOpen={isOpen} setIsOpen={setIsOpen} />
    </Redirect>
  );
};

const useBlocks = (data, plansData, topics) => {
  const now = new Date();
  const then = add(now, { weeks: 8 });

  const blocks = useMemo(() => {
    if (!data || plansData.includes(undefined)) return [];

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
        } else if (event.start > now) {
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
            planBlocks.push({
              ...event,
              date: occurrence,
              endDate: add(occurrence, {
                minutes: differenceInMinutes(event.end, event.start),
              }),
              id: event.uid + occurrence.toString(),
            });
          });
        }
        if (event.start > now) {
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
      const rules = {
        lunch: () => b.summary?.includes("Lunch"),
        dinner: () => b.summary?.includes("Dinner"),
        work: () => b.summary?.includes("Work") && b.date.getHours() < 17,
        afternoon: () => b.date.getHours() >= 12 && b.date.getHours() < 18,
        evening: () => b.date.getHours() >= 18,
      };
      return topics.length === 0
        ? true
        : topics.reduce((p, t) => (p ? p : rules[t]()), false);
    });
  }, [blocks, topics]);

  return filteredBlocks;
};

const useDates = (blocks) => {
  const weeks = 4;
  const [dates, enabledDates] = useMemo(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const dates = Array.from(
      { length: weeks * 7 - getDay(today) + 1 },
      (_, i) => {
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
      }
    );
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
