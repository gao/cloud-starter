import { projectDao, Project, ticketDao } from 'common/da/daos';
import { newContext, Context } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

let adminCtx: Context;

describe("test-dao", function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
	});

	this.afterAll(async function () {
		try {
			await closeKnex();
		} catch (ex) {
			console.log('cannot ${ex}')
		}
	})


	it('dao-simple-crud-project', async function () {
		try {
			let project: Project | undefined;

			// test create
			const projectId = await projectDao.create(adminCtx, { name: 'dao-simple-crud-project_project-01' });
			assert(Number.isInteger(projectId), 'project id');
			project = await projectDao.get(adminCtx, projectId);
			assert.strictEqual(project.name, 'dao-simple-crud-project_project-01');

			// test update
			await projectDao.update(adminCtx, projectId, { name: 'dao-simple-crud-project_project-01-updated' });
			project = await projectDao.get(adminCtx, projectId);
			assert.strictEqual(project.name, 'dao-simple-crud-project_project-01-updated');

			// test list
			const projects = await projectDao.list(adminCtx, { matching: { name: 'dao-simple-crud-project_project-01-updated' } });
			assert.strictEqual(projects[0].name, 'dao-simple-crud-project_project-01-updated');

			// always cleanup
			await projectDao.remove(adminCtx, projectId);

		} catch (ex) {
			throw ex;
		}
	});

	it('dao-simple-crud-ticket', async function () {
		try {

			// SETUP
			let project: Project | undefined;
			// create project (container object)
			const projectId = await projectDao.create(adminCtx, { name: 'dao-simple-crud-ticket_project-01' });


			// test create ticket
			const ticketId = await ticketDao.create(adminCtx, { projectId, title: 'dao-simple-crud-ticket_ticket-01' })
			const ticket = await ticketDao.get(adminCtx, ticketId);
			assert.strictEqual(ticket.title, 'dao-simple-crud-ticket_ticket-01');

			// Note: update can be fairly assumed it worked as the project does. We might add test if we find issue. 

			// test list (Note: list is a little different than projectDao.list, because the filter is different)
			// const tickets = await ticketDao.list(adminCtx, { projectId });
			// assert.strictEqual(tickets[0].title, 'dao-simple-crud-ticket_ticket-01');

			// CLEANUP
			await ticketDao.remove(adminCtx, ticketId);
			await projectDao.remove(adminCtx, projectId);

		} catch (ex) {
			throw ex;
		}
	});

	it('dao-simple-with-normal-user', async function () {
		try {


		} catch (ex) {
			throw ex;
		}
	});
});