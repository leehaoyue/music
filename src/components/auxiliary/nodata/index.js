export default {
  name: 'nodata',
  props: {
    msg: '',
    height: ''
  },
  computed: {
    title() {
      return this.$globalmethod.isEmpty(this.msg) ? '暂无数据' : this.msg;
    },
    style() {
      return {
        height: this.$globalmethod.isEmpty(this.height) ? 'calc(100vh - 120px)' : this.height
      };
    }
  }
};
