import Section from "./Section";

const DetailsSection = () => (
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
    <div className="flex flex-col gap-3">
      <input
        type="text"
        className="bg-transparent border-2 rounded-md border-slate-500"
        // {...form.register("name", { required: true })}
        placeholder="Your Name"
      />
      <input
        type="text"
        className="bg-transparent border-2 rounded-md border-slate-500"
        placeholder="Event Title"
        // {...form.register("title", { required: true })}
      />
      <input
        type="text"
        className="bg-transparent border-2 rounded-md border-slate-500"
        placeholder="Location"
        // {...form.register("location")}
      />
    </div>
    <button
      type="submit"
      className="w-full py-2 mt-20 px-3 text-white rounded-md bg-yellow-600 font-bold tracking-wider uppercase"
    >
      Create Request
    </button>
  </Section>
);

export default DetailsSection;
