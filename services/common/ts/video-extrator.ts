// import * as spawn from "p-spawn";
import { spawn } from 'p-spawn';
import * as path from 'path';
import * as fs from 'fs-extra-plus';

export async function extractMediaInfo(videoPath: string, name?: string) {
	const cmdResult = await spawn('ffprobe', ['-i', videoPath, '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'], {
		capture: 'stdout'
	});
	const jsonString = cmdResult.stdout.toString();
	const obj = JSON.parse(jsonString);
	let width = 400, height = 300;
	for (const stream of obj.streams) {
		if (stream.width && stream.height) {
			width = stream.width;
			height = stream.height;
			break;
		}
	}

	const result = {
		width: width,
		height: height,
		length: parseFloat(obj.format.duration),
		name: path.basename(videoPath)
	}
	if (name) {
		result.name = name;
	}
	return result;
}


export async function extractThumbnail(videoPath: string, width: number, height: number, start: number, destPath: string) {
	const args = ['-nostats', '-loglevel', '0', '-ss', `${start}`, '-i', videoPath, '-vframes', '1', '-t', '1', '-f', 'image2', '-y', '-s', `${width}x${height}`, destPath];
	await spawn('ffmpeg', args, {
		capture: 'stdout'
	});
}

export async function transcodes(videoPath: string, destPath: string, progressCallback?: Function) {
	const args = ['-i', videoPath, destPath];
	let timer = null;
	if (progressCallback) {
		timer = setInterval(() => {
			let size = 0;
			if (fs.pathExistsSync(destPath)) {
				const size = fs.statSync(destPath).size;
				progressCallback(size);
			}
		}, 2000);
	}

	await spawn('ffmpeg', args, {
		capture: 'stdout'
	});

	if (timer) {
		clearInterval(timer);
	}
}