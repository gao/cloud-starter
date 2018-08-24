

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

export interface Ticket {
	id: number;
	projectId: number;
	title: string;
	ghId?: number;
	ghTitle?: string;
	ghNumber?: number;
}


export interface Feature {
	id: number;
	name: string;
	parentId: number;
}

export interface Label {
	id: number;
	projectId: number;
	name: string;
	color: string;
	ghId?: number;
	ghColor?: string;
}

export interface FeatureLabel {
	featureId: number;
	labelId: number;
}