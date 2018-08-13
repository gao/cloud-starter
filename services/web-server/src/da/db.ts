import * as knexClient from 'knex';

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