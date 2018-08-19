

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
}

export interface Feature {
	id: number;
	name: string;
	parentId: number;
}

export interface Label {
	id: number;
	name: string;
}

export interface FeatureLabel {
	featureId: number;
	labelId: number;
}