<!-- 历史 -->
<template>
  <mu-row class="currentlist">
    <mu-col span="12">
      <mu-appbar style="width: 100%;" flat color="primary">
        <mu-button flat
          slot="left"
          v-show="editShow"
          @click="deleteMicAll">
          <mu-icon left value="delete_sweep"></mu-icon>
          全部删除
        </mu-button>
        <mu-button flat
          slot="right"
          v-show="$store.state.history.length>0"
          @click="editShow = !editShow">
          <mu-icon left :value="editShow?'done':'edit'"></mu-icon>
          {{editShow?'完成':'编辑'}}
        </mu-button>
      </mu-appbar>
    </mu-col>
    <mu-col span="12" class="currentlistinner">
      <mu-grid-list class="gridlist-demo" v-show="$store.state.history.length>0">
        <mu-grid-tile v-for="(item, index) in $store.state.history" :key="index"
            @click="playMic(item)">
          <img :src="item.data.songList[0].songPicRadio"
            :onerror="`onerror=null;src='${$globaldata.link}img/master.png'`">
          <mu-button class="editBTN"
            icon
            color="secondary"
            v-show="editShow"
            @click.stop="deleteMic(item)">
            <mu-icon value="delete"></mu-icon>
          </mu-button>
          <span slot="title">{{item.data.songList[0].songName}}</span>
          <span slot="subTitle">
            <b>{{item.data.songList[0].artistName}}</b>
            <sound v-show="!paused && $store.state.mic.data && item.data.songList[0].queryId === $store.state.mic.data.songList[0].queryId" />
            <mu-button class="pausedBTN"
              color="primary"
              v-show="paused && $store.state.mic.data && item.data.songList[0].queryId === $store.state.mic.data.songList[0].queryId">
              <mu-icon value="pause"></mu-icon>
            </mu-button>
          </span>
        </mu-grid-tile>
      </mu-grid-list>
      <noData :msg="'暂未收听任何歌曲'" v-show="$store.state.history.length<=0" />
    </mu-col>
    <reTop domName="currentlistinner"/>
  </mu-row>
</template>
<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>
