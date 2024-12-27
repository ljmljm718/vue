<script setup lang="ts">
// 图片
import avatar from '../../assets/avatar.svg';
import userAvatar from '../../assets/userAvatar.svg';

// 其他依赖
import { marked } from 'marked';
import { throttle } from 'lodash-es';
import {
  getCollectionList,
  chatThemeCreate,
  chatThemePage,
  chatHistoryPage,
  chatThemeDelete,
  putUpdateChatTheme,
  getCollectionSearch
} from '../../apis';
import RadioButton from './radioButton.vue';

// 随机ID
const uuid = (length = 8, chars?) => {
  let result = '';
  const charsString = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
};

const chatList = ref<any[]>([]);
const questionText = ref<string>('');

const pageMainTitle = ref<string>(''); // 智能文本模型库V1.2.0
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
onActivated(() => nextTick(() => scollToBottom()));

const handleMessageListScroll = throttle(() => {
  if (messageList.value.length === 0) return;
  // 滚动到最上面以后加载更多
  const scrollMain = chatScrollIns.value.wrapRef;
  const scrollMainScrollTop = scrollMain.scrollTop;
  if (scrollMainScrollTop <= 8) getMessageByThemeID(activeChatID.value);
}, 500);

// 左侧对话列表
const activeChatID = ref<string>('');
const chatInfoList = ref<any[]>([
  { id: 'new_chat', theme: '新对话', model: 'Doubao-vision-pro-32k', message: [] }
]);
const chatInfoTotal = ref<number>(0);
const currentNo = ref<number>(1);
// updateActiveChat 更新活动的item forceUpdateList 强制刷新列表 chatInfoList
const getChatInfoList = async (updateActiveChat = true, forceUpdateList = false) => {
  if (forceUpdateList) {
    chatInfoTotal.value = 0;
    currentNo.value = 1;
  }
  if (chatInfoTotal.value !== 0 && chatInfoTotal.value <= chatInfoList.value.length) return;
  const { list, total } = await chatThemePage({
    pageNo: currentNo.value,
    pageSize: 10,
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
  // 如果处理之后列表为空，自动新建对话
  if (chatInfoList.value.length === 0) handleNewChatInfo();
};
getChatInfoList();

// 处理左侧对话列表滚动事件
const scrollContainer = ref();
const handleChatInfoList = throttle(() => {
  const chatInfoContainer = document.getElementById('chatInfoContainer');
  const chatInfoContainerHeight = chatInfoContainer.clientHeight;
  const scrollMain = scrollContainer.value.wrapRef;
  const scrollMainScrollTop = scrollMain.scrollTop;
  const scrollMainHeight = scrollMain.clientHeight;
  if (scrollMainHeight + scrollMainScrollTop + 5 > chatInfoContainerHeight) {
    getChatInfoList(false);
  }
}, 500);

// 点击某个对话
const handleChatInfoClick = (item) => {
  activeChatID.value = item.id;
  if (activeChatID.value !== 'new_chat') getMessageByThemeID(activeChatID.value);
  setTimeout(() => {
    nextTick(() => scollToBottom());
  }, 400);
};

// 处理textarea输入框
const handleTextChange = () => {
  const textarea = document.querySelector('textarea');
  textarea.addEventListener('input', (e) => {
    const text = e.target.value;
    questionText.value = text;
    console.log('TEXT', text);
  });
  textarea.addEventListener('keydown', (e) => {
    const keyCode = event.keyCode;
    const shiftKey = event.shiftKey;
    if (!shiftKey && keyCode === 13) {
      handleSendMsg(null);
    }
  });
};
onMounted(() => handleTextChange());

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

const handleContentBlur = async (e) => {
  const text = e.target.textContent;
  const activeItem = chatInfoList.value.find((item) => item.id === activeChatID.value);
  if (!activeItem) return;
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
    nextTick(() => getChatInfoList(false, true));
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
onActivated(() => getCollectionData());

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
  });
};
onMounted(() => adjustTextareaHeight());

// 语音功能正在进行，阻止消息发送
const radioRecording = ref<boolean>(false);
const disabledSendBtn = ref<boolean>(false);
const handleRadioRecoOutput = (text) => {
  const textarea = document.querySelector('textarea');
  textarea.value = text;
  questionText.value = text;
};

