<template>
  <div class="ai-show-outer-frame" :class="getOuterFrameClass">
    <div class="w-full h-full flex relative">
      <div class="w-80px flex flex-col items-center text-white">
        <div class="logo w-28px h-32px mt-32px"></div>
        <div class="text-[16px] leading-[25px] text-center mt-11px">AI助手</div>
        <div class="flex flex-col items-center md:pt-30px xl:pt-60px space-y-[50px]">
          <div
            v-for="item in sideMenus"
            :key="item.key"
            @click="handleMenuItemClick(item)"
            class="flex flex-col items-center"
          >
            <div
              :class="`
                ${routeKeyWord === item.key ? 'show-mask-wrapper' : ''}
                w-48px h-48px flex items-center justify-center
              `"
            >
              <div
                :class="`
                  ${routeKeyWord === item.key ? 'selected-' : ''}icon-${item.icon}
                  w-24px h-24px ${['text', 'vision'].includes(item.key) ? 'top-[2px]' : ''}
                `"
                class="relative"
              ></div>
            </div>
            <div
              class="text-[12px] mt-12px"
              :style="`font-weight: ${routeKeyWord === item.key ? 'bold' : '500'};`"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="fixed bottom-4 left-2">
        <ThemeSwitch v-model="enableDarkModel" @change="handleDarkModeSwitchChange" />
      </div>
      <div class="ai-show-main-frame h-full box-border" style="width: calc(100% - 80px)">
        <div
          class="w-full h-full overflow-hidden"
          style="border-radius: 12px 2px 2px 12px; background-color: var(--base-bg-color)"
        >
          <router-view v-if="routerAlive">
            <template #default="{ Component, route }">
              <keep-alive>
                <component :is="Component" :key="route.fullPath" />
              </keep-alive>
            </template>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAiFrameStore } from './storage';
import ThemeSwitch from './components/themeSwitch/index.vue';

const storage = useAiFrameStore();
const route = useRoute();
const router = useRouter();

const handleMenuItemClick = (item) => {
  router.push(item.key);
};

const routeKeyWord = computed(() => {
  const routeArr = route.path.split('/');
  if (routeArr.length === 0) return '';
  return routeArr[routeArr.length - 1];
});

defineOptions({ name: 'AiLayout' });
const getOuterFrameClass = computed(() => {
  return storage.getEnableDarkMode ? 'ai-dark dark' : 'ai-light'; // ai-light
});

const enableDarkModel = ref<boolean>(false);
const handleDarkModeSwitchChange = (mode) => {
  console.log('🚀 ~ handleDarkModeSwitchChange ~ mode:', mode);
  storage.setEnableDarkMode(mode);
};

//region 无感刷新
const routerAlive = ref(true);
// 无感刷新，防止出现页面闪烁白屏
const reload = () => {
  routerAlive.value = false;
  nextTick(() => (routerAlive.value = true));
};

// 侧边栏菜单列表
const sideMenus = ref<any[]>([
  { icon: 1, key: 'text', label: '文本模型' },
  { icon: 2, key: 'vision', label: '视觉模型' },
  // { icon: 3, key: 'voice', label: '语音模型' },
  { icon: 4, key: 'knowledge', label: '知识库' }
]);
const showedModel = ref<string>('textModel');
</script>
<style lang="scss">
/* 亮色模式变量 */
.ai-show-outer-frame.ai-light {
  --user-message-bg: #e0dfff;
  --system-message-bg: white;
  --el-color-primary: #615ced;
  background-image: linear-gradient(to right, transparent, #ffffffd0, #ffffffd0, #ffffffd0),
    linear-gradient(to top, #4378ff, #8366e1, #9362da);
  color: black;
  --base-bg-color: #ffffff;
  .show-mask-wrapper {
    background-image: url(./assets/btnMask.svg);
    background-size: 100% 100%;
  }
  .side-bar-frame {
    background-color: var(--base-bg-color);
  }
  /** 折叠按钮 */
  .collapse-btn {
    background-image: url(./assets/collapseBtn.svg);
    background-size: 100% 100%;
  }

  /** 主体部分样式 */
  .ai-show-main-container {
    background: linear-gradient(to top, #f6f7fb, #f6f7fb, #f6f7fb, #ededfd);
  }

  .params-config-btn {
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  /** 对话列表actived对话项 */
  .active-chat-info-item {
    border: 1px solid #615ced !important;
    background-image: linear-gradient(to top, #fff, #fafafe, #f0f0fe);
  }

  /** 对话记录遮罩 */
  .message-bottom-mask {
    background: linear-gradient(to top, #f6f7fb, #f6f7fb, #f6f7fb00);
  }

  .input-outer-container {
    width: calc(100% - 90px);
    left: 44px;
    background: white;
  }
}

/** 新建对话按钮 */
.new-chat-btn {
  width: 224px;
  height: 40px;
  background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
  border-radius: 20px;
  margin: 24px 16px 16px 16px;
}

/* 暗色模式变量 */
.ai-show-outer-frame.ai-dark {
  --user-message-bg: #605dee;
  --system-message-bg: linear-gradient(to right, #2a2e4f, #252b42, #1f2532);
  --el-color-primary: #615ced;
  background-image: linear-gradient(to right, transparent, #000000d0, #000000d0, #000000d0),
    linear-gradient(to top, #23304a, #282e48, #2d2d46);
  color: white;
  --base-bg-color: #1f2531;
  .show-mask-wrapper {
    background-image: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
    background-size: 100% 100%;
    border-radius: 999px;
  }
  .side-bar-frame {
    background-color: var(--base-bg-color);
  }
  /** 折叠按钮 */
  .collapse-btn {
    background-image: url(./assets/darkCollapseBtn.svg);
    background-size: 100% 100%;
  }
  /** 主体部分样式 */
  .ai-show-main-container {
    background: linear-gradient(to top, rgba(147, 98, 218, 0) 0%, rgba(67, 120, 255, 0.3) 100%),
      #0f121b;
  }

  .params-config-btn {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  /** 对话列表actived对话项 */
  .active-chat-info-item {
    box-shadow: inset 0px 0px 16px 0px rgba(97, 92, 237, 0.5);
    border-radius: 8px;
    border: 1px solid #615ced;
    background: none;
  }

  /** 输入框外层样式 */
  .input-outer-container {
    width: calc(100% - 90px);
    left: 44px;
    background: linear-gradient(to right, #4378ff, #9362da);
  }

  /** 对话记录遮罩 */
  .message-bottom-mask {
    background: linear-gradient(to top, #121727, #121727, #12172700);
  }
}

.left-side-bar-frame {
  position: absolute;
  width: 256px;
  left: 0px;
}

.right-side-bar-frame {
  position: absolute;
  width: 256px;
  right: 0px;
}

.ai-show-outer-frame {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.ai-show-main-frame {
  padding: 8px 8px 8px 0;
}

.ai-show-textarea {
  resize: none;
  height: 60px;
  min-height: 60px;
  max-height: 96px;
  overflow-y: hidden;
  border: 0 !important;
  box-shadow: none !important;
  outline: none;
  font-size: 16px;
}

.ai-show-textarea {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
}

textarea::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
textarea::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
textarea::-webkit-scrollbar-track {
  background-color: transparent;
}

/** 大号logo */
.extra-logo {
  background-image: url(./assets/extraLogo.svg);
  background-size: 100% 100%;
}
</style>
<style scoped lang="scss">
/* 图标引入 */
.logo {
  background-image: url(./assets/logo.svg);
  background-size: 100% 100%;
}

@for $i from 1 through 4 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.svg);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .selected-icon-#{$i} {
    background-image: url(./assets/selectedIcon#{$i}.svg);
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }
}

.ai-side-bar {
  background: linear-gradient(to top, #b5bbf480, #ffffff, #c2ece380);
}
</style>
