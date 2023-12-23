/* eslint-disable */
import type { authorizationLevel } from 'src/boot/authorization';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare module 'vue-router' {
	interface RouteMeta {
		/**
		 * This route requires authentication for access
		 */
		requiresAuth?: boolean;

		/**
		 * The level required for authorization
		 */
		level?: authorizationLevel;

		/**
		 * This route must not be rendered in ssr
		 */
		noSSR?: boolean;

		/**
		 * Don't force lang redirection
		 */
		noForceLang?: boolean;
	}
}
