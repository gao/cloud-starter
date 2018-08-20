

import { srouter } from '../express-utils';
import { getUserRepos, getRepo } from '../service/github';
import { projectDao } from '../da/daos';
import { Project } from '../da/entities';

const _router = srouter();


_router.get('/api/github/repos', async function (req, res, next) {

	const repos = await getUserRepos(req.context);

	return { success: true, data: repos };

});

_router.post('/api/github/import-repo', async function (req, res, next) {
	const repoName = req.body.repo;

	try {
		const repo = await getRepo(req.context, repoName);

		const projectData: Partial<Project> = {
			name: repo.name,
			ghRepoId: repo.id,
			ghRepoName: repo.name,
			ghRepoFullName: repo.full_name,
		}

		const projectId = await projectDao.create(req.context, projectData);
		const newProject = await projectDao.get(req.context, projectId);

		return { success: true, data: newProject };

	} catch (ex) {
		throw new Error(`Cannot import github repo '${repoName}'. Cause: ` + ex);
	}


});

export const router = _router;