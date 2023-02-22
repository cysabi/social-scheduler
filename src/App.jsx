import { useState, useEffect, useMemo } from "react";
import {
  formatISO,
  format,
  isSameDay,
  add,
  differenceInHours,
  addDays,
  getDay,
} from "date-fns";
import ical from "ical";
import { rrulestr } from "rrule";
import { RadioGroup } from "@headlessui/react";
import { useForm } from "react-hook-form";

const App = () => {
  const cal = useCalendar(
    "https://calendar.google.com/calendar/ical/d721a6f85d1f6a5df9ef3efa7d550de29c3581e4cede18de74329a681a33bb8b%40group.calendar.google.com/public/basic.ics"
  );
  // const cal = useCalendar(
  //   "https://calendar.google.com/calendar/ical/sammyboy1510%40gmail.com/public/basic.ics"
  // );
  const blocks = useBlocks(cal?.data);
  const [day, setDay] = useState("");
  const [block, setBlock] = useState("");

  const url = getEventRequestUrl();
  if (url) {
    window.open(url, "_blank"); // replace with replacing the entire href
    return null;
  }

  if (cal?.error) {
    return <Error error={cal.error} />;
  }

  console.log(cal);

  return (
    <div className="max-w-lg box-content px-4 mx-auto my-20 flex flex-col gap-20">
      <h1 className="font-bold text-2xl text-center">
        Schedule a time with Sam Holmberg
      </h1>
      <DaySection value={day} onChange={setDay} blocks={blocks} />
      <Section
        logo={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        }
        title={
          <span className="inline-flex items-center">
            <span>Pick a block for</span>
            {day && (
              <>
                <span className="inline-flex gap-1 mx-2 px-1.5 items-center tracking-normal font-medium text-slate-50 rounded-md border-2 border-slate-600">
                  <PaginateButton left />
                  {format(day, "MMMM d")}
                  <PaginateButton right />
                </span>
              </>
            )}
          </span>
        }
      >
        {cal && day ? (
          <BlockSection
            value={block}
            onChange={setBlock}
            day={day}
            blocks={blocks}
          />
        ) : (
          <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4">
            <p className="w-full text-center">Please select a day first</p>
          </div>
        )}
      </Section>
      <Section
        logo={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        }
        title="Enter your details"
      >
        <DetailsSection />
      </Section>
    </div>
  );
};

const PaginateButton = ({ left, right, ...rest }) => {
  return (
    <button {...rest} className="group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5 text-slate-400 hover:group-enabled:text-slate-200 group-disabled:text-slate-600"
      >
        {left && (
          <path
            fillRule="evenodd"
            d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z"
            clipRule="evenodd"
          />
        )}
        {right && (
          <>
            <path
              fillRule="evenodd"
              d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </>
        )}
      </svg>
    </button>
  );
};

const DaySection = ({ value, onChange, blocks }) => {
  const [weeks, setWeeks] = useState(2);

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

  return (
    <Section
      logo={
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
        />
      }
      title={
        <span className="inline-flex items-center">
          <span>Pick a day in the next </span>
          <span className="inline-flex gap-1 mx-2 px-1.5 items-center tracking-normal font-medium text-slate-50 rounded-md border-2 border-slate-600">
            <PaginateButton
              left
              disabled={weeks === 2}
              onClick={() => setWeeks(weeks - 2)}
            />
            {`${weeks} weeks`}
            <PaginateButton
              right
              disabled={weeks === 8}
              onClick={() => setWeeks(weeks + 2)}
            />
          </span>
        </span>
      }
    >
      <RadioGroup
        className="grid grid-cols-7 gap-3"
        value={value}
        onChange={onChange}
        by={(a, b) => {
          if (a && b) {
            return a.toDateString() === b.toDateString();
          }
        }}
      >
        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
          <p
            className="uppercase text-center font-medium text-slate-400 -mb-2"
            key={day}
          >
            {day}
          </p>
        ))}
        {dates.map((d) => (
          <RadioGroup.Option
            key={d.date}
            value={d.date}
            disabled={
              blocks.filter((b) => isSameDay(b.date, d.date)).length === 0
            }
            style={{
              gridColumnStart: getDay(d.date),
            }}
          >
            {({ checked, disabled }) => (
              <div
                className={`border-2 border-slate-600 p-2 rounded-md flex-col text-center font-medium ${
                  checked
                    ? "border-yellow-500 bg-yellow-400/20"
                    : "border-slate-600 hover:bg-slate-700"
                } ${
                  disabled
                    ? "border-slate-700 bg-slate-700 cursor-not-allowed text-slate-300"
                    : "cursor-pointer"
                }`}
              >
                <p>{d.month}</p>
                <p>{d.day}</p>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </Section>
  );
};

const BlockSection = ({ value, onChange, day, blocks }) => {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      by={(a, b) => a.id === b.id}
      className="flex flex-col gap-4"
    >
      {blocks
        .filter((b) => isSameDay(b.date, day))
        .sort((a, b) => a.date - b.date)
        .map((block) => (
          <RadioGroup.Option key={block.id} value={block}>
            {({ checked }) => (
              <div
                className={`border-2 rounded-lg flex items-center justify-between flex-wrap font-medium cursor-pointer p-4 ${
                  checked
                    ? "border-yellow-500 bg-yellow-400/20"
                    : "border-slate-600 hover:bg-slate-700"
                }`}
              >
                <p>{block.summary}</p>
                <p>~ {format(block.date, "haaa")}</p>
              </div>
            )}
          </RadioGroup.Option>
        ))}
    </RadioGroup>
  );
};

const DetailsSection = () => (
  <>
    <div className="flex flex-col gap-3">
      <input
        type="text"
        className="bg-transparent border-2 rounded-md border-slate-500"
        // {...form.register("name", { required: true })}
        placeholder="Your Name"
      />
      <input
        type="text"
        className="bg-transparent border-2 rounded-md border-slate-500"
        placeholder="Event Title"
        // {...form.register("title", { required: true })}
      />
      <input
        type="text"
        className="bg-transparent border-2 rounded-md border-slate-500"
        placeholder="Location"
        // {...form.register("location")}
      />
    </div>
    <button
      type="submit"
      className="w-full py-2 mt-20 px-3 text-white rounded-md bg-yellow-600 font-bold tracking-wider uppercase"
    >
      Create Request
    </button>
  </>
);

const Section = ({ logo, title, children }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 shrink-0 text-yellow-400"
      >
        {logo}
      </svg>
      <h2 className="text-lg uppercase font-semibold tracking-wider text-slate-300">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

const getEventRequestUrl = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.name) {
    let url = "https://www.google.com/calendar/render?action=TEMPLATE";
    url += "&text=" + encodeURIComponent(params.name);
    url += "&details=" + encodeURIComponent(params.description);
    if (params.location)
      url += "&location=" + encodeURIComponent(params.location);
    if (params.start)
      url +=
        "&dates=" +
        encodeURIComponent(
          formatISO(params.start, { format: "basic" }) +
            "/" +
            formatISO(params.end, { format: "basic" })
        );
    return url;
  }
};

const Error = ({ error }) => (
  <div className="h-screen flex flex-col gap-2 items-center justify-center">
    <div className="h-12 w-12 bg-red-400/20 flex items-center justify-center rounded-md text-red-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <div className="text-2xl text-red-400 font-bold">
      An error has occurred:
    </div>
    <div className="text-lg text-slate-300">{error}</div>
  </div>
);

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
    return out;
  }, [data]);

  return blocks;
};

const useCalendar = (url) => {
  return {
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
  };

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
