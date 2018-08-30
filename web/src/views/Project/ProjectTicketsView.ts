import { BaseView, addDomEvents, addHubEvents } from 'views/base';
import { ticketDso, paneDso } from 'ts/dsos';
import { first, append, display, on, push } from 'mvdom';
import { render } from 'ts/render';
import { ProjectPaneConfigDialog } from './ProjectPaneConfigDialog';
import { getLuma } from 'ts/utils';
import { Pane } from 'shared/entities';

export class ProjectTicketsView extends BaseView {

	projectId!: number;


	//#region    ---------- Hub Events ---------- 
	hubEvents = addHubEvents(this.hubEvents, {
		'dsoHub; Pane; update, create': async (pane: Pane) => {
			this.refreshPane(pane.id);
		}
	})
	//#endregion ---------- /Hub Events ---------- 


	//#region    ---------- View DOM Events ---------- 
	events = addDomEvents(this.events, {
		'click; .card > header .ico-more': async (evt) => {
			const paneEl = evt.selectTarget.closest('[data-type="Pane"]')!;
			const paneId = parseInt(paneEl.getAttribute('data-id')!);

			// TODO: need to get the labelIds to set the checbox
			const d = await display(ProjectPaneConfigDialog, 'body', { paneId });
		}
	})
	//#endregion ---------- /View DOM Events ---------- 

	//#region    ---------- View Controller Methods ---------- 
	async postDisplay(data: { projectId: number }) {
		this.projectId = data.projectId;

		this.refresh();
	}
	//#endregion ---------- /View Controller Methods ---------- 


	async refresh() {
		const projectId = this.projectId;

		// first get all of the panes
		const panes = await paneDso.list({ projectId });

		const addEl = first(this.el, '.show-add-pane-dialog')!;

		for (const pane of panes) {
			const cardFrag = render('ProjectTicketsView-pane', pane)
			append(addEl, cardFrag, 'before');
			this.refreshPane(pane.id);
		}

	}

	async refreshPane(paneId: number) {
		const paneEl = first(this.el, `[data-type='Pane'][data-id='${paneId}']`);
		if (paneEl == null) {
			console.log(`cannot find pane for ${paneId}`);
			return;
		}

		const pane = await paneDso.get(paneId);
		push(paneEl, pane);
		const tickets = await ticketDso.list({ projectId: this.projectId, labelIds: pane.labelIds });
		// TODO: need to move the 'isDark' somewhere else, perhaps on import time
		for (const t of tickets) {
			if (t.labels) {
				for (const l of t.labels) {
					const luma = getLuma(l.color);
					l.luma = luma;
					l.isDark = (l.luma < 150);
				}
			}
		}
		const sectionEl = first(paneEl, '.card > section')!;
		append(sectionEl, render('ProjectTicketsView-tickets', { tickets }), 'empty');
	}

}