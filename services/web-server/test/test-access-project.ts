import { userDao, projectDao, User, Project } from 'common/da/daos';
import { newContext, Context } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

let adminCtx: Context;
let userACtx: Context;
let userBCtx: Context;

describe("test-access-project", function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
		userACtx = await newContext(await userDao.create(adminCtx, { username: 'test-user-A', type: 'user' }));
		userBCtx = await newContext(await userDao.create(adminCtx, { username: 'test-user-B', type: 'user' }));
	});

	this.afterAll(async function () {
		await userDao.remove(adminCtx, userACtx.userId);
		await userDao.remove(adminCtx, userBCtx.userId);
		await closeKnex();
	});


	it('access-project-from-userA', async function () {

		// // test create project from userA, should work
		let testProject01Id = await projectDao.create(userACtx, { name: 'test-access-project-01' });
		let testProject01: Project | null = await projectDao.get(userACtx, testProject01Id);
		assert.strictEqual(testProject01.name, 'test-access-project-01');

		// test update from userA, should work
		await projectDao.update(userACtx, testProject01Id, { name: 'test-access-project-01 updated' });
		testProject01 = await projectDao.get(userACtx, testProject01Id);
		assert.strictEqual(testProject01.name, 'test-access-project-01 updated');

		// test delete project from userA, should work
		await projectDao.remove(userACtx, testProject01Id);
		testProject01 = await projectDao.first(userACtx, { id: testProject01Id });
		assert.strictEqual(testProject01, null, 'project01 should be null');

		// cleanup (always cleanup data). 
		// testProject01 should be already removed with test above.

	});

	it('access-project-unauthorized-@', async function () {

		// test create project from userA, should work
		let testProject01Id = await projectDao.create(userACtx, { name: 'test-access-project-01' });
		let testProject01: Project | null = await projectDao.get(userACtx, testProject01Id);
		assert.strictEqual(testProject01.name, 'test-access-project-01');

		// test update from userA, should fail
		await assert.rejects(projectDao.update(userBCtx, testProject01Id, { name: 'test-access-project-01 updated' }), (ex: any) => {
			if (ex.message.includes('does not have the necessary access')) {
				return true;
			} else {
				return false;
			}
		}, 'updating userA project from userB should fail');

		// test delete project from userA, should fail
		await assert.rejects(projectDao.remove(userBCtx, testProject01Id), (ex: any) => {
			if (ex.message.includes('does not have the necessary access')) {
				return true;
			} else {
				return false;
			}
		}, 'removing userA project from userB should fail');

		// cleanup (always cleanup data). 
		await projectDao.remove(userACtx, testProject01Id);

	});


});