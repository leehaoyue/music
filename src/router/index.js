import Vue from 'vue';
import VueRouter from 'vue-router';
import { Loading } from 'element-ui';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [{
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/Home.vue')
  }, {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: 'about' */ '../views/About.vue')
  }]
});

router.beforeEach((to, from, next) => {
  let loadingInstance = Loading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.5)'
  });

  if (to.matched.length === 0) {
    loadingInstance.close();
    return from.name ? next({
      name: from.name
    }) : next({ name: 'Home' });
  }
  loadingInstance.close();
  next();
});

export default router;
