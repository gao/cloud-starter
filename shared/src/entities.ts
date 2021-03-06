
//#region    ---------- Entity Related Types ---------- 
export interface Filter<E> {
	matching?: Partial<E>;
	ids?: number[];
}

export interface ProjectEntityFilter<E> extends Filter<E> {
	projectId: number;
}

export interface TicketFilter extends ProjectEntityFilter<Ticket> {
	labelIds?: number[];
}

//#endregion ---------- /Entity Related Types ---------- 

//#region    ---------- BaseEntities ---------- 
export interface StampedEntity {
	cid?: number,
	ctime?: string,
	mid?: number,
	mtime?: string
}

interface ProjectEntity extends StampedEntity {
	projectId: number;
}
//#endregion ---------- /BaseEntities ---------- 


//#region    ---------- Entity Types ---------- 

export interface User extends StampedEntity {
	id: number;
	type: 'sys' | 'admin' | 'user';
	username: string;
	pwd?: string;
}

export interface OAuth { // OAuth does ot need to be stamped
	id: number;
	userId: number;
	token?: string;
}

export interface Project extends StampedEntity {
	id: number;
	name: string;
	ghId?: number;
	ghName?: string;
	ghFullName?: string;
}

export interface Ticket extends ProjectEntity {

	//// db properties
	id: number;
	title: string;
	ghId?: number;
	ghTitle?: string;
	ghNumber?: number;

	//// transient properties
	labels?: { id: number, name: string, color: string, luma?: number, isDark?: boolean }[];
}


export interface Label extends ProjectEntity {
	id: number;
	name: string;
	color: string;
	ghId?: number;
	ghColor?: string;
}

export interface TicketLabel extends StampedEntity {
	ticketId: number;
	labelId: number;
}



export interface Pane extends ProjectEntity {
	id: number;
	name: string;
	labelIds?: number[];
}
//#endregion ---------- /Entity Types ---------- 
