import { getKnex } from './da/db';

// IMPORTANT: Do not change this appVersion value manually, change it in the package.json and do a "npm run version"
const staticConfigurations: any = {
	dataPath: "/service/data",
	appVersion: "DROP-019-SNAPSHOT",
	dbHost: "cstar-db-srv"
}

/**
 * Return a configuration from a configuration name. Those configuration could be static, comes from redis, or from DB (and cached).
 * 
 * Note: For now, just support static config.
 * 
 * @param name 
 */
export async function getConfig(name: string): Promise<any> {
	let data: any | undefined;

	// first we try to get it from the environment
	// TODO: needs to make sure that works (and remove comments when it does)
	data = process.env[name];

	// if not found, try the static value
	if (data == null) {
		data = staticConfigurations[name];
	}

	if (data == null) {
		const k = await getKnex();
		const r = await k('config').where({ name });
		if (r && r.length === 1) {
			data = r[0].data; // data is the jsonb
		}
	}

	if (!data) {
		throw new Error(`Code error - getConf for name '${name}' not found.`);
	}

	return data;
}

