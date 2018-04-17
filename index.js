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
		const result = await get(`/forecast?zip=${zip},${country}&APPID=${APPID}`);
		console.log('Result: ' + result)
		return result;
	},
};
