
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
export async function getConf(name: string): Promise<any> {
	let confObj: any | undefined;

	// first we try to get it from the environment
	// TODO: needs to make sure that works (and remove comments when it does)
	confObj = process.env[name];

	// if not found, try the static value
	if (confObj == null) {
		confObj = staticConfigurations[name];
	}

	if (!confObj) {
		throw new Error(`Code error - getConf for name '${name}' not found.`);
	}

	return confObj;
}

