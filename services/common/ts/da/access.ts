import { BaseDao } from './dao-base';
import { Context, getSysContext } from '../context';
import { newTopFinder } from '../top-decorator';

const topFinder = newTopFinder();


/**
 * There are three type of privilege
 * - '#...' such as '#admin' meaning the role admin, and this is system wide, or '#free' for free user
 *   - as of now there are 4 types: 
 *     - 'sys' this is the role for any background service/logic that does not have a user attached. A default 'sys' user has been created with this role
 *     - 'admin' this is the role for any logged in user that have full admin privilege. A default 'admin' user has been created with this role.
 *     - 'user' those are normal user that login/register through the system
 * - '@...' such as '@cid' means that the current user (in context) `.id` match the '.cid' of the entity in question
 * - '...' such as 'owner' or 'viewer' which are role scoped for a given project (using the user_role table)
 * 
 * Note: In this application, Role are scoped by project (can be scoped on different object or root depending of the app need)
 */

//#region    ---------- Decorator ---------- 
export function AccessRequires(privilege: string[] | string) {
	const privileges = (privilege instanceof Array) ? privilege : [privilege];

	return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {


		const method = descriptor.value!;
		//console.log(`AccessRequires decorator for ${target.constructor.name} ${propertyKey} wrapping ${method.name}`);

		descriptor.value = async function accessRequiresWrapper(this: BaseDao<Object, number>) {
			const sysCtx = await getSysContext();
			const isTop = topFinder.isTop(this.constructor, target.constructor, propertyKey);

			// we perform the access control only for the top most class for this methods
			if (isTop) {
				const ctx = arguments[0] as Context;
				if (!ctx.constructor.name.startsWith('Context')) {
					throw new Error(`First argument of ${this.constructor.name}.${method.name} must be a "Context" and not a ${ctx.constructor.name}`);
				}

				const userId = ctx.userId;
				const userType = ctx.userType;
				let entityId: number | null = null;

				let pass = false;

				for (const p of privileges) {

					// if we have a user type, try to match it. 
					if (p.startsWith('#')) {
						const type = p.substring(1);
						if (type === userType) {
							pass = true;
							break;
						}
					}
					// if we have a property userId access type
					else if (p.startsWith('@')) {
						const propName = p.substring(1); // propName to be 
						entityId = arguments[1] as number; // right now, we assume the second arg is the entityId

						const entity: any = await this.get(sysCtx, entityId);
						const val = entity[propName] as number;
						if (userId === val) {
							pass = true;
							break;
						}
					} else {
						// TODO: needs to implement project role base
					}

				}

				if (!pass) {
					throw new Error(`User ${userId} does not have the necessary access for "${this.constructor.name}[${entityId}].${method.name}", access: [${privileges.join(',')}]`);
				}
			}

			return method.apply(this, arguments);
		}
	}

}
//#endregion ---------- /Decorator ---------- 