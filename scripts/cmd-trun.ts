import { router } from 'cmdrouter';
import { spawn } from 'p-spawn';
import { CallReducer, wait } from './utils';
import { join as joinPath } from 'path';
import * as chokidar from 'chokidar';

const servicesDir = 'services';

const testPathContains = '/test/';

router({ trun }).route();


async function trun(serviceName: string, testGrep: string) {


	const serviceDir = `${servicesDir}/${serviceName}`;
	const serviceDistDir = `${serviceDir}/dist`;

	// TODO: need to use the vdev to get the real dir

	// start the building
	spawn('tsc', ['-w'], { cwd: serviceDir }); // this will create a new restart

	// --------- service test watch and run --------- //
	console.log('watch ' + `${serviceDistDir}/**/*.js`);
	const watcher = chokidar.watch(`${serviceDistDir}/**/*.js`, { depth: 99, ignoreInitial: true, persistent: true });

	const cr = new CallReducer(() => {
		const args = ['run', 'kexec', serviceName];
		args.push('--', 'npm', 'run', 'test');
		if (testGrep) {
			args.push('--', '-g', testGrep);
		}
		spawn('npm', args);
	}, 500);

	watcher.on('change', async function (filePath: string) {
		console.log(`change ${filePath}`);
		cr.map(filePath);
	});

	watcher.on('add', async function (filePath: string) {
		cr.map(filePath);
	});
	// --------- /service test watch and run --------- //

	// initial call
	// cr.map();


}