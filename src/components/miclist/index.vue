<!-- 全部 -->
<template>
  <mu-row class="miclist">
    <mu-col class="part" span="12">
      <mu-appbar style="width: 100%;" color="primary">
        <img class="board" :src="brand.pic_s192" :onerror="`onerror=null;src='${$globaldata.link}img/master.png'`" v-if="type">
        <span>云听音悦</span>
        <mu-badge v-if="type" :content="title.label" :color="title.color"></mu-badge>
        <mu-button flat slot="right" @click="seachMic">
          <mu-icon value="search"></mu-icon>
        </mu-button>
        <mu-button flat slot="right" @click="partShow = !partShow">
          <mu-icon :value="partShow ? 'more_horiz' : 'more_vert'"></mu-icon>
        </mu-button>
      </mu-appbar>
    </mu-col>
    <mu-col class="list miclistinner" span="12" ref="list">
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
      <swiper :options="swiperOption"
        :class="{single:list.length<6}">
        <swiper-slide class="swiper-slide"
          :key="index"
          v-for="(item, index) in list.slice(0, 4)">
          <img class="board" :src="item.pic_huge||item.pic_small"
            :onerror="`onerror=null;src='${$globaldata.link}img/master.png'`"
            @click="playMic(item)">
        </swiper-slide>
      </swiper>
      <swiper :options="swiperOption" v-show="list.length>7">
        <swiper-slide class="swiper-slide"
          :key="index"
          v-for="(item, index) in list.slice(5, 9)">
          <img class="board" :src="item.pic_huge||item.pic_small" :onerror="`onerror=null;src='${$globaldata.link}img/master.png'`"
            @click="playMic(item)">
        </swiper-slide>
      </swiper>
      <mu-list textline="three-line">
        <mu-list-item avatar
          button
          :ripple="false"
          :key="index"
          @click="playMic(item)"
          v-for="(item, index) in list">
          <mu-ripple class="mu-ripple-demo">
            <sound v-show="!paused && $store.state.mic.data && item.song_id === $store.state.mic.data.songList[0].queryId" />
            <mu-button class="pausedBTN"
              color="primary"
              v-show="paused && $store.state.mic.data && item.song_id === $store.state.mic.data.songList[0].queryId">
              <mu-icon value="pause"></mu-icon>
            </mu-button>
            <mu-list-item-action>
              <mu-avatar>
                <img :class="{current: !paused && $store.state.mic.data && item.song_id === $store.state.mic.data.songList[0].queryId}"
                  :src="item.pic_big||item.pic_small"
                  :onerror="`onerror=null;src='${$globaldata.link}img/master.png'`">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{ item.title }}-{{ item.author }}</mu-list-item-title>
              <mu-list-item-sub-title>
                <span style="color: rgba(0, 0, 0, .87)">专辑 -</span>
                {{ item.album_title }}<br/>
                <span style="color: rgba(0, 0, 0, .87)">代理 -</span>
                {{ item.si_proxycompany }}
              </mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-ripple>
        </mu-list-item>
        <mu-divider shallow-inset></mu-divider>
        <mu-flex class="flex-wrapper"
          justify-content="center">
          <mu-badge v-show="isOver" content="到底了"></mu-badge>
        </mu-flex>
      </mu-list>
      </mu-load-more>
    </mu-col>
    <mu-drawer :open.sync="partShow" :docked="false">
      <mu-list>
        <mu-list-item button
          :key="item.index"
          v-for="item in part"
          @click="refresh(item.index)">
          <mu-button :color="item.color">{{ item.label }}</mu-button>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <reTop domName="miclistinner"/>
  </mu-row>
</template>
<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>
