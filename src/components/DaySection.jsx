
import {
    format,
    isSameDay,
    addDays,
    getDay,
  } from "date-fns";

import { useState } from "react";
import Section from "./Section";
import PaginateButton from "./PaginateButton";
import { RadioGroup } from "@headlessui/react";


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

  export default DaySection;