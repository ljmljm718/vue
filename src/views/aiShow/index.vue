<script setup lang="ts">
import TextModel from './textModel.vue';
import KnowledgeLib from './knowledgeLib.vue';
import VisionModel from './visionModel.vue';

const showedModel = ref<string>('textModel');
const sideMenus = ref<any[]>([
  { icon: 1, key: 'textModel', label: '文本模型' },
  { icon: 2, key: 'vision', label: '视觉模型' },
  // { icon: 3, key: 'voice', label: '语音模型' },
  { icon: 4, key: 'knowledge', label: '知识库' }
]);
</script>
<template>
  <div class="w-100vw h-100vh overflow-hidden flex ai-show-outer-frame">
    <div class="w-[80px] flex flex-col items-center box-border text-white">
      <div class="logo w-28px h-32px mt-32px"></div>
      <div class="text-[16px] leading-[25px] text-center mt-11px">AI助手</div>
      <div class="flex flex-col items-center pt-70px space-y-[50px]">
        <div
          v-for="item in sideMenus"
          :key="item.key"
          @click="showedModel = item.key"
          class="flex flex-col items-center"
        >
          <div
            :class="`${showedModel === item.key ? 'show-mask-wrapper' : ''} w-48px h-48px flex items-center justify-center`"
          >
            <div
              :class="`${showedModel === item.key ? 'selected-' : ''}icon-${item.icon} w-24px h-24px ${['textModel', 'vision'].includes(item.key) ? 'top-[2px]' : ''}`"
              class="relative"
            ></div>
          </div>
          <div
            class="text-[12px] mt-12px"
            :style="`font-weight: ${showedModel === item.key ? 'bold' : '500'};`"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="box-border p-8px pl-0 h-full rounded-md" style="width: calc(100% - 80px)">
      <div class="w-full h-full ai-show-func-frame flex overflow-hidden">
        <TextModel v-if="showedModel === 'textModel'" />
        <KnowledgeLib v-if="showedModel === 'knowledge'" />
        <VisionModel v-if="showedModel === 'vision'" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dark .ai-show-outer-frame {
  background-image: linear-gradient(to right, transparent, #000000d0, #000000d0, #000000d0),
    linear-gradient(to top, #23304a, #282e48, #2d2d46);
  color: white;
  .show-mask-wrapper {
    background-image: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
    background-size: 100% 100%;
    border-radius: 999px;
  }
}
.ai-show-outer-frame {
  background-image: linear-gradient(to right, transparent, #ffffffd0, #ffffffd0, #ffffffd0),
    linear-gradient(to top, #4378ff, #8366e1, #9362da);
  color: black;
  .show-mask-wrapper {
    background-image: url(./assets/btnMask.png);
    background-size: 100% 100%;
  }
  .ai-show-func-frame {
    border-radius: 12px 0 0 12px;
    background-color: white;
  }
}
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
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .selected-icon-#{$i} {
    background-image: url(./assets/selectedIcon#{$i}.png);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }
}
</style>
<style lang="scss">
.ai-show-outer-frame {
  --side-panel-bg-color: #ffffff;
  --default-border-color: #e0e3eb;
}

.dark .ai-show-outer-frame {
  --side-panel-bg-color: #1f2531;
  --default-border-color: #2c3240;
}

/* 右侧pannel基本样式 */
.right-panel-wrapper {
  background-color: var(--side-panel-bg-color);
  padding: 25px;
  box-sizing: border-box;
}

/** 折叠按钮 */
.collapse-btn {
  background-image: url(./assets/collapseBtn.png);
  background-size: 100% 100%;
}

.dark .collapse-btn {
  background-image: url(./assets/darkCollapseBtn.png);
  background-size: 100% 100%;
}
</style>
