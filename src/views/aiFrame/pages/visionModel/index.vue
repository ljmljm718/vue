<script setup lang="ts">
import { chatThemePage } from '../../apis';

const pageMainTitle = ref<string>('智能视觉模型库V1.2.0');

// 左右两边内容是否折叠
const leftPanelCollapsed = ref<boolean>(false);
const rightPanelCollapsed = ref<boolean>(true);

/**
 * 左侧对话列表 start
 */
// 测试用数据
function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const testThemePage = async (pageSize: number) => {
  const len = 56;
  const item = { id: 'new_chat', theme: '新对话', model: 'Doubao-vision-pro-32k', message: [] };
  const res: any[] = [];
  const n = pageSize < len ? pageSize : len;
  for (let i = 0; i < n; ++i) {
    res.push({ ...item, id: item.id + i, message: [] });
  }
  await sleep(2000);
  return { list: res, total: len };
};

// 获取对话列表
const activedChatID = ref('');
const chatInfoList = ref<any[]>([]);
const chatInfoTotal = ref(0);
const chatPageSize = ref(20);
const loadingChatInfo = ref(false);

const getChatInfoList = async (pageSize: number = 20) => {
  // 正在请求中
  if (loadingChatInfo.value) {
    return;
  }
  loadingChatInfo.value = true;
  chatPageSize.value = pageSize;
  // const {list, total} = await chatThemePage({
  //   pageNo: 1,
  //   pageSize: 20,
  //   type: 'image-to-text'
  // });
  const { list, total } = await testThemePage(pageSize);
  if (!Array.isArray(list)) {
    return;
  }
  chatInfoList.value = list;
  activedChatID.value = list[0].id ? list[0].id : 'new_chat';
  chatInfoTotal.value = total;
  loadingChatInfo.value = false;
};
getChatInfoList();

// 点击某个对话
const handleChatInfoClick = (item: any) => {
  activedChatID.value = item.id;
};
// 删除对话
const handleDeleteChatTheme = () => {};

const handleContentBlur = () => {
  console.log('blur');
};
const handleContentKeyDown = () => {
  console.log('key down');
};

// 对话列表滚动事件
const themeRef = ref();
const handleThemeScroll = async () => {
  const themeContainer = document.getElementById('themeContainer');
  if (!themeContainer) {
    return;
  }
  const themeContainerHeight = themeContainer.clientHeight;
  const scrollMain = themeRef.value.wrapRef;
  const scrollMainScrollTop = scrollMain.scrollTop;
  const scrollMainHeight = scrollMain.clientHeight;
  if (
    scrollMainHeight + scrollMainScrollTop + 5 > themeContainerHeight &&
    chatInfoList.value.length < chatInfoTotal.value
  ) {
    await getChatInfoList(chatPageSize.value + 10);
  }
};

/**
 * 左侧对话列表 end
 */

/**
 * 中间 start
 */

// 发送按钮禁用
const disabledSendBtn = ref<boolean>(false);

// 自适应调整textarea高度
const adjustTextareaHeight = () => {
  const textarea = document.getElementById('textarea');
  if (!textarea) {
    return;
  }
  textarea.addEventListener('input', (e) => {
    const target = e.target as any;
    // 获取当前的 offsetHeight 和 scrollHeight
    // const currentOffsetHeight = target.offsetHeight;
    // const currentScrollHeight = target.scrollHeight;
    target.style.height = 'auto';
    target.style.height = Math.max(textarea.scrollHeight, 60) + 'px';
    console.log(
      '🚀 ~ textarea.addEventListener ~ Math.max(textarea.scrollHeight, 60):',
      Math.max(textarea.scrollHeight, 60)
    );
  });
};
onMounted(() => adjustTextareaHeight());

/**
 * 中间 end
 */

/**
 * 右侧参数设置 start
 */

// 右侧参数设置
const returnStream = ref(true);
const maxResLen = ref(1);

