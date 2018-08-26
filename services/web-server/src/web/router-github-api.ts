

import { srouter } from '../express-utils';
import { getUserRepos, getRepo } from '../service/github';
import { projectDao } from '../da/daos';
import { Project } from 'shared/entities';
import { getProjectFromReq } from './web-commons';
import { syncIssues, syncLabels } from '../service/github-syncer';

const _router = srouter();


_router.get('/github/repos', async function (req, res, next) {

	const repos = await getUserRepos(req.context);

	return { success: true, data: repos };

});

_router.post('/github/import-repo', async function (req, res, next) {
	const repoName = req.body.repo;

	try {
		const repo = await getRepo(req.context, repoName);

		const projectData: Partial<Project> = {
			name: repo.name,
			ghId: repo.id,
			ghName: repo.name,
			ghFullName: repo.full_name,
		}

		const projectId = await projectDao.create(req.context, projectData);
		const newProject = await projectDao.get(req.context, projectId);

		return { success: true, data: newProject };

	} catch (ex) {
		throw new Error(`Cannot import github repo '${repoName}'. Cause: ` + ex);
	}

});

_router.post('/github/sync', async function (req, res, next) {
	const repoName = req.body.repo;


	const projectId = (req.body.projectId) ? parseInt(req.body.projectId) : null;
	if (projectId == null) {
		throw new Error("Cannot sync because no projectId in post request ");
	}

	// Sync the label and issues, can do it concurrently
	const [syncedIssueIds, syncedLabelIds] = await Promise.all(
		[syncIssues(req.context, projectId),
		syncLabels(req.context, projectId)]);


	return { success: true, data: { syncedIssueIds, syncedLabelIds } };

});

_router.post('/github/sync-issues', async function (req, res, next) {
	const repoName = req.body.repo;


	const projectId = (req.body.projectId) ? parseInt(req.body.projectId) : null;
	if (projectId == null) {
		throw new Error("Cannot sync issues because no projectId in post request ");
	}

	const syncedIssueIds = await syncIssues(req.context, projectId);

	return { success: true, data: syncedIssueIds };

});


export const router = _router;