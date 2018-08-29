
//#region    ---------- Entity Related Types ---------- 
export interface Filter<E> {
	matching?: Partial<E>;
	ids?: number[];
}

export interface TicketFilter extends Filter<Ticket> {
	projectId: number;
	labelIds?: number[];
}

//#endregion ---------- /Entity Related Types ---------- 

//#region    ---------- BaseEntities ---------- 

interface ProjectEntity {
	projectId: number;
}
//#endregion ---------- /BaseEntities ---------- 


//#region    ---------- Entity Types ---------- 
export interface User {
	id: number;
	username: string;
	pwd?: string;
}

export interface OAuth {
	id: number;
	userId: number;
	token?: string;
}

export interface Project {
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

export interface TicketLabel {
	ticketId: number;
	labelId: number;
}



export interface Pane extends ProjectEntity {
	id: number;
	name: string;
	labelIds?: number[];
}
//#endregion ---------- /Entity Types ---------- 
