<script setup lang="ts">
const recoText = ref<string>('');
const recoRunning = ref<boolean>(false);
const recognition =
  new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
recognition.lang = 'cmn-Hans-CN'; //普通话 (中国大陆)
const stopTimer = ref<any>();
const startReco = () => {
  recoRunning.value = true;
  let stopFlag = false;
  recognition.onresult = (event: any) => {
    console.log('voice', event.results[0][0].transcript);
    recoText.value += event.results[0][0].transcript.toString();
    stopFlag = false;
  };
  stopTimer.value = setInterval(() => {
    return;
    if (stopFlag) {
      recognition.stop();
      recoRunning.value = false;
      clearInterval(stopTimer.value);
    }
    stopFlag = true;
  }, 1000 * 5);
  recognition.start();
};
</script>

<template>
  <div class="w-full p-3 box-border">
    <el-button type="primary" @click="startReco()" :disabled="recoRunning">开始识别</el-button>
    <div>{{ recoText }}</div>
  </div>
</template>

<style scoped lang="scss"></style>
