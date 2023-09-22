(() => {
	const app = Vue.createApp({
		setup () {
			return {};
		}
	});
	app.use(Quasar, {
		config: {
			brand: {
				primary: '#1e87f0',
				secondary: '#26A69A',
				accent: '#c743de',
				positive: '#18b53c',
				negative: '#d6293d',
				info: '#1ca2bd',
				warning: '#d9831a',
				dark: '#1d1d1d',
				'dark-page': '#232323',
				'separator-dark-color': '#21282c',
				grey: '#23282c',
				'grey-1': '#2f353a',
				'grey-2': '#333a40',
				'grey-3': '#3a4149',
				'grey-4': '#73818f',
				'grey-5': '#8f9ba6',
				'grey-6': '#acb4bc',
				'grey-7': '#c8ced3',
				'grey-8': '#e4e7ea'
			},
			loading: {
				delay: 400,
				spinner: 'QSpinnerCube',
				spinnerSize: 80,
				spinnerColor: 'cyan-7'
			},
			notify: {
				color: 'light-blue-7',
				position: 'bottom',
				timeout: '3000'
			}
		}
	});
	app.mount(document.body);
})();
