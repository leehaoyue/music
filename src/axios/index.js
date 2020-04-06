import axios from 'axios';
import Qs from 'qs';
import Toast from 'muse-ui-toast';
import Message from 'muse-ui-message';
import NProgress from 'muse-ui-progress';
import $server from './interfaceList.js';

const $instance = axios.create({
  transformRequest: [data => { // 请求数据处理（防止后端接收不到参数）
    return Qs.stringify(data);
  }],
  transformResponse: [data => { // ie兼容性（解决无返回数据问题）
    if (!!window.ActiveXObject || 'ActiveXObject' in window || navigator.userAgent.indexOf('MSIE') >= 0) {
      return JSON.parse(data)
    }
    return data
  }],
  baseURL: process.env.VUE_APP_API,
  responseType: 'json',
  timeout: 3000, // 超时定时器
  cancelToken: axios.CancelToken.source().token, // 取消请求（防止一个接口请求多次）
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// 自定义拦截器
$instance.interceptors.request.use(res => {
  // 请求成功
  return res;
}, () => {
  // 请求失败
  Toast.warning({
    position: 'top',
    message: '请求失败！'
  });
});

$instance.interceptors.response.use(res => {
  // 响应成功
  return res;
}, () => {
  // 响应失败
  Toast.warning({
    position: 'top',
    message: '响应失败！'
  });
});

export default {
  getData({url, method, params, baseURL, responseType, headers}) {
    return new Promise((resolve, reject) => {
      NProgress.start();
      if (params && params.isMock) {
        let res = {
          data: $server(url)
        };
        resolve(res);
        NProgress.done();
        return;
      }
      let methods = 'post';
      if (method) {
        methods = method;
      }
      let obj = methods === 'post' ? {
        data: params
      } : {
        params: params
      };

      obj = headers ? {...obj,
        headers: {
          'Content-Type': headers
        }
      } : obj;
      $instance({...obj,
        baseURL: baseURL || process.env.VUE_APP_API,
        responseType: responseType || 'json',
        method: methods,
        url: url
      }).then((res) => {
        NProgress.done();
        resolve(res);
      }).catch((err) => {
        NProgress.done();
        Toast.warning({
          position: 'top',
          message: '服务器错误，请重试！'
        });
        reject(err);
      })
    });
  }
}
