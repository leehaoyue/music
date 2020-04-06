import Vue from 'vue';
import App from './App.vue';
// 路由管理器
import router from './router';
// vuex-状态管理
import store from './store';
// 资源缓存
import './registerServiceWorker';

// promise兼容性处理（ie、火狐）
import promise from 'es6-promise';
// axios-HTTP库
import axios from '@/axios/index';
// lodash-实用工具库
import lodash from 'lodash';
// MuseUI-UI组件库
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'typeface-roboto';
import Toast from 'muse-ui-toast';
import 'muse-ui-message/dist/muse-ui-message.css';
import Message from 'muse-ui-message';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import Loading from 'muse-ui-loading';
import 'muse-ui-progress/dist/muse-ui-progress.css';
import NProgress from 'muse-ui-progress';
// swiper-轮播
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
// Material Design Icons
import './assets/iconfont/material-icons.css';
// font-awesome-矢量图标
import 'font-awesome/css/font-awesome.css';
// 全局变量
import '@/global/globalData';
// 全局方法
import globalmethod from '@/global/globalMethod';
// 全局组件
import components from '@/global/globalComponents';

Vue.use(MuseUI);
Vue.use(Toast);
Vue.use(Message);
Vue.use(Loading);
Vue.use(NProgress);
Vue.use(VueAwesomeSwiper);
Vue.use(components);

promise.polyfill();

Vue.prototype.$axios = axios;
Vue.prototype.$globalmethod = globalmethod;
Vue.prototype.$lodash = lodash;

// 取消vue所有的日志与警告
Vue.config.silent = true;
// 阻止vue在启动时生成生产提示
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
