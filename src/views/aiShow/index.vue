<script setup lang="ts">
import TextModel from './textModel.vue';
import KnowledgeLib from './knowledgeLib.vue';

const showedModel = ref<string>('textModel');
const sideMenus = ref<any[]>([
  { key: 'textModel', label: '文本模型' },
  { key: 'vision', label: '视觉模型' },
  { key: 'voice', label: '语音模型' },
  { key: 'knowledge', label: '知识库' }
]);
</script>
<template>
  <div class="w-100vw h-100vh overflow-hidden flex bg-white text-black">
    <div class="w-[74px] flex flex-col box-border ai-side-bar">
      <div class="logo w-74px h-74px"></div>
      <div
        class="text-[black] text-[14px] text-center relative top-[-4px] mx-[8px] pb-[16px]"
        style="border-bottom: 1px solid #e0e3eb"
      >
        AI助手
      </div>
      <div class="flex flex-col items-center pt-16px space-y-[30px]">
        <div
          v-for="(item, index) in sideMenus"
          :key="item.key"
          @click="showedModel = item.key"
          class="flex flex-col items-center"
        >
          <div
            :class="`${showedModel === item.key ? 'selected-' : ''}icon-${index + 1} w-48px h-48px`"
          ></div>
          <div class="text-[12px] mt-12px">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <TextModel v-if="showedModel === 'textModel'" />
    <KnowledgeLib v-if="showedModel === 'knowledge'" />
  </div>
</template>
<style scoped lang="scss">
.ai-side-bar {
  background: linear-gradient(to top, #b5bbf480, #ffffff, #c2ece380);
}

.logo {
  background-image: url(./assets/logo.png);
  background-size: 100% 100%;
}

@for $i from 1 through 4 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 60% 60%;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .selected-icon-#{$i} {
    background-image: url(./assets/selectedIcon#{$i}.png);
    background-size: 100% 100%;
  }
}
</style>
