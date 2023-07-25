// `nodes` contain any nodes you add from the graph (dependencies)
// `root` is a reference to this program's root node
// `state` is an object that persists across program updates. Store data here.
import { nodes, root, state } from "membrane";
import { api } from "./utils";

export const Root = {
  tests: () => ({}),
  status: () => {
    if (!state.apiKey) {
      return "Invoke `:configure` with your openweathermap.org API key first";
    }
    return `Weather for ${state.cityData.name}`;
  },
  async configure({ args: { apiKey, zipCode, countryCode } }) {
    state.apiKey = apiKey;
    // Retrieve lat/lon for the given zip/country code
    const query = {
      zip: `${zipCode},${countryCode}`,
    };
    const res = await api("GET", "geo/1.0/zip", query);
    // Save the retrieved city data in the state object
    state.cityData = await res.json();
  },
  async weather({ args: { units }}) {
    const query = {
      lat: state.cityData.lat,
      lon: state.cityData.lon,
      units: units || "imperial",
    };
    const res = await api("GET", "data/2.5/onecall", query);
    return await res.json();
  },
};

export const Tests = {
  testWeatherTemp: async () => {
    const temp = await root.weather({ units: "metric" }).current.temp;
    return  typeof temp === 'number';
  }
};

export const Weather = {
  current: ({ obj }) => obj.current,
  hourly: ({ obj }) => obj.hourly,
  daily: ({ obj }) => obj.daily,
  minutely: ({ obj }) => obj.minutely,
};

export const MinutelyCollection = {
  one: ({ obj, args: { dt } }) => findOneByDt(obj, dt),
  items: ({ obj }) => obj,
};

export const HourlyCollection = {
  one: ({ obj, args: { dt } }) => findOneByDt(obj, dt),
  items: ({ obj }) => obj,
};

export const DailyCollection = {
  one: ({ obj, args: { dt } }) => findOneByDt(obj, dt),
  items: ({ obj }) => obj,
};

export const Minutely = {
  gref: ({ obj }) => root.weather.minutely.one({ dt: obj.dt }),
};

export const Hourly = {
  gref: ({ obj }) => root.weather.hourly.one({ dt: obj.dt }),
};

export const Daily = {
  gref: ({ obj }) => root.weather.daily.one({ dt: obj.dt }),
};

const findOneByDt = (obj, dt) => obj.find((one) => one.dt === dt);
