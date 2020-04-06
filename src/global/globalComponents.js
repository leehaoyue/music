import reTop from '@/components/auxiliary/retop/index.vue'; // 返回顶部
import sound from '@/components/auxiliary/sound/index.vue'; // 音浪
import nodata from '@/components/auxiliary/nodata/index.vue'; // 暂无数据

export default (Vue) => {
  Vue.component('reTop', reTop);
  Vue.component('sound', sound);
  Vue.component('noData', nodata);
}