import { get as webGet, post as webPost, put as webPut, delet as webDelete, patch as webPatch } from './ajax';
import { hub } from 'mvdom';
import { Project, Ticket, Label, Filter } from 'shared/entities';

const dsoHub = hub('dsoHub');

class BaseDso<E, F> {

	private _entityType: string;

	constructor(type: string) {
		this._entityType = type;
	}

	async get(id: number): Promise<E> {
		const result = await webGet(`/api/crud/${this._entityType}/${id}`);
		if (result.success) {
			return result.data;
		} else {
			throw result;
		}
	}

	async list(filter?: F): Promise<E[]> {
		const result = await webGet(`/api/crud/${this._entityType}`, filter);
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

export const projectDso = new BaseDso<Project, Filter<Project>>('Project');


export interface TicketFilter extends Filter<Ticket> {
	projectId: number;
}
export const ticketDso = new BaseDso<Ticket, TicketFilter>('Ticket');

export interface LabelFilter extends Filter<Label> {
	projectId: number;
}
export const labelDso = new BaseDso<Label, LabelFilter>('Label');
