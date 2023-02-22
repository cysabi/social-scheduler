import { format } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import PaginateButton from "./PaginateButton";

const BlockSection = ({ value, onChange, blocks }) => (
  <RadioGroup
    value={value}
    onChange={onChange}
    by={(a, b) => a.id === b.id}
    className="flex flex-col gap-4"
  >
    {blocks
      .sort((a, b) => a.date - b.date)
      .map((block) => (
        <RadioGroup.Option key={block.id} value={block}>
          {({ checked }) => (
            <div
              className={`border-2 rounded-lg flex items-center justify-between flex-wrap font-medium cursor-pointer px-4 py-3 ${
                checked
                  ? "border-yellow-500 bg-yellow-400/20"
                  : "border-slate-600 hover:bg-slate-700"
              }`}
            >
              <p className="text-lg">{block.summary}</p>
              <p>~ {format(block.date, "haaa")}</p>
            </div>
          )}
        </RadioGroup.Option>
      ))}
  </RadioGroup>
);

export const BlockButton = ({ enabledDates, day, setDay }) => {
  const i = enabledDates.findIndex((d) => d.date.toString() === day.toString());
  return (
    <span className="shrink-0 inline-flex gap-1 px-1.5 items-center tracking-normal font-medium text-slate-50 rounded-md border-2 border-slate-600">
      <PaginateButton
        left
        disabled={i === 0}
        onClick={() => setDay(enabledDates[i - 1].date)}
      />
      {format(day, "MMMM d")}
      <PaginateButton
        right
        disabled={i === enabledDates.length - 1}
        onClick={() => setDay(enabledDates[i + 1].date)}
      />
    </span>
  );
};

export default BlockSection;
