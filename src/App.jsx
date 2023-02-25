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
import Section from "./components/Section";
import BlockSection from "./components/block";
import DaySection from "./components/day";
import DetailsSection from "./components/DetailsSection";
import config from "./config";
import Filters from "./components/Filters";

const App = () => {
  const cal = useCalendar(config.cal);
  const plans = config.plans.map((plan) => useCalendar(plan));

  const [weeks, setWeeks] = useState(4);
  const [day, setDay] = useState("");
  const [block, setBlock] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  //filters
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [work, setWork] = useState(false);
  const [afternoon, setAfternoon] = useState(false);
  const [evening, setEvening] = useState(false);

  const filterFn = (block) => {
    if (lunch && block.summary?.includes("Lunch")) return true;
    if (dinner && block.summary?.includes("Dinner")) return true;
    if (work && block.summary?.includes("Work") && block.date.getHours() < 17)
      return true;
    if (afternoon && block.date.getHours() >= 12 && block.date.getHours() < 18)
      return true;
    if (evening && block.date.getHours() >= 18) return true;
    if (!lunch && !dinner && !work && !afternoon && !evening) return true;
    return false;
  };

  const setBlockShowDetails = (block) => {
    setBlock(block);
    setIsOpen(true);
  };

  const blocks = useBlocks(
    cal?.data,
    plans?.map((p) => p?.data)
  );
  const [dates, enabledDates] = useDates(blocks, weeks, filterFn);

  useEffect(() => {
    if (
      enabledDates.length > 0 &&
      !enabledDates.find((d) => d.date.toString() === day.toString())
    ) {
      setDay(enabledDates[0].date);
    }
  }, [enabledDates, day]);

  return (
    <Redirect error={cal?.error}>
      <div className="max-w-lg box-content px-4 mx-auto flex flex-col mt-64 gap-4 sm:my-20 sm:gap-20">
        <div className="fixed top-0 left-0 right-0 h-16 bg-slate-800 items-center justify-between px-4">
          <div className="bg-slate-800 border-b-2 border-slate-500">
            <h1 className="font-bold text-lg text-center my-4">
              Schedule a time with {config.name}
            </h1>
            <Section
              logo={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              }
              title={
                <span className="inline-flex gap-2.5 flex-wrap items-center">
                  <span>Pick a day</span>
                </span>
              }
            >
              <DaySection
                value={day}
                onChange={setDay}
                dates={dates}
                disabled={(d) => !enabledDates.includes(d)}
              />
            </Section>
            <div className="flex items-center gap-3 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 shrink-0 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-lg uppercase font-semibold tracking-wider text-slate-300">
                <span className="inline-flex gap-2.5 flex-wrap items-center">
                  <span>Pick an event</span>
                </span>
              </h2>
            </div>
            <Filters
              lunch={lunch}
              setLunch={setLunch}
              dinner={dinner}
              setDinner={setDinner}
              work={work}
              setWork={setWork}
              afternoon={afternoon}
              setAfternoon={setAfternoon}
              evening={evening}
              setEvening={setEvening}
            />
          </div>
        </div>
        <Section>
          {day ? (
            getUpcomingWeek(day).map((day) => (
              <div key={day.getTime()}>
                <div className="text-right bg-slate-600 px-2 rounded-md text-xs mb-4">
                  {format(day, "EEEE, LLL do")}
                </div>
                <BlockSection
                  value={block}
                  onChange={setBlockShowDetails}
                  blocks={blocks
                    .filter((b) => isSameDay(b.date, day))
                    .filter((b) => filterFn(b))}
                />
              </div>
            ))
          ) : (
            <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4">
              <p className="w-full text-center text-slate-400">
                Loading Blocks...
              </p>
            </div>
          )}
        </Section>
        <DetailsSection block={block} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </Redirect>
  );
};

const getUpcomingWeek = (day) => {
  const week = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    return add(day, { days: i });
  });
  return week;
};

const useDates = (blocks, weeks, filterFn) => {
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
          day: format(nextDate, "do"),
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
      (d) =>
        blocks
          .filter((b) => isSameDay(b.date, d.date))
          .filter((b) => filterFn(b)).length !== 0
    );
    return [dates, enabledDates];
  }, [blocks, weeks]);
  return [dates, enabledDates];
};

const useBlocks = (data, plansData) => {
  const blocks = useMemo(() => {
    if (!data || plansData.includes(undefined)) return [];

    const now = new Date();
    const then = add(now, { weeks: 8 });

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

  return blocks;
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
