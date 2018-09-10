import { userDao, projectDao } from 'common/da/daos';
import { newContext, Context } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

let adminCtx: Context;

describe("test-access", function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
	});

	this.afterAll(async function () {
		await closeKnex();
	});

	it('access-user-create-remove', async function () {
		const users = await userDao.list(adminCtx);
		const orginalUserCount = users.length;

		// create and remove as admin, should all work
		const userId_1 = await userDao.create(adminCtx, { username: 'text-access-user-01' });
		await userDao.remove(adminCtx, userId_1);

		// create test user 2 and it's context
		const userId_2 = await userDao.create(adminCtx, { username: 'text-access-user-02' });
		const user2Ctx = await newContext(userId_2);

		// with user 2 context, create a user3, should work
		const userId_3 = await userDao.create(user2Ctx, { username: 'text-access-user-03' });

		// with user 2 context, try to remove, user3, should fail
		await assert.rejects(userDao.remove(user2Ctx, userId_3), (ex: any) => {
			if (ex.message.includes('does not have the necessary access')) {
				return true;
			} else {
				return false;
			}
		});

		// cleanup (always cleanup data). 
		// TODO: needs to make are exception safe (finally and run even when test fail)
		await userDao.remove(adminCtx, userId_2);
		await userDao.remove(adminCtx, userId_3);

		// check cleanup
		const userCount = (await userDao.list(adminCtx)).length;
		assert.strictEqual(userCount, orginalUserCount, 'total user count');

	});



});