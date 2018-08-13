import { on, hub } from 'mvdom';
import { asNum } from "./utils";
import * as qs from 'qs';

// Global routeHub to trigger the events
var routeHub = hub("routeHub");

export function getInfo() {
	return parseHash();
}

export function initRoute() {
	triggerRouteChange(getInfo());
}

export function pathAt(idx: number): string | null {
	return getInfo().pathAt(idx);
}

export function pathAsNum(idx: number): number | null {
	return getInfo().pathAsNum(idx);
}

export class RouteInfo {
	private _data: any;

	constructor(data: any) {
		this._data = data;
	}

	pathAt(idx: number): string | null {
		return (this._data.paths.length > idx) ? this._data.paths[idx] : null;
	};

	pathAsNum(idx: number): number | null {
		var num = this.pathAt(idx);
		return asNum(num);
	};

	paths(): string[] {
		return this._data.paths;
	}

	hash(): string {
		return this._data.hash;
	}
	params(): any {
		return this._data.params;
	}
	param(name: string): string | null {
		return this._data.params[name];
	}
}

document.addEventListener('DOMContentLoaded', function (event) {
	on(window, 'hashchange', function () {
		triggerRouteChange(getInfo());
	});
});

// --------- utilities --------- //
function triggerRouteChange(routeInfo: RouteInfo) {
	routeHub.pub('CHANGE', routeInfo);
}

function parseHash(): RouteInfo {
	let hash = window.location.hash;
	let paths: string[];
	let params: any = {};
	if (hash) {
		hash = hash.substring(1);

		var pathAndParam = hash.split('!'); // should get the first "!" as we should allow for param values to have "!"

		paths = pathAndParam[0].split('/');

		//process params
		if (pathAndParam[1]) {
			params = qs.parse(pathAndParam[1]);
		}
	} else {
		paths = [];
	}

	return new RouteInfo({ paths, hash, params });
}
// --------- /utilities --------- //