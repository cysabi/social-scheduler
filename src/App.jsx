import { useState, useEffect, useMemo } from "react";
import {
  format,
  isSameDay,
  add,
  differenceInSeconds,
  getDay,
  areIntervalsOverlapping,
} from "date-fns";
import ical from "ical";
import { rrulestr } from "rrule";
import { Redirect } from "./components/request";
import Section from "./components/Section";
import Error from "./components/Error";
import BlockSection, { BlockButton } from "./components/block";
import DaySection, { DayButton } from "./components/day";
import DetailsSection from "./components/DetailsSection";

const App = () => {
  const cal = useCalendar(
    "https://calendar.google.com/calendar/ical/d721a6f85d1f6a5df9ef3efa7d550de29c3581e4cede18de74329a681a33bb8b%40group.calendar.google.com/public/basic.ics"
  );
  const plans = useCalendar(
    "https://calendar.google.com/calendar/ical/sammyboy1510%40gmail.com/public/basic.ics"
  );

  const [weeks, setWeeks] = useState(2);
  const [day, setDay] = useState("");
  const [block, setBlock] = useState("");

  const blocks = useBlocks(cal?.data, plans?.data);
  const [dates, enabledDates] = useDates(blocks, weeks);

  if (enabledDates.length > 0 && day === "") {
    setDay(enabledDates[0].date);
  }

  return cal?.error ? (
    <Error error={cal.error} />
  ) : (
    <Redirect>
      <div className="max-w-lg box-content px-4 mx-auto my-20 flex flex-col gap-20">
        <h1 className="font-bold text-2xl text-center">
          Schedule a time with Sam Holmberg
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
              <span>Pick a day from the next </span>
              <DayButton weeks={weeks} setWeeks={setWeeks} />
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
        <Section
          logo={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          }
          title={
            <span className="inline-flex gap-2.5 flex-wrap items-center">
              <span>Pick a block for</span>
              {day && (
                <BlockButton
                  enabledDates={enabledDates}
                  day={day}
                  setDay={setDay}
                />
              )}
            </span>
          }
        >
          {day ? (
            <BlockSection
              value={block}
              onChange={setBlock}
              blocks={blocks.filter((b) => isSameDay(b.date, day))}
            />
          ) : (
            <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4">
              <p className="w-full text-center text-slate-400">
                Loading Blocks...
              </p>
            </div>
          )}
        </Section>
        <DetailsSection block={block} />
      </div>
    </Redirect>
  );
};

const useDates = (blocks, weeks) => {
  const [dates, enabledDates] = useMemo(() => {
    let today = new Date();
    today = add(today, {
      days: -getDay(today) + 1,
    });
    const dates = Array.from(
      { length: weeks * 7 - getDay(today) + 1 },
      (_, i) => {
        const nextDate = add(today, { days: i });
        return {
          date: nextDate,
          month: format(nextDate, "LLL"),
          day: format(nextDate, "do"),
        };
      }
    );
    const enabledDates = dates.filter(
      (d) => blocks.filter((b) => isSameDay(b.date, d.date)).length !== 0
    );
    return [dates, enabledDates];
  }, [blocks, weeks]);
  return [dates, enabledDates];
};

const useBlocks = (data, plansData) => {
  const blocks = useMemo(() => {
    const blocks = [];
    if (!data || !plansData) return blocks;
    const now = new Date();
    Object.values(data)
      .filter((event) => event.type === "VEVENT")
      .forEach((event) => {
        const rule = event.rrule
          ? rrulestr(event.rrule.toString(), { dtstart: event.start })
          : undefined;
        if (rule) {
          rule
            .between(now, new Date(now.getTime() + 8 * 7 * 24 * 60 * 60 * 1000))
            .forEach((occurrence) => {
              blocks.push({
                ...event,
                date: occurrence,
                endDate: add(occurrence, {
                  seconds: differenceInSeconds(event.end, event.start),
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
    const plans = [];
    Object.values(plansData)
      .filter((event) => (event.type = "VEVENT"))
      .forEach((event) => {
        if (event.start > now) {
          plans.push({ ...event, date: event.start, id: event.uid });
        }
      });
    console.log(blocks, plans);
    return blocks.filter(
      (b) =>
        plans.filter((p) =>
          areIntervalsOverlapping(
            { start: b.date, end: b.endDate },
            { start: p.start, end: p.end }
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
  }, []);

  return cal;
};

export default App;
