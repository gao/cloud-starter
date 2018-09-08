import { userDao, projectDao } from '../src/da/daos';
import { newContext, Context } from '../src/context';
import { closeKnex } from '../src/da/db';

let adminCtx: Context;

describe("test-access", function () {

	this.beforeAll(async function () {
		adminCtx = await newContext(1); // admin user
	});

	this.afterAll(async function () {
		await closeKnex();
	});

	it('access-basic-create', async function () {
		let users = await userDao.list(adminCtx);
		console.log(`users >>  ${users.length}`);

		// create and remove as admin, should all work
		let userId = await userDao.create(adminCtx, { username: 'text-access-user-01' });
		await userDao.remove(adminCtx, userId);

		// we create a user with no admin role
		userId = await userDao.create(adminCtx, { username: 'text-access-user-02' });
		const userCtx = await newContext(userId);

		// user can create a new user
		const userId3 = await userDao.create(userCtx, { username: 'text-access-user-03' });

		// However, user cannot remove user 3 (because of @AccessRequires('um'))
		try {
			await userDao.remove(userCtx, userId3);
		} catch (ex) {
			console.log(`ERROR AS EXPECTED`, ex);
		}



	})

});