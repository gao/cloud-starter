require("../../common/ts/common-alias"); // needs to be full relative path because it will set the alias. Call only once at start file.


import { getConf } from 'common/conf';
import { getKnex } from 'common/db';

//main();

async function main() {

	// const client = await getNewRedisClient();

	// listenViaBlocking(client);
	neverEnd();

	const appVersion = await getConf('appVersion');

	console.log(`-->> agent (${appVersion}) index.js - main() - started`);

	const knex = await getKnex();
	const tableName = 'user';
	try {
		const obj = await knex(tableName).first().from(tableName);
	} catch (ex) {
		console.log(`Error - Cannot get connection`, ex);
	}
	console.log('user obj')
}

async function neverEnd() {
	await new Promise(function (resolve, reject) {
		console.log('Will never end...');
	});
}


async function listenViaBlocking(client: any) {
	let videoId: number | null = null;
	for (; true;) { // eslint-disable-line (we use for rather than while to be able to use "continue")
		try {
			// get the next item from the queue list
			const result = await client.brpop('agent.todo', 0);
			const str = result[1];
			if (str) {

			}
		} catch (ex) {
		}
	}
}

