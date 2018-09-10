import { PerfContext } from './perf';
import { User } from 'shared/entities';
import { oauthDao } from './da/daos';
import { getPrivileges } from './role-manager';

// temporary hardcoded (should go to DB with roles)


/** Context factory. Right now just based on userId */
export async function newContext(userId?: number, user?: Partial<User>) {
	if (userId !== undefined) {
		return new ContextImpl(userId, user);
	} else {
		// empty context
		return new ContextImpl(-1);
	}
}

/** Note: Make context an interface so that ContextImpl class does not get expose and app code cannot create it of the newContext factory */
export interface Context {
	readonly userId: number;
	readonly username: string | null;
	getAccessToken(): Promise<string | null>;
	hasPrivilege(privilege: string): Promise<boolean>;
	readonly perfContext: PerfContext;
}

//#region    ---------- Private Implementations ---------- 
class ContextImpl implements Context {
	readonly userId: number;
	private _privilegeSet: Set<string> | undefined = undefined;
	private _user?: Partial<User>
	readonly perfContext = new PerfContext();

	_data = new Map<string, any>(); // not used yet. 

	get username() {
		return (this._user && this._user.username) ? this._user.username : null;
	}


	constructor(userId: number, user?: Partial<User>) {
		this.userId = userId;
		this._user = user;
	}

	/**
	 * On demand github accessToken property get. Tries to get it only once (since a context is per request)
	 * - undefined means did not try to get it yet. 
	 * - null means that we tried and nothing was found, so, we can run null later
	 * - any value means we found it. 
	 */

	private _accessToken: string | null | undefined = undefined;
	public async getAccessToken(): Promise<string | null> {

		// if null, attempt to find it
		if (this._accessToken === undefined) {
			const oauth = await oauthDao.first(this, { userId: this.userId });
			if (oauth != null && oauth.token != null) {
				this._accessToken = oauth.token;
			} else {
				this._accessToken = null;
			}
		};

		return this._accessToken;
	}

	public async hasPrivilege(privilege: string) {

		if (!this._privilegeSet) {
			const privileges = await getPrivileges(this.userId);
			this._privilegeSet = new Set(privileges);
		}

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