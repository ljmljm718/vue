<script setup lang="ts">
import { getCollectionList, chatThemeCreate } from '../../apis';
import RadioButton from './radioButton.vue';

const pageMainTitle = ref<string>('智能文本模型库V1.2.0');
// 左右两边内容是否折叠
const leftPanelCollapsed = ref<boolean>(false);
const rightPanelCollapsed = ref<boolean>(true);

// 消息记录滚动到最底下
const chatScrollIns = ref();
const scollToBottom = () => {
  if (!chatScrollIns.value) return;
  nextTick(() => {
    chatScrollIns.value.wrapRef.scrollTop = chatScrollIns.value.wrapRef.scrollHeight;
  });
};

// 左侧对话列表
const activedChatID = ref<string>('');
const chatInfoList = ref<any[]>([]);
const getChatInfoList = async () => {
  chatInfoList.value = [
    { id: 'new_chat', theme: '新对话', model: 'Doubao-vision-pro-32k', message: [] }
  ];
  activedChatID.value = 'new_chat';
};
getChatInfoList();
// 点击某个对话
const handleChatInfoClick = () => {};
// 删除对话
const handleDeleteChatTheme = () => {};

const handleContentBlur = () => {};
const handleContentKeyDown = () => {};

// ============== 配置项 ===============
// 获取知识库选择列表
const knowledgeLib = ref<string>(''); // 知识库
const knowledgeLibOptions = ref<any[]>([]);
const getCollectionData = async () => {
  const res = await getCollectionList({});
  console.log('获取知识库选择列表 res', res);
  if (!Array.isArray(res)) return;
  knowledgeLibOptions.value = res;
  if (res.length === 0) return;
  knowledgeLib.value = res[0].collectionId;
};
getCollectionData();

const modelSelected = ref<string>('Doubao-lite-32k'); // 大模型
const modelOptions = ref<any[]>([
  { label: 'Doubao-pro-32k', value: 'Doubao-pro-32k' },
  { label: 'Doubao-pro-128k', value: 'Doubao-pro-128k' },
  { label: 'Doubao-pro-256k', value: 'Doubao-pro-256k' },
  { label: 'Doubao-lite-32k', value: 'Doubao-lite-32k' },
  { label: 'Doubao-lite-128k', value: 'Doubao-lite-128k' }
]);

const enabledflowRes = ref<boolean>(true); // 开启流式返回
const maxResLength = ref<number>(10); // 最大返回长度

// 自适应调整textarea高度
const adjustTextareaHeight = () => {
  const textarea = document.getElementById('textarea');
  textarea.addEventListener('input', (e) => {
    const target = e.target;
    // 获取当前的 offsetHeight 和 scrollHeight
    const currentOffsetHeight = target.offsetHeight;
    const currentScrollHeight = target.scrollHeight;
    target.style.height = 'auto';
    target.style.height = Math.max(textarea.scrollHeight, 60) + 'px';
    console.log(
      '🚀 ~ textarea.addEventListener ~ Math.max(textarea.scrollHeight, 60):',
      Math.max(textarea.scrollHeight, 60)
    );
  });
};
onMounted(() => adjustTextareaHeight());

// 语音功能正在进行，阻止消息发送
const radioRecording = ref<boolean>(false);
const disabledSendBtn = ref<boolean>(false);
const handleRadioRecoOutput = () => {};

// 发送消息
const handleSendMsg = async (text) => {};

