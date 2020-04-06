<!-- 当前 -->
<template>
  <mu-row class="player">
    <mu-col class="nav" span="12">
      <mu-appbar style="width: 100%;" color="primary">
        <mu-button icon slot="left" @click="reback">
          <mu-icon value="keyboard_arrow_left"></mu-icon>
        </mu-button>
        {{name}}
        <mu-menu slot="right">
          <mu-button flat :disabled="!duration>0"
            @click="collect">
            <mu-icon :value="hasCollect"></mu-icon>
          </mu-button>
        </mu-menu>
      </mu-appbar>
    </mu-col>
    <mu-col class="lrc" span="12">
      <ul class="lrc_content"
        disabled
        ref="lrc_content"
        @touchstart="drag=true"
        @touchmove="dragLrc()"
        @touchend="dragLrcEnd()">
        <li :class="{current: currentLrc(lrcTime, item, lrc[index+1])}"
          :key="index"
          v-for="(item, index) in lrc">{{ item.c }}</li>
      </ul>
      <img :class="{board: src&&paused}" :src="src" :onerror="`onerror=null;src='${$globaldata.link}img/master.png'`"/>
    </mu-col>
    <mu-col span="12">
      <mu-row class="ctrl" gutter
        align-items="center"
        justify-content="center">
        <mu-col span="2">
          <mu-button fab small color="primary" :disabled="!duration>0" @click="playPause">
            <mu-icon :value="paused?'pause':'play_arrow'"></mu-icon>
          </mu-button>
        </mu-col>
        <mu-col span="10">
          <mu-button icon color="primary" ref="button">
            <mu-icon :value="volumeIcon"></mu-icon>
          </mu-button>
          <mu-slider class="volume-slider"
            v-model="volume"
            :max="100"
            :disabled="!duration>0"
            :display-value="false"
            @change="changeVolume"></mu-slider>
          <mu-button icon color="primary"
            :disabled="!duration>0"
            @click="preMic">
            <mu-icon value="skip_previous"></mu-icon>
          </mu-button>
          <mu-button icon color="primary"
            :disabled="!duration>0"
            @click="nextMic">
            <mu-icon value="skip_next"></mu-icon>
          </mu-button>
          <mu-button icon color="primary"
            :disabled="!duration>0"
            @click="loopMic">
            <mu-icon :value="loop"></mu-icon>
          </mu-button>
          <mu-slider class="time-slider"
            v-model="currentTime"
            :disabled="!duration>0"
            :max="duration"
            :display-value="false"
            @change="changeTime"></mu-slider>
          <mu-badge :content="`${currentTimeCtrl} / ${durationTimeCtrl}`" color="primary"></mu-badge>
        </mu-col>
      </mu-row>
    </mu-col>
  </mu-row>
</template>
<style lang="less" src="./index.less"></style>
<script src="./index.js"></script>
