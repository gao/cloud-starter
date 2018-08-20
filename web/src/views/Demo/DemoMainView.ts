import { BaseView, BaseViewClass, addHubEvents, RouteInfo } from 'views/base';
import { display, first, all } from 'mvdom';
import { DemoTypoView, DemoCardsView, DemoButtonsView } from 'views/Demo/DemoViews';
import { pathAt } from 'ts/route';


const defaultPath = 'typo';

const pathToView: { [name: string]: BaseViewClass } = {
	"typo": DemoTypoView,
	"cards": DemoCardsView,
	"buttons": DemoButtonsView
};

export class DemoMainView extends BaseView {

	protected get main() { return first(this.el, 'section.content')! }

	hubEvents = addHubEvents(this.hubEvents, {
		// 'routeHub' is the hub receiving url changes
		'routeHub; CHANGE': () => {
			this.displayView();
		},
	});

	postDisplay() {
		this.displayView();
	}


	private displayView() {
		// Note: need to guard for this (routeHub event when moving out to another view)
		if (pathAt(0) !== 'demo') {
			return;
		}

		const newPath = this.hasNewPathAt(1, defaultPath);

		// update this view/content only if the path has changed
		if (newPath != null) {
			const subViewClass = pathToView[newPath];
			display(subViewClass, this.main, null, 'empty');



			// update the tab
			const href = `#demo/${newPath}`;
			for (const tab of all(this.el, '.tab-bar a')) {
				const tabHref = tab.getAttribute('href');
				if (tab.classList.contains('sel') && tabHref !== href) {
					tab.classList.remove('sel');
				} else if (tabHref === href) {
					tab.classList.add('sel');
				}
			}
		}
	}
}