const messageList = computed(() => {
  const activeChatInfo = chatInfoList.value.find((item) => item.id === activedChatID.value);
  if (!activeChatInfo) return [];
  return activeChatInfo.message;
});
</script>
<template>
  <div class="relative h-full">
    <div
      class="side-bar-frame transition-all left-side-bar-frame h-full shadow-md duration-200px z-30"
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
      <el-scrollbar style="height: calc(100% - 90px)">
        <div class="w-full px-10px box-border">
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
    <div
      class="absolute right-0 h-full z-10 transition-all duration-200px ai-show-main-container"
      :style="`width: ${leftPanelCollapsed ? '100%' : 'calc(100% - 256px)'};`"
    >
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
      <div
        class="2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px] mx-auto flex flex-col"
        style="height: calc(100% - 80px)"
      >
        <div class="grow min-h-100px relative" style="flex: 1 1 auto">
          <el-scrollbar class="hide-scrollbar" ref="chatScrollIns">
            <div class="w-full flex flex-col items-center mb-10px" v-if="messageList.length === 0">
              <div class="flex items-center space-x-24px w-full xl:pt-[4vh] pt-0">
                <div class="w-48px h-48px extra-logo"></div>
                <div
                  class="text-36px font-bold line-clamp-1"
                  style="width: calc(100% - 54px)"
                  title="您好，我是智慧农业AI助手"
                >
                  您好，我是智慧农业AI助手
                </div>
              </div>
              <div class="w-full 2xl:mt-48px mt-20px flex justify-evenly">
                <div class="w-[31%] aspect-.9 card-bg-1 p-22px box-border">
                  <div class="text-[#333] dark:text-[#fff] text-18px font-bold">智能问答</div>
                  <div class="sm:hidden md:hidden lg:hidden xl:block">
                    <div class="text-[#999] text-14px mt-4px line-clamp-1">
                      帮您快速获取信息，解决问题
                    </div>
                  </div>
                </div>
                <div class="w-[31%] aspect-.9 card-bg-2 p-22px box-border">
                  <div class="text-[#333] dark:text-[#fff] text-18px font-bold">文档编写</div>
                  <div class="sm:hidden md:hidden lg:hidden xl:block">
                    <div class="text-[#999] text-14px mt-4px line-clamp-1">
                      输入需求，快速帮您生成文档
                    </div>
                  </div>
                </div>
                <div class="w-[31%] aspect-.9 card-bg-3 p-22px box-border">
                  <div class="text-[#333] dark:text-[#fff] text-18px font-bold">代码生成</div>
                  <div class="sm:hidden md:hidden lg:hidden xl:block">
                    <div class="text-[#999] text-14px mt-4px line-clamp-1">
                      根据描述生成代码框架及内容
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="item in messageList" :key="item">{{ item }}</div>
          </el-scrollbar>
          <div class="w-full absolute left-0 bottom-0 h-16px message-bottom-mask z-10"></div>
        </div>
        <div
          class="input-outer-container p-2px rounded-16px shadow-md relative"
          style="flex: 0 0 auto"
        >
          <div class="rounded-16px p-8px bg-white dark:bg-#121212 flex items-end overflow-hidden">
            <textarea class="ai-show-textarea grow" id="textarea" rows="2" wrap="soft"></textarea>
            <div class="mx-8px mb-4px">
              <RadioButton
                v-model:disableSend="radioRecording"
                :generateTexting="disabledSendBtn"
                @output="handleRadioRecoOutput"
              />
            </div>
            <div>
              <div
                v-loading="disabledSendBtn"
                :class="`w-48px h-32px ${disabledSendBtn || radioRecording ? 'disabled-send' : 'send-btn'} cursor-pointer`"
                @click="handleSendMsg(null)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="side-bar-frame right-side-bar-frame z-30 h-full shadow-md transition-all duration-200px"
      :style="`right: ${rightPanelCollapsed ? '-256px' : '0'};`"
    >
      <div
        class="flex items-center justify-between pb-18px"
        style="border-bottom: 1px solid #66666626; padding: 25px 25px 16px 25px"
      >
        <div class="font-bold">参数设置</div>
        <el-icon
          class="p-1 hover:bg-red hover:text-white rounded-sm transition-all"
          @click="rightPanelCollapsed = true"
        >
          <Close />
        </el-icon>
      </div>
      <el-scrollbar height="calc(100% - 80px)">
        <div style="height: calc(100% - 63px)" class="py-[16px] text-14px px-25px">
          <div class="mb-[8px]">知识库</div>
          <div>
            <el-select
              v-model="knowledgeLib"
              placeholder="请选择知识库"
              size="large"
              type="primary"
            >
              <el-option
                v-for="item in knowledgeLibOptions"
                :label="item.collectionName"
                :value="item.collectionId"
                :key="item.collectionId"
              />
            </el-select>
          </div>
          <div class="mb-[8px] mt-[16px]">大模型</div>
          <div>
            <el-select
              v-model="modelSelected"
              placeholder="请选择大模型"
              type="primary"
              size="large"
            >
              <el-option
                v-for="item in modelOptions"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </div>
          <div class="mb-[8px] mt-[16px]">是否流式返回</div>
          <div><el-switch v-model="enabledflowRes" size="large" /></div>
          <div class="mb-[8px] mt-[16px]">最大返回长度</div>
          <div class="!text-[#000] flex items-center">
            <div class="w-100px mr-10px">
              <el-slider v-model="maxResLength" :max="4096" :min="10" />
            </div>

            <div class="!w-100px">
              <el-input-number v-model="maxResLength" class="!w-100px" />
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<style scoped lang="scss">
.ai-dark {
  @for $i from 1 through 3 {
    .card-bg-#{$i} {
      background-image: url(../../assets/darkCardBg#{$i}.png);
      background-size: 100% 100%;
    }
  }
}

.ai-light {
  @for $i from 1 through 3 {
    .card-bg-#{$i} {
      background-image: url(../../assets/cardBg#{$i}.png);
      background-size: 100% 100%;
    }
  }
}
:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #615ced;
  background-color: #615ced;
}
:deep(.el-slider__button) {
  border: 2px solid #615ced;
}
:deep(.el-slider__bar) {
  background-color: #615ced;
}
.disabled-send {
  background-image: url(../../assets/disabledSend.png);
  background-size: 100% 100%;
}

.send-btn {
  background-image: url(../../assets/sendBtn.png);
  background-size: 100% 100%;
}

.arrow-bg {
  background-image: url(../../assets/arrow.png);
  background-size: 100% 100%;
}

.max-btn {
  background-image: url(../../assets/max.png);
  background-size: 100% 100%;
}

.big-logo {
  background-image: url(../../assets/bigLogo.png);
  background-size: 100% 100%;
}

:deep(.hide-scrollbar .el-scrollbar__bar.is-vertical) {
  display: none;
}
</style>
