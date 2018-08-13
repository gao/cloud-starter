
import { BaseView, addHubEvents, addDomEvents } from './base';
import { all, first, display, on, EventInfo, frag, append } from 'mvdom';
import { pathAt } from 'ts/route';
import { ProjectAddDialog } from 'views/Project/ProjectAddDialog';
import { projectDso } from 'ts/dsos';
import { render } from 'ts/render';

export class NavView extends BaseView {

	//// View key elements
	private get projectsEl() { return first(this.el, 'section ul') };

	//#region    ---------- DOM Events ---------- 
	events = addDomEvents(this.events, {
		'click; .show-add-project-dialog': async () => {

			const dialog = await display(ProjectAddDialog, 'body');
			on(dialog.el, 'ok', async (evt) => {
				const r = await projectDso.create(evt.detail!);
			});
		}
	});
	//#endregion ---------- /DOM Events ----------

	//#region    ---------- Hub Events ---------- 
	hubEvents = addHubEvents(this.hubEvents, {

		// register to the routeHub to listen route changes
		'routeHub; CHANGE': async (routeInfo: any) => {
			this.refreshMenu();
		},

		// Listen to the dsoHub to listen to Project objec change
		'dsoHub; Project; create, update, remove': async (data) => {
			await this.refreshProjects();
			await this.refreshMenu();
		}
	});
	//#endregion ---------- /Hub Events ---------- 

	//#region    ---------- View Controller Methods---------- 
	// before we get any routeHub events, build the list of projects
	async init() {
		await this.refreshProjects();
	}

	async postDisplay() {
		await this.refreshProjects();
		await this.refreshMenu();
	}
	//#endregion ---------- /View Controller Methods---------- 

	private async refreshProjects() {
		const projects = await projectDso.list();
		const ff = document.createDocumentFragment();
		for (const p of projects) {
			const f = render("NavView-project-item", p);
			ff.appendChild(f);
		}
		append(this.projectsEl!, ff, 'empty');
	}

	private refreshMenu() {
		// remove the eventual .sel
		for (const item of all(this.el, ".sel")) {
			item.classList.remove('sel');
		}

		// get the nav-item based on the url hash
		let path0 = pathAt(0);
		path0 = (!path0) ? 'home' : path0;

		const href = (path0 === 'project') ? `#${path0}/${pathAt(1)}` : `#${path0}`;

		const selMenu = first(this.el, `a[href='${href}'`);

		if (selMenu) {
			selMenu.classList.add('sel');
		} else {
			console.log("ERROR - no .menu-item found for path ", href);
		}

	}
}