// 改变最大返回长度的响应函数
const handleInputChange = (val: any) => {
  const n = Number(val);
  if (Number.isInteger(n)) {
    maxResLen.value = n;
  } else {
    maxResLen.value = 1;
  }
};

/**
 * 右侧参数设置 end
 */
</script>
<template>
  <div class="relative h-full">
    <!-- left -->
    <div
      class="side-bar-frame transition-all left-side-bar-frame h-full shadow-md duration-200 z-30"
      :style="`left: ${leftPanelCollapsed ? '-256px' : '0'};`"
    >
      <div
        class="collapse-btn w-24px h-48px absolute right-[-33px]"
        :style="`top: calc(50% - 24px);transform: rotate(${leftPanelCollapsed ? '180deg' : '0'});`"
        @click="leftPanelCollapsed = !leftPanelCollapsed"
      ></div>
      <div
        class="new-chat-btn flex justify-center items-center text-white text-14px cursor-pointer select-none ml-20px"
      >
        <el-icon><Plus /></el-icon>
        <span class="pl-4px">新建对话</span>
      </div>
      <el-scrollbar
        style="height: calc(100% - 90px)"
        ref="themeRef"
        @scroll="handleThemeScroll"
        v-loading="loadingChatInfo"
      >
        <div id="themeContainer" class="w-full px-10px box-border">
          <div
            v-for="item in chatInfoList"
            :key="item.id"
            class="w-full h-60px rounded-8px px-16px flex flex-col justify-center space-y-6px box-border cursor-pointer relative"
            :class="[activedChatID === item.id ? 'active-chat-info-item' : '']"
            style="border: 1px solid transparent"
            @click="handleChatInfoClick(item)"
          >
            <div
              class="text-14px w-[180px] line-clamp-1"
              :contenteditable="activedChatID === item.id"
              @blur="handleContentBlur"
              @keydown="handleContentKeyDown"
            >
              {{ item.theme || '新对话' }}
            </div>
            <div class="text-[#999999] text-12px">{{ item.model }}</div>
            <div class="absolute right-1 top-0">
              <el-icon
                class="p-3px text-10px hover:bg-red text-#666 hover:text-white rounded-sm transition-all scale-[.7]"
                @click="handleDeleteChatTheme(item.id)"
              >
                <Close />
              </el-icon>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- main content -->
    <div
      class="absolute right-0 h-full z-10 transition-all duration-200 ai-show-main-container"
      :style="`width: ${leftPanelCollapsed ? '100%' : 'calc(100% - 256px)'};`"
    >
      <!-- title -->
      <div
        class="params-config-btn flex items-center space-x-8px text-14px px-16px py-8px rounded-full cursor-pointer absolute right-5 top-3"
        @click="rightPanelCollapsed = false"
      >
        <el-icon><Operation /></el-icon>
        <div>参数设置</div>
      </div>
      <div class="h-64px px-24px box-border flex items-center text-18px font-bold">
        {{ pageMainTitle }}
      </div>
      <!-- content -->
      <div
        class="2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px] mx-auto flex flex-col"
        style="height: calc(100% - 80px)"
      >
        <div class="grow min-h-100px relative" style="flex: 1 1 auto">
          <el-scrollbar class="hide-scrollbar" ref="chatScrollIns">
            <div class="w-full flex flex-col items-center mb-10px">
              <div class="flex items-center space-x-24px w-full xl:pt-[4vh] pt-0">
                <div class="w-48px h-48px extra-logo"></div>
                <div class="text-36px font-bold line-clamp-1" style="width: calc(100% - 54px)">
                  欢迎使用，智慧农业图文解析模型
                </div>
              </div>
              <div class="w-full 2xl:mt-48px mt-20px flex justify-evenly">
                <div class="w-[31%] aspect-.9 card-bg-1 p-22px box-border">
                  <div class="text-[#333] dark:text-[#fff] text-18px font-bold">
                    识别图像中的内容
                  </div>
                  <div class="sm:hidden md:hidden lg:hidden xl:block">
                    <div class="text-[#999] text-14px mt-4px line-clamp-1">
                      识别图像中作物种类，判断生长情况
                    </div>
                  </div>
                </div>
                <div class="w-[31%] aspect-.9 card-bg-2 p-22px box-border">
                  <div class="text-[#333] dark:text-[#fff] text-18px font-bold">
                    总结图片中的内容
                  </div>
                  <div class="sm:hidden md:hidden lg:hidden xl:block">
                    <div class="text-[#999] text-14px mt-4px line-clamp-1">
                      识别图片中病虫害并给出防治方法
                    </div>
                  </div>
                </div>
                <div class="w-[31%] aspect-.9 card-bg-3 p-22px box-border">
                  <div class="text-[#333] dark:text-[#fff] text-18px font-bold">
                    提取图片中的文字
                  </div>
                  <div class="sm:hidden md:hidden lg:hidden xl:block">
                    <div class="text-[#999] text-14px mt-4px line-clamp-1">
                      识别图片中农资说明上的文字
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="w-full absolute left-0 bottom-0 h-16px message-bottom-mask z-10"></div>
        </div>
        <div
          class="input-outer-container p-2px rounded-16px shadow-md relative"
          style="flex: 0 0 auto"
        >
          <div class="rounded-16px p-8px bg-white dark:bg-#121212 flex items-end overflow-hidden">
            <textarea class="ai-show-textarea grow" id="textarea" rows="2" wrap="soft"></textarea>
            <div>
              <div
                v-loading="disabledSendBtn"
                :class="`w-48px h-32px ${disabledSendBtn ? 'disabled-send' : 'send-btn'} cursor-pointer`"
                @click="handleSendMsg(null)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- right -->
    <div
      class="side-bar-frame right-side-bar-frame z-30 h-full shadow-md transition-all duration-200"
      :style="`right: ${rightPanelCollapsed ? '-256px' : '0'};`"
    >
      <div
        class="flex items-center justify-between pb-18px"
        style="border-bottom: 1px solid #66666626; padding: 25px"
      >
        <div class="font-bold">参数配置</div>
        <el-icon
          class="p-1 hover:bg-red hover:text-white rounded-sm transition-all"
          @click="rightPanelCollapsed = true"
        >
          <Close />
        </el-icon>
      </div>
      <div class="p-[16px]">
        <div class="text-[14px]">是否流式返回</div>
        <el-switch v-model="returnStream" class="mt-[16px]" />
        <div class="mt-[16px] text-[14px]">最大返回长度</div>
        <div class="flex mt-[16px]">
          <el-slider v-model="maxResLen" :max="4096" :min="10" />
          <el-input
            v-model="maxResLen"
            style="width: 96px"
            input-style="font-size: 14px"
            @input="handleInputChange"
            class="ml-[16px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ai-dark {
  @for $i from 1 through 6 {
    .card-bg-#{$i} {
      background-image: url(../../assets/vision-init-#{$i}-dark.png);
      background-size: 100% 100%;
    }
  }
}

.ai-light {
  @for $i from 1 through 6 {
    .card-bg-#{$i} {
      background-image: url(../../assets/vision-init-#{$i}.png);
      background-size: 100% 100%;
    }
  }
}

// 不发送和发送按钮
.disabled-send {
  background-image: url(../../assets/disabledSend.png);
  background-size: 100% 100%;
}
.send-btn {
  background-image: url(../../assets/sendBtn.png);
  background-size: 100% 100%;
}

// el-switch底色
:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #615ced;
  background-color: #615ced;
}

// el-slider按钮边框颜色
:deep(.el-slider__button) {
  border-color: #615ced;
}

// el-slider进度条底色
:deep(.el-slider__bar) {
  background-color: #615ced;
}
</style>
