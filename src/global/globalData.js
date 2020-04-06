import Vue from 'vue'

const color = ['#2196f3' /* 蓝色 */, '#F75A05' /* 橙色 */, '#67C23A' /* 绿色 */, '#F56C6C' /* 红色 */, '#909399' /* 灰色 */],
  link = window.location.origin+window.location.pathname,
  $globaldata = {
    link: link, //项目地址
    container: { // 容器样式
      header: {
        height: '60px'
      },
      aside: {
        width: '200px'
      },
      footer: {
        height: '60px'
      }
    },
    color: color
  };

Vue.prototype.$globaldata = $globaldata;
