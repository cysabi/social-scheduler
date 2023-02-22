import { useState, useEffect, useMemo } from "react";
import {
  format,
  isSameDay,
  add,
  differenceInHours,
  getDay,
  addDays,
  isWednesday,
  formatISO,
} from "date-fns";
import ical from "ical";
import { rrulestr } from "rrule";
import Error from "./components/Error";
import DetailsSection from "./components/DetailsSection";
import BlockSection from "./components/BlockSection";
import DaySection from "./components/DaySection";
import Section from "./components/Section";
import PaginateButton from "./components/PaginateButton";
import { Redirect, Button } from "./components/request";

const App = () => {
  const cal = useCalendar(
    "https://calendar.google.com/calendar/ical/d721a6f85d1f6a5df9ef3efa7d550de29c3581e4cede18de74329a681a33bb8b%40group.calendar.google.com/public/basic.ics"
  );
  // const cal = useCalendar(
  //   "https://calendar.google.com/calendar/ical/sammyboy1510%40gmail.com/public/basic.ics"
  // );

  const [weeks, setWeeks] = useState(2);
  const [day, setDay] = useState("");
  const [block, setBlock] = useState("");

  const blocks = useBlocks(cal?.data || []);
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
            <span className="inline-flex flex-wrap items-center">
              <span className="mr-2">Pick a day from the next </span>
              <span className="shrink-0 inline-flex gap-1 px-1.5 items-center tracking-normal font-medium text-slate-50 rounded-md border-2 border-slate-600">
                <PaginateButton
                  sub
                  disabled={weeks === 2}
                  onClick={() => setWeeks(weeks - 2)}
                />
                {`${weeks} weeks`}
                <PaginateButton
                  plus
                  disabled={weeks === 8}
                  onClick={() => setWeeks(weeks + 2)}
                />
              </span>
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
            <span className="inline-flex flex-wrap items-center">
              <span className="mr-2">Pick a block for</span>
              {day && (
                <span className="shrink-0 inline-flex gap-1 px-1.5 items-center tracking-normal font-medium text-slate-50 rounded-md border-2 border-slate-600">
                  <PaginateButton
                    left
                    disabled={
                      enabledDates.findIndex(
                        (d) => d.date.toString() === day.toString()
                      ) === 0
                    }
                    onClick={() =>
                      setDay(
                        enabledDates[
                          enabledDates.findIndex((d) => d.date === day) - 1
                        ].date
                      )
                    }
                  />
                  {format(day, "MMMM d")}
                  <PaginateButton
                    right
                    disabled={
                      enabledDates.findIndex(
                        (d) => d.date.toString() === day.toString()
                      ) ===
                      enabledDates.length - 1
                    }
                    onClick={() =>
                      setDay(
                        enabledDates[
                          enabledDates.findIndex((d) => d.date === day) + 1
                        ].date
                      )
                    }
                  />
                </span>
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
    const today = new Date();
    const dates = Array.from(
      { length: weeks * 7 - getDay(today) + 1 },
      (_, i) => {
        const nextDate = addDays(today, i);
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

const useBlocks = (data) => {
  const blocks = useMemo(() => {
    const out = [];
    if (!data) return out;
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
              out.push({
                ...event,
                date: occurrence,
                endDate: add(occurrence, {
                  hours: differenceInHours(event.end, event.start),
                }),
                id: event.uid + occurrence.toString(),
              });
            });
        } else if (startDate > now) {
          out.push({
            ...event,
            date: startDate,
            id: event.uid,
          });
        }
      });
    return out.filter((e) => !isWednesday(e.date));
  }, [data]);

  return blocks;
};

const useCalendar = (url) => {
  const [cal, setCal] = useState(devData());

  // useEffect(() => {
  //   fetch("https://corsproxy.io/?" + url)
  //     .then((resp) => {
  //       if (resp.ok) {
  //         resp.text().then((text) => setCal({ data: ical.parseICS(text) }));
  //       } else {
  //         resp.text().then((text) => setCal({ error: text }));
  //       }
  //     })
  //     .catch((error) => {
  //       setCal({ error: error.message });
  //     });
  // }, []);

  return cal;
};

