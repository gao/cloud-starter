import { get as webGet, post as webPost, put as webPut, delet as webDelete, patch as webPatch } from './ajax';
import { hub } from 'mvdom';

const dsoHub = hub('dsoHub');

class BaseDso {

	private _entityType: string;

	constructor(type: string) {
		this._entityType = type;
	}

	async get(id: number): Promise<any> {
		const result = await webGet(`/api/crud/${this._entityType}/${id}`);
		if (result.success) {
			return result.data;
		} else {
			throw result;
		}
	}

	async list(params?: any): Promise<any[]> {
		const result = await webGet(`/api/crud/${this._entityType}`, params);

		if (result.success) {
			return result.data as any[];
		} else {
			throw result;
		}
	}

	async create(props: any): Promise<number> {
		const result = await webPost(`/api/crud/${this._entityType}`, props);
		const entity = result.data;
		if (result.success) {
			dsoHub.pub('Project', 'create', entity);
			return entity;
		} else {
			throw result;
		}
	}
}

export const projectDso = new BaseDso('Project');


export const ticketDso = new BaseDso('Ticket');
