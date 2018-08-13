
import { srouter } from '../express-utils';
import { daoByEntity } from '../da/daos';

const _router = srouter();

///////
// This module creates the generic crud methods that will be used as fall back if not overriden
// All of the generic crud methods use the appropriate entity daos, which already give a layer of specificity

// list the entities
_router.get('/crud/:type', async function (req, res, next) {
	const type = req.params.type;
	const dao = daoByEntity[type];


	const entities = await dao.list(req.context);

	return { success: true, data: entities };
});

_router.get('/crud/:type/:id', async function (req, res, next) {
	const type = req.params.type;
	const dao = daoByEntity[type];

	const id = parseInt(req.params.id);


	const entity = await dao.get(req.context, id);

	return { success: true, data: entity };
});


_router.post('/crud/:type', async function (req, res, next) {
	const type = req.params.type;
	const dao = daoByEntity[type];

	const data = req.body;
	const id = await dao.create(req.context, req.body);
	const entity = await dao.get(req.context, id);


	return { success: true, data: entity };
});

_router.get('/crud-test', async function (req, res, next) {
	console.log('crud test', req.body);
	//	throw new Error('test error from crud test')

	return { success: true, data: {} };
});

export const router = _router;