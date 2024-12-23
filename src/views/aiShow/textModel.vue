<script setup lang="ts">
import avatar from './assets/avatar.png';
import userAvatar from './assets/userAvatar.png';
import { marked } from 'marked';
import request from '@/config/axios';
import { throttle } from 'lodash-es';
import { record_start, record_upload } from '@/views/aiShow/utils';
import {
  chatThemeCreate,
  chatThemePage,
  chatHistoryPage,
  chatThemeDelete,
  putUpdateChatTheme
} from './api';
import RadioButton from './components//radioButton.vue';

const getCollectionSearch = async (data: any) => {
  return await request.post({ url: `/agriculture/collection/search`, data });
};

const getCollectionList = async (params: any) => {
  return await request.get({ url: `/agriculture/collection/get-collection-list`, params });
};

const selectEmbeddingModel = async (params: any) => {
  return await request.get({ url: `/agriculture/collection/select-embedding-model`, params });
};

const asr = async (params: any) => {
  return await request.get({ url: `/agriculture/asr/asr`, params });
};

// 获取知识库选择列表
const getCollectionData = async () => {
  const res = await getCollectionList({});
  console.log('获取知识库选择列表 res', res);
  if (!Array.isArray(res)) return;
  knowledgeLibOptions.value = res;
  if (res.length === 0) return;
  knowledgeLib.value = res[0].collectionId;
};
getCollectionData();

// 随机ID
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
// 语音识别输出函数
const handleRadioTextOutput = (text: string) => {
  console.log('语音识别结果 text =>', text);
  const textarea = document.querySelector('textarea');
  questionText.value = text;
  textarea.value = text;
};
const remindArr = ref<any[]>([
  { text: '智慧农业AI助手能为您做什么？' },
  { text: '水肥一体化灌溉流程需要注意什么？' },
  { text: '农作物病虫害知识库文档编写？' }
]);

// 参数配置
const knowledgeLib = ref<string>(''); // 知识库
const knowledgeLibOptions = ref<any[]>([]);
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

// 发送消息
const disabledSendBtn = ref<boolean>(false);
const handleSendMsg = async (text) => {
  // if (!knowledgeLib.value) return ElMessage.warning('请先选择知识库!');
  if (!modelSelected.value) return ElMessage.warning('请先选择模型！');
  const textarea = document.querySelector('textarea');
  if (!text) text = textarea.value;
  if (!text) return;
  radioRecording.value = true;
  const activeChatInfo = chatInfoList.value.find((item) => item.id === activeChatID.value);
  if (activeChatID.value === 'new_chat') {
    // 如果 id 为 new_chat，说明没有创建主题还，请求创建主题
    const data = await chatThemeCreate({
      collectionId: knowledgeLib.value,
      model: modelSelected.value,
      theme: text,
      type: 'text'
    });
    activeChatInfo.id = data;
    activeChatInfo.theme = text;
    activeChatID.value = data;
  }
  fullTextArea(true);
  if (!text) return;
  if (disabledSendBtn.value) return;
  disabledSendBtn.value = true;
  chatList.value.push({ role: 'user', text: text });
  activeChatInfo.message.push({ role: 'user', text: text });
  scollToBottom();
  // TODO 返回请求结果
  const chatId = uuid();
  chatList.value.push({ id: chatId, role: 'system', text: '' });
  activeChatInfo.message.push({ id: chatId, role: 'system', text: '' });
  const res = await getCollectionSearch({
    collectionId: knowledgeLib.value,
    query: text,
    model: modelSelected.value,
    themeId: activeChatID.value,
    stream: false,
    maxNewTokens: maxResLength.value
  }).catch(() => {
    disabledSendBtn.value = false;
    const activeItem = chatList.value.find((item) => item.id === chatId);
    const _activeItem = activeChatInfo.message.find((item) => item.id === chatId);
    activeItem.text = '请求失败，请稍后重试';
    _activeItem.text = '请求失败，请稍后重试';
    radioRecording.value = false;
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
      const _activeItem = activeChatInfo.message.find((item) => item.id === chatId);
      const textArr = innerText.split('');
      const putText = textArr.shift();
      activeItem.text += putText;
      _activeItem.text += putText;
      if (!enabledflowRes.value) {
        activeItem.text = innerText;
        _activeItem.text = innerText;
        disabledSendBtn.value = false;
        scollToBottom();
        return;
      }
      flowOutput(textArr.join(''));
      scollToBottom();
    }, 10);
  };
  if (res) flowOutput(res.toString());
  scollToBottom();
  questionText.value = '';
  textarea.value = '';
  radioRecording.value = false;
};

