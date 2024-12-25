<template>
  <div
    class="radio-outer-wrapper"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    <div
      v-if="btnStatus === 'ready' && !props.generateTexting"
      class="w-full h-full ready-status-btn"
      @click="startRecord()"
    ></div>
    <div
      v-show="btnStatus === 'recording' && !props.generateTexting"
      class="w-full h-full recording-status-btn relative"
    >
      <div
        class="w-16px h-16px absolute left-4px top-4px rounded-full overflow-hidden flex justify-center items-center"
      >
        <div
          id="waveContainer"
          class="w-full h-100px bg-white dark:bg-[#0f121b] relative left-1px"
        ></div>
      </div>
      <div class="absolute left-0 top-0 w-full h-full z-20" @click="stopRecord()"></div>
    </div>
    <div
      v-if="btnStatus === 'disabled' || props.generateTexting"
      class="w-full h-full disabled-status-btn"
    ></div>
    <div
      class="tooltip-bg w-104px h-51px absolute top-[-51px] left-[-40px]"
      v-show="['ready'].includes(btnStatus) && showTooltip && !props.generateTexting"
    >
      <div class="text-center text-white text-14px relative top-12px">语音输入</div>
    </div>
    <div
      class="tooltip-long-bg w-124px h-51px absolute top-[-51px] left-[-50px]"
      v-show="['recording'].includes(btnStatus) && showTooltip && !props.generateTexting"
    >
      <div class="text-center text-white text-14px relative top-12px">
        {{ loading ? '识别中...' : '停止语音输入' }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { record_start, record_upload } from './utils';
import { asr } from '../../apis';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm';

let wavesurferIns: any = null;
let recordIns: any = null;
onMounted(() => {
  wavesurferIns = WaveSurfer.create({
    container: '#waveContainer',
    waveColor: '#9499f3', // 设置波形颜色
    progressColor: '#FCB28F', // 设置进度条颜色
    height: 100, // 设置波形图高度
    barWidth: 2, // 设置条形宽度
    barRadius: 1, // 设置条形圆角
    cursorWidth: 0, // 设置光标宽度
    interact: true, // 禁用交互
    autoCenter: true, // 光标自动展示在中间
    normalize: false // 将波形拉伸至最大高度
  });
  recordIns = wavesurferIns.registerPlugin(
    RecordPlugin.create({
      scrollingWaveform: false
    })
  );
});

onUnmounted(() => {
  wavesurferIns && wavesurferIns.destroy();
});

const showTooltip = ref<boolean>(false);
const btnStatus = ref<'ready' | 'recording' | 'disabled'>('ready');
// 开始录音
const startRecord = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // 如果成功获取到流，则有权限
  console.log('麦克风权限已授予');

  // 使用完毕后记得关闭流
  stream.getTracks().forEach((track) => track.stop());
  if (btnStatus.value !== 'ready') return;
  emit('update:disableSend', true);
  recordIns.startRecording();
  record_start();
  btnStatus.value = 'recording';
};

const props = defineProps({
  disableSend: {
    type: Boolean,
    default: false
  },
  generateTexting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['output', 'update:disableSend']);
const loading = ref<boolean>(false);
const stopRecord = async () => {
  console.log('触发 stopRecord');
  if (btnStatus.value !== 'recording') return;
  loading.value = true;
  recordIns.stopRecording();
  const path = await record_upload().catch(() => {
    loading.value = false;
    emit('update:disableSend', false);
  });
  const asrRes = await asr({
    audioPath: path
  }).catch(() => {
    btnStatus.value = 'ready';
    loading.value = false;
    emit('update:disableSend', false);
  });
  emit('update:disableSend', false);
  loading.value = false;
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
    background-image: url(../../assets/activeRadioBtn.png);
    background-size: contain;
  }

  .recording-status-btn {
    background-image: url(../../assets/waveRadioBtn.png);
    background-size: contain;
  }

  .disabled-status-btn {
    background-image: url(../../assets/radioBtn.png);
    background-size: contain;
  }

  .tooltip-bg {
    background-image: url(../../assets/tooltipBg.png);
    background-size: contain;
  }

  .tooltip-long-bg {
    background-image: url(../../assets/tooltipLongBg.png);
    background-size: contain;
  }
}
</style>
