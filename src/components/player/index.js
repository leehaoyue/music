export default {
  name: 'player',
  data() {
    return {
      currentTime: '',
      volume: (this.$store.state.audio.ctrl.volume || 0.5)*100,
      timer: setTimeout(() => {}),
      drag: false,
      dragTime: ''
    };
  },
  watch: {
    '$store.state.audio.ctrl.currentTime'(n) {
      this.currentTime = n;
      let clientHeight = this.$refs.lrc_content.clientHeight,
        scrollHeight = this.$refs.lrc_content.scrollHeight,
        duration = this.$store.state.audio.ctrl.duration;

      if (clientHeight && scrollHeight && clientHeight>0 && scrollHeight>0 && !this.drag) {
        this.$refs.lrc_content.scrollTop = (scrollHeight-clientHeight)/duration*n*2;
      }
    }
  },
  computed: {
    loop() {
      return this.$store.state.loop==='list'?'loop':'replay';
    },
    hasCollect() {
      if (this.$globalmethod.isEmpty(this.$store.state.mic)) {
        return 'favorite_border';
      }
      let node = this.$store.state.collect.find(item => {
        return item.data.songList[0].queryId === this.$store.state.mic.data.songList[0].queryId;
      });

      if (node) {
        return 'favorite';
      }
      return 'favorite_border';
    },
    name() {
      return this.$globalmethod.isEmpty(this.$store.state.mic) ? null : `${this.$store.state.mic.data.songList[0].songName}-${this.$store.state.mic.data.songList[0].artistName}`;
    },
    src() {
      return this.$store.state.mic.data ? this.$store.state.mic.data.songList[0].songPicRadio : '';
    },
    lrc() {
      let arr = [],
        medis = this.$store.state.lrc,
        medises = medis.split('\n');

      medises.forEach(item => {
        let t = item.substring(item.indexOf('[') + 1, item.indexOf(']'));

        arr.push({
          t: Number((t.split(':')[0] * 60 + parseFloat(t.split(':')[1])).toFixed(3)),
          c: item.substring(item.lastIndexOf(']') + 1, item.length)
        });
      });
      return arr;
    },
    lrcTime() {
      let time = this.$store.state.audio.ctrl.currentTime;

      return Number(time ? time.toFixed(3) : 0);
    },
    paused() {
      return this.$store.state.audio.dom ? !this.$store.state.audio.ctrl.paused : false;
    },
    duration() {
      return this.$store.state.audio.ctrl.duration;
    },
    currentTimeCtrl() {
      return this.timeFilter(this.$store.state.audio.ctrl.currentTime);
    },
    durationTimeCtrl() {
      return this.timeFilter(this.$store.state.audio.ctrl.duration);
    },
    volumeIcon() {
      return this.volume===0 ? 'volume_off' : this.volume<=30 ? 'volume_mute' : this.volume<=60 ? 'volume_down' : 'volume_up';
    }
  },
  mounted() {
    if (!this.$globalmethod.isEmpty(this.$route.query)&&!this.$globalmethod.isEmpty(this.$route.query.songid)) {
      this.playMic({
        'song_id': this.$route.query.songid
      });
    }
  },
  methods: {
    timeFilter(t) { // 时间转换
      let m = Math.floor(t/60), s = t,
        mm = '00', ss = '00';

      if (!this.$globalmethod.isEmpty(t)) {
        s = Math.round(s%60);
        mm = m<10 ? '0' + m : m;
        ss = s<10 ? '0' + s : s;
      }
      return mm + ':' + ss;
    },
    currentLrc(c, item, next) {
      if (item && item.t && next && next.t) {
        return c >= item.t && c < next.t;
      } else if (item && item.t && next && !next.t) {
        return true;
      }
      return false;
    },
    playPause() { // 暂停、播放
      this.$store.commit('audio', {...this.$store.state.audio,
        ctrl: {...this.$store.state.audio.ctrl,
          paused: !this.$store.state.audio.ctrl.paused
        }
      });
    },
    dragLrc() { // 拖拽歌词
      this.drag=true;
      let clientHeight = this.$refs.lrc_content.clientHeight,
        scrollHeight = this.$refs.lrc_content.scrollHeight,
        scrollTop = this.$refs.lrc_content.scrollTop;

      this.dragTime = scrollTop/(scrollHeight-clientHeight)*this.duration;
    },
    dragLrcEnd() { // 拖拽歌词（停止）
      this.drag=false;
      if (this.dragTime && this.dragTime<=this.duration) {
        this.changeTime(this.dragTime);
      }
    },
    changeTime(n) { // 进度调节
      clearTimeout(this.timer);
      let that = this;

      this.$store.commit('audio', {...this.$store.state.audio,
        ctrl: {...this.$store.state.audio.ctrl,
          drag: true,
          currentTime: n
        }
      });
      setTimeout(() => {
        that.$store.commit('audio', {...that.$store.state.audio,
          ctrl: {...that.$store.state.audio.ctrl,
            drag: false
          }
        });
      });
    },
    changeVolume(n) { // 音量调节
      this.$store.commit('audio', {...this.$store.state.audio,
        ctrl: {...this.$store.state.audio.ctrl,
          volume: n/100
        }
      });
    },
    preMic() { // 上一首
      if (this.$store.state.list.length>1) {
        let index = this.$store.state.list.findIndex(item => String(this.$store.state.mic.data.songList[0].songId) === (item.song_id||item.data.songList[0].queryId)),
          info = {};

        if (index===0) {
          info = this.$store.state.list[this.$store.state.list.length-1];
        } else {
          info = this.$store.state.list[index-1];
        }
        this.playMic(info);
      } else {
        this.$toast.warning({
          position: 'top',
          message: '当前播放列表仅有一首歌曲！'
        });
      }
    },
    nextMic() { // 下一首
      if (this.$store.state.list.length>1) {
        let index = this.$store.state.list.findIndex(item => String(this.$store.state.mic.data.songList[0].songId) === (item.song_id||item.data.songList[0].queryId)),
          info = {};

        if (index<this.$store.state.list.length-1) {
          info = this.$store.state.list[index+1];
        } else {
          info = this.$store.state.list[0];
        }
        this.playMic(info);
      } else {
        this.$toast.warning({
          position: 'top',
          message: '当前播放列表仅有一首歌曲！'
        });
      }
    },
    loopMic() { // 循环播放方式
      if (this.$store.state.loop === 'list') {
        this.$store.commit('loop', 'single');
        this.$toast.success({
          position: 'top',
          message: '单曲循环'
        });
      } else {
        this.$store.commit('loop', 'list');
        this.$toast.success({
          position: 'top',
          message: '列表循环'
        });
      }
    },
    reback() { // 返回
      try {
        if (window.history.length>2) {
          this.$router.go(-1);
        } else {
          this.$router.push({ name: 'miclist' });
        }
      } catch (err) {
        this.$router.push({ name: 'miclist' });
      }
    },
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
    collect() { // 收藏歌曲
      this.$store.commit('collect', this.$store.state.mic);
    }
  }
};
