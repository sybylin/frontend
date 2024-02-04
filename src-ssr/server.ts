/* eslint-disable quotes */
/* eslint-disable no-console */

import { extname } from 'path/posix';
import express from 'express';
import compression from 'compression';
import { ssrClose, ssrCreate, ssrListen, ssrRenderPreloadTag, ssrServeStaticContent } from 'quasar/wrappers';
import helmet from 'helmet';
import hpp from 'hpp';
import { ExpressLog } from './middlewares/log';
import type { Application } from 'express';

export const create = ssrCreate(() => {
	const app: Application = express();

	app.disable('x-powered-by');
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	if (process.env.NODE_ENV === 'production') {
		app.use(helmet({
			contentSecurityPolicy: {
				directives: {
					'default-src': ["'self'", "api.sybyl.in"],
					'base-uri': ["'none'"],
					'font-src': ["'self'", "https:", "data:"],
					'form-action': ["'self'"],
					'frame-ancestors': ["'self'"],
					'img-src': ["'self'", "data:"],
					'object-src': ["'none'"],
					'script-src': [
						"https:",
						"'wasm-unsafe-eval'",
						"'self'",
						"'unsafe-eval'" // remove this rule with sha256 of files
					],
					'script-src-attr': ["'none'"],
					'style-src': ["'self'", "https:", "'unsafe-inline'"],
					'upgrade-insecure-requests': null
				}
			}
		}));
		app.use(hpp());
		app.use((req, res, next) => {
			const ext = extname(req.path);
			if (/.(appcache|atom|bbaw|bmp|crx|css|cur|eot|f4[abpv]|flv|geojson|gif|htc|ic[os]|jpe?g|m?js|json(ld)?|m4[av]|manifest|map|markdown|md|mp4|oex|og[agv]|opus|otf|pdf|png|rdf|rss|safariextz|svgz?|swf|topojson|tt[cf]|txt|vcard|vcf|vtt|webapp|web[mp]|webmanifest|woff2?|xloc|xpi)$/.test(ext)) {
				res.removeHeader('X-UA-Compatible');
				res.removeHeader('X-XSS-Protection');
			}
			if (/.(appcache|atom|bbaw|bmp|crx|css|cur|eot|f4[abpv]|flv|geojson|gif|htc|ic[os]|jpe?g|json(ld)?|m4[av]|manifest|map|markdown|md|mp4|oex|og[agv]|opus|otf|png|rdf|rss|safariextz|swf|topojson|tt[cf]|txt|vcard|vcf|vtt|webapp|web[mp]|webmanifest|woff2?|xloc|xpi)$/.test(ext)) {
				res.removeHeader('Content-Security-Policy');
				res.removeHeader('X-Content-Security-Policy');
				res.removeHeader('X-WebKit-CSP');
			}
			next();
		});
		app.use(compression());
	}
	app.use(ExpressLog);

	return app;
});

export const listen = ssrListen(async ({ app, port, isReady }) => {
	await isReady();
	return app.listen(port, () => {
		console.log(`Server listening at port ${port}`);
	});
});

export const close = ssrClose(({ listenResult }) => {
	return listenResult.close();
});

const maxAge = process.env.DEV
	? 0
	: 1000 * 60 * 60 * 24 * 30;

export const serveStaticContent = ssrServeStaticContent((path, opts) => {
	return express.static(path, {
		maxAge,
		...opts
	});
});

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;
const webpRE = /\.webp$/;

export const renderPreloadTag = ssrRenderPreloadTag((file) => {
	if (jsRE.test(file) === true)
		return `<link rel="modulepreload" href="${file}" crossorigin>`;

	if (cssRE.test(file) === true)
		return `<link rel="stylesheet" href="${file}">`;

	if (woffRE.test(file) === true)
		return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;

	if (woff2RE.test(file) === true)
		return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;

	if (gifRE.test(file) === true)
		return `<link rel="preload" href="${file}" as="image" type="image/gif">`;

	if (jpgRE.test(file) === true)
		return `<link rel="preload" href="${file}" as="image" type="image/jpeg">`;

	if (pngRE.test(file) === true)
		return `<link rel="preload" href="${file}" as="image" type="image/png">`;

	if (webpRE.test(file) === true)
		return `<link rel="preload" href="${file}" as="image" type="image/webp">`;

	return '';
});
