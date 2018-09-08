import { Label, OAuth, Project, TicketLabel, User, Pane } from 'shared/entities';
import { Context } from '../context';
import { AccessRequires } from './access';
import { BaseDao, ProjectEntityDao } from './dao-base';
import { TicketDao } from './dao-TicketDao';

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

export const ticketDao = new TicketDao();

export const paneDao = new ProjectEntityDao<Pane, number>('pane');

export const oauthDao = new BaseDao<OAuth, number>('oauth');

export const labelDao = new ProjectEntityDao<Label, number>('label');

export type TicketLabelId = { ticketId: number, labelId: number };
export const ticketLabelDao = new BaseDao<TicketLabel, TicketLabelId>('ticket_label', ['ticketId', 'labelId']);

export const daoByEntity: { [type: string]: BaseDao<any, any> } = {
	User: userDao,
	Project: projectDao,
	Label: labelDao,
	Ticket: ticketDao,
	TicketLabel: ticketLabelDao,
	Pane: paneDao
}

