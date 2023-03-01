import { Fragment } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { RadioGroup } from "@headlessui/react";

const BlockSection = ({ value, onChange, blocks, day, scrolls }) => {
  const filteredBlocks = blocks.sort((a, b) => a.date - b.date);

  return (
    <div className="flex flex-col flex-1 gap-2 min-h-0">
      <div className="overflow-y-auto after:bg-slate-300 px-4 pb-4">
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
                    scrolls={scrolls}
                  />
                  <RadioGroup.Option value={block}>
                    {({ checked }) => {
                      const time = format(block.date, "BBBB").split(" ").pop();
                      return (
                        <div
                          className={`border-2 rounded-lg flex items-center justify-between flex-wrap font-medium cursor-pointer px-3 py-2.5 ${
                            checked
                              ? "border-yellow-500 bg-yellow-400/20"
                              : "border-slate-600 hover:bg-slate-700"
                          }`}
                        >
                          <p className="text-lg">{block.summary}</p>
                          <p className={`font-normal text-slate-200`}>{time}</p>
                        </div>
                      );
                    }}
                  </RadioGroup.Option>
                </Fragment>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="rounded-lg flex items-center bg-slate-700 justify-between flex-wrap font-medium p-4 mt-8">
            <p className="w-full text-center text-slate-400">
              Loading calendar...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BlockHeadings = ({ prevDate, date, scrolls }) => {
  const days =
    prevDate === undefined
      ? [date]
      : eachDayOfInterval({ start: prevDate, end: date });
  if (prevDate !== undefined) days.shift();
  return days.map((d) => (
    <div
      className="flex items-center gap-3"
      key={d}
      ref={(node) =>
        node
          ? scrolls.current.set(format(d, "L-d"), node)
          : scrolls.current.delete(format(d, "L-d"))
      }
    >
      <div className="border-b-2 border-slate-700 border-dotted flex-1" />
      <div key={d} className="tracking-wide text-right text-sm text-slate-400">
        {format(d, "EEEE, LLL do")}
      </div>
    </div>
  ));
};

export default BlockSection;
