import { psqlImport, pgStatus, pgTest, list as gsList, download as gsDownload } from 'vdev';
import { router } from 'cmdrouter';
import * as fs from 'fs-extra-plus';
import { basename, join as joinPath } from 'path';
import { ensureDir } from 'fs-extra-plus';


const sqlDir = 'sql';
const host = 'cstar-db-srv';

const dbPrefix = 'cstar_';
const dbOpts = { user: dbPrefix + "user", db: dbPrefix + "db", host: host };

router({ updateDb, recreateDb }).route();


// --------- Commands --------- //
// user for dev
async function recreateDb() {
	if (!(await checkRunning())) {
		return;
	}

	//// Drop the cstar_ db and user
	const t = await pgTest(dbOpts);
	if (t.success) { // drop only if exist
		// local test: // psql -U postgres -d postgres -f sql/_drop-db.sql
		await psqlImport({ user: "postgres", db: "postgres", host }, [`${sqlDir}/_drop-db.sql`]);
	}

	//// create the cstar_... database / user
	// local test: psql -U postgres -d postgres -f sql/00_create-db.sql
	await psqlImport({ user: "postgres", db: "postgres", host }, [`${sqlDir}/00_create-db.sql`]);

	//// Option 1) At the beginning, load from sql
	await psqlImport(dbOpts, [`${sqlDir}/01_create-tables.sql`]);
	await psqlImport(dbOpts, [`${sqlDir}/02_seed.sql`]);

	//// Option 2) When app is in prod, this will take the data from prod
	//await loadProdDb();


	//// 6) Import the drop sqls
	await updateDb();
}

async function updateDb() {
	try {
		// TODO: need to gets the db changelog first, to run only what is missing.
		await psqlImport(dbOpts, await fs.glob('drop-*.sql', sqlDir));
	} catch (ex) {
		console.log('Failed updatedb: ', ex);
	}
}

async function loadProdDb() {
	//// 3) Download the last dev prod sql (will be deintified later)
	const gsFiles: any[] = await gsList({ store: 'dev', path: '**/*.sql' });
	const lastDbSqlStoragePath = gsFiles[gsFiles.length - 1].name;

	const tmpProdSqlDir = '~tmp/sql/';
	const prodFileName = basename(lastDbSqlStoragePath);

	await ensureDir(tmpProdSqlDir);
	await gsDownload({ store: 'dev', path: lastDbSqlStoragePath }, tmpProdSqlDir);

	//// 4) Import the prod sql
	// local test: psql -U cstar_user -d cstar_db -f ~tmp/sql/prod-db.sql
	await psqlImport(dbOpts, [joinPath(tmpProdSqlDir, prodFileName)]);

	//// 5) Reset the passwords to welcome (clear)
	await psqlImport(dbOpts, [`${sqlDir}/_reset-passwords.sql`]);
}
// --------- /Commands --------- //


// --------- Private Utils --------- //
async function checkRunning(): Promise<boolean> {
	const status = await pgStatus({ host });
	if (!status.accepting) {
		console.log(`Database not ready (${status.message})`);
	}
	return status.accepting;
}
// --------- /Private Utils --------- //