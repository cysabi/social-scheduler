import { formatISO, set } from "date-fns";
import { useState } from "react";
import { Button } from "./request";
import Section from "./Section";

const DetailsSection = ({ block }) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState("");

  const start = getDate(block.date, checked, time);

  return (
    <>
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
        />
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Additional Details (optional)"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
        />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              value={checked}
              onChange={() => setChecked(!checked)}
              className="h-6 w-6 rounded-md"
            />
            <p>Custom Start Time?</p>
          </div>
          <input
            type="time"
            value={time}
            disabled={!checked}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Start Date (optional)"
          />
        </div>
      </Section>
      <Button
        disabled={!block || !name || !start}
        createUrl={() => {
          const searchParams = new URLSearchParams({
            text: `${block.summary} with ${name}`,
            details,
            location,
            start: formatISO(start, { format: "basic" }),
            end: formatISO(block.endDate, { format: "basic" }),
          });
          return window.location.href + "?" + searchParams.toString();
        }}
      />
    </>
  );
};

const getDate = (date, checked, time) => {
  if (!checked) {
    return date;
  }
  if (!time) {
    return false;
  }
  return set(date, {
    hours: time.split(":")[0],
    minutes: time.split(":")[1],
  });
};

export default DetailsSection;
