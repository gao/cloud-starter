import { router } from 'cmdrouter';
import { spawn } from 'p-spawn';
import { CallReducer, wait } from './utils';
import { join as joinPath } from 'path';
import * as chokidar from 'chokidar';

router({ watch }).route();

const webServerDir = 'services/web-server';

const noRestartIfPathHas = '/test/';

async function watch() {

	// ./node_modules/.bin/vdev build watch web
	spawn('./node_modules/.bin/vdev', ['build', 'watch', 'web']);

	watchService('web-server', '9229');

	watchService('gh-syncer', '9230');

	// --------- agent sql watch --------- //
	const recreateDbCr = new CallReducer(() => {
		spawn('npm', ['run', 'kexec', 'agent', 'npm', 'run', 'recreateDb']);
	}, 500);

	const sqlWatcher = chokidar.watch('services/agent/sql', { depth: 99, ignoreInitial: true, persistent: true });

	sqlWatcher.on('change', async function (filePath: string) {
		console.log(`services/agent/sql change: ${filePath}`);
		recreateDbCr.map(filePath);
	});

	sqlWatcher.on('add', async function (filePath: string) {
		console.log(`services/agent/sql add: ${filePath}`);
		recreateDbCr.map(filePath);
	});
	// --------- agent sql watch --------- //

}


async function watchService(serviceName: string, debugPort: string) {
	const serviceDir = `services/${serviceName}`;

	// kubectl port-forward $(kubectl get pods -l run=cstar-web-server --no-headers=true -o custom-columns=:metadata.name) 9229
	const podName = (await spawn('kubectl', ['get', 'pods', '-l', `run=cstar-${serviceName}`, '--no-headers=true', '-o', 'custom-columns=:metadata.name'], { capture: 'stdout' })).stdout.trim();
	spawn('kubectl', ['port-forward', podName, `${debugPort}:9229`]);

	spawn('tsc', ['-w'], { cwd: serviceDir }); // this will create a new restart

	console.log('waiting for tsc -w');
	await wait(2000);

	const distDir = joinPath(serviceDir, '/dist/');

	const watcher = chokidar.watch(distDir, { depth: 99, ignoreInitial: true, persistent: true });

	const cr = new CallReducer(() => {
		spawn('npm', ['run', 'krestart', serviceName]);
	}, 500);

	watcher.on('change', async function (filePath: string) {
		console.log(`${serviceName} - change: ${filePath}`);
		if (filePath.includes(noRestartIfPathHas)) {
			console.log(`no restart because path contains ${noRestartIfPathHas}`);
		} else {
			cr.map(filePath);
		}

	});

	watcher.on('add', async function (filePath: string) {
		console.log(`${serviceName} - add: ${filePath}`);
		if (filePath.includes(noRestartIfPathHas)) {
			console.log(`no restart because path contains ${noRestartIfPathHas}`);
		} else {
			cr.map(filePath);
		}
	});
}