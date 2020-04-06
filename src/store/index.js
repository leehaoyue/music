import Vue from 'vue';
import Vuex from 'vuex';
import $globalmethod from '@/global/globalMethod.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    audio: { // 音乐播放器
      dom: '',
      ctrl: ''
    },
    mic: {}, // 当前播放音乐信息
    lrc: '', // 当前播放音乐歌词
    list: [], // 播放列表
    loop: 'list', // 循环播放方式（list：列表、single：单曲）
    history: localStorage.getItem('history')?JSON.parse(localStorage.getItem('history')):[], // 播放历史
    collect: localStorage.getItem('collect')?JSON.parse(localStorage.getItem('collect')):[], // 收藏历史
    navShow: true // 是否显示底部导航
  },
  mutations: {
    audio (state, obj) {
      state.audio = obj;
    },
    mic (state, obj) {
      state.mic = obj;
    },
    lrc (state, str) {
      state.lrc = str;
    },
    list (state, arr) {
      state.list = arr;
    },
    loop(state, str) {
      state.loop = str;
    },
    history (state, obj) {
      let list = localStorage.getItem('history'), arr = [], node = '';

      if (list && !$globalmethod.isEmpty(JSON.parse(list))) {
        arr = JSON.parse(list);
        node = arr.find(item=>{
          return item.data.songList[0].queryId === obj.data.songList[0].queryId;
        });
        if (!node) {
          arr.unshift(obj);
        }
        state.history = arr;
      } else {
        state.history = [obj];
      }
      localStorage.setItem('history', JSON.stringify(state.history));
    },
    clearHistory(state, obj) {
      let list = localStorage.getItem('history'), arr = [], index = '';

      if (list && !$globalmethod.isEmpty(JSON.parse(list))) {
        arr = JSON.parse(list);
        index = arr.findIndex(item=>{
          return item.data.songList[0].queryId === obj.data.songList[0].queryId;
        });
        if (index>=0) {
          arr.splice(index, 1);
        }
        state.history = arr;
      }
      localStorage.setItem('history', JSON.stringify(state.history));
    },
    clearAllHistory(state) {
      state.history = [];
      localStorage.setItem('history', JSON.stringify(state.history));
    },
    collect (state, obj) {
      let list = localStorage.getItem('collect'), arr = [], index = '';

      if (list && !$globalmethod.isEmpty(JSON.parse(list))) {
        arr = JSON.parse(list);
        index = arr.findIndex(item=>{
          return item.data.songList[0].queryId === obj.data.songList[0].queryId;
        });
        if (index>=0) {
          arr.splice(index, 1);
        } else {
          arr.unshift(obj);
        }
        state.collect = arr;
      } else {
        state.collect = [obj];
      }
      localStorage.setItem('collect', JSON.stringify(state.collect));
    },
    clearAllCollect(state) {
      state.collect = [];
      localStorage.setItem('collect', JSON.stringify(state.collect));
    },
    navShow (state, bln) {
      state.navShow = bln;
    }
  },
  actions: {},
  modules: {}
});
