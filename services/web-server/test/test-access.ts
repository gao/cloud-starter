import { userDao, projectDao } from '../src/da/daos';
import { newContext, Context } from '../src/context';
import { closeKnex } from '../src/da/db';

let ctx: Context;

describe("test-access", function () {

	this.beforeAll(async function () {
		ctx = await newContext(-1);
	});

	this.afterAll(async function () {
		await closeKnex();
	});

	it('access-basic-create', async function () {
		let users = await userDao.list(ctx);
		console.log(`users >>  ${users.length}`);

		const userId = await userDao.create(ctx, { username: 'text-access-user-01' });

		userDao.remove(ctx, userId);
	})

});