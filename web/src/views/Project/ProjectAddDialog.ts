import { DialogBase } from 'views/Dialog/DialogBase';
import { frag, trigger, pull } from 'mvdom';
import { render } from 'ts/render';


export class ProjectAddDialog extends DialogBase {

	init(data: any) {
		this.title = "Add new Project";
		this.content = render('ProjectAddDialog-content', data);
		this.footer = true;
	}

}