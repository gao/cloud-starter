import { userDao, projectDao, User } from 'common/da/daos';
import { newContext, Context } from 'common/context';
import { closeKnex } from 'common/da/db';
import * as assert from 'assert';

let adminCtx: Context;
let userACtx: Context;

describe('test-access-basic', function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
		const userAId = await userDao.create(adminCtx, { username: 'test-user-A', type: 'user' });
		userACtx = await newContext(userAId);
	});

	this.afterAll(async function () {
		await userDao.remove(adminCtx, userACtx.userId);
		await closeKnex();
	});


	it('access-basic-user-crud-from-admin', async function () {
		const users = await userDao.list(adminCtx);
		const orginalUserCount = users.length;

		// test create user from admin, should work
		const testUser01Id = await userDao.create(adminCtx, { username: 'test-access-basic-user-01' });

		// test update user from admin, should work
		await userDao.update(adminCtx, testUser01Id, { username: 'test-access-basic-user-01 updated' });
		let testUser01: User | null = await userDao.get(adminCtx, testUser01Id);
		assert.strictEqual(testUser01.username, 'test-access-basic-user-01 updated', 'username');

		// test remove from admin, should work
		await userDao.remove(adminCtx, testUser01Id);
		testUser01 = await userDao.first(adminCtx, { id: testUser01Id });
		assert.strictEqual(testUser01, null, 'testUser01 should be null');


		// cleanup (always cleanup data). 
		// testUser01 should be already removed with test above. 

		// check cleanup
		const userCount = (await userDao.list(adminCtx)).length;
		assert.strictEqual(userCount, orginalUserCount, 'total user count');

	});


	it('access-basic-user-crud-from-userA', async function () {
		const users = await userDao.list(adminCtx);
		const orginalUserCount = users.length;


		// test create user from test-user01 from userA, should fail
		await assert.rejects(userDao.create(userACtx, { username: 'test-access-basic-user-01' }), (ex: any) => {
			if (ex.message.includes('does not have the necessary access')) {
				return true;
			} else {
				return false;
			}
		}, 'creating user form userA');

		// create test user 02 with admin
		const testUser01Id = await userDao.create(adminCtx, { username: 'test-access-basic-user-01' });

		// test update testUser01 from userA, should fail
		await assert.rejects(userDao.update(userACtx, testUser01Id, { username: 'test-access-basic-user-01 updated' }), (ex: any) => {
			if (ex.message.includes('does not have the necessary access')) {
				return true;
			} else {
				return false;
			}
		}, 'updating test-user-01 from userA');

		// test update testUser01 from testUser01, should work
		const testUser01Ctx = await newContext(testUser01Id);
		await userDao.update(testUser01Ctx, testUser01Id, { username: 'test-access-basic-user-01 update 2' })
		const testUser01 = await userDao.get(adminCtx, testUser01Id);
		assert.strictEqual(testUser01.username, 'test-access-basic-user-01 update 2');


		// cleanup
		await userDao.remove(adminCtx, testUser01Id);


		// check cleanup
		const userCount = (await userDao.list(adminCtx)).length;
		assert.strictEqual(userCount, orginalUserCount, 'total user count');

	});


});