// 发送消息
const handleSendMsg = async (text) => {
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
  if (!text) return;
  if (disabledSendBtn.value) return;
  disabledSendBtn.value = true;
  chatList.value.push({ role: 'user', text: text });
  textarea.value = '';
  console.log('🚀 ~ handleSendMsg ~ activeChatInfo:', activeChatInfo);
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

const messageList = computed(() => {
  const activeChatInfo = chatInfoList.value.find((item) => item.id === activeChatID.value);
  if (!activeChatInfo) return [];
  return activeChatInfo.message;
});

// 新建对话
const handleNewChatInfo = () => {
  if (scrollContainer.value)
    nextTick(() => {
      scrollContainer.value.wrapRef.scrollTop = 0;
    });
  const newChatExist = chatInfoList.value.find((item) => item.id === 'new_chat');
  if (newChatExist) return (activeChatID.value = newChatExist.id);
  chatInfoList.value.unshift({
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
      getChatInfoList(activeChatID.value === id, true);
      if (res) return ElMessage.success('删除成功！');
      ElMessage.error('删除失败，请稍后重试！');
    })
    .catch(() => console.info('操作取消'));
};
</script>
<template>
  <div class="relative h-full">
    <div
      class="side-bar-frame transition-all ease-in-out left-side-bar-frame h-full shadow-md duration-600 z-30"
      :style="`left: ${leftPanelCollapsed ? '-256px' : '0'};`"
    >
      <div
        class="collapse-btn w-24px h-48px absolute right-[-33px]"
        :style="`top: calc(50% - 24px);transform: rotate(${leftPanelCollapsed ? '180deg' : '0'});`"
        @click="leftPanelCollapsed = !leftPanelCollapsed"
      ></div>
      <div
        class="new-chat-btn flex justify-center items-center text-white text-14px cursor-pointer select-none ml-20px"
        @click="handleNewChatInfo()"
      >
        <el-icon><Plus /></el-icon>
        <span class="pl-4px">新建对话</span>
      </div>
      <el-scrollbar
        style="height: calc(100% - 90px)"
        ref="scrollContainer"
        @scroll="handleChatInfoList"
      >
        <div class="w-full px-10px box-border" id="chatInfoContainer">
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
    </div>
    <div
      class="absolute right-0 h-full z-10 transition-all ease-in-out duration-600 ai-show-main-container"
      :style="`width: ${leftPanelCollapsed ? '100%' : 'calc(100% - 256px)'};`"
    >
      <div
        class="params-config-btn flex items-center space-x-8px text-14px px-16px py-8px rounded-full cursor-pointer absolute right-5 top-3"
        @click="rightPanelCollapsed = false"
      >
        <el-icon><Operation /></el-icon>
        <div>参数设置</div>
      </div>
      <div class="h-54px px-24px box-border flex items-center text-18px font-bold">
        {{ pageMainTitle }}
      </div>
      <div
        class="2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px] mx-auto flex flex-col"
        style="height: calc(100% - 80px)"
        @click="rightPanelCollapsed = true"
      >
        <div class="grow min-h-100px relative" style="flex: 1 1 auto">
          <el-scrollbar
            class="hide-scrollbar"
            ref="chatScrollIns"
            @scroll="handleMessageListScroll"
          >
            <div
              class="w-full flex flex-col items-center mb-10px"
              v-if="messageList.length === 0 && activeChatID === 'new_chat'"
            >
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
            <div class="space-y-[24px] pb-10px" v-else>
              <div
                class="flex justify-center 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px] transition duration-500"
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
      class="side-bar-frame right-side-bar-frame z-30 h-full shadow-md transition-all ease-in-out duration-600"
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
              clearable
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
            <div class="w-85px mr-10px ml-10px">
              <el-slider v-model="maxResLength" :max="4096" :min="10" />
            </div>

            <div class="!w-90px">
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
  background-image: url(../../assets/disabledSend.svg);
  background-size: 100% 100%;
}

.send-btn {
  background-image: url(../../assets/sendBtn.svg);
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

:deep(.el-select__wrapper.is-focusd) {
  box-shadow: 0 0 0 1px #ffffff;
}
</style>
