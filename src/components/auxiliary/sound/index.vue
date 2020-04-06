<template>
  <div class="soundBG">
    <ul class="music">
      <li :class="'m'+item"
        :key="item"
        v-for="item in 3"></li>
      <li :class="'m'+item"
        :key="item"
        v-for="item in 3"></li>
    </ul>
  </div>
</template>
<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>
