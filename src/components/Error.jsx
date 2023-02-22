const Error = ({ error }) => (
  <div className="h-screen flex flex-col items-center justify-center">
    <div className="h-12 w-12 bg-red-400/20 mb-4 flex items-center justify-center rounded-md text-red-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <div className="text-2xl text-red-400 font-bold">
      An error has occurred:
    </div>
    <div className="text-lg text-slate-300">{error}</div>
  </div>
);

export default Error;
