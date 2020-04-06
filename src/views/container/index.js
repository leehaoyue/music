import navigation from '../navigation/index.vue'; // 底部导航

export default {
  name: 'container',
  data() {
    return {
      timer: setTimeout(() => {}),
      audio: ''
    };
  },
  computed: {
    src() {
      if (this.$globalmethod.isEmpty(this.$store.state.mic)) {
        document.title = '云听音悦';
      } else {
        document.title = `云听音悦 | ${this.$store.state.mic.data.songList[0].songName}-${this.$store.state.mic.data.songList[0].artistName}`;
      }
      return this.$globalmethod.isEmpty(this.$store.state.mic) ? null : this.$store.state.mic.data.songList[0].songLink;
    }
  },
  watch: {
    src() {
      clearTimeout(this.timer);
      let that = this;

      that.audio = that.$refs.audio;
      that.$store.commit('history', that.$store.state.mic);
      that.timer = setTimeout(() => {
        that.audio.removeEventListener('canplay', that.canplayListner);
        that.audio.removeEventListener('timeupdate', that.timeupdateListener);
        that.audio.removeEventListener('ended', that.endedListener);
        that.audio.addEventListener('canplay', that.canplayListner);
        that.audio.addEventListener('timeupdate', that.timeupdateListener);
        that.audio.addEventListener('ended', that.endedListener);
      });
    },
    '$store.state.audio.ctrl': {
      handler(n) {
        if (!this.$globalmethod.isEmpty(n)) {
          if (n.paused) {
            this.$refs.audio.pause();
          } else {
            this.$refs.audio.play();
          }
          if (n.drag) {
            this.$refs.audio.currentTime = n.currentTime;
          }
          this.$refs.audio.volume = n.volume;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    playMic(info) { // 播放音乐
      const loading = this.$loading();

      this.$axios.getData({
        baseURL: process.env.VUE_APP_BAIDUMIC,
        url: '/data/music/links',
        headers: 'application/javascript',
        method: 'get',
        params: {
          songIds: info.song_id||info.data.songList[0].queryId
        }
      }).then(res => {
        this.$store.commit('mic', res.data);
        this.$store.commit('lrc', '暂无歌词');
        if (this.$store.state.mic.data.songList[0].lrcLink) {
          this.getLrc(this.$store.state.mic.data.songList[0].lrcLink);
        }
        loading.close();
      }).catch(() => {
        loading.close();
        this.$toast.warning({
          position: 'top',
          message: '播放失败，请重试！'
        });
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
    canplayListner() { // 是否可以播放监听
      this.$store.commit('audio', {
        dom: this.audio,
        ctrl: {
          drag: false,
          currentTime: this.audio.currentTime,
          duration: this.audio.duration,
          loop: this.audio.loop,
          paused: false,
          volume: this.$store.state.audio.ctrl.volume || 0.5
        }
      });
    },
    timeupdateListener() { // 播放进度监听
      this.$store.commit('audio', {...this.$store.state.audio,
        ctrl: {...this.$store.state.audio.ctrl,
          currentTime: this.audio.currentTime
        }
      });
    },
    endedListener() { // 是否结束监听
      if (this.$store.state.list.length===1 || this.$store.state.loop === 'single' || this.$globalmethod.isEmpty(this.$store.state.list)) {
        this.audio.currentTime = 0;
      } else if (this.$store.state.loop === 'list') {
        let index = this.$store.state.list.findIndex(item => String(this.$store.state.mic.data.songList[0].songId) === (item.song_id||item.data.songList[0].queryId)),
          info = {};

        if (index<this.$store.state.list.length-1) {
          info = this.$store.state.list[index+1];
        } else {
          info = this.$store.state.list[0];
        }
        this.playMic(info);
      }
    }
  },
  components: {
    navigation
  }
};
