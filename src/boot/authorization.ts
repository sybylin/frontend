import { boot } from 'quasar/wrappers';
import { checkUserRights } from 'src/boot/custom';

export default boot(({ router }) => {
	router.beforeEach(async (to, _from, next) => {
		if (to.meta.requiresAuth && !(await checkUserRights(to.meta.level ?? 'user'))) {
			next({
				name: 'login',
				query: {
					redirect: to.fullPath
				}
			});
			return;
		}
		next();
	});
});
