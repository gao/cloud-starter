import { BaseDao } from './dao-base';
import { Context } from '../context';
import { newTopFinder } from 'common/top-decorator';

const topFinder = newTopFinder();


//#region    ---------- Decorator ---------- 
export function AccessRequires(privilege: string[] | string) {
	const privileges = (privilege instanceof Array) ? privilege : [privilege];

	return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {


		const method = descriptor.value!;
		//console.log(`AccessRequires decorator for ${target.constructor.name} ${propertyKey} wrapping ${method.name}`);

		descriptor.value = async function accessRequiresWrapper(this: BaseDao<Object, number>) {

			const isTop = topFinder.isTop(this.constructor, target.constructor, propertyKey);

			// we perform the access control only for the top most class for this methods
			if (isTop) {
				const ctx = arguments[0] as Context;
				const userId = ctx.userId;
				if (!ctx.constructor.name.startsWith('Context')) {
					throw new Error(`First argument of ${this.constructor.name}.${method.name} must be a "Context" and not a ${ctx.constructor.name}`);
				}
				let pass = false;

				for (const p of privileges) {
					// Check if it is userId matching rule
					if (p.startsWith('@')) {
						const propName = p.substring(2); // propName to be 
						const entityId = arguments[1] as number; // right now, we assume the second arg is the entityId
						const entity: any = await this.get(ctx, entityId);
						const val = entity[propName] as number;
						if (userId === val) {
							pass = true;
							break;
						}
					} else {
						if ((await ctx.hasPrivilege(p))) {
							pass = true;
							break;
						}
					}
				}

				if (!pass) {
					throw new Error(`User ${userId} does not have the necessary access for "${this.constructor.name}.${method.name}" [${privileges.join(',')}]`);
				}
			}

			return method.apply(this, arguments);
		}
	}

}
//#endregion ---------- /Decorator ---------- 