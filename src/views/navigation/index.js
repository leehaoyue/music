export default {
  name: 'navigation',
  data() {
    return {
      list: [],
      defaultActive: ''
    };
  },
  watch: {
    '$route.name'(n) {
      if (n) {
        let node = this.list.find(item => item.index === this.$route.name);

        this.defaultActive = this.$globalmethod.isEmpty(node) ? this.list[0].index : node.index;
        // this.changePage();
      }
      this.dealURL();
      this.$store.commit('navShow', n!==this.list[1].index);
    }
  },
  created() {
    this.dealURL();
    this.getList();
  },
  methods: {
    dealURL() { // 项目地址处理
      if (/from=singlemessage/.test(window.location.href)) {
        window.location = window.location.href.replace(/\?from=singlemessage/g, '').replace(/from=singlemessage&/g, '').replace(/from=singlemessage/g, '').replace(/&#/g, '#');
      }
    },
    getList() { // 获取目录
      this.$axios.getData({
        url: '/navigation_list',
        method: 'post',
        params: {
          isMock: true
        }
      }).then(res => {
        this.$set(this, 'list', res.data);
        let node = this.list.find(item => item.index === this.$route.name);

        this.defaultActive = this.$globalmethod.isEmpty(node) ? res.data[0].index : node.index;
        this.$store.commit('navShow', this.$route.name!==res.data[1].index);
        // this.changePage();
      });
    },
    changePage() { // 切换选项卡
      if (this.defaultActive==='player' && !this.$globalmethod.isEmpty(this.$store.state.mic)) {
        this.$router.push({
          name: this.defaultActive,
          query: {
            songid: this.$store.state.mic.data.songList[0].queryId
          }
        });
        if (!this.$globalmethod.isEmpty(this.$store.state.mic)) {
          document.title = `云听音悦 | ${this.$store.state.mic.data.songList[0].songName}-${this.$store.state.mic.data.songList[0].artistName}`;
        }
      } else {
        this.$router.push({
          name: this.defaultActive
        });
        document.title = '云听音悦';
      }
    }
  }
};
