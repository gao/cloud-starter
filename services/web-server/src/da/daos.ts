import { BaseDao } from './dao-base';
import { Project, Ticket, User, OAuth } from './entities';
import { Context } from '../context';
import { AccessRequires } from './access';

export * from './entities';

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


class ProjectDao extends BaseDao<Project, number>{
	constructor() { super('project') }
}
export const projectDao = new ProjectDao();


class TicketDao extends BaseDao<Ticket, number>{
	constructor() { super('ticket') }
}
export const ticketDao = new TicketDao();


class OAuthDao extends BaseDao<OAuth, number>{
	constructor() { super('oauth') }
}
export const oauthDao = new OAuthDao();


class FeatureDao extends BaseDao<Project, number>{
	constructor() { super('feature') }
}
export const featureDao = new FeatureDao();


class LabelDao extends BaseDao<Project, number>{
	constructor() { super('label') }
}
export const labelDao = new LabelDao();


export const daoByEntity: { [type: string]: BaseDao<any, number> } = {
	User: userDao,
	Project: projectDao
}