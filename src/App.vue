<template>
  <div id="app" v-cloak>
    <router-view />
  </div>
</template>

<style lang="less">
@import './global/globalStyle.less';

* {
  margin: 0;
  padding: 0;
}

html,body {
  .body-hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // user-select: none;
}

[v-cloak] {
  display: none;
}
</style>
