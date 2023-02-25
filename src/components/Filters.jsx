import { useState, Fragment } from "react";
import { Switch } from "@headlessui/react";

const Filters = ({
  lunch,
  setLunch,
  dinner,
  setDinner,
  work,
  setWork,
  afternoon,
  setAfternoon,
  evening,
  setEvening,
}) => {
  return (
    <div className="pb-4 flex gap-2 items-center justify-center items-center">
      <Switch checked={lunch} onChange={setLunch} as={Fragment}>
        {({ checked }) => (
          <button
            className={`${
              checked ? "bg-yellow-500" : "bg-slate-600"
            } relative inline-flex h-6 px-2 text-sm items-center rounded-full`}
          >
            Lunch
          </button>
        )}
      </Switch>
      <Switch checked={dinner} onChange={setDinner} as={Fragment}>
        {({ checked }) => (
          <button
            className={`${
              checked ? "bg-yellow-500" : "bg-slate-600"
            } relative inline-flex h-6 px-2 text-sm items-center rounded-full`}
          >
            Dinner
          </button>
        )}
      </Switch>
      <Switch checked={work} onChange={setWork} as={Fragment}>
        {({ checked }) => (
          <button
            className={`${
              checked ? "bg-yellow-500" : "bg-slate-600"
            } relative inline-flex h-6 px-2 text-sm items-center rounded-full`}
          >
            Work
          </button>
        )}
      </Switch>
      <Switch checked={afternoon} onChange={setAfternoon} as={Fragment}>
        {({ checked }) => (
          <button
            className={`${
              checked ? "bg-yellow-500" : "bg-slate-600"
            } relative inline-flex h-6 px-2 text-sm items-center rounded-full`}
          >
            Afternoon
          </button>
        )}
      </Switch>
      <Switch checked={evening} onChange={setEvening} as={Fragment}>
        {({ checked }) => (
          <button
            className={`${
              checked ? "bg-yellow-500" : "bg-slate-600"
            } relative inline-flex h-6 px-2 text-sm items-center rounded-full`}
          >
            Evening
          </button>
        )}
      </Switch>
    </div>
  );
};

export default Filters;
