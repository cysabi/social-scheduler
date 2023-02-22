import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Error from "./Error";

export const Button = ({ createUrl, ...rest }) => {
  let [value, setValue] = useState("");
  let [open, setOpen] = useState(false);
  let [copied, setCopied] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setValue(createUrl());
        }}
        className="disabled:cursor-not-allowed w-full py-2 px-3 text-white rounded-md bg-yellow-600 disabled:bg-slate-600 disabled:text-slate-400 font-bold tracking-wider uppercase"
        {...rest}
      >
        Create Request
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex sm:items-center justify-center items-end">
          <Dialog.Panel className="sm:max-w-md w-full rounded-t-xl sm:rounded-xl flex flex-col gap-6 shadow-2xl bg-slate-700 p-6">
            <div>
              <div className="font-semibold text-xl">Request Created</div>
              <div className="text-lg font-medium">
                Copy this url, and send it to Sam Holmberg
              </div>
            </div>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={value}
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
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard
                    .writeText(value)
                    .then(() => setCopied(true));
                }}
                className="p-2 px-3 rounded-md flex items-center bg-yellow-600 font-semibold tracking-wider uppercase gap-2"
              >
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
                <p>Copy Text</p>
              </button>
              {copied && (
                <div className="font-bold text-green-400 text-lg">Copied!</div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export const Redirect = ({ error, children }) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.text) {
    try {
      let url = "https://www.google.com/calendar/render?action=TEMPLATE";
      url += "&text=" + params.text;
      url += "&details=" + params.details;
      url += "&location=" + params.location;
      url += "&dates=" + params.start + "/" + params.end;
      window.location.href = url;
      return null;
    } catch {
      return (
        <Error error="Invalid request url! Make sure it's been copied it correctly." />
      );
    }
  }
  if (error) {
    return <Error error={error} />;
  }
  return children;
};
