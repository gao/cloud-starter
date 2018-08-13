import { Context } from '../context';


export interface Dao<E, I> {
	create(ctx: Context, data: Partial<E>): Promise<I>;
	update(ctx: Context, id: number, data: Partial<E>): Promise<any>;
	get(ctx: Context, id: number): Promise<E>;
	list(ctx: Context): Promise<E[]>;
	remove(ctx: Context, id: number): Promise<any>;
}
