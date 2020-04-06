export default {
  name: 'miclist',
  data() {
    return {
      part: [{
        index: 1,
        label: '新歌榜',
        color: 'primary'
      }, {
        index: 2,
        label: '热歌榜',
        color: 'secondary'
      }, {
        index: 11,
        label: '摇滚榜',
        color: 'success'
      }, {
        index: 12,
        label: '爵士',
        color: 'warning'
      }, {
        index: 16,
        label: '流行',
        color: 'error'
      }, {
        index: 21,
        label: '欧美金曲榜',
        color: 'primary'
      }, {
        index: 22,
        label: '经典老歌榜',
        color: 'secondary'
      }, {
        index: 23,
        label: '情歌对唱榜',
        color: 'success'
      }, {
        index: 24,
        label: '影视金曲榜',
        color: 'warning'
      }, {
        index: 25,
        label: '网络歌曲榜',
        color: 'error'
      }],
      partShow: false,
      type: '',
      size: 20,
      refreshing: false,
      loading: false,
      isOver: false,
      totop: false,
      isSearh: false,
      searchInfo: '',
      brand: {},
      list: [],
      swiperOption: {
        loop: false,
        effect: 'coverflow',
        fadeEffect: {
          slideShadows: true,
          shadow: true
        },
        initialSlide: 0,
        autoplay: false,
        observer: true,
        observeParents: true,
        autoplayDisableOnInteraction: true
      }
    };
  },
  computed: {
    title() {
      return this.part.find(item => item.index === this.type);
    },
    paused() {
      return this.$store.state.audio.dom ? this.$store.state.audio.ctrl.paused : true;
    }
  },
  created() {
    this.type = this.part[0].index;
    this.getList(this.part[0].index);
  },
  methods: {
    getList(info) { // 获取歌曲列表
      this.type = info || this.type;
      this.partShow = false;
      this.$axios.getData({
        baseURL: process.env.VUE_APP_BAIDUTING,
        url: '/v1/restserver/ting',
        method: 'get',
        params: {
          method: 'baidu.ting.billboard.billList',
          type: this.type,
          size: this.size,
          offset: 0
        }
      }).then(res => {
        this.isOver = this.list.length === res.data.song_list.length;
        this.brand = res.data.billboard;
        this.$set(this, 'list', res.data.song_list);
        this.refreshing = false;
        this.loading = false;
      });
    },
    refresh(info) { // 下拉刷新、切换模块
      this.size = 20;
      this.refreshing = true;
      this.$refs.list.scrollTop = 0;
      if (info && info !== this.type) {
        this.$set(this, 'list', []);
        this.searchInfo = '';
        this.isSearh = false;
      }
      if (this.isSearh) {
        this.searchList();
      }
      if (!this.isSearh) {
        this.getList(info);
      }
    },
    load() { // 上拉加载更多
      this.size += 10;
      this.loading = true;
      if (!this.isOver) {
        this.getList();
      } else {
        this.loading = false;
      }
    },
    seachMic() { // 搜索歌曲
      this.$prompt('搜索歌名、歌手', '搜索', {
        validator (value) {
          if (value) {
            return {
              valid: /\S/.test(value.replace(/\s/g, '')),
              message: '搜索内容不能为空！'
            };
          }
          return {
            message: '搜索内容不能为空！'
          };
        }
      }).then(({ result, value }) => {
        if (result) {
          this.searchInfo = value.replace(/\s/g, '');
          this.searchList();
        }
      });
    },
    searchList() { // 搜索歌曲列表
      this.loading = true;
      this.$axios.getData({
        baseURL: process.env.VUE_APP_BAIDUTING,
        url: '/v1/restserver/ting',
        method: 'get',
        params: {
          method: 'baidu.ting.search.merge',
          query: this.searchInfo
        }
      }).then(res => {
        if (!this.$globalmethod.isEmpty(res.data.result.song_info.song_list)) {
          this.$refs.list.scrollTop = 0;
          this.$set(this, 'list', res.data.result.song_info.song_list);
          this.type = '';
          this.isOver = true;
          this.isSearh = true;
        } else {
          this.$toast.warning({
            position: 'top',
            message: '未查到任何信息！'
          });
        }
        this.refreshing = false;
        this.loading = false;
      });
    },
    playMic(info) { // 播放音乐
      if (!this.$globalmethod.isEmpty(this.$store.state.mic) && this.$store.state.mic.data.songList[0].queryId !== info.song_id || this.$globalmethod.isEmpty(this.$store.state.mic)) {
        const loading = this.$loading();

        this.$axios.getData({
          baseURL: process.env.VUE_APP_BAIDUMIC,
          url: '/data/music/links',
          headers: 'application/javascript',
          method: 'get',
          params: {
            songIds: info.song_id
          }
        }).then(res => {
          if (res.data.data.songList[0].songLink) {
            this.$store.commit('mic', res.data);
            this.$store.commit('lrc', '暂无歌词');
            this.$store.commit('list', this.list);
            if (this.$store.state.mic.data.songList[0].lrcLink) {
              this.getLrc(this.$store.state.mic.data.songList[0].lrcLink);
            }
          } else {
            this.$toast.warning({
              position: 'top',
              message: '该歌曲资源努力上架中！'
            });
          }
          loading.close();
        }).catch(() => {
          loading.close();
          this.$toast.warning({
            position: 'top',
            message: '播放失败，请重试！'
          });
        });
      } else if (!this.$globalmethod.isEmpty(this.$store.state.mic) && this.$store.state.mic.data.songList[0].queryId === info.song_id) {
        this.playPause();
      }
    },
    playPause() { // 暂停、播放
      this.$store.commit('audio', {...this.$store.state.audio,
        ctrl: {...this.$store.state.audio.ctrl,
          paused: !this.$store.state.audio.ctrl.paused
        }
      });
    },
    getLrc(n) { // 获取歌词
      this.$axios.getData({
        baseURL: process.env.VUE_APP_QUKULRC,
        url: n.substring(n.indexOf('/data2/lrc/')),
        responseType: 'text',
        method: 'get'
      }).then(res => {
        this.$store.commit('lrc', res.data);
      });
    }
  }
};
