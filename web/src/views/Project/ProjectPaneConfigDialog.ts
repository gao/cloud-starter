
import { BaseView, addDomEvents } from 'views/base';
import { DialogBase } from '../Dialog/DialogBase';
import { labelDso, paneDso } from 'ts/dsos';
import { render } from 'ts/render';
import { all, pull } from 'mvdom';
import { Label, Pane } from 'shared/entities';

export class ProjectPaneConfigDialog extends DialogBase {

	private paneId!: number;

	//#region    ---------- View DOM Events ---------- 
	events = addDomEvents(this.events, {
		'CHANGE; em.check': (evt) => {
			const em = evt.selectTarget;
		},

		'OK': async (evt) => {
			const fieldsData = pull(this.el);
			const labelIds = this.getLabelIds();
			paneDso.update(this.paneId, { ...fieldsData, ...{ labelIds } });
		}

	});
	//#endregion ---------- /View DOM Events ---------- 

	//#region    ---------- View Controller Methods ---------- 
	async init(data: any) {
		this.paneId = data.paneId;

		const pane = await paneDso.get(this.paneId);

		const projectId = pane.projectId;
		this.title = "Labels";

		const labels: (Label & { sel?: boolean })[] = await labelDso.list({ projectId });

		if (pane.labelIds != null) {
			labels.forEach(l => l.sel = (pane.labelIds!.includes(l.id)))
		}

		const contentData = { ...pane, ...{ labels } };
		this.content = render('ProjectPaneConfigDialog-content', contentData);
		this.footer = true;
	}
	//#endregion ---------- /View Controller Methods ---------- 


	//#region    ---------- Public APIs ---------- 
	getLabelIds() {
		const checkboxes = Array.from(all(this.el, 'em.check-on'));
		return checkboxes.map(c => parseInt(c.closest('li')!.getAttribute('data-entity-id')!))
	}
	//#endregion ---------- /Public APIs ---------- 

}