<template>
  <div class="radio-outer-wrapper" @click="handleRadioBtnClick()">
    <div v-if="btnStatus === 'ready'" class="w-full h-full ready-status-btn"></div>
    <div v-if="btnStatus === 'recording'" class="w-full h-full recording-status-btn"></div>
    <div v-if="btnStatus === 'disabled'" class="w-full h-full disabled-status-btn"></div>
  </div>
</template>
<script setup lang="ts">
import { XfVoiceDictation } from '@muguilin/xf-voice-dictation';
let times = null;

const emit = defineEmits(['output']);
const xfVoice = new XfVoiceDictation({
  APPID: 'c58327d1',
  APISecret: 'NTVkMmZlMjRkMGNhMGUzODNkZjc3MDgx',
  APIKey: '35bf0e84cee3468c79d3740416637205',

  // webSocket请求地址 非必传参数，默认为：wss://iat-api.xfyun.cn/v2/iat
  // url: '',

  // 监听录音状态变化回调
  onWillStatusChange: function (oldStatus, newStatus) {
    // 可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
    console.log('识别状态：', oldStatus, newStatus);
    if (newStatus === 'ing') btnStatus.value = 'recording';
  },

  // 监听识别结果的变化回调
  onTextChange: function (text) {
    // 可以在这里进行页面中一些交互逻辑处理：如将文本显示在页面中
    console.log('识别内容：', text);
    emit('output', text);

    // 如果3秒钟内没有说话，就自动关闭（60s后也会自动关闭）
    if (text) {
      clearTimeout(times);
      times = setTimeout(() => {
        this.stop();
        btnStatus.value = 'ready';
      }, 3000);
    }
  },

  // 监听识别错误回调
  onError: function (error) {
    console.log('错误信息：', error);
    btnStatus.value = 'ready';
  }
});

const btnStatus = ref<'ready' | 'recording' | 'disabled'>('ready');
const handleRadioBtnClick = (status: string = btnStatus.value) => {
  if (status === 'ready') {
    // 就绪状态，准备录音
    xfVoice.start();
  }
  if (status === 'recording') {
    xfVoice.stop();
    btnStatus.value = 'ready';
  }
};
</script>
<style scoped lang="scss">
.radio-outer-wrapper {
  width: 24px;
  height: 24px;

  .ready-status-btn {
    background-image: url(../assets/activeRadioBtn.png);
    background-size: contain;
  }

  .recording-status-btn {
    background-image: url(../assets/waveRadioBtn.png);
    background-size: contain;
  }

  .disabled-status-btn {
    background-image: url(../assets/radioBtn.png);
    background-size: contain;
  }
}
</style>
