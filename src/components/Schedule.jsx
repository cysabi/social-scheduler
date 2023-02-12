import ical from "ical";
import { useState, useEffect } from "react";

const calA =
  "https://calendar.google.com/calendar/ical/d721a6f85d1f6a5df9ef3efa7d550de29c3581e4cede18de74329a681a33bb8b%40group.calendar.google.com/public/basic.ics";
const calP =
  "https://calendar.google.com/calendar/ical/sammyboy1510%40gmail.com/public/basic.ics";

const Schedule = () => {
  const [cal, setCal] = useState();
  const [date, setDate] = useState();

  useEffect(() => {
    fetch(calA).then((resp) => {
      if (resp.ok) {
        resp.text().then((text) => setCal({ data: ical.parseICS(text) }));
      } else {
        resp.text().then((text) => setCal({ error: text }));
      }
    });
  }, []);

  // if (cal === undefined) {
  //   return <p>loading</p>;
  // }
  // if (cal.error) {
  //   return <p>{cal.error}</p>;
  // }
  // console.log(cal.data);

  return (
    <main class="max-w-lg mx-auto my-20 flex flex-col gap-20">
      <h1 class="font-bold text-2xl text-center">
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
        title="Pick a date and time"
      >
        <DatePicker date={date} setDate={setDate} />
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
        <input
          type="text"
          class="bg-transparent border-2 rounded-md border-slate-500"
          placeholder="Your Name"
        />
        <input
          type="text"
          class="bg-transparent border-2 rounded-md border-slate-500"
          placeholder="Event Title"
        />
        <input
          type="text"
          class="bg-transparent border-2 rounded-md border-slate-500"
          placeholder="Location"
        />
      </Section>
      <button class="py-2 px-3 text-white rounded-md bg-yellow-600 font-bold tracking-wider uppercase">
        Create Request
      </button>
    </main>
  );
};

const DatePicker = ({ date, setDate }) => {
  return <input type="date" />;
};

const Section = ({ logo, title, children }) => (
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-yellow-400"
      >
        {logo}
      </svg>
      <h2 class="text-lg uppercase font-semibold tracking-wider text-slate-300">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

export default Schedule;
