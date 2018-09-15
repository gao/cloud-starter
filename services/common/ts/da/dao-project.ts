import { Project, User } from 'shared/entities';
import { Context } from '../context';
import { BaseDao } from './dao-base';
import { AccessRequires } from './access';
import { saveProle } from '../role-manager';
import { getKnex } from './db';

export class ProjectDao extends BaseDao<Project, number> {
	constructor() { super('project', true) }


	@AccessRequires(['#sys'])
	async getOwners(ctx: Context, projectId: number): Promise<User[]> {
		const k = await getKnex();

		// select "user".* from "user" right join user_prole on "user".id = user_prole."userId"
		//    where "projectId" = 1000 and user_prole.name = 'owner';
		const r: any[] = await k('user').column('user.*').rightJoin('user_prole', 'user.id', 'user_prole.userId')
			.where({ projectId, 'user_prole.name': 'owner' });

		// TODO: need to make it generic to dao (to cleanup data from db)
		r.forEach(user => { delete user.pwd });
		return r;
	}

	//#region    ---------- BaseDao Overrides ---------- 
	async create(ctx: Context, data: Partial<Project>) {
		const projectId = await super.create(ctx, data);

		await saveProle(ctx.userId, projectId, 'owner');
		return projectId;
	}

	@AccessRequires(['#sys', '#admin', 'project-read'])
	async get(ctx: Context, id: number) {
		return super.get(ctx, id);
	}

	@AccessRequires(['#sys', '#admin', 'project-write'])
	async update(ctx: Context, id: number, data: Partial<Project>) {
		return super.update(ctx, id, data);
	}

	@AccessRequires(['#sys', '#admin', 'project-remove'])
	async remove(ctx: Context, id: number) {
		return super.remove(ctx, id);
	}
	//#endregion ---------- /BaseDao Overrides ---------- 
}