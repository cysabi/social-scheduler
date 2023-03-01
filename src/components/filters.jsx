import { useEffect, useState } from "react";
import { format, isSameDay } from "date-fns";
import { RadioGroup, Listbox } from "@headlessui/react";

const ALL_TOPICS = ["lunch", "dinner", "work", "afternoon", "evening"];

const FilterSection = ({ children }) => (
  <div className="flex flex-col gap-2 text-sm sm:text-base">{children}</div>
);

export const DayFilter = ({ value, onChange, dates, disabled, scrolls }) => (
  <RadioGroup
    value={value}
    onChange={onChange}
    by={(a, b) => (a && b ? isSameDay(a, b) : undefined)}
  >
    <span className="flex gap-2 overflow-x-auto rounded-md bg-slate-800 mt-2 pb-4">
      {dates.map((d) => (
        <RadioGroup.Option
          key={d.date}
          value={d.date}
          disabled={disabled(d)}
          className="flex-1"
          ref={(node) =>
            node
              ? scrolls.current.set(d.date.toDateString(), node)
              : scrolls.current.delete(d.date.toDateString())
          }
        >
          {({ checked, disabled }) => (
            <div
              className={`border-2 border-slate-600 p-2 rounded-md flex-col text-center ${
                checked
                  ? "border-yellow-500 bg-yellow-400/20"
                  : "border-slate-600 hover:bg-slate-700"
              } ${
                disabled
                  ? "border-slate-700 bg-slate-700 cursor-not-allowed text-slate-300"
                  : "cursor-pointer"
              }`}
            >
              <p className="w-full text-center font-semibold whitespace-nowrap">
                {d.label}
              </p>
              <p className="w-full text-center text-slate-300 whitespace-nowrap">
                {format(d.date, "LLL d")}
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
    setTopics(ALL_TOPICS.filter((t) => window.location.search.includes(t)));
  }, []);

  return (
    <Listbox value={topics} onChange={setTopics} multiple>
      <Listbox.Options
        static
        className="flex justify-between overflow-x-auto rounded-lg gap-0"
      >
        {ALL_TOPICS.map((t) => (
          <Listbox.Option key={t} value={t}>
            {({ selected }) => (
              <button
                className={`border-2 border-slate-600 px-2 capitalize text-sm sm:text-base py-0 rounded-full flex-col text-center hover:cursor-pointer ${
                  selected
                    ? "border-transparent bg-yellow-500 text-black"
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
