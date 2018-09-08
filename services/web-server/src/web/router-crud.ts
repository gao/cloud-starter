
import { srouter } from '../express-utils';
import { daoByEntity } from 'common/da/daos';

const _router = srouter();

///////
// This module creates the generic crud methods that will be used as fall back if not overriden
// All of the generic crud methods use the appropriate entity daos, which already give a layer of specificity

// LIST entity
_router.get('/crud/:type', async function (req, res, next) {
	const type = req.params.type;
	const dao = daoByEntity[type];

	let filter: any | undefined = undefined;
	if (req.query.projectId) {
		filter = { projectId: req.query.projectId };
	}
	const entities = await dao.list(req.context, filter);

	return { success: true, data: entities };
});

// GET entity
_router.get('/crud/:type/:id', async function (req, res, next) {
	const type = req.params.type;
	const dao = daoByEntity[type];

	const id = parseInt(req.params.id);


	const entity = await dao.get(req.context, id);

	return { success: true, data: entity };
});

// CREATE entity
_router.post('/crud/:type', async function (req, res, next) {
	const type = req.params.type;
	const dao = daoByEntity[type];

	const data = req.body;
	const id = await dao.create(req.context, data);
	const entity = await dao.get(req.context, id);

	return { success: true, data: entity };
});


// PATCH entity
_router.patch('/crud/:type/:id', async function (req, res, next) {
	const ctx = req.context;
	const type = req.params.type;
	const id = parseInt(req.params.id);
	const dao = daoByEntity[type];

	const data = req.body;
	await dao.update(ctx, id, data);
	const entity = await dao.get(ctx, id);

	return { success: true, data: entity };
});


export const router = _router;