import { types } from 'pg';
import * as knexClient from 'knex';


// NOTE: this is not 100% safe for now, but we should be below the bigint for a while.
//       and v8 added bigint, so, sont it will work (will need TS 3.1 https://github.com/Microsoft/TypeScript/issues/15096)
types.setTypeParser(20, function (val: string) {
	return parseInt(val); // for now, int, until TS 3.1 supports BigInt
	// FIXME: When TS 3.1 supports BigInt
	// return BigInt(val); 
});


const host = 'cstar-db-srv';
// const host = 'localhost';
const dbPrefix = 'cstar_';
const dbOpts = { database: `${dbPrefix}db`, user: `${dbPrefix}user`, password: 'welcome', host: host };



let _knex: knexClient | undefined;

export async function getKnex() {

	if (!_knex) {
		try {
			_knex = await knexClient({
				client: 'pg',
				connection: dbOpts,
				pool: {
					min: 0,
					max: 5
				},
				acquireConnectionTimeout: 1000
			});
		} catch (ex) {
			console.log(`Cannot connect to `, dbOpts, ex);
		}
	}

	return _knex!; // help the compiler

}

export async function closeKnex() {
	const k = await getKnex();
	await k.destroy();
	_knex = undefined;

}