const devData = () => ({
  data: ical.parseICS(`BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Social Availability Schedule
X-WR-TIMEZONE:America/Los_Angeles
X-WR-CALDESC:This calendar has the purpose of showing my typical week of so
cial availability.
BEGIN:VTIMEZONE
TZID:America/Los_Angeles
X-LIC-LOCATION:America/Los_Angeles
BEGIN:DAYLIGHT
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
TZNAME:PDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
TZNAME:PST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230211T130000
DTEND;TZID=America/Los_Angeles:20230211T170000
RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=SA,SU
DTSTAMP:20230222T052113Z
UID:5m5r5nau1oe4de525bchhtosh9@google.com
CREATED:20230211T010133Z
DESCRIPTION:
LAST-MODIFIED:20230217T070957Z
LOCATION:
SEQUENCE:2
STATUS:CONFIRMED
SUMMARY:Afternoon Plans
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230218T100000
DTEND;TZID=America/Los_Angeles:20230218T130000
RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=SA,SU
DTSTAMP:20230222T052113Z
UID:qg672mtp3q8pgkc8dhguqtout9@google.com
CREATED:20230211T010033Z
DESCRIPTION:
LAST-MODIFIED:20230217T070945Z
LOCATION:
SEQUENCE:2
STATUS:CONFIRMED
SUMMARY:Brunch
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230206T180000
DTEND;TZID=America/Los_Angeles:20230207T000000
RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=MO,TU,WE,TH
DTSTAMP:20230222T052113Z
UID:384jusa3r91us4d2jf7b4p3dia@google.com
CREATED:20230211T005547Z
DESCRIPTION:
LAST-MODIFIED:20230217T070914Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:After Work Plans
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230209T200000
DTEND;TZID=America/Los_Angeles:20230210T000000
RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=FR,TH,SA
DTSTAMP:20230222T052113Z
UID:4e72d4mt7j4samt869rthhlvic@google.com
CREATED:20230211T005724Z
DESCRIPTION:
LAST-MODIFIED:20230217T070847Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:After Dinner Plans
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230206T180000
DTEND;TZID=America/Los_Angeles:20230206T200000
RRULE:FREQ=DAILY
DTSTAMP:20230222T052113Z
UID:30kos71l5no0dfr2q70p5k0ufm@google.com
CREATED:20230211T005652Z
DESCRIPTION:
LAST-MODIFIED:20230217T070808Z
LOCATION:
SEQUENCE:2
STATUS:CONFIRMED
SUMMARY:Dinner
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230206T090000
DTEND;TZID=America/Los_Angeles:20230206T170000
RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=FR,MO,TH,TU
DTSTAMP:20230222T052113Z
UID:3bd4toun7hk63e09ci8pdguphq@google.com
CREATED:20230211T005205Z
DESCRIPTION:
LAST-MODIFIED:20230217T070621Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:Working Together
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230206T120000
DTEND;TZID=America/Los_Angeles:20230206T170000
RRULE:FREQ=WEEKLY;BYDAY=FR,MO,TH,TU,WE
DTSTAMP:20230222T052113Z
UID:5qb1bpnm999k6sa2bok81suhfe@google.com
CREATED:20230211T005231Z
DESCRIPTION:
LAST-MODIFIED:20230217T070519Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:Lunch and Working
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230206T133000
DTEND;TZID=America/Los_Angeles:20230206T170000
RRULE:FREQ=WEEKLY;BYDAY=FR,MO,TH,TU,WE
DTSTAMP:20230222T052113Z
UID:2gc7228pc9581h67jse9qcg3e8@google.com
CREATED:20230211T005342Z
DESCRIPTION:
LAST-MODIFIED:20230217T070442Z
LOCATION:
SEQUENCE:2
STATUS:CONFIRMED
SUMMARY:Cafe Working
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230206T113000
DTEND;TZID=America/Los_Angeles:20230206T133000
RRULE:FREQ=WEEKLY;BYDAY=FR,MO,TH,TU,WE
DTSTAMP:20230222T052113Z
UID:6f0q4bjvqsgdu0k8flp6c78bfh@google.com
CREATED:20230211T005302Z
DESCRIPTION:
LAST-MODIFIED:20230217T070427Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:Lunch
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230211T100000
DTEND;TZID=America/Los_Angeles:20230211T210000
RRULE:FREQ=WEEKLY;WKST=SU;BYDAY=SA,SU
DTSTAMP:20230222T052113Z
UID:1akq71f401l2c007vkef1a2k85@google.com
CREATED:20230211T010011Z
DESCRIPTION:
LAST-MODIFIED:20230211T010309Z
LOCATION:
SEQUENCE:2
STATUS:CONFIRMED
SUMMARY:All Day Adventure
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
DTSTART;TZID=America/Los_Angeles:20230211T100000
DTEND;TZID=America/Los_Angeles:20230211T130000
RRULE:FREQ=WEEKLY;UNTIL=20230218T075959Z;BYDAY=SA
DTSTAMP:20230222T052113Z
UID:63r0ij16guk9l5cmd9cpahpcvv@google.com
CREATED:20230211T010033Z
DESCRIPTION:
LAST-MODIFIED:20230211T010107Z
LOCATION:
SEQUENCE:1
STATUS:CONFIRMED
SUMMARY:Brunch Meetup
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`),
});

export default App;
