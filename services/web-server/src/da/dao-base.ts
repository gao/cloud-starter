import { getKnex } from './db';
import { Dao } from './dao';
import { Context } from '../context';
import { Monitor } from '../perf';

// Note: for now, the knex can take a generic I for where value
// @annoC
export class BaseDao<E, I> implements Dao<E, I> {
	tableName: string;

	constructor(tableName: string) {
		this.tableName = tableName;
	}

	@Monitor()
	async get(ctx: Context, id: number): Promise<E> {
		const k = await getKnex();
		const r = await k(this.tableName).where('id', id);
		if (r.length === 0) {
			throw new Error(`dao.get error, can't find ${this.tableName}[${id}]`);
		}
		return r[0] as E;
	}

	@Monitor()
	async first(ctx: Context, data: Partial<E>): Promise<E | null> {
		const k = await getKnex();
		const r = await k(this.tableName).where(data);
		if (r.length === 0) {
			return null;
		}
		return r[0] as E;
	}

	@Monitor()
	async create(ctx: Context, data: Partial<E>): Promise<I> {
		const k = await getKnex();
		const r = await k(this.tableName).insert(data).returning('id');
		return r[0] as I;
	}

	async ttt(data: Partial<E>) { }

	@Monitor()
	async update(ctx: Context, id: number, data: Partial<E>) {
		const k = await getKnex();
		const r = await k(this.tableName).update(data).where('id', id);
		return r;
	}

	@Monitor()
	async list(ctx: Context, filter?: { matching: Partial<E> }): Promise<E[]> {
		const k = await getKnex();
		let q = k(this.tableName);
		if (filter && filter.matching) {
			q = q.where(filter.matching);
		}
		const entities = await q.then(); // TODO: need to check if this is the common way
		return entities as E[];
	}

	@Monitor()
	async remove(ctx: Context, id: number) {
		const k = await getKnex();
		return k(this.tableName).delete().where('id', id);
	}

}

