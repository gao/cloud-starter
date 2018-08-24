
import { srouter } from '../express-utils';
import { getProjectFromReq } from './web-commons';
import { ticketDao, Project } from '../da/daos';
import { getIssues } from '../service/github';

const _router = srouter();

const entityType = 'Ticket'; // normalize parametirazation accross crud overrides.


// list the entities, require query.projectId
_router.get(`/crud/${entityType}`, async function (req, res, next) {
	const projectId = req.query.projectId;

	if (projectId == null) {
		throw new Error(`Cannot list tickets, 'projectId' request param missing`);
	}

	const data = await ticketDao.list(req.context, { matching: { projectId } });

	return { success: true, data };
});


export const router = _router;


