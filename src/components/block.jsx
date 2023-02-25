import { add, eachDayOfInterval, format, isSameDay } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import Section from "./Section";

const BlockSection = ({ value, onChange, blocks, day }) => (
  <Section
    logo={
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    }
    className="flex flex-col flex-1 gap-2 min-h-0"
    title="Blocks"
  >
    <div className="overflow-y-scroll after:bg-slate-300">
      {day ? (
        eachDayOfInterval({ start: day, end: add(day, { days: 6 }) }).map(
          (day) => {
            const dayBlocks = blocks
              .filter((b) => isSameDay(b.date, day))
              .sort((a, b) => a.date - b.date);
            return (
              dayBlocks.length > 0 && (
                <div key={day.getTime()}>
                  <div className="font-medium tracking-wide mt-3 mb-1 text-slate-400">
                    {format(day, "EEEE, LLL do")}
                  </div>
                  <RadioGroup
                    value={value}
                    onChange={onChange}
                    by={(a, b) => a.id === b.id}
                    className="flex flex-col gap-3"
                  >
                    {dayBlocks.map((block) => (
                      <RadioGroup.Option key={block.id} value={block}>
                        {({ checked }) => (
                          <div
                            className={`border-2 rounded-lg flex items-center justify-between flex-wrap font-medium cursor-pointer px-3 py-2.5 ${
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
                </div>
              )
            );
          }
        )
      ) : (
        <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4">
          <p className="w-full text-center text-slate-400">Loading Blocks...</p>
        </div>
      )}
    </div>
  </Section>
);

export default BlockSection;
