const { root } = program.refs;
const { APPID } = process.env;

import { get } from './client';

export async function init() {
	await root.set({
		locations: {},
	});
}

export const LocationCollection = {
	async byZipCode({ args }) {
		const { country, zip } = args;
		const result = await get(
			`/forecast?zip=${zip},${country}&APPID=${APPID}`
		);
		return result;
	},
};

export const ListCollection = {
	one({ source, args }) {
		const item = source.find(one => one.dt === args.dt);
		return item;
	},
	items({ source }) {
		return source;
	},
};

export const ListItem = {
	async self({ source, self }) {
		const { zip, country } = self.match(root.locations.byZipCode());
		return root.locations
			.byZipCode({ country: us, zip: zip })
			.list.one({ dt: source.dt });
	},
};

export const RainInfo = {
	last3h({ source }) {
		return source['3h'];
	},
};

export const SnowInfo = {
	last3h({ source }) {
		return source['3h'];
	},
};
