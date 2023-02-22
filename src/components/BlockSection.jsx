import { format, isSameDay } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import PaginateButton from "./PaginateButton";
import Section from "./Section";

const BlockSection = ({
  value,
  onChange,
  day,
  blocks,
  enabledDates,
  setDay,
}) => (
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
              <PaginateButton
                left
                disabled={
                  enabledDates.findIndex(
                    (d) => d.date.toString() === day.toString()
                  ) === 0
                }
                onClick={() => {
                  const i = enabledDates.findIndex((d) => d.date === day);
                  setDay(enabledDates[i - 1].date);
                }}
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
                onClick={() => {
                  const i = enabledDates.findIndex((d) => d.date === day);
                  setDay(enabledDates[i + 1].date);
                }}
              />
            </span>
          </>
        )}
      </span>
    }
  >
    {day ? (
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
    ) : (
      <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4">
        <p className="w-full text-center">Please select a day first</p>
      </div>
    )}
  </Section>
);

export default BlockSection;
