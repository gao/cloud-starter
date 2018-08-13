import { BaseView, addDomEvents } from 'views/base';
import { first, pull } from 'mvdom';
import { login } from 'ts/user-ctx';
import { post } from 'ts/ajax';

export class LoginView extends BaseView {

	//// some dom element that will be used in this component view
	private get fieldset() { return first(this.el, 'section.content')! };
	private get footerMessage() { return first(this.el, 'footer .message')! };

	//// the mode getter and setter which is DOM/Class backed, but exposed a simple object property
	private get mode() {
		if (this.el.classList.contains('login-mode')) {
			return 'login';
		} else {
			return 'register'
		}
	}
	private set mode(m: string) {
		if ('login' === m) {
			this.el.classList.remove('register-mode');
			this.el.classList.add('login-mode');
		} else {
			this.el.classList.add('register-mode');
			this.el.classList.remove('login-mode');
		}
	}

	//#region    ---------- View Events ---------- 
	events = addDomEvents(this.events, {

		// LOGIN
		'click; .do-login': async (evt) => {
			this.doLogin();
		},

		// REGISTER
		'click; .do-register': async (evt) => {
			this.doRegister();
		},

		// Press enter
		'keyup; input': async (evt) => {
			if (evt instanceof KeyboardEvent) {
				if ('Enter' === evt.key) {
					const mode = this.mode;
					if ('login' === mode) {
						this.doLogin();
					} else {
						this.doRegister();
					}
				}
			}
		},

		// Toggle to register
		'click; .to-register': async (evt) => {
			this.mode = 'register';
		},

		// Toggle to login
		'click; .to-login': async (evt) => {
			this.mode = 'login';
		},
	});
	//#endregion  ---------- View Events ---------- 


	private async doLogin() {
		const data = pull(this.fieldset, 'input');

		try {
			const result = await login(data.username, data.pwd);
			if (result.success) {
				window.location.href = '/';
				return;
			} else {
				this.footerMessage.innerText = result.message;
			}

		} catch (ex) {
			console.log('error login', ex);
			this.footerMessage.innerText = ex.message;
		}
	}

	private async doRegister() {
		const data = pull(this.fieldset, 'input');

		try {
			const result = await post('/api/register', data);

		} catch (ex) {
			console.log('error register', ex);
			this.footerMessage.innerText = ex.error || ex.message;
		}
	}

}