import { Fragment } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import Section from "./Section";

const BlockSection = ({ value, onChange, blocks, day }) => {
  const filteredBlocks = blocks
    .filter((block) => day && block.date >= day)
    .sort((a, b) => a.date - b.date);

  return (
    <Section
      logo={
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      }
      className="flex flex-col flex-1 gap-2 min-h-0"
      title="Pick a block"
    >
      <div className="overflow-y-auto after:bg-slate-300 px-4">
        {day ? (
          <RadioGroup
            value={value}
            onChange={onChange}
            by={(a, b) => a.id === b.id}
            className="flex flex-col gap-3 mt-2"
          >
            {filteredBlocks.map((block, i) => {
              return (
                <Fragment key={block.id}>
                  <BlockHeadings
                    prevDate={filteredBlocks?.[i - 1]?.date}
                    date={block.date}
                  />
                  <RadioGroup.Option value={block}>
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
                </Fragment>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4">
            <p className="w-full text-center text-slate-400">
              Loading Blocks...
            </p>
          </div>
        )}
      </div>
    </Section>
  );
};

const BlockHeadings = ({ prevDate, date }) => {
  const days =
    prevDate === undefined
      ? [date]
      : eachDayOfInterval({ start: prevDate, end: date });
  return days.map((day) => (
    <div className="flex items-center gap-4" key={day}>
      <div className="border-b-2 border-slate-700 border-dotted flex-1" />
      <div
        key={day}
        className="tracking-wide text-right text-sm text-slate-400"
      >
        {format(day, "EEEE, LLL do")}
      </div>
    </div>
  ));
};

export default BlockSection;
