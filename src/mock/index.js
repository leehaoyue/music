const Mock = require('mockjs'),
  data = (info) => {
    return Mock.mock({
      /* 底部导航 */
      '/navigation_list': [{
        index: 'miclist',
        label: '全部',
        icon: 'home'
      }, {
        index: 'player',
        label: '当前',
        icon: 'play_arrow'
      }, {
        index: 'currentlist',
        label: '历史',
        icon: 'list'
      }, {
        index: 'collectlist',
        label: '收藏',
        icon: 'favorite'
      }]
    })[info];
  };

export default data;
