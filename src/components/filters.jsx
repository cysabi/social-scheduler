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
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
      />
    }
    title="Select filters"
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
