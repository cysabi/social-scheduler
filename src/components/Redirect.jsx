import Error from "./Error";

const Redirect = ({ error, children }) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.text) {
    try {
      let url = "https://www.google.com/calendar/render?action=TEMPLATE";
      url += "&text=" + params.title;
      url += "&details=" + params.description;
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

export default Redirect;
