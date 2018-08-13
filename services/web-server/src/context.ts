import { PerfContext } from './perf';

// temporary hardcoded (should go to DB with roles)
const _userPrivileges: { [key: string]: string[] } = {
	'-1': ['um', 'project']
}

/** Context factory. Right now just based on userId */
export async function newContext(userId?: number) {
	if (userId !== undefined) {
		const privileges = _userPrivileges[userId] || [];
		return new ContextImpl(userId, privileges);
	} else {
		// empty context
		return new ContextImpl(-1);
	}
}


export interface Context {
	readonly userId: number;
	hasPrivilege: (privilege: string) => boolean;
	readonly perfContext: PerfContext;
}

//#region    ---------- Private Implementations ---------- 
class ContextImpl {
	readonly userId: number;
	private _privilegeSet: Set<string>;
	readonly perfContext = new PerfContext();

	_data = new Map<string, any>()

	constructor(userId: number, privileges?: string[]) {
		this.userId = userId;
		this._privilegeSet = new Set(privileges);
	}

	public hasPrivilege(privilege: string) {
		return this._privilegeSet.has(privilege);
	}

	// set or get a data for a key
	// val: If null or object, will set the data with val, and return this (i.e. Context object)
	//      If 
	data(key: string, val: any | undefined | null) {
		if (val === undefined) {
			return this._data.get(key);
		} else {
			this._data.set(key, val);
			return this;
		}
	}

}
//#endregion ---------- /Private Implementations ---------- 