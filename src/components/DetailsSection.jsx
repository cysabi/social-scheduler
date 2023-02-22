const DetailsSection = () => (
  <>
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
  </>
);

export default DetailsSection;
