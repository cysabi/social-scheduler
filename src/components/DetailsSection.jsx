import { formatISO, set } from "date-fns";
import { useState } from "react";
import { Button } from "./request";
import Section from "./Section";
import { Dialog } from "@headlessui/react";

const DetailsSection = ({ block, isOpen, setIsOpen }) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [emailTo, setEmailTo] = useState("");

  const start = getDate(block.date, time);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex sm:items-center justify-center items-center">
        <Dialog.Panel className="max-w-sm rounded-md bg-slate-700 border-slate-500 border-2 p-4">
          <>
            <Section
              logo={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              }
              title="Confirm Event"
            >
              <div className="flex gap-2 p-3 border-2 rounded-lg">
                <span className="text-md font-semibold flex-grow p-1">
                  <span>
                    {details ? details : block.summary}
                    {name ? ` w/ ${name}` : undefined}
                  </span>
                  <div className="text-xs text-gray-400">
                    {location ? `${location}` : undefined}
                    {time ? ` @ ${time}` : undefined}
                  </div>
                </span>
                <span className="p-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stroke-width="0"
                    viewBox="0 0 16 16"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"></path>
                  </svg>
                </span>
              </div>
              <div className="grid grid-cols-8 justify-items-center items-center gap-2 mb-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                </svg>
                <input
                  className="col-span-7 w-full"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
                  <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z"></path>
                </svg>
                <input
                  className="col-span-7 w-full"
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Description"
                />
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0-3.124 3.074-3.124 8.057 0 11.13l5.656 5.565 5.657-5.565c3.124-3.073 3.124-8.056 0-11.13zm-5.657 8.195c-.668 0-1.295-.26-1.768-.732-.975-.975-.975-2.561 0-3.536.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732c.975.975.975 2.562 0 3.536-.472.472-1.1.732-1.768.732z"></path>
                </svg>
                <input
                  type="text"
                  className="col-span-7 w-full"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional)"
                />
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                  <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path>
                </svg>
                <input
                  className="col-span-7 w-full"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                </svg>
                <input
                  type="text"
                  className="col-span-7 w-full"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="Email invite (optional)"
                />
              </div>
            </Section>
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                className="disabled:cursor-not-allowed flex-2 py-2 px-3 text-white rounded-md bg-slate-500 disabled:bg-slate-600 disabled:text-slate-400 font-bold tracking-wider uppercase"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
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
            </div>
          </>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const getDate = (date, time) => {
  if (!time) {
    return false;
  }
  return set(date, {
    hours: time.split(":")[0],
    minutes: time.split(":")[1],
  });
};

export default DetailsSection;
