<template>
  <div class="radio-outer-wrapper">
    <div
      v-if="btnStatus === 'ready'"
      class="w-full h-full ready-status-btn"
      @click="startRecord()"
    ></div>
    <div
      v-if="btnStatus === 'recording'"
      class="w-full h-full recording-status-btn"
      @click="stopRecord()"
    ></div>
    <div v-if="btnStatus === 'disabled'" class="w-full h-full disabled-status-btn"></div>
    <div
      class="tooltip-bg w-104px h-51px absolute top-[-51px] left-[-40px]"
      v-show="['ready'].includes(btnStatus)"
    >
      <div class="text-center text-white text-14px relative top-12px">语音输入</div>
    </div>
    <div
      class="tooltip-long-bg w-124px h-51px absolute top-[-51px] left-[-50px]"
      v-show="['recording'].includes(btnStatus)"
    >
      <div class="text-center text-white text-14px relative top-12px">停止语音输入</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { record_start, record_upload } from '../utils';
import { asr } from '../api';

const btnStatus = ref<'ready' | 'recording' | 'disabled'>('ready');
// 开始录音
const startRecord = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // 如果成功获取到流，则有权限
  console.log('麦克风权限已授予');

  // 使用完毕后记得关闭流
  stream.getTracks().forEach((track) => track.stop());
  if (btnStatus.value !== 'ready') return;
  record_start();
  btnStatus.value = 'recording';
};

const props = defineProps({
  embeddingModel: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['output']);
const stopRecord = async () => {
  if (btnStatus.value !== 'recording') return;
  const path = await record_upload();
  console.log('path', path);
  const asrRes = await asr({
    // cluster: props.embeddingModel,
    audioPath: path
  }).catch(() => {
    btnStatus.value = 'ready';
  });
  if (typeof asrRes === 'string') emit('output', asrRes);
  else ElMessage.warning('语音识别失败，请稍后重试！');
  btnStatus.value = 'ready';
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

  .tooltip-bg {
    background-image: url(../assets/tooltipBg.png);
    background-size: contain;
  }

  .tooltip-long-bg {
    background-image: url(../assets/tooltipLongBg.png);
    background-size: contain;
  }
}
</style>
