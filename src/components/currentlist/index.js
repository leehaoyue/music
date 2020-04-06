export default {
  name: 'currentlist',
  data() {
    return {
      list: [],
      editShow: false
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
  methods: {
    playMic(info) { // 播放音乐
      if (!this.$globalmethod.isEmpty(this.$store.state.mic) && this.$store.state.mic.data.songList[0].queryId !== info.data.songList[0].queryId || this.$globalmethod.isEmpty(this.$store.state.mic)) {
        const loading = this.$loading();

        this.$axios.getData({
          baseURL: process.env.VUE_APP_BAIDUMIC,
          url: '/data/music/links',
          headers: 'application/javascript',
          method: 'get',
          params: {
            songIds: info.data.songList[0].queryId
          }
        }).then(res => {
          if (res.data.data.songList[0].songLink) {
            this.$store.commit('mic', res.data);
            this.$store.commit('lrc', '暂无歌词');
            this.$store.commit('list', this.$store.state.history);
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
      } else if (!this.$globalmethod.isEmpty(this.$store.state.mic) && this.$store.state.mic.data.songList[0].queryId === info.data.songList[0].queryId) {
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
    },
    deleteMic(info) { // 删除音乐
      this.$store.commit('clearHistory', info);
    },
    deleteMicAll() { // 全部删除
      this.$confirm('确定要全部删除？', '提示', {
        type: 'warning'
      }).then(({ result }) => {
        if (result) {
          this.$store.commit('clearAllHistory');
        }
      });
    }
  }
};
