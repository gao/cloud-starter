
import { srouter } from '../express-utils';
import { getProjectFromReq } from './web-commons';
import { ticketDao, Project } from '../da/daos';
import { getIssues } from '../service/github';

const _router = srouter();

const entityType = 'Ticket'; // normalize parametirazation accross crud overrides.

///////
// This module override the router crud for list, create ticket as it needs to have a projectId

// list the entities
_router.get(`/crud/${entityType}`, async function (req, res, next) {
	const project = await getProjectFromReq(req);

	// NOTE: for now, we just get the list from github
	if (project.ghFullName) {
		const issues = await getIssues(req.context, project.ghFullName);
		return { success: true, data: issues };
	} else {
		return { success: true, data: [] }; // empty for now
	}
});


_router.post('/crud/${entityType}', async function (req, res, next) {
	throw new Error(`Create ${entityType} not supported yet`);
});

export const router = _router;


//#region    ---------- Utils ---------- 


//#endregion ---------- /Utils ---------- 