import { Project } from 'shared/entities';
import { Context } from '../context';
import { BaseDao } from './dao-base';
import { AccessRequires } from './access';
import { saveProle } from '../role-manager';

export class ProjectDao extends BaseDao<Project, number> {
	constructor() { super('project', true) }

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
}