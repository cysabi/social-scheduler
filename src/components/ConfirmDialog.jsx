import { format, formatISO, set } from "date-fns";
import { useEffect, useState } from "react";
import Section from "./Section";
import { Dialog } from "@headlessui/react";
import config from "../config";

const ConfirmDialog = ({ block, setBlock }) => {
  const [success, setSuccess] = useState([null, null]);

  return (
    <Dialog
      open={!!block}
      onClose={() => {
        setBlock("");
        setSuccess([null, null]);
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex sm:items-center justify-center items-center">
        <Dialog.Panel className="max-w-md w-full rounded-md bg-slate-700 p-6 shadow-xl mx-4 flex flex-col">
          {success[0] === null && (
            <ConfirmSection
              block={block}
              setBlock={setBlock}
              setSuccess={setSuccess}
            />
          )}
          {success[0] === true &&
            (config.api ? (
              <Success>{success[1]}</Success>
            ) : (
              <CopyUrl url={success[1]} />
            ))}
          {success[0] === false && <Error>{success[1].message}</Error>}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const Success = () => (
  <div className="flex flex-col items-center gap-2 justify-center text-center">
    <div className="h-10 w-10 bg-green-400/20 flex items-center justify-center rounded-md text-green-400">
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
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <div className="text-xl text-green-400 font-semibold">Success!</div>
    <div className="text-lg text-slate-300">
      An event has been created on {config.name}'s calendar!
      <br />
      You may close this window now.
    </div>
  </div>
);

const Error = ({ children }) => (
  <div className="flex flex-col items-center justify-center text-center gap-2">
    <div className="h-10 w-10 bg-red-400/20 flex items-center justify-center rounded-md text-red-400">
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
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <div className="text-xl text-red-400 font-semibold">
      An error has occurred:
    </div>
    <div className="text-lg text-slate-300">{children}</div>
  </div>
);

const CopyUrl = ({ url }) => {
  let [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg uppercase font-semibold tracking-wider mb-0.5">
          Created Event Request
        </h2>
        <p className="text-lg font-medium text-slate-300">
          Copy this url, and send it to {config.name}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={url}
          readOnly
          className="rounded-r-none text-sm font-mono w-full border-r-0 !border-slate-600"
        ></input>
        <div className="p-2 rounded-md rounded-l-none bg-slate-600 text-slate-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={() =>
            navigator.clipboard.writeText(url).then(() => setCopied(true))
          }
          className={`p-2 px-3 w-full text-center rounded-md font-semibold tracking-wider uppercase gap-2 ${
            copied ? "bg-green-500/30" : "bg-yellow-600"
          }`}
          disabled={copied}
        >
          {copied ? (
            <div className="text-green-200">Text Copied!</div>
          ) : (
            "Copy Text"
          )}
        </button>
      </div>
    </div>
  );
};

const ConfirmSection = ({ block, setBlock, setSuccess }) => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [emailTo, setEmailTo] = useState("");

  useEffect(() => {
    if (block.date) setTime(format(block.date, "HH:mm"));
  }, [block]);

  const title = `${details ? details : block.summary}${name && ` w/ ${name}`}`;

  const createEvent = () => {
    localStorage.setItem("name", name);
    const searchParams = new URLSearchParams({
      title,
      location,
      start: formatISO(getDate(block.date, time)),
      end: formatISO(block.endDate),
    });
    if (config.api) {
      fetch(config.api + "?" + searchParams.toString())
        .then((resp) => {
          resp.ok
            ? resp.json().then((data) => setSuccess([true, data]))
            : resp.json().then((data) => setSuccess([false, data]));
        })
        .catch((error) => setSuccess([false, error]));
    } else {
      setSuccess([true, window.location.href + "?" + searchParams.toString()]);
    }
  };

  return (
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
          <span className="text-black">{title}</span>
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
        {/* <Input
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
        /> */}
      </div>
      <div className="flex items-center flex-row-reverse justify-start flex-wrap gap-4">
        <button
          disabled={!name}
          className="disabled:cursor-not-allowed py-2 px-3 text-white rounded-md bg-yellow-600 disabled:bg-yellow-600/80 disabled:text-white/80 font-semibold tracking-wider uppercase"
          onClick={createEvent}
        >
          Create Event
        </button>
        <button
          className="py-2 px-3 text-slate-100 rounded-md border-2 border-slate-600 hover:bg-slate-600 font-semibold tracking-wider uppercase"
          onClick={() => setBlock("")}
        >
          Cancel
        </button>
      </div>
    </Section>
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
