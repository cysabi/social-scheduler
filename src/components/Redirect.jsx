import { formatISO } from "date-fns";
import Error from "./Error";

const Redirect = ({ children }) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  if (params.name) {
    try {
      let url = "https://www.google.com/calendar/render?action=TEMPLATE";
      url += "&text=" + encodeURIComponent(params.name);
      url += "&details=" + encodeURIComponent(params.description);
      if (params.location)
        url += "&location=" + encodeURIComponent(params.location);
      url +=
        "&dates=" +
        encodeURIComponent(
          formatISO(params.start, { format: "basic" }) +
            "/" +
            formatISO(params.end, { format: "basic" })
        );
      window.location.href = url;
      return null;
    } catch {
      return (
        <Error error="Invalid request! Make sure it's been copied it correctly" />
      );
    }
  }
  return children;
};

export default Redirect;
