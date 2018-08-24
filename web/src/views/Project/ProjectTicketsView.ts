

import { BaseView } from 'views/base';
import { ticketDso } from 'ts/dsos';
import { first, append } from 'mvdom';
import { render } from 'ts/render';

export class ProjectTicketsView extends BaseView {

	projectId!: number;

	//// Key view DOM Elements
	private get mainTicketsContent() { return first(this.el, '.card > section')! }

	async postDisplay(data: { projectId: number }) {
		this.projectId = data.projectId;

		const tickets = await ticketDso.list({ projectId: this.projectId });

		append(this.mainTicketsContent, render('ProjectTicketsView-tickets', { tickets }), 'empty');
	}


}