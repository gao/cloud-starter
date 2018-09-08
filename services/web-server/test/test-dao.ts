import { userDao, projectDao } from 'common/da/daos';
import { newContext } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

describe("dao", function () {

	this.afterAll(async function () {
		console.log('>>> Closing Knex');
		await closeKnex();
	})


	it('dao-simple-create', async function () {
		try {
			const ctx = await newContext(-1);
			const startCount = (await userDao.list(ctx)).length;

			// test create
			const userId = await userDao.create(ctx, { username: 'mike' });
			assert.notEqual(userId, null);

			// cleaup
			const d = await userDao.remove(ctx, userId);
			const endCount = (await userDao.list(ctx)).length;
			assert.strictEqual(endCount, startCount);

			console.log('PERF \n' + ctx.perfContext);

		} catch (ex) {
			throw ex;
		}

	});

	it('dao-update-user', async function () {
		try {
			const ctx = await newContext(-1);

			const userId = await userDao.create(ctx, { username: 'test-user-01' });
			const ctxUser = await newContext(userId);

			await userDao.update(ctxUser, userId, { username: 'test-user-01-updated' });
			const user = await userDao.get(ctx, userId);

			assert.strictEqual('test-user-01-updated', user.username);

			console.log('PERF \n' + ctxUser.perfContext);

		} catch (ex) {
			throw ex;
		}

	});

	it('dao-create-and-update', async function () {
		try {
			const ctx = await newContext(-1);
			const startCount = (await projectDao.list(ctx)).length;

			// test the create
			const projectId = await projectDao.create(ctx, { name: 'project-test-01' });
			assert.notEqual(projectId, null);
			let project = await projectDao.get(ctx, projectId);
			assert.strictEqual('project-test-01', project.name);

			// test update 
			await projectDao.update(ctx, projectId, { name: 'project-test-01-updated' });
			project = await projectDao.get(ctx, projectId);
			assert.strictEqual('project-test-01-updated', project.name);

			// cleanup
			const d = await projectDao.remove(ctx, projectId);
			const endCount = (await projectDao.list(ctx)).length;
			assert.strictEqual(endCount, startCount);

			console.log('PERF \n' + ctx.perfContext);
		} catch (ex) {
			throw ex;
		}

	});

});