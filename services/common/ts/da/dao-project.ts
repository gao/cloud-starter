import { Project } from 'shared/entities';
import { Context } from '../context';
import { BaseDao } from './dao-base';
import { AccessRequires } from './access';

export class ProjectDao extends BaseDao<Project, number> {
	constructor() { super('project', true) }

	@AccessRequires(['#sys', '#admin', '@cid'])
	async get(ctx: Context, id: number) {
		return super.get(ctx, id);
	}

	@AccessRequires(['#sys', '#admin', '@cid', 'project-writer'])
	async update(ctx: Context, id: number, data: Partial<Project>) {
		return super.update(ctx, id, data);
	}

	@AccessRequires(['#sys', '#admin', '@cid'])
	async remove(ctx: Context, id: number) {
		return super.remove(ctx, id);
	}
}