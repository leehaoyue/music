<!-- 主页容器 -->
<template>
  <mu-row class="container">
    <mu-col class="main" span="12">
      <mu-slide-left-transition>
        <keep-alive><router-view /></keep-alive>
      </mu-slide-left-transition>
    </mu-col>
    <mu-col class="nav" span="12" v-show="$store.state.navShow">
      <navigation />
    </mu-col>
    <audio :src="src" autoplay muted ref="audio" id="myAudio"></audio>
  </mu-row>
</template>
<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>