// 消息记录滚动到最底下
const chatScrollIns = ref();
const scollToBottom = () => {
  if (!chatScrollIns.value) return;
  nextTick(() => {
    chatScrollIns.value.wrapRef.scrollTop = chatScrollIns.value.wrapRef.scrollHeight;
  });
};
const handleMessageListScroll = throttle(() => {
  const chatInfoContainer = document.getElementById('messageListContainer');
  const chatInfoContainerHeight = chatInfoContainer.clientHeight;
  const scrollMain = chatScrollIns.value.wrapRef;
  const scrollMainScrollTop = scrollMain.scrollTop;
  const scrollMainHeight = scrollMain.clientHeight;
  if (scrollMainScrollTop <= 8) getMessageByThemeID(activeChatID.value);
}, 500);

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
    textarea.style.height = '100%';
  }
};

let recording = ref<boolean>(false);
const enableRecord = async () => {
  if (recording.value) {
    const path = await record_upload();
    const res = await selectEmbeddingModel({ modelType: '语音识别' });
    if (Array.isArray(res) && res.length > 0) {
      const firstItem = res[0];
      const { authorization, embeddingModel } = firstItem;
      const asrRes = await asr({
        authorization,
        cluster: embeddingModel,
        audio_path: path
      });
      const textarea = document.querySelector('textarea');
      textarea.value = asrRes;
    }
    recording.value = false;
    return;
  }
  recording.value = true;
  record_start();
};

const handleRadioRecoOutput = (text: string) => {
  const textarea = document.querySelector('textarea');
  textarea.value = text;
  questionText.value = text;
};

const chatInfoList = ref<any[]>([
  { id: 'new_chat', theme: '新对话', model: 'Doubao-vision-pro-32k', message: [] }
]);
const chatInfoTotal = ref<number>(0);
const currentNo = ref<number>(1);
const getChatInfoList = async (updateActiveChat = true, forceUpdateList = false) => {
  if (forceUpdateList) {
    chatInfoTotal.value = 0;
    currentNo.value = 1;
  }
  if (chatInfoTotal.value !== 0 && chatInfoTotal.value <= chatInfoList.value.length) return;
  const { list, total } = await chatThemePage({
    pageNo: currentNo.value,
    pageSize: 20,
    type: 'text'
    // collectionId: ""
  });
  console.log('获取所有对话记录 =>', list);
  if (!Array.isArray(list)) return;
  currentNo.value = currentNo.value + 1;
  if (currentNo.value === 2) {
    chatInfoList.value = list.map((item) => ({ ...item, message: [] }));
  } else {
    chatInfoList.value = [...chatInfoList.value, ...list.map((item) => ({ ...item, message: [] }))];
  }
  if (list.length > 0) {
    if (updateActiveChat) activeChatID.value = list[0].id;
    handleChatInfoClick({ id: activeChatID.value });
  }
  chatInfoTotal.value = total;
};
getChatInfoList();

const handleChatInfoClick = (item) => {
  activeChatID.value = item.id;
  if (activeChatID.value !== 'new_chat') getMessageByThemeID(activeChatID.value);
  setTimeout(() => {
    nextTick(() => scollToBottom());
  }, 400);
};

const activeChatID = ref<string>('new_chat');
const messageList = computed(() => {
  const activeChatInfo = chatInfoList.value.find((item) => item.id === activeChatID.value);
  if (!activeChatInfo) return [];
  return activeChatInfo.message;
});

// 根据 themeID 获取聊天记录
const getMessageByThemeID = async (themeId: string) => {
  console.log(`根据 themeID: ${themeId} 获取聊天记录`);
  if (themeId === 'new_chat') return ElMessage.warning('未找到对话ID');
  const activeChatInfo = chatInfoList.value.find((item) => item.id === activeChatID.value);
  if (!activeChatInfo) return;
  const activeTotal = activeChatInfo.total || 0;
  if (
    Array.isArray(activeChatInfo.message) &&
    activeChatInfo.message.length > 0 &&
    activeChatInfo.message.length >= activeTotal
  )
    return;
  const pageSize = 10;
  const getPageNo = (): number => {
    const index = Math.floor(activeChatInfo.message.length / pageSize);
    return index + 1;
  };
  const pageNo = activeTotal === 0 ? 1 : getPageNo();
  const { list, total } = await chatHistoryPage({
    themeId,
    pageNo,
    pageSize
  });
  if (pageNo === 1)
    activeChatInfo.message = list.map((item) => ({ ...item, text: item.message.text }));
  else
    activeChatInfo.message = [
      ...list.map((item) => ({ ...item, text: item.message.text })),
      ...activeChatInfo.message
    ];
  activeChatInfo.total = total;
};

