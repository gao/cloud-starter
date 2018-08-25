

import { BaseView, addDomEvents } from 'views/base';
import { ticketDso, labelDso } from 'ts/dsos';
import { first, append, display, on } from 'mvdom';
import { render } from 'ts/render';
import { ProjectLabelPickerDialog } from './ProjectLabelPickerDialog';

export class ProjectTicketsView extends BaseView {

	projectId!: number;

	//// Key view DOM Elements
	private get mainTicketsContent() { return first(this.el, '.card > section')! }

	//#region    ---------- View DOM Events ---------- 
	events = addDomEvents(this.events, {
		'click; .card > header .ico-more': async (evt) => {
			const ticketCard = evt.selectTarget.closest('.card');
			const d = await display(ProjectLabelPickerDialog, 'body', { projectId: this.projectId, });
			on(d.el, "OK", async () => {
				const ids = d.getLabelIds();
				const labels = await labelDso.list();
				console.log(labels);
			})
		}
	})
	//#endregion ---------- /View DOM Events ---------- 

	//#region    ---------- View Controller Methods ---------- 
	async postDisplay(data: { projectId: number }) {
		this.projectId = data.projectId;

		const tickets = await ticketDso.list({ projectId: this.projectId });

		append(this.mainTicketsContent, render('ProjectTicketsView-tickets', { tickets }), 'empty');
	}
	//#endregion ---------- /View Controller Methods ---------- 



}