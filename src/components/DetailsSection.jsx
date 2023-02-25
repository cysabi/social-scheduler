import { formatISO, set } from "date-fns";
import { useState } from "react";
import { Button } from "./request";
import Section from "./Section";
import { Dialog } from "@headlessui/react";

const DetailsSection = ({ block, isOpen, setIsOpen }) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState("");

  const start = getDate(block.date, checked, time);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex sm:items-center justify-center items-center">
        <Dialog.Panel className="max-w-md w-full rounded-md bg-slate-700 p-6 shadow-xl mx-4">
          <>
            <Section
              logo={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              }
              title="Enter your details"
            >
              <div className="my-6 flex flex-col gap-3 items-stretch">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Additional Details (optional)"
                />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional)"
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      value={checked}
                      onChange={() => setChecked(!checked)}
                      className="h-6 w-6 rounded-md"
                    />
                    <p>Custom Start Time?</p>
                  </div>
                  <input
                    type="time"
                    value={time}
                    disabled={!checked}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Start Date (optional)"
                    className="disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
                  />
                </div>
              </div>
            </Section>
            <div className="flex items-center flex-row-reverse justify-start flex-wrap gap-4 pt-4">
              <Button
                disabled={!block || !name || !start}
                createUrl={() => {
                  const searchParams = new URLSearchParams({
                    text: `${block.summary} with ${name}`,
                    details,
                    location,
                    start: formatISO(start, { format: "basic" }),
                    end: formatISO(block.endDate, { format: "basic" }),
                  });
                  return window.location.href + "?" + searchParams.toString();
                }}
              />
              <button
                className="py-2 px-3 text-slate-100 rounded-md border-2 border-slate-600 hover:bg-slate-600 font-bold tracking-wider uppercase"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>
          </>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const getDate = (date, checked, time) => {
  if (!checked) {
    return date;
  }
  if (!time) {
    return false;
  }
  return set(date, {
    hours: time.split(":")[0],
    minutes: time.split(":")[1],
  });
};

export default DetailsSection;
