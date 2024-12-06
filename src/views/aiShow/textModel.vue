<script setup lang="ts">
import avatar from './assets/avatar.png';
import userAvatar from './assets/userAvatar.png';
import { marked } from 'marked';
import request from '@/config/axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getAccessToken } from '@/utils/auth';

const getCollectionSearch = async (data: any) => {
  return await request.post({ url: `/agriculture/collection/search`, data });
};

const getCollectionList = async (params: any) => {
  return await request.get({ url: `/agriculture/collection/get-collection-list`, params });
};

const getCollectionData = async () => {
  const res = await getCollectionList({});
  console.log('getCollectionData res', res);
  if (!Array.isArray(res)) return;
  knowledgeLibOptions.value = res;
  if (res.length === 0) return;
  knowledgeLib.value = res[0].collectionId;
};
getCollectionData();

const uuid = (length = 8, chars?) => {
  let result = '';
  const charsString = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
};

const sideBarCollapsed = ref<boolean>(false);
const chatList = ref<any[]>([]);
const questionText = ref<string>('');
const remindArr = ref<any[]>([
  { text: '智慧农业AI助手能为您做什么？' },
  { text: '水肥一体化灌溉流程需要注意什么？' },
  { text: '农作物病虫害知识库文档编写？' }
]);

// 参数配置
const knowledgeLib = ref<string>(''); // 知识库
const knowledgeLibOptions = ref<any[]>([]);
const modelSelected = ref<string>('Doubao-lite-32k'); // 大模型
const modelOptions = ref<any[]>([{ label: 'Doubao-lite-32k', value: 'Doubao-lite-32k' }]);
const enabledflowRes = ref<boolean>(true); // 开启流式返回
const maxResLength = ref<number>(10); // 最大返回长度

// 发送消息
const disabledSendBtn = ref<boolean>(false);
const handleSendMsg = async (text) => {
  const textarea = document.querySelector('textarea');
  if (!text) text = textarea.value;
  fullTextArea(true);
  if (!text) return;
  if (disabledSendBtn.value) return;
  disabledSendBtn.value = true;
  chatList.value.push({ role: 'user', text: text });
  scollToBottom();
  // TODO 返回请求结果
  const chatId = uuid();
  chatList.value.push({ id: chatId, role: 'robot', text: '' });
  const res = await getCollectionSearch({
    collectionId: knowledgeLib.value,
    query: text,
    model: modelSelected.value,
    stream: false,
    max_new_tokens: maxResLength.value
  }).catch(() => {
    disabledSendBtn.value = false;
    const activeItem = chatList.value.find((item) => item.id === chatId);
    activeItem.text = '请求失败，请稍后重试';
  });
  const flowOutput = (
    innerText = '### 你好，我是智慧农业AI助手\n#### 可以完成智能问答，文档编写，代码生成等多种任务\n##### 请输入你的问题'
  ) => {
    if (!innerText) {
      disabledSendBtn.value = false;
      return;
    }
    setTimeout(() => {
      const activeItem = chatList.value.find((item) => item.id === chatId);
      const textArr = innerText.split('');
      const putText = textArr.shift();
      activeItem.text += putText;
      if (!enabledflowRes.value) {
        activeItem.text = innerText;
        disabledSendBtn.value = false;
        scollToBottom();
        return;
      }
      flowOutput(textArr.join(''));
      scollToBottom();
    }, 10);
  };
  flowOutput(res.toString());
  scollToBottom();
  questionText.value = '';
  textarea.value = '';
};
const chatScrollIns = ref();
const scollToBottom = () => {
  if (!chatScrollIns.value) return;
  nextTick(() => {
    chatScrollIns.value.wrapRef.scrollTop = chatScrollIns.value.wrapRef.scrollHeight;
  });
};

// 处理textarea输入框
const handleTextChange = () => {
  const textarea = document.querySelector('textarea');
  const inputContainer = document.querySelector('#inputContainer');
  textarea.style.height = '30px';
  textarea.addEventListener('input', (e) => {
    if (inputContainer.classList.contains('full-screen-text-container')) {
      return (textarea.style.height = 'calc(100% - 30px)');
    }
    textarea.style.height = '30px';
    const text = e.target.value;
    questionText.value = text;
    if (!text) return (textarea.style.height = '30px');
    if (e.target.scrollHeight > 50) return (textarea.style.height = '50px');
    textarea.style.height = e.target.scrollHeight + 'px';
  });
};
onMounted(() => {
  handleTextChange();
});

