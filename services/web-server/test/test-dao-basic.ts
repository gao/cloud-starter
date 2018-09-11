import { projectDao, userDao, Project, ticketDao } from 'common/da/daos';
import { wait } from 'common/utils';
import { newContext, Context, getSysContext } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

let adminCtx: Context; // admin user seeded in the db
let sysCtx: Context; // sys context (to test multiple users without testing full access with role and all)

/**
 * Test some basic crud operations with timestamps and all from admin (to access testing)
 * 
 * @see 
 *   - test-access and test-access-project... for access testing. 
 *   - test-search for search testing
 *
 */

describe("test-dao", function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
		sysCtx = await getSysContext();
	});

	this.afterAll(async function () {
		try {

			await closeKnex();
		} catch (ex) {
			console.log('cannot ${ex}')
		}
	});


	it('dao-basic-crud-project', async function () {
		try {
			let project: Project | undefined;

			// test create
			const projectId = await projectDao.create(adminCtx, { name: 'test-dao-basic-crud-project_project-01' });
			assert(Number.isInteger(projectId), 'project id');
			project = await projectDao.get(adminCtx, projectId);
			assert.strictEqual(project.name, 'test-dao-basic-crud-project_project-01');
			const mtime1 = project.mtime!;

			// test update 
			await wait(10); // very short wait to make sure create/updatetime is not the same
			await projectDao.update(sysCtx, projectId, { name: 'test-dao-basic-crud-project_project-01-updated' });
			project = await projectDao.get(adminCtx, projectId);
			assert.strictEqual(project.name, 'test-dao-basic-crud-project_project-01-updated');
			const mtime2 = project.mtime!;

			//// check the timestamp
			// the modify time should have been modify from before
			assert.notStrictEqual(mtime2, mtime1, 'modify time');
			// make sure the ctime and mtime is different
			assert.notStrictEqual(project.ctime, project.mtime, 'ctime vs mtime');
			// check that the .mid and .cid
			assert.strictEqual(project.cid, adminCtx.userId);
			assert.strictEqual(project.mid, sysCtx.userId);

			// test list
			const projects = await projectDao.list(adminCtx, { matching: { name: 'test-dao-basic-crud-project_project-01-updated' } });
			assert.strictEqual(projects[0].name, 'test-dao-basic-crud-project_project-01-updated');

			// always cleanup
			await projectDao.remove(adminCtx, projectId);

		} catch (ex) {
			throw ex;
		}
	});

	it('dao-basic-crud-ticket', async function () {
		try {

			// SETUP
			let project: Project | undefined;
			// create project (container object)
			const projectId = await projectDao.create(adminCtx, { name: 'test-dao-basic-crud-ticket_project-01' });

			// test create ticket
			const ticketId = await ticketDao.create(adminCtx, { projectId, title: 'test-dao-basic-crud-ticket_ticket-01' })
			const ticket = await ticketDao.get(adminCtx, ticketId);
			assert.strictEqual(ticket.title, 'test-dao-basic-crud-ticket_ticket-01');

			// Note: update can be fairly assumed it worked as the project does. We might add test if we find issue. 

			// test list (Note: list is a little different than projectDao.list, because the filter is different)
			const tickets = await ticketDao.list(adminCtx, { projectId });
			assert.strictEqual(tickets[0].title, 'test-dao-basic-crud-ticket_ticket-01');

			// CLEANUP
			await ticketDao.remove(adminCtx, ticketId);
			await projectDao.remove(adminCtx, projectId);

		} catch (ex) {
			throw ex;
		}
	});


});