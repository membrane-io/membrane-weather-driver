// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { state, root } from "membrane";
import { api } from "./utils";

state.latLon = state.latLon ?? {};

export const Root = {
  tests: () => ({}),
  status: () => {
    if (!state.apiKey) {
      return "Get an [OpenWeather API key](https://openweathermap.org) and then [configure](:configure) it.";
    }
    return `Ready`;
  },
  async configure({ apiKey }) {
    state.apiKey = apiKey ?? state.apiKey;
  },
  async weather({ units, zipCode, countryCode }) {
    const zip = `${zipCode},${countryCode ?? "US"}`;

    // Retrieve and cache lat/lon for the given zip/country code
    if (!state.latLon[zip]) {
      const res = await api("geo/1.0/zip", { zip });
      const { lat, lon } = await res.json();
      state.latLon[zip] = { lat, lon };
    }

    const query = {
      ...state.latLon[zip],
      units: units ?? "standard",
    };
    const res = await api("data/2.5/onecall", query);
    if (res.status !== 200) {
      throw new Error(`OpenWeather API returned ${res.status}: ${res.text()}`);
    }
    return await res.json();
  },
};

export const Tests = {
  testWeatherTemp: async () => {
    const temp = await root.weather({ zipCode: "10001" }).current.temp;
    return typeof temp === "number";
  },
};

export const Weather = {
  current: (_, { obj }) => obj.current,
  hourly: (_, { obj }) => obj.hourly,
  daily: (_, { obj }) => obj.daily,
  minutely: (_, { obj }) => obj.minutely,
};
