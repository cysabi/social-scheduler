import { format } from "date-fns";
import { RadioGroup } from "@headlessui/react";

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

export default BlockSection;
