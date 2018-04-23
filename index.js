const { root } = program.refs;
const { APPID } = process.env;

import { get } from './client';

export async function init() {
  await root.set({
    locations: {},
  });
}

export async function parse({ name, value }) {
  if (name === 'zip') {
    return root.locations.byZipCode({ country: 'us', zip: value })
  }
}

export const LocationCollection = {
  async byZipCode({ args }) {
    const { country, zip } = args;
    const result = await get(`/forecast?zip=${zip},${country}&APPID=${APPID}`);
    return result;
  },
};

export const Location = {
  forecasts({ source }) {
    return source['list'];
  },
};

export const ForecastCollection = {
  one({ source, args }) {
    const { hours, dt } = args;
    if (!hours && dt) {
      const item = source.find(one => one.dt == args.dt);
      return item;
    }
    const epochHours = args.hours * 3600000 + new Date().getTime();
    const item = source.find(one => one.dt * 1000 > epochHours);
    return item;
  },
  items({ source }) {
    return source;
  },
};

export const ListItem = {
  async self({ source, self, parent }) {
    const { zip, country } = parent.match(root.locations.byZipCode());
    return root.locations
      .byZipCode({ country: country, zip: zip })
      .forecasts()
      .one({ dt: source.dt });
  },
  weather({ source }) {
    return source['weather'][0];
  },
  dtTxt({ source }) {
    return source['dt_txt'];
  },
};
