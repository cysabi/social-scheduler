import { isSameDay } from "date-fns";
import { RadioGroup, Listbox } from "@headlessui/react";
import Section from "./Section";
import { useEffect, useState } from "react";

const allTopics = ["lunch", "dinner", "work", "afternoon", "evening"];

const FilterSection = ({ children }) => (
  <Section
    logo={
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
      />
    }
    title={<span className="inline-flex flex-wrap items-center">Filters</span>}
    className="flex flex-col gap-2 text-sm sm:text-base"
  >
    {children}
  </Section>
);

export const DayFilter = ({ value, onChange, dates, disabled }) => (
  <RadioGroup
    value={value}
    onChange={onChange}
    by={(a, b) => (a && b ? isSameDay(a, b) : undefined)}
  >
    <span className="flex gap-2 overflow-scroll bg-slate-800">
      {dates.map((d) => (
        <RadioGroup.Option
          key={d.date}
          value={d.date}
          disabled={disabled(d)}
          className="flex-1"
        >
          {({ checked, disabled }) => (
            <div
              className={`border-2 border-slate-600 py-1 px-2 rounded-md flex-col text-center ${
                checked
                  ? "border-yellow-500 bg-yellow-400/20"
                  : "border-slate-600 hover:bg-slate-700"
              } ${
                disabled
                  ? "border-slate-700 bg-slate-700 cursor-not-allowed text-slate-300"
                  : "cursor-pointer"
              }`}
            >
              <p className="w-full text-center font-medium whitespace-nowrap">
                {d.altLabel ? d.altLabel : d.weekDay}
              </p>
              <p className="w-full text-center whitespace-nowrap">
                {d.month} {d.day}
              </p>
            </div>
          )}
        </RadioGroup.Option>
      ))}
    </span>
  </RadioGroup>
);

export const TopicsFilter = ({ topics, setTopics }) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("topics")) {
      setTopics([
        ...topics,
        ...params
          .get("topics")
          .split(",")
          .filter((t) => allTopics.includes(t)),
      ]);
    }
  }, []);

  return (
    <Listbox value={topics} onChange={setTopics} multiple>
      <Listbox.Options
        static
        className="flex justify-between overflow-x-scroll gap-1"
      >
        {allTopics.map((t) => (
          <Listbox.Option key={t} value={t}>
            {({ selected }) => (
              <button
                className={`border-2 border-slate-600 px-2 capitalize text-xs sm:text-base sm:uppercase py-1 rounded-md flex-col text-center hover:cursor-pointer font-medium ${
                  selected
                    ? "border-yellow-500 bg-yellow-400/20"
                    : "border-slate-600 hover:bg-slate-700"
                }`}
              >
                {t}
              </button>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

const FilterChip = ({ name, value, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium">{name}</span>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center hover:bg-slate-700 gap-2 py-1 px-2 border-2 border-slate-600 rounded-md"
        >
          {value}
          <Chevron open={open} />
        </button>
      </div>
      {open && <>{children}</>}
    </div>
  );
};

const Chevron = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6"
  >
    {open ? (
      <path
        fillRule="evenodd"
        d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
        clipRule="evenodd"
      />
    ) : (
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    )}
  </svg>
);

export default FilterSection;
