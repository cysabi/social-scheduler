import { format, formatISO, set } from "date-fns";
import { useEffect, useState } from "react";
import { RedirectDialog } from "./request";
import Section from "./Section";
import { Dialog } from "@headlessui/react";
import config from "../config";

const ConfirmDialog = ({ block, setBlock }) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [emailTo, setEmailTo] = useState("");

  useEffect(() => {
    if (block.date) setTime(format(block.date, "HH:mm"));
  }, [block]);

  return (
    <Dialog
      open={!!block}
      onClose={() => setBlock("")}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex sm:items-center justify-center items-center">
        <Dialog.Panel className="max-w-md w-full rounded-md bg-slate-700 p-6 shadow-xl mx-4">
          <Section
            logo={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            }
            title="Confirm Event"
            className="flex flex-col gap-6"
          >
            <div className="flex p-4 rounded-lg justify-between bg-yellow-500 text-yellow-900">
              <span className="font-semibold">
                <span className="text-black">
                  {details ? details : block.summary}
                  {name && ` w/ ${name}`}
                </span>
                <div className="text-sm text-yellow-900">
                  {location && `@ ${location}`}
                  {` ~ ${
                    block.date &&
                    format(getDate(block.date, time), "LLL do @ h:mm bbb")
                  }`}
                </div>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <Input
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
              <Input
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                }
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Description (optional)"
              />
              <Input
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                }
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (optional)"
              />
              <Input
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <Input
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                }
                value={emailTo}
                type="email"
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="Email invite (optional)"
              />
            </div>
            <div className="flex items-center flex-row-reverse justify-start flex-wrap gap-4">
              <RedirectDialog>
                {({ submit }) => (
                  <button
                    disabled={!block || !name}
                    className="disabled:cursor-not-allowed py-2 px-3 text-white rounded-md bg-yellow-600 disabled:bg-yellow-600/80 disabled:text-white/80 font-semibold tracking-wider uppercase"
                    onClick={() => {
                      const searchParams = new URLSearchParams({
                        start: formatISO(getDate(block.date, time), {
                          format: "basic",
                        }),
                        end: formatISO(block.endDate, { format: "basic" }),
                        title: `${block.summary} with ${name}`,
                        description: details,
                        location,
                      });
                      if (config.api) {
                        fetch(config.api + "?" + searchParams.toString()).then(
                          (resp) => {
                            if (resp.ok) {
                            }
                          }
                        );
                      } else {
                        submit(
                          window.location.href + "?" + searchParams.toString()
                        );
                      }
                    }}
                  >
                    Create Event
                  </button>
                )}
              </RedirectDialog>
              <button
                className="py-2 px-3 text-slate-100 rounded-md border-2 border-slate-600 hover:bg-slate-600 font-semibold tracking-wider uppercase"
                onClick={() => setBlock("")}
              >
                Cancel
              </button>
            </div>
          </Section>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const Input = ({ icon, ...rest }) => (
  <div className="flex items-center flex-row-reverse">
    <input
      type="text"
      className="w-full rounded-l-none border-l-0 peer"
      {...rest}
    />
    <div className="text-slate-500 py-2 pl-3 pr-0 border-y-2 border-l-2 rounded-l-lg border-slate-600 peer-focus:border-yellow-500 peer-focus:text-yellow-500">
      {icon}
    </div>
  </div>
);

const getDate = (date, time) =>
  !time
    ? date
    : set(date, {
        hours: time.split(":")[0],
        minutes: time.split(":")[1],
      });

export default ConfirmDialog;