const showRightPanel = ref<boolean>(false);

// 新对话
const handleNewChatInfo = () => {
  const newChatExist = chatInfoList.value.find((item) => item.id === 'new_chat');
  if (newChatExist) return (activeChatID.value = newChatExist.id);
  chatInfoList.value.push({
    id: 'new_chat',
    theme: '新对话',
    model: 'Doubao-vision-pro-32k',
    message: []
  });
  activeChatID.value = 'new_chat';
};

// 删除对话
const handleDeleteChatTheme = (id: string) => {
  ElMessageBox.confirm('确认删除该对话吗？', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消'
  })
    .then(async () => {
      const res = await chatThemeDelete({ id });
      getChatInfoList(false, true);
      if (res) return ElMessage.success('删除成功！');
      ElMessage.error('删除失败，请稍后重试！');
    })
    .catch(() => console.info('操作取消'));
};

// 语音功能正在进行，阻止消息发送
const radioRecording = ref<boolean>(false);

const handleContentBlur = async (e) => {
  const text = e.target.textContent;
  const activeItem = chatInfoList.value.find((item) => item.id === activeChatID.value);
  if (text === activeItem.theme) {
    const midArr = chatInfoList.value;
    chatInfoList.value = [];
    nextTick(() => (chatInfoList.value = midArr));
    return;
  }
  const res = await putUpdateChatTheme({
    id: activeItem.id,
    collectionId: activeItem.collectionId,
    theme: text,
    model: activeItem.model,
    type: activeItem.type
  });
  if (res) {
    ElMessage.success('修改成功!');
    chatInfoList.value = [];
    nextTick(() => getChatInfoList(false));
  } else {
    ElMessage.warning('修改失败，请稍后重试!');
  }
};

const handleContentKeyDown = (event) => {
  const keyCode = event.keyCode;
  if (keyCode === 13) {
    event.srcElement.dispatchEvent(new Event('blur'));
    event.preventDefault();
  }
};

