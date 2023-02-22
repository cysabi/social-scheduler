import { getDay } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import PaginateButton from "./PaginateButton";

const DaySection = ({ value, onChange, dates, disabled }) => (
  <RadioGroup
    className="flex flex-wrap sm:grid sm:grid-cols-7 gap-3"
    value={value}
    onChange={onChange}
    by={(a, b) => (a && b ? a.toString() === b.toString() : undefined)}
  >
    {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
      <p
        className="uppercase hidden sm:block text-center font-medium text-slate-400 -mb-2.5"
        key={day}
      >
        {day}
      </p>
    ))}
    {dates.map((d) => (
      <RadioGroup.Option
        key={d.date}
        value={d.date}
        disabled={disabled(d)}
        className="flex-1"
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
);

export const DayButton = ({ weeks, setWeeks }) => (
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
);

export default DaySection;
