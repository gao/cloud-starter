import { router } from 'cmdrouter';
import { spawn } from 'p-spawn';
import { CallReducer, wait } from './utils';
import { join as joinPath } from 'path';
import * as chokidar from 'chokidar';

const servicesDir = 'services';


router({ trun }).route();


async function trun(serviceName: string, testGrep: string) {


	// TODO: need to use the vdev to get the real dir
	const testDir = `${servicesDir}/${serviceName}/dist/${servicesDir}/${serviceName}/test/`;


	// --------- service test watch and run --------- //

	const watcher = chokidar.watch(`${testDir}**/*.js`, { depth: 99, ignoreInitial: true, persistent: true });

	const cr = new CallReducer(() => {
		const args = ['run', 'kexec', serviceName];
		args.push('--', 'npm', 'run', 'test');
		if (testGrep) {
			args.push('--', '-g', testGrep);
		}
		spawn('npm', args);
	}, 500);

	watcher.on('change', async function (filePath: string) {
		cr.map(filePath);
	});

	watcher.on('add', async function (filePath: string) {
		cr.map(filePath);
	});
	// --------- /service test watch and run --------- //

	// initial call
	// cr.map();


}