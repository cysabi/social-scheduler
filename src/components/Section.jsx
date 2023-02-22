const Section = ({ logo, title, children }) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 shrink-0 text-yellow-400"
      >
        {logo}
      </svg>
      <h2 className="text-lg uppercase font-semibold tracking-wider text-slate-300">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

export default Section;
