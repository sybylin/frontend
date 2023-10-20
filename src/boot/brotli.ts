import { boot } from 'quasar/wrappers';
import * as brotliPromise from 'brotli-wasm';
import lzString from 'lz-string';

export const stringCompress = (data: string): string => JSON.stringify(lzString.compress(data));

export const stringDecompress = (data: string): string => lzString.decompress(JSON.parse(data));

export const brotliCompress = async (data: string): Promise<string | null> => {
	const wasm = await brotliPromise.default;
	return stringCompress(
		wasm.compress(
			new TextEncoder().encode(data)
		).toString()
	);
};

export const brotliDecompress = async (data: string): Promise<string | null> => {
	const wasm = await brotliPromise.default;
	return new TextDecoder().decode(
		wasm.decompress(
			Uint8Array.from(
				stringDecompress(data)
					.split(',')
					.map((n) => Number(n))
			)
		)
	);
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
		$stringCompress: (data: string) => string;
		$stringDecompress:(data: string) => string;
		$brotliCompress: (data: string) => Promise<string | null>;
		$brotliDecompress: (data: string) => Promise<string | null>;
  }
}

export default boot(({ app }) => {
	app.config.globalProperties.$stringCompress = stringCompress;
	app.provide('$stringCompress', stringCompress);
	app.config.globalProperties.$stringDecompress = stringDecompress;
	app.provide('$stringDecompress', stringDecompress);
	app.config.globalProperties.$brotliCompress = brotliCompress;
	app.provide('$brotliCompress', brotliCompress);
	app.config.globalProperties.$brotliDecompress = brotliDecompress;
	app.provide('$brotliDecompress', brotliDecompress);
});
