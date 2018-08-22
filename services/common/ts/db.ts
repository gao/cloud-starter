
import * as knexClient from 'knex';
import { getConf } from './conf';
import { types } from 'pg';
import { join as joinPath, } from 'path';

// node-postgres wrap bigint number to string, see https://github.com/tgriesser/knex/issues/387
// But there is s wrong around, using node-postgress setTypeParser
// NOTE: this is not 100% safe for now, but we should be below the bigint for a while.
//       and v8 added bigint, so, sont it will work
types.setTypeParser(20, function (val: string) {
	console.log('>>> type', val)
	return parseInt(val)
});

let _knex: knexClient;
connect();

const knexObservers: (() => void)[] = [];

async function connect() {
	const dbHost = await getConf('dbHost');
	const dbName = await getConf('dbName');
	const dbUser = await getConf('dbUser');
	const dbPassword = await getConf('dbPassword');
	_knex = knexClient({
		client: 'pg',
		connection: {
			host: dbHost,
			user: dbUser,
			password: dbPassword,
			database: dbName
		},
		// debug: true,
		searchPath: 'public',
		pool: {
			min: 0,
			max: 7,
		},
		acquireConnectionTimeout: 500
	});
	notifyKnexObservers();

}

function notifyKnexObservers() {
	for (let observer of knexObservers) {
		observer();
	}
}

function knexCreated() {
	return new Promise(function (resolve, reject) {
		knexObservers.push(() => { resolve() });
	});
}

//#region    ---------- Public API ---------- 
export async function getKnex() {
	if (!_knex) {
		await knexCreated();
	}
	return _knex;
}

export async function closeKnex() {
	if (_knex) {
		_knex.destroy();
	}
}
//#endregion ---------- /Public API ---------- 

//#region    ---------- Public Common Entity API ---------- 

export async function getMedia(id: number) {
	const media = await getEntity('media', id);
	if (media) {
		const mediaObj = { ...media };
		const case_ = await getCase(media.caseId);
		const storeBucketRoot = await getConf("storeBucketRoot");
		const storeCdn = await getConf("storeCdn");

		// the caseStoreFolder: cases/case-102/tGcrAG7pEmn1Rr2wpdkBVJr-pvtySYGqry1cKtv1XqJqN5E/
		mediaObj.caseStoreFolder = case_.storeFolder;
		// the mediaFolderPath: cases/case-102/tGcrAG7pEmn1Rr2wpdkBVJr-pvtySYGqry1cKtv1XqJqN5E/main-media
		mediaObj.mediaStoreFolder = joinPath(case_.storeFolder, "main-media");
		// the fullCaseBucketFolderPath = dev-store/someone/cases/case-102/tGcrAG7pEmn1Rr2wpdkBVJr-pvtySYGqry1cKtv1XqJqN5E/
		mediaObj.fullCaseBucketFolderPath = joinPath(storeBucketRoot, mediaObj.caseStoreFolder);
		// the fullMediaBucketPath is like: dev-store/someone/cases/case-102/tGcrAG7pEmn1Rr2wpdkBVJr-pvtySYGqry1cKtv1XqJqN5E/main-media.mp4
		mediaObj.fullMediaBucketPath = joinPath(mediaObj.fullCaseBucketFolderPath, media.storeFileName);
		// the fullMediaBucketFolderPath is like: dev-store/someone/cases/case-102/tGcrAG7pEmn1Rr2wpdkBVJr-pvtySYGqry1cKtv1XqJqN5E/main-media
		mediaObj.fullMediaBucketFolderPath = joinPath(storeBucketRoot, mediaObj.mediaStoreFolder);
		// the fullMediaUrl is like: http://35.190.42.175:80/dev-store/friping/cases/case-102/tGcrAG7pEmn1Rr2wpdkBVJr-pvtySYGqry1cKtv1XqJqN5E/main-media.mp4
		mediaObj.fullMediaUrl = joinPath(storeCdn, storeBucketRoot, case_.storeFolder, media.storeFileName);
		return mediaObj;
	}
	return null;
}

export async function getCase(id: number) {
	return getEntity('case', id);
}

export async function getConfigsFromGb(gb: string) {
	const tableName = "bucket";
	const knex = await getKnex();
	const knexObj = knex(tableName).first().from(tableName).where({ name: gb });
	return knexObj;
}

//#endregion ---------- /Public Common Entity API ---------- 

//#region    ---------- Dao Utils ---------- 
async function getEntity(entityTableName: string, id: number) {
	const knex = await getKnex();
	const knexObj = knex(entityTableName).first().from(entityTableName).where({ id });
	return knexObj;
}
//#endregion ---------- /Dao Utils ---------- 