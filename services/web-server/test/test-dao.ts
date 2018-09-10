import { projectDao, userDao, Project, ticketDao } from 'common/da/daos';
import { wait } from 'common/utils';
import { newContext, Context } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

let adminCtx: Context; // admin user seeded in the db

let user1Ctx: Context; // default user created/cleaned by this test suite

/**
 * Test some basic crud operations with timestamps and all. 
 * 
 * Do not test: 
 *   - access: see test-access
 *   - search: see test-search
 */

describe("test-dao", function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
		user1Ctx = await newContext((await userDao.create(adminCtx, { username: 'test-user1' })));
	});

	this.afterAll(async function () {
		try {
			// cleanup the user created
			await userDao.remove(adminCtx, user1Ctx.userId);

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
			const mtime1 = project.mtime!;

			// test update with user1
			await wait(10); // very short wait to make sure create/updatetime is not the same
			await projectDao.update(user1Ctx, projectId, { name: 'dao-simple-crud-project_project-01-updated' });
			project = await projectDao.get(adminCtx, projectId);
			assert.strictEqual(project.name, 'dao-simple-crud-project_project-01-updated');
			const mtime2 = project.mtime!;

			//// check the timestamp
			// the modify time should have been modify from before
			assert.notStrictEqual(mtime2, mtime1, 'modify time');
			// make sure the ctime and mtime is different
			assert.notStrictEqual(project.ctime, project.mtime, 'ctime vs mtime');
			// check that the .mid and .cid
			assert.strictEqual(project.cid, adminCtx.userId);
			assert.strictEqual(project.mid, user1Ctx.userId);


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
			const tickets = await ticketDao.list(adminCtx, { projectId });
			assert.strictEqual(tickets[0].title, 'dao-simple-crud-ticket_ticket-01');

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