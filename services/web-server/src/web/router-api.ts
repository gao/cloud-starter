import { srouter } from '../express-utils';
import { userDao } from '../da/daos';
import { newContext } from '../context';

const _router = srouter();

_router.get('/hello', async function (req, res) {

	console.log('... get /hello');

	return { status: true, message: 'Hello World 2' };
});

_router.get('/create-user', async function (req, res) {
	const ctx = res.locals.ctx = await newContext(-1);
	userDao.create(ctx, { username: 'mike' });

	return { success: true, message: `Hello World ..` };
});


export const router = _router;