
import { BaseView, addDomEvents } from 'views/base';
import { DialogBase } from '../Dialog/DialogBase';
import { labelDso } from 'ts/dsos';
import { render } from 'ts/render';
import { all } from 'mvdom';

export class ProjectLabelPickerDialog extends DialogBase {


	//#region    ---------- View DOM Events ---------- 
	events = addDomEvents(this.events, {
		'CHANGE; em.check': (evt) => {
			const em = evt.selectTarget;
		}
	});
	//#endregion ---------- /View DOM Events ---------- 

	//#region    ---------- View Controller Methods ---------- 
	async init(data: any) {
		const projectId = data.projectId;
		this.title = "Labels";

		const labels = await labelDso.list({ projectId });
		this.content = render('ProjectLabelPickerDialog-content', { labels });
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