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
		requiresAuth?: boolean;
		level?: authorizationLevel
	}
}