const fullTextArea = (forceHide = false) => {
  const inputContainer = document.querySelector('#inputContainer') as HTMLElement;
  const textarea = document.querySelector('textarea') as HTMLElement;
  if (inputContainer.classList.contains('full-screen-text-container') || forceHide) {
    // 当前是展开状态
    inputContainer.classList.remove('full-screen-text-container');
    textarea.style.height = '50px';
  } else {
    inputContainer.classList.add('full-screen-text-container');
    textarea.style.height = inputContainer.style.height + 'px';
  }
};
</script>
<template>
  <!--侧栏宽度 74px -->
  <div
    class="w-[256px] bg-[#F2F4FA] relative"
    :style="`border-right: 1px solid #E0E3EB;width:${sideBarCollapsed ? '0' : '256px'};`"
  >
    <div
      class="h-[63px] px-[24px] flex items-center font-bold"
      style="border-bottom: 1px solid #e0e3eb"
      v-show="!sideBarCollapsed"
    >
      参数配置
    </div>
    <div
      style="height: calc(100% - 63px)"
      class="px-[24px] py-[16px] text-14px"
      v-show="!sideBarCollapsed"
    >
      <div class="mb-[8px]">知识库</div>
      <div>
        <el-select v-model="knowledgeLib" placeholder="请选择知识库" size="large" type="primary">
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
        <el-select v-model="modelSelected" placeholder="请选择大模型" type="primary" size="large">
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
        <el-slider v-model="maxResLength" :max="4096" :min="10" />
        <div class="bg-white px-3 py-1 shadow-sm ml-4 w-6 flex justify-center">
          {{ maxResLength }}
        </div>
        <!-- <el-input-number v-model="maxResLength" :min="1" :max="10000" /> -->
      </div>
    </div>
    <div
      class="collapse-btn w-24px h-48px absolute right-[-33px]"
      :style="`top: calc(50% - 24px);transform: rotate(${sideBarCollapsed ? '180deg' : '0'});`"
      @click="sideBarCollapsed = !sideBarCollapsed"
    ></div>
  </div>
  <div :style="`width: calc(100% - ${sideBarCollapsed ? '74px' : '330px'})`">
    <div
      class="h-[63px] px-[24px] flex items-center bg-[#F2F4FA] font-bold"
      style="border-bottom: 1px solid #e0e3eb"
    >
      智能问答
    </div>
    <div class="bg-[#F5F6FA] flex justify-center" style="height: calc(100% - 63px)">
      <div
        class="relative h-full flex flex-col pb-36px pt-8px box-border 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px]"
      >
        <div class="mt-[12px] grow" style="max-height: calc(100% - 108px)">
          <div v-show="chatList.length === 0" class="w-full pt-60px h-full">
            <el-scrollbar>
              <div class="w-full flex flex-col items-center">
                <div class="big-logo w-180px h-140px"></div>
                <div class="text-36px text-[#333] flex flex-col items-center">
                  <div>您好,我是</div>
                  <div>智慧农业AI助手</div>
                </div>
                <div class="space-y-16px w-600px mt-18px py-30px">
                  <div
                    v-for="item in remindArr"
                    :key="item.text"
                    @click="handleSendMsg(item.text)"
                    class="flex justify-between items-center bg-white px-[21px] h-[56px] cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div>{{ item.text }}</div>
                    <div class="arrow-bg w-[18px] h-[14px]"></div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div v-show="chatList.length !== 0" class="w-full pt-10px h-full">
            <el-scrollbar ref="chatScrollIns">
              <div class="space-y-[24px] pb-10px">
                <div
                  class="flex items-start space-x-[12px] pl-8px box-border"
                  v-for="(item, index) in chatList"
                  :key="index"
                >
                  <div class="w-32px h-32px rounded-1 bg-blue">
                    <img
                      :src="item.role === 'robot' ? avatar : item.role === 'user' ? userAvatar : ''"
                    />
                  </div>
                  <div
                    style="width: calc(100% - 80px)"
                    class="bg-white rounded-1 px-16px box-border text-wrap"
                    :innerHTML="marked.parse(item.text)"
                  ></div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div
          class="relative min-h-56px mt-12px rounded-2 2xl:w-[1000px] xl:w-[848px] bg-white lg:w-[600px] md:w-[400px] sm:w-[400px]"
          style="border: 2px solid #00c784"
          id="inputContainer"
        >
          <textarea
            id="textarea"
            cols="30"
            rows="2"
            placeholder="请输入问题，我可以完成智能问答、文档编写、代码生成等多种任务"
            wrap="soft"
          ></textarea>
          <!-- <el-input
            v-model="questionText"
            type="primary"
            clearable
            class="h-full"
            placeholder="请输入问题，我可以完成智能问答、文档编写、代码生成等多种任务"
            @keyup.enter="handleSendMsg()"
          /> -->
          <div
            v-loading="disabledSendBtn"
            :class="`z-20 absolute right-13px bottom-12px w-48px h-32px ${disabledSendBtn ? 'disabled-send' : 'send-btn'} cursor-pointer`"
            @click="handleSendMsg(null)"
          ></div>
          <div
            v-if="questionText"
            class="max-btn z-20 absolute right-12px top-10px w-14px h-14px cursor-pointer"
            @click="fullTextArea()"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.full-screen-text-container {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
}
textarea {
  background-color: transparent;
  height: 92%;
  margin-top: 3px;
  color: #333;
  width: calc(100% - 95px);
  resize: none;
  padding: 10px 15px;
  line-height: 22px;
  font-size: 16px;
  border: none !important;
  outline: none !important;
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
.collapse-btn {
  background-image: url(./assets/collapseBtn.png);
  background-size: 100% 100%;
}

.max-btn {
  background-image: url(./assets/max.png);
  background-size: 100% 100%;
}

.big-logo {
  background-image: url(./assets/bigLogo.png);
  background-size: 100% 100%;
}

.disabled-send {
  background-image: url(./assets/disabledSend.png);
  background-size: 100% 100%;
}

.send-btn {
  background-image: url(./assets/sendBtn.png);
  background-size: 100% 100%;
}

.arrow-bg {
  background-image: url(./assets/arrow.png);
  background-size: 100% 100%;
}
</style>
