import { router } from 'cmdrouter';
import { loadBlock, now, printLog } from 'vdev';
import * as fs from 'fs-extra-plus';
import * as path from 'path';
import { sketchdev } from 'sketchdev';


router({ ico }).route();

const sketchFile = '../design/cstar-design.sketch';

async function ico() {
	const block = await loadBlock('web');
	const webDir = block.baseDistDir!;

	if (await fs.pathExists(sketchFile)) {
		var start = now();
		const sketchDistDir = './~sketchdev-dist/';
		const webSvgDir = path.join(webDir, './svg');

		// always be safe
		if (path.resolve(sketchDistDir).toLowerCase().includes('britetime')) {
			await fs.remove(sketchDistDir);
		} else {
			console.log(`path ${sketchDistDir} does not seems to be safe to delete`);
		}

		await sketchdev(sketchFile).exportIcons(sketchDistDir);

		await fs.mkdirs(webSvgDir);
		await fs.copy(path.join(sketchDistDir, 'sprite/'), webSvgDir);

		await printLog("ico", path.join(webSvgDir, 'sprite.svg'), start);
	} else {
		console.log(`ico - Sketch app file ${sketchFile} does not exist (skipping)`);
	}
}