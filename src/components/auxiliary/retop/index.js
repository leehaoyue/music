export default {
  name: 'retop',
  props: {
    domName: ''
  },
  data() {
    return {
      show: false,
      isFirefox: navigator.userAgent.indexOf('Firefox') >= 0,
      listenFC: navigator.userAgent.indexOf('Firefox') >= 0 ? 'DOMMouseScroll' : 'mousewheel',
      dom: null
    };
  },
  mounted() {
    let that = this;

    that.dom = document.getElementsByClassName(that.domName)[0];
    that.dom.addEventListener(that.listenFC, that.mousewheelFC);
  },
  beforeDestroy() {
    let that = this;

    that.dom.removeEventListener(that.listenFC, that.mousewheelFC);
  },
  methods: {
    // 鼠标滚轮触发事件
    mousewheelFC() {
      if (this.dom.scrollTop >= 500) {
        this.show = true;
      } else {
        this.show = false;
      }
    },
    // 返回顶部
    retop() {
      this.show = false;
      this.dom.scrollTop = 0;
    }
  }
};
