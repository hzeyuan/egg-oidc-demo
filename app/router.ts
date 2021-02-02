import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/app1', controller.home.app1);
  router.get('/app2', controller.home.app2);
  router.get('/rp', controller.home.rp);
  router.get('/interaction/:uid', controller.interaction.grant);
  router.post('/interaction/:uid/login', controller.interaction.login);
  router.post('/interaction/:uid/confirm', controller.interaction.confirm);
};
