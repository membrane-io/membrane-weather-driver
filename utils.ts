import { nodes, root, state } from "membrane";

export async function api(path: string, query?: any, body?: string) {
  if (!state.apiKey) {
    throw new Error("No API key set. Invoke `:configure` first");
  }
  if (query) {
    Object.keys(query).forEach((key) =>
      query[key] === undefined ? delete query[key] : {}
    );
  }
  // Get the api key from the state object
  Object.assign(query, { ...query, appid: state.apiKey });
  const querystr =
    query && Object.keys(query).length ? `?${new URLSearchParams(query)}` : "";
  const url = `http://api.openweathermap.org/${path}${querystr}`;
  const req = {
    method: "GET" as RequestMethod,
    body,
  };
  const res = await fetch(url, req);
  if (res.status !== 200) {
    throw new Error(`Could not fetch ${url}: ${await res.text()}`);
  }
  return res;
}
