import { BaseView, addHubEvents } from 'views/base';
import { frag, trigger, push, first } from 'mvdom';
import { render } from 'ts/render';
import { pathAsNum } from 'ts/route';
import { projectDso } from 'ts/dsos';


export class ProjectMainView extends BaseView {

	//// View key dom elements
	private get screenHeader() { return first(this.el, '.screen header')!; }
	private get content() { return first(this.el, '.screen > section.content')!; }

	//#region    ---------- Hub Events ----------
	hubEvents = addHubEvents(this.hubEvents, {
		// 'routeHub' is the hub receiving url changes
		'routeHub; CHANGE': () => {
			this.refresh();
		}
	});
	//#endregion ---------- /Hub Events ---------- 

	//#region    ---------- View Controller Methods ---------- 
	async postDisplay(data: any) {
		this.refresh();
	}
	//#endregion ---------- /View Controller Methods ---------- 

	async refresh() {
		const id = pathAsNum(1);
		this.el.setAttribute('data-entity-id', `${id}`);

		// get the project
		const project = await projectDso.get(id!);

		// update the header data
		push(this.screenHeader, project);

		console.log(this.content);
		// TODO: Update the content
		this.content.innerHTML = `<div>This will be the content for ${project.name}</div>`;
	}
}