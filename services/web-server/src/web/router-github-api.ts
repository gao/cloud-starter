

import { srouter } from '../express-utils';
import { getAccessToken, getUserInfo, getUserRepos } from '../service/github';

const _router = srouter();


_router.get('/api/github/repos', async function (req, res, next) {

	const repos = await getUserRepos(req.context);

	return { success: true, data: repos };

});

export const router = _router;