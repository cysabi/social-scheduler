import { Fragment, useState, useEffect } from "react";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import config from "../config";

const BlockSection = ({
  value,
  onChange,
  blocks,
  day,
  scrolls,
  scrollToDay,
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    setScrollTop(scrollTop);
  };

  const debouncedScrollTop = useDebouncedValue(scrollTop);

  useEffect(() => {
    let closestDate = null;
    for (const [date, node] of scrolls.current.entries()) {
      if (node.offsetTop - 260 > debouncedScrollTop) {
        break;
      }
      closestDate = date;
    }
    if (closestDate) scrollToDay(new Date(closestDate));
  }, [debouncedScrollTop]);

  return (
    <div className="flex flex-col flex-1 gap-2 min-h-0">
      <div
        className="overflow-y-auto after:bg-slate-300 px-4 pb-4"
        onScroll={handleScroll}
      >
        {day ? (
          <RadioGroup
            value={value}
            onChange={onChange}
            by={(a, b) => a.id === b.id}
            className={`flex flex-col ${"gap-3"} mt-2`}
          >
            {blocks.map((block, i) => {
              return (
                <Fragment key={block.id}>
                  <BlockHeadings
                    prevDate={blocks?.[i - 1]?.date}
                    date={block.date}
                    blocks={blocks}
                    scrolls={scrolls}
                  />
                  {(!block.overlaps.length ||
                    window.location.search.includes(config.pass)) && (
                    <RadioGroup.Option
                      value={block}
                      disabled={!!block.overlaps.length}
                      className="group"
                    >
                      {({ checked, disabled }) => {
                        const time = format(block.date, "BBBB")
                          .split(" ")
                          .pop();
                        return (
                          <div
                            className={`border-2 rounded-lg flex items-center justify-between flex-wrap font-medium px-3 py-2.5 ${
                              checked
                                ? "border-yellow-500 bg-yellow-400/20"
                                : "border-slate-600"
                            } ${
                              disabled
                                ? "border-slate-700 bg-slate-700 cursor-not-allowed text-slate-300"
                                : "hover:bg-slate-700/60 cursor-pointer"
                            }`}
                          >
                            <p className="text-lg">{block.summary}</p>
                            {disabled ? (
                              <p className="font-normal text-slate-400">
                                {time}
                              </p>
                            ) : (
                              <p className="font-normal text-slate-200">
                                {time}
                              </p>
                            )}
                          </div>
                        );
                      }}
                    </RadioGroup.Option>
                  )}
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

const BlockHeadings = ({ prevDate, date, blocks, scrolls }) => {
  const days =
    prevDate === undefined
      ? [date]
      : eachDayOfInterval({ start: prevDate, end: date });
  if (prevDate !== undefined) days.shift();
  return days.map((date) => {
    const overlaps = blocks
      .filter((b) => isSameDay(b.date, date))
      .flatMap((b) => b.overlaps);
    let events = {};
    overlaps.forEach((event) => {
      const id = event.id;
      const prevEvent = events[id];
      events[id] = {
        ...event,
        blocks: !prevEvent
          ? event.blocks
          : [...event.blocks, ...prevEvent.blocks],
      };
    });
    events = Object.values(events);
    return (
      <Fragment key={date}>
        <div
          className="flex items-center gap-3"
          key={date}
          ref={(node) =>
            node
              ? scrolls.current.set(date.toDateString(), node)
              : scrolls.current.delete(date.toDateString())
          }
        >
          <div className="border-b-2 border-slate-700 border-dotted flex-1" />
          <div
            key={date}
            className="tracking-wide text-right text-sm text-slate-400"
          >
            {format(date, "EEEE, LLL do")}
          </div>
        </div>
        {!!events.length && window.location.search.includes(config.pass) && (
          <div className="bg-yellow-500/10 rounded-lg flex flex-col p-3 gap-3">
            <div className="text-lg font-bold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-yellow-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                />
              </svg>
              Events Scheduled:
            </div>
            <div className="flex flex-col gap-1">
              {events.map((e) => (
                <div key={e.id} className="flex justify-between gap-3">
                  {e.private ? (
                    <div className="flex-1 whitespace-nowrap opacity-50">
                      Private Event
                    </div>
                  ) : (
                    <div className="flex-1 whitespace-nowrap font-medium">
                      {e.name}
                    </div>
                  )}
                  <div className="text-right">
                    {format(e.date, "h:mmaaa")}{" "}
                    <span className="text-yellow-100">
                      ({e.blocks.join(", ")})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Fragment>
    );
  });
};

const useDebouncedValue = (value, delay = 100) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};

export default BlockSection;
