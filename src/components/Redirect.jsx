import Error from "./Error";

const Redirect = ({ error, children }) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.title) {
    try {
      let url = "https://www.google.com/calendar/render?action=TEMPLATE";
      url += "&text=" + params.title;
      url += "&location=" + params.location;
      url += "&dates=" + params.start + "/" + params.end;
      window.location.href = url;
      return (
        <div className="h-screen flex items-center justify-center w-screen text-xl text-slate-500">
          <p>Redirecting...</p>
        </div>
      );
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

export default Redirect;
