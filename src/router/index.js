import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routerPush = VueRouter.prototype.push,
  routes = [{
    path: '/',
    name: 'container',
    redirect: '/miclist',
    component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "container" */ '../views/container/index.vue'),
    children: [{
      path: 'miclist',
      name: 'miclist',
      component: () => import(/* webpackChunkName: "miclist" */ '../components/miclist/index.vue')
    }, {
      path: 'collectlist',
      name: 'collectlist',
      component: () => import(/* webpackChunkName: "collectlist" */ '../components/collectlist/index.vue')
    }, {
      path: 'currentlist',
      name: 'currentlist',
      component: () => import(/* webpackChunkName: "currentlist" */ '../components/currentlist/index.vue')
    }, {
      path: 'player',
      name: 'player',
      component: () => import(/* webpackChunkName: "player" */ '../components/player/index.vue')
    }]
  }],
  router = new VueRouter({
    routes
  });

VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error);
};

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    return from.name ? next({
      name: from.name
    }) : next({ name: 'miclist' });
  }
  next();
});

export default router;
