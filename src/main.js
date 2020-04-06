import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// promise兼容性处理（ie、火狐）
import promise from 'es6-promise';
// axios-HTTP库
import axios from '@/axios/index.js';
// Element-桌面端组件库
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
// font-awesome-矢量图标
import 'font-awesome/css/font-awesome.css';
// Lodash
import lodash from 'lodash';
// 全局方法
import globalmethod from '@/global/globalMethod';
// 全局组件
import components from '@/global/globalComponents';
// Mockjs
const Mock = require('mockjs');

Vue.use(Element);
Vue.use(components);

promise.polyfill();

Vue.prototype.$axios = axios;
Vue.prototype.$globalmethod = globalmethod;
Vue.prototype.$lodash = lodash;
Vue.prototype.$mock = Mock;

// 取消vue所有的日志与警告
Vue.config.silent = true;
// 阻止vue在启动时生成生产提示
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
