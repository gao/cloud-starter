import { BaseDao } from './dao-base';
import { Project, Ticket, User, OAuth, Label, TicketLabel, Filter } from 'shared/entities';
import { Context, newContext } from '../context';
import { AccessRequires } from './access';
import { getKnex } from './db';

export * from 'shared/entities';

class UserDao extends BaseDao<User, number>{
	constructor() {
		super('user');
	}

	async getByUsername(ctx: Context, username: string) {
		return super.first(ctx, { username });
	}

	// For now, we allow anybody to call this for registration. 
	//   Need to change that at some point to avoid DOS.
	// @AccessRequires('um') 
	async create(ctx: Context, data: Partial<User>) {
		return super.create(ctx, data);
	}

	@AccessRequires('um')
	async remove(ctx: Context, id: number) {
		return super.remove(ctx, id);
	}

	@AccessRequires(['um', '@-id'])
	async update(ctx: Context, id: number, data: Partial<User>) {
		return super.update(ctx, id, data);
	}


}
export const userDao = new UserDao();


export const projectDao = new BaseDao<Project, number>('project');

class TicketDao extends BaseDao<Ticket, number> {
	constructor() { super('ticket') }

	async list(ctx: Context, filter?: Filter<Ticket>): Promise<Ticket[]> {
		const k = await getKnex();
		let q = k(this.tableName);

		// columns we want to select
		const columns = {
			'id': 'ticket.id',
			'projectId': 'ticket.projectId',
			'title': 'ticket.title',
			'ghId': 'ticket.ghId',
			'ghNumber': 'ticket.ghNumber',
			'label_id': 'l.id',
			'label_name': 'l.name',
			'label_color': 'l.color'
		}
		q.columns(columns);

		// for now only support the filter.matching
		if (filter && filter.matching) {
			// de-ambiguitate matching, for now, only support ticket matching
			const matching = Object.entries(filter.matching).reduce((acc: any, kv: any[]) => {
				acc['ticket.' + kv[0]] = kv[1];
				return acc;
			}, {});

			q = q.where(matching);
		}

		// make the join up to the label table (many to many on the middle) 
		q = q.leftJoin('ticket_label as tl', 'ticket.id', 'tl.ticketId');
		q = q.join('label as l', 'tl.labelId', 'l.id');

		//const sql = q.toSQL().sql; // usefull for debug

		// do the query (need cast here)
		const records = await q.then() as any[];

		// reduce the records to be per tickets and merge the labels and such
		// Note: here we use a Map<number, ticket> (ticketByTicketId) accumulator to reduce the number of ticket entities created
		const entities: Map<number, Ticket> = records.reduce((acc: Map<number, Ticket>, r: any) => {
			const rId = r.id;
			let ticket = acc.get(rId);

			// if we do not have a ticket yet, we extract the information and create it
			if (ticket == null) {
				ticket = {
					id: rId,
					projectId: r.projectId,
					title: r.title,
					ghId: r.ghId,
					ghNumber: r.ghNumber,
					labels: []
				}
				acc.set(rId, ticket);
			}

			if (r.label_id) {
				ticket.labels!.push({
					id: r.label_id,
					name: r.label_name,
					color: r.label_color
				});
			}

			return acc;

		}, new Map<number, Ticket>());

		// return the values fof the map as array
		return Array.from(entities.values());

	}
}
export const ticketDao = new TicketDao();

export const oauthDao = new BaseDao<OAuth, number>('oauth');

export const labelDao = new BaseDao<Label, number>('label');

export type TicketLabelId = { ticketId: number, labelId: number };
export const ticketLabelDao = new BaseDao<TicketLabel, TicketLabelId>('ticket_label', ['ticketId', 'labelId']);

export const daoByEntity: { [type: string]: BaseDao<any, any> } = {
	User: userDao,
	Project: projectDao,
	Label: labelDao,
	Ticket: ticketDao,
	TicketLabel: ticketLabelDao
}

