import { userDao, projectDao, User, Project } from 'common/da/daos';
import { newContext, Context } from 'common/context';
import { closeKnex } from 'common/da/db';
import { clean, initSuite } from './t-utils'
import * as assert from 'assert';



const errorNoAccess = /does not have the necessary access/;

describe("test-access-project", async function () {


	const suite = initSuite(this);

	it('access-project-from-userA', async function () {

		// create project from userA, should work
		let testProject01Id = await projectDao.create(suite.userACtx, { name: 'test-access-project-01' });

		// test get, should work
		let testProject01: Project | null = await projectDao.get(suite.userACtx, testProject01Id);
		assert.strictEqual(testProject01.name, 'test-access-project-01');

		// test update from userA, should work
		await projectDao.update(suite.userACtx, testProject01Id, { name: 'test-access-project-01 updated' });
		testProject01 = await projectDao.get(suite.userACtx, testProject01Id);
		assert.strictEqual(testProject01.name, 'test-access-project-01 updated');

		// test delete project from userA, should work
		await projectDao.remove(suite.userACtx, testProject01Id);
		testProject01 = await projectDao.first(suite.userACtx, { id: testProject01Id });
		assert.strictEqual(testProject01, null, 'project01 should be null');

	});


	it('access-project-viewer', async function () {

		// create project from userA, should work
		let testProject01Id = await projectDao.create(suite.userACtx, { name: 'test-access-project-01' });
		suite.toClean('project', testProject01Id);

		// assign 

		// test read from userB, should fail
		await assert.rejects(projectDao.get(suite.userBCtx, testProject01Id), errorNoAccess, 'UserB schould not access to userA project');

		// test write from userB, should fail
		await assert.rejects(projectDao.update(suite.userBCtx, testProject01Id, { name: 'test-access-project-01 updated' }),
			errorNoAccess, 'UserB schould not have write access to userA project');

		// test write from userB, should fail
		await assert.rejects(projectDao.remove(suite.userBCtx, testProject01Id),
			errorNoAccess, 'UserB schould not have remove access to userA project');
	});


});