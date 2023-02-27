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
                        <p className="text-slate-400">
                          <TimeOfDayIcon date={block.date} />
                        </p>
                      </div>
                    )}
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
    </Section>
  );
};

const BlockHeadings = ({ prevDate, date }) => {
  const days =
    prevDate === undefined
      ? [date]
      : eachDayOfInterval({ start: prevDate, end: date });
  if (prevDate !== undefined) days.shift();
  return days.map((day) => (
    <div className="flex items-center gap-3" key={day}>
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

const TimeOfDayIcon = ({ date }) => {
  const hour = date.getHours();
  if (hour < 12) {
    return (
      //sunrise
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"></path>
      </svg>
    );
  } else if (hour < 18) {
    return (
      //sun
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        className="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"></path>
      </svg>
    );
  } else if (hour < 20) {
    return (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
      </svg>
    );
  }
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
      <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
    </svg>
  );
};

export default BlockSection;
