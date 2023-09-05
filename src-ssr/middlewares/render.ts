import { STATUS_CODES } from 'http';
import { RenderError } from '@quasar/app-vite';
import { ssrMiddleware } from 'quasar/wrappers';

export default ssrMiddleware(({ app, resolve, render, serve }) => {
	app.get(resolve.urlPath('*'), (req, res) => {
		res.setHeader('Content-Type', 'text/html');

		render({ req, res })
			.then((html) => res.send(html))
			.catch((err: RenderError) => {
				if (err.url) {
					if (err.code)
						res.redirect(err.code, err.url);
					else
						res.redirect(err.url);
				}
				else if (err.code >= 400 && err.code <= 499)
					res.status(err.code).send(STATUS_CODES[err.code]);
				else if (process.env.DEV)
					serve.error({ err, req, res });
				else
					res.redirect(resolve.urlPath('/500'));
			});
	});
});
