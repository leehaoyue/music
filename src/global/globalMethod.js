export default {
  // 判断android、ios
  iSAndroid() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    if (isAndroid) {
      return true;
    }
    if (isIOS) {
      return false;
    }
  },
  // url截取参数
  getURLString (key){
    let reg = new RegExp('(^|&)'+ key +'=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);

    if (r !== null) {
      return unescape(r[2]);
    }
    return null;
  },
  // 阻止事件冒泡
  cancelBubble(e) {
    e.cancelBubble = true;
  },
  // 获取指定元素
  getnode(key, val, childkey, arrobj) {
    if (Array.isArray(arrobj)) {
      for (let i in arrobj) {
        if (val === arrobj[i][key]) {
          return arrobj[i]
        } else if (arrobj[i][childkey] && arrobj[i][childkey].length>0) {
          let node = this.getnode(key, val, childkey, arrobj[i][childkey]);

          if (node) {
            return node;
          }
        }
      }
    } else {
      for (let i in arrobj) {
        if (val === i[key]) {
          return i
        } else if (i[childkey] && i[childkey].length>0) {
          let node = this.getnode(key, val, childkey, i[childkey]);

          if (node) {
            return node;
          }
        }
      }
    }
  },
  // 判断是否为数字
  isNum(num) {
    return this.isEmpty(num) ? false : /^[0-9]+[0-9]*]*$/.test(num);
  },
  // 判断对象是否相等
  isEqual(origin, target) {
    let o1 = origin instanceof Object;
    let o2 = target instanceof Object;

    if (!o1 || !o2) {
      return origin === target;
    }
    if (Object.keys(origin).length !== Object.keys(target).length) {
      return false;
    }
    for (let attr in origin) {
      let t1 = origin[attr] instanceof Object;
      let t2 = target[attr] instanceof Object;

      if (t1 && t2) {
        return this.isEqual(origin[attr],target[attr]);
      } else if (origin[attr] !== target[attr]) {
        return false;
      }
    }
    return true;
  },
  // 只能输入数字、字母、下划线
  isLetter(str) {
    return this.isEmpty(str) ? false : /^\w+$/.test(str);
  },
  // 判断是否为时间
  isTime (time) {
    return !isNaN(Date.parse(time));
  },
  // 时间转换
  timeFilter(date, type) {
    if (!date) {
      return '—';
    }
    let time = '';

    try {
      time = this.iSAndroid() ? date : date.replace(/-/g, '/');
    } catch (err) {
      time = date;
    }
    time = new Date(time);
    let Y = time.getFullYear();
    let M = (time.getMonth()+1 < 10 ? '0'+(time.getMonth()+1) : time.getMonth()+1);
    let D = time.getDate()< 10 ? '0'+time.getDate() : time.getDate();
    let H = (time.getHours()< 10 ? '0'+time.getHours() : time.getHours());
    let MM = ':' + (time.getMinutes()< 10 ? '0'+time.getMinutes() : time.getMinutes());

    switch (type) {
    case 'hh:mm':
      time = `${H}${MM}`;
      break;
    case 'diff/hh:mm':
      let diff = (new Date().getTime()-time.getTime())/(3600*1000*24);

      if (diff<1) {
        time = `${H}${MM}`;
      } else if (diff>=1 && diff<2) {
        time = `昨日 ${H}${MM}`;
      } else {
        time = `${Math.round(diff)}天前 ${H}${MM}`;
      }
      break;
    case 'yyyy-mm-dd':
      time = `${Y}-${M}-${D}`;
      break;
    case 'yyyy.mm.dd':
      time = `${Y}年${M}月${D}日`;
      break;
    case 'yyyy-mm-dd/hh:mm':
      time = `${Y}-${M}-${D} ${H}${MM}`;
      break;
    case 'yyyy.mm.dd/hh:mm':
      time = `${Y}年${M}月${D}日 ${H}${MM}`;
      break;
    default:
      time = `${Y}-${M}-${D} ${H}${MM}`;
    }
    return time;
  },
  // 数组去重并排序
  reDuplication(arrobj, key, method) {
    let newarr = [];
    let json = {};

    try {
      newarr = Array.from(new Set(arrobj.flat(Infinity))).sort((a,b)=>{
        if (!this.isEmpty(key)) {
          return this.isEmpty(method) ? a[key] - b[key] : a[key].localeCompare(b[key], method)
        }
        return a - b;
      });
    } catch (err) {
      for (let i = 0; i < arrobj.length; i++) {
        if (json[arrobj[i]] !== arrobj[i]) {
          newarr.push(arrobj[i]);
          json[arrobj[i]] = arrobj[i];
        }
      }
    }
    return newarr;
  },
  // 判断是否为空
  isEmpty: (obj) => {
    if (typeof obj === 'boolean') {
      return false;
    }
    if ((!obj || obj === '') && obj !== 0) {
      return true;
    }
    if (typeof obj === 'string' && !obj.replace(/\s/g, '')) {
      return true;
    }
    if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
      return true;
    }
    if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
      if (obj instanceof Date) {
        return false;
      }
      return true;
    }
    return false;
  },
  // 去掉空键值
  removeEmpty(obj) {
    let param = Object.assign({}, obj);

    for (let i in param) {
      if (this.isEmpty(param[i])) {
        delete param[i];
      }
    }
    return param;
  },
  // 去空格
  removeBlank(str) {
    return str.replace(/\s/g, '');
  },
  // 加载弹窗
  pageLoading(obj, boolean) {
    if (boolean) {
      obj.$loading({
        customClass: 'pageLoading',
        background: 'transparent'
      });
    } else {
      obj.$loading({
        customClass: 'pageLoadingClose'
      }).close();
    }
  }
}