const scrollContainer = ref();
const handleChatInfoList = () => {
  const chatInfoContainer = document.getElementById('chatInfoContainer');
  const chatInfoContainerHeight = chatInfoContainer.clientHeight;
  const scrollMain = scrollContainer.value.wrapRef;
  const scrollMainScrollTop = scrollMain.scrollTop;
  const scrollMainHeight = scrollMain.clientHeight;
  if (scrollMainHeight + scrollMainScrollTop + 5 > chatInfoContainerHeight) {
    getChatInfoList(false);
  }
};
</script>
<template>
  <!--侧栏宽度 74px -->
  <div
    class="w-[256px] side-bar-wrapper relative flex flex-col items-center"
    :style="`border-right: 1px solid var(--default-border-color);width:${sideBarCollapsed ? '0' : '256px'};`"
  >
    <div
      class="new-chat-btn flex justify-center items-center text-white text-14px cursor-pointer select-none"
      v-show="!sideBarCollapsed"
      @click="handleNewChatInfo()"
    >
      <el-icon><Plus /></el-icon>
      <span class="pl-4px">新建对话</span>
    </div>
    <el-scrollbar
      height="calc(100% - 16px)"
      class="w-full mx-4px box-border"
      style="width: calc(100% - 8px)"
      ref="scrollContainer"
      @scroll="handleChatInfoList"
    >
      <div class="px-12px space-y-8px" id="chatInfoContainer">
        <div
          v-for="item in chatInfoList"
          :key="item.id"
          class="w-full h-60px rounded-8px px-16px flex flex-col justify-center space-y-6px box-border cursor-pointer relative"
          :class="[activeChatID === item.id ? 'active-chat-info-item' : '']"
          style="border: 1px solid transparent"
          @click="handleChatInfoClick(item)"
        >
          <div
            class="text-14px w-[180px] line-clamp-1"
            :contenteditable="activeChatID === item.id"
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
    <div
      class="collapse-btn w-24px h-48px absolute right-[-33px]"
      :style="`top: calc(50% - 24px);transform: rotate(${sideBarCollapsed ? '180deg' : '0'});`"
      @click="sideBarCollapsed = !sideBarCollapsed"
    ></div>
  </div>
  <div
    class="main-container-wrapper"
    :style="`width: calc(100% - ${sideBarCollapsed ? (showRightPanel ? '256px' : '0px') : showRightPanel ? '512px' : '256px'})`"
  >
    <div class="h-[63px] px-[24px] flex justify-between items-center">
      <div class="text-18px font-bold">智能文本模型库V1.2.0</div>
      <div
        class="params-config-btn flex items-center space-x-8px text-14px px-16px py-8px rounded-full cursor-pointer"
        @click="showRightPanel = true"
      >
        <el-icon><Operation /></el-icon>
        <div>参数设置</div>
      </div>
    </div>
    <div class="flex justify-center" style="height: calc(100% - 63px)">
      <div
        class="relative h-full flex flex-col pb-36px pt-8px box-border 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px]"
      >
        <div class="mt-[6px] grow" style="max-height: calc(100% - 108px)">
          <div v-show="messageList.length === 0" class="w-full pt-60px h-full">
            <el-scrollbar>
              <div class="w-full flex flex-col items-center">
                <div class="flex items-center space-x-24px w-full xl:pt-[4vh] pt-0">
                  <div class="w-48px h-48px extra-logo"></div>
                  <div class="text-36px font-bold">您好，我是智慧农业AI助手</div>
                </div>
                <div class="w-full 2xl:mt-48px mt-20px flex justify-evenly">
                  <div class="w-[31%] aspect-.9 card-bg-1 p-22px box-border">
                    <div class="text-[#333] dark:text-[#fff] text-18px font-bold">智能问答</div>
                    <div class="text-[#999] text-14px mt-4px">帮您快速获取信息，解决问题</div>
                  </div>
                  <div class="w-[31%] aspect-.9 card-bg-2 p-22px box-border">
                    <div class="text-[#333] dark:text-[#fff] text-18px font-bold">文档编写</div>
                    <div class="text-[#999] text-14px mt-4px">输入需求，快速帮您生成文档</div>
                  </div>
                  <div class="w-[31%] aspect-.9 card-bg-3 p-22px box-border">
                    <div class="text-[#333] dark:text-[#fff] text-18px font-bold">代码生成</div>
                    <div class="text-[#999] text-14px mt-4px">根据描述生成代码框架及内容</div>
                  </div>
                </div>
                <div class="space-y-16px w-600px mt-18px py-30px !hidden">
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
          <div v-show="messageList.length !== 0" class="w-full h-full">
            <el-scrollbar ref="chatScrollIns" @scroll="handleMessageListScroll">
              <div class="space-y-[24px] pb-10px" id="messageListContainer">
                <div
                  class="flex justify-center 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px]"
                  v-for="(item, index) in messageList"
                  :key="index"
                >
                  <div
                    :class="[
                      'flex',
                      'items-start',
                      item.role === 'user' ? 'flex-row-reverse' : '',
                      'w-full'
                    ]"
                  >
                    <img
                      :src="
                        item.role === 'system' ? avatar : item.role === 'user' ? userAvatar : avatar
                      "
                    />
                    <div
                      class="bg-white rounded-16px px-16px box-border text-wrap mx-8px box-border shadow-sm"
                      :style="`background: ${item.role === 'system' ? 'var(--system-message-bg)' : 'var(--user-message-bg)'};max-width: calc(100% - 94px);`"
                      :innerHTML="marked.parse(item.text)"
                    ></div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div
          class="mt-12px p-2px box-border rounded-16px 2xl:w-[1004px] xl:w-[852px] lg:w-[604px] md:w-[404px] sm:w-[404px] fix-border-color"
          id="inputContainer"
        >
          <div class="relative h-full box-border min-h-56px w-full bg-white input-out-container">
            <textarea
              id="textarea"
              cols="30"
              rows="2"
              placeholder="请输入问题，我可以完成智能问答、文档编写、代码生成等多种任务"
              wrap="soft"
            ></textarea>
            <div
              v-loading="disabledSendBtn"
              :class="`z-20 absolute right-13px bottom-12px w-48px h-32px ${disabledSendBtn || radioRecording ? 'disabled-send' : 'send-btn'} cursor-pointer`"
              @click="handleSendMsg(null)"
            ></div>
            <div
              v-loading="recording"
              :class="`z-20 !hidden absolute right-68px bottom-12px h-32px ${disabledSendBtn ? 'bg-red' : 'bg-green'} cursor-pointer text-white rounded-md flex items-center px-12px`"
              @click="enableRecord()"
            >
              语音
            </div>
            <RadioButton
              class="absolute right-72px bottom-15px z-20"
              v-model:disableSend="radioRecording"
              :generateTexting="disabledSendBtn"
              @output="handleRadioRecoOutput"
            />
            <div
              v-if="questionText"
              class="max-btn z-20 absolute right-12px top-10px w-14px h-14px cursor-pointer"
              @click="fullTextArea()"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-256px right-panel-wrapper" v-show="showRightPanel">
    <div
      class="flex items-center justify-between pb-18px"
      style="border-bottom: 1px solid var(--default-border-color)"
    >
      <div class="font-bold">参数配置</div>
      <el-icon
        class="p-1 hover:bg-red hover:text-white rounded-sm transition-all"
        @click="showRightPanel = false"
      >
        <Close />
      </el-icon>
    </div>
    <div style="height: calc(100% - 63px)" class="py-[16px] text-14px">
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
      <div class="!text-[#000] flex items-center pl-12px">
        <el-slider v-model="maxResLength" :max="4096" :min="10" />
        <div class="bg-white px-3 py-1 shadow-sm ml-4 w-6 flex justify-center">
          {{ maxResLength }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.dark {
  .side-bar-wrapper {
    .active-chat-info-item {
      box-shadow: inset 0px 0px 16px 0px rgba(97, 92, 237, 0.5);
      border-radius: 8px;
      border: 1px solid #615ced;
      background: none;
    }
  }
  .main-container-wrapper {
    --user-message-bg: #605dee;
    --system-message-bg: linear-gradient(to right, #2a2e4f, #252b42, #1f2532);
    background: linear-gradient(to top, rgba(147, 98, 218, 0) 0%, rgba(67, 120, 255, 0.3) 100%),
      #0f121b;
    .fix-border-color {
      background: linear-gradient(to right, #4378ff, #9362da);
    }
    .input-out-container {
      position: relative;
      background: #0f121b;
      border-radius: 16px;
      border: 1px solid #00000000;
    }
    @for $i from 1 through 3 {
      .card-bg-#{$i} {
        background-image: url(./assets/darkCardBg#{$i}.png);
        background-size: 100% 100%;
      }
    }
    .params-config-btn {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
  }
}

.side-bar-wrapper {
  background-color: var(--side-panel-bg-color);
  .new-chat-btn {
    width: 224px;
    height: 40px;
    background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
    border-radius: 20px;
    margin: 24px 0;
  }
  .active-chat-info-item {
    border: 1px solid #615ced !important;
    background-image: linear-gradient(to top, #fff, #fafafe, #f0f0fe);
  }
}
.main-container-wrapper {
  --user-message-bg: #e0dfff;
  --system-message-bg: white;
  background: linear-gradient(to top, #f6f7fb, #f6f7fb, #f6f7fb, #ededfd);
  .input-out-container {
    background: #ffffff;
    box-shadow: 0px 4px 16px 0px rgba(214, 213, 222, 0.5);
    border-radius: 16px;
    border: 1px solid #ebecf2;
  }
  @for $i from 1 through 3 {
    .card-bg-#{$i} {
      background-image: url(./assets/cardBg#{$i}.png);
      background-size: 100% 100%;
    }
  }

  /** 分割线 */
  .split-line {
    width: 255px;
    height: 1px;
    border: 1px solid #f7f8fa;
  }
}

:deep(.el-scrollbar__bar) {
  opacity: 0;
}

.params-config-btn {
  background: rgba(255, 255, 255, 1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.extra-logo {
  background-image: url(./assets/extraLogo.png);
  background-size: 100% 100%;
}

.full-screen-text-container {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
}
.dark textarea {
  color: #fff;
}
textarea {
  background-color: transparent;
  height: 92%;
  margin-top: 3px;
  color: #333;
  width: calc(100% - 140px);
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
