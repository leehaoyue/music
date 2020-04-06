<!-- 底部导航 -->
<template>
  <mu-bottom-nav class="navigation"
    :value.sync="defaultActive"
    shift
    @change="changePage">
    <mu-bottom-nav-item :value="item.index"
      :key="item.index"
      :title="item.label"
      :icon="item.icon"
      v-for="item in list"></mu-bottom-nav-item>
  </mu-bottom-nav>
</template>
<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>
