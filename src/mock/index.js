const Mock = require('mockjs'),
  data = (info) => {
    return Mock.mock({
      /* 底部导航 */
      '/navigation_list': [{
        index: 'currentlist',
        label: '播放历史',
        icon: 'fa fa-list-ul'
      }, {
        index: 'collectlist',
        label: '收藏记录',
        icon: 'fa fa-heart'
      }]
    })[info];
  };

export default data;
