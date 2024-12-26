<script setup lang="ts">
import {
  chatThemePage,
  chatHistoryPage,
  postImgToText,
  putUpdateChatTheme,
  postCreateChatHistory,
  chatThemeDelete,
  chatThemeCreate,
  getauth
} from '../../apis';

// 图片
import avatar from '../../assets/avatar.svg';
import userAvatar from '../../assets/userAvatar.svg';

// 其他依赖
import { marked } from 'marked';
import { throttle } from 'lodash-es';

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

const getChatInfoList = async (params) => {
  await nextTick();
  const type = useITT.value ? 'image-to-text' : 'text-to-image';
  const { pageSize = 20, forceUpdateSelectedID = true } = params;
  // 正在请求中
  if (loadingChatInfo.value) {
    return;
  }
  loadingChatInfo.value = true;
  chatPageSize.value = pageSize;
  const { list, total } = await chatThemePage({
    pageNo: 1,
    pageSize: pageSize,
    type: type
  });
  // const { list, total } = await testThemePage(pageSize);
  if (!Array.isArray(list)) {
    loadingChatInfo.value = false;
    return;
  }
  chatInfoList.value = list;
  console.log('forceUpdateSelectedID', forceUpdateSelectedID);
  if (forceUpdateSelectedID) activedChatID.value = list[0] ? list[0].id : 'new_chat';
  chatInfoTotal.value = total;
  loadingChatInfo.value = false;
  // 请求对应的消息列表
  if ('new_chat' === activedChatID.value) {
    return;
  }
  getMessageList(activedChatID.value).then(() => {
    scollToBottom();
  });
};
getChatInfoList({});

// 点击某个对话 设置当前对话ID 查询对话内容
const handleChatInfoClick = async (item: any) => {
  activedChatID.value = item.id;
  if ('new_caht' === item.id) {
    return;
  }
  msgPageSize.value = 10;
  await getMessageList(item.id);
  scollToBottom();
};

// 删除对话
const handleDeleteChatTheme = (id: string) => {
  ElMessageBox.confirm('确认删除该对话吗？', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消'
  })
    .then(async () => {
      const res = await chatThemeDelete({ id });
      getChatInfoList({ pageSize: 20 });
      if (res) return ElMessage.success('删除成功！');
      ElMessage.error('删除失败，请稍后重试！');
    })
    .catch(() => console.info('操作取消'));
};

const handleContentBlur = async (e) => {
  const text = e.target.textContent;
  const activeItem = chatInfoList.value.find((item) => item.id === activedChatID.value);
  if (!activeItem) return;
  if (text === activeItem.theme) {
    const midArr = chatInfoList.value;
    chatInfoList.value = [];
    nextTick(() => (chatInfoList.value = midArr));
    return;
  }
  const res = await putUpdateChatTheme({
    id: activeItem.id,
    theme: text,
    model: activeItem.model,
    type: activeItem.type
  });
  if (res) {
    ElMessage.success('修改成功!');
    chatInfoList.value = [];
    nextTick(() => getChatInfoList({ pageSize: 20, forceUpdateSelectedID: false }));
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
    await getChatInfoList({ pageSize: chatPageSize.value + 10 });
  }
};

// 新建对话
const handleNewChatInfo = () => {
  if (themeRef.value)
    nextTick(() => {
      themeRef.value.wrapRef.scrollTop = 0;
    });
  const newChatExist = chatInfoList.value.find((item) => item.id === 'new_chat');
  if (newChatExist) return (activedChatID.value = newChatExist.id);
  chatInfoList.value.unshift({
    id: 'new_chat',
    theme: '新对话',
    model: 'Doubao-vision-pro-32k',
    message: []
  });
  activedChatID.value = 'new_chat';
};

/**
 * 左侧对话列表 end
 */

/**
 * 中间 start
 */
// 当前对话内容
const messageList = computed(() => {
  const activeChatInfo = chatInfoList.value.find((item) => item.id === activedChatID.value);
  if (!activeChatInfo) return [];
  return activeChatInfo.message;
});

const msgTotal = ref(0);
const msgPageSize = ref(10);
const msgLoading = ref(false);

// 查询对话内容
const getMessageList = async (id: string, pageSize: number = 10) => {
  // 正在请求中
  if (msgLoading.value) {
    return;
  }
  msgPageSize.value = pageSize;
  msgLoading.value = true;
  const params = {
    pageNo: 1,
    pageSize,
    themeId: id
  };
  const { list, total } = await chatHistoryPage(params);
  if (!Array.isArray(list)) {
    msgLoading.value = false;
    return;
  }
  const idx = chatInfoList.value.findIndex((ele) => ele.id === id);
  // 调整list顺序
  chatInfoList.value[idx].message = modifyMsgList(list);
  msgTotal.value = total;
  msgLoading.value = false;
};

// 调整对话内容顺序
const modifyMsgList = (list: any[]) => {
  /**
   * 视觉模块中 list 的 length 一定是2的倍数
   * 每两项中必定一个是 user 一个是 system
   * 调整成 user 在前 system 在后的顺序
   */
  const res: any[] = [];
  if (list.length <= 0) {
    return [];
  }
  const n = list.length;
  for (let i = 0; i < n; i += 2) {
    if ('user' === list[i].role) {
      res.push(list[i]);
      res.push(list[i + 1]);
    } else {
      res.push(list[i + 1]);
      res.push(list[i]);
    }
  }
  return res;
};

// 发送按钮禁用
const disabledSendBtn = ref<boolean>(true);

// 自适应调整textarea高度
const adjustTextareaHeight = () => {
  const textarea = document.getElementById('textarea');
  if (!textarea) {
    return;
  }
  textarea.addEventListener('input', (e) => {
    const target = e.target as any;
    target.style.height = 'auto';
    target.style.height = Math.max(textarea.scrollHeight, 60) + 'px';
    console.log(
      '🚀 ~ textarea.addEventListener ~ Math.max(textarea.scrollHeight, 60):',
      Math.max(textarea.scrollHeight, 60)
    );
  });
};
onMounted(() => adjustTextareaHeight());

// 处理textarea输入框
const handleTextChange = () => {
  const textarea = document.querySelector('textarea');
  textarea.addEventListener('keydown', (e) => {
    const keyCode = event.keyCode;
    const shiftKey = event.shiftKey;
    if (!shiftKey && keyCode === 13) {
      handleSendMsg();
    }
  });
};
onMounted(() => handleTextChange());

// 发送
const handleSendMsg = async () => {
  const textarea = document.querySelector('textarea');
  if (!textarea) {
    return;
  }
  if (useITT.value) {
    if (!inputTextITT.value || inputImgListITT.value.length <= 0) return;
    await submitITT();
  } else {
    if (!inputTextITT.value) return;
    await submitTTI();
  }
};

const useITT = ref(true);
watch(useITT, () => {
  // 切换模式时 输入内容清空 左边不折叠右边折叠 pageSize复原 total设置为0 重新查询对话列表
  inputTextITT.value = '';
  inputImgListITT.value = [];
  leftPanelCollapsed.value = false;
  rightPanelCollapsed.value = true;
  chatPageSize.value = 20;
  msgPageSize.value = 10;
  chatInfoTotal.value = 0;
  msgTotal.value = 0;
  handleWatch();
  getChatInfoList({});
});

// 上传图片的弹框
const showUploadImg = ref(false);
const imgs = ref<any[]>([]);
const inputImgListITT = ref<any[]>([]);

const handleClickShowUploadImg = () => {
  showUploadImg.value = true;
};

// 确认上传 把imgs的项目添加到inputImgList中 然后清空imgs
const handleConfirmUploadImg = () => {
  imgs.value.forEach((ele) => {
    inputImgListITT.value.push({ url: ele, showDel: false });
  });
  console.log(imgs.value);
  imgs.value = [];
  showUploadImg.value = false;
};

// 取消上传
const handleClickCloseUploadImg = () => {
  imgs.value = [];
  showUploadImg.value = false;
};

// 删除输入框中的图片
const handleClickDelImg = (index: number) => {
  inputImgListITT.value.splice(index, 1);
};

// 提示文本列表
const supportText = ['总结图片内容', '提取图中文字'];

const inputTextITT = ref('');

const sendingITT = ref(false);
const submitITT = async () => {
  sendingITT.value = true;
  disabledSendBtn.value = true;
  try {
    // 构造请求参数
    const model = 'ep-20241206121046-84924';
    const messages = [{ role: 'user', content: [] as any[] }];
    messages[0].content.push({ type: 'text', text: inputTextITT.value });
    inputImgListITT.value.forEach((ele) => {
      messages[0].content.push({ type: 'image_url', image_url: { url: ele.url } });
    });
    const max_tokens = maxResLength.value;
    const data = { model, messages, max_tokens };

    // 请求数据
    const res = await postImgToText(data);
    // TODO: 错误处理
    const content = res.data.choices[0].message.content;
    const modelName = res.data.model;

    // 如果没有聊天 新建一个 重新加载列表 选中新建的对话
    let themeId: string;
    if (activedChatID.value === 'new_chat') {
      themeId = await chatThemeCreate({
        theme: inputTextITT.value,
        model: modelName,
        type: 'image-to-text'
      });
      await getChatInfoList({});
      const idx = chatInfoList.value.findIndex((ele) => ele.id === themeId);
      activedChatID.value = chatInfoList.value[idx].id;
    } else {
      // 如果有聊天 加载聊天记录 更新模型名称
      const idx = chatInfoList.value.findIndex((ele) => ele.id === activedChatID.value);
      themeId = activedChatID.value;
      await putUpdateChatTheme({
        id: activedChatID.value,
        theme: chatInfoList.value[idx].theme,
        model: modelName,
        type: 'image-to-text'
      });
    }

    // 保存聊天记录
    let imgStr = '';
    let list: string[] = [];
    inputImgListITT.value.forEach((ele, index) => {
      if (index === inputImgListITT.value.length - 1) {
        imgStr += ele.url;
        list.push(ele.url);
      } else {
        imgStr += ele.url + ',';
        list.push(ele.url);
      }
    });
    await postCreateChatHistory({
      themeId,
      role: 'user',
      message: {
        text: inputTextITT.value,
        image: imgStr
      }
    });
    await postCreateChatHistory({
      themeId,
      role: 'system',
      message: {
        text: content,
        image: ''
      }
    });

    await getMessageList(themeId);

    if (returnStream.value) {
      outputtingITT.value = true;
      messageList.value[messageList.value.length - 1].message.text = '';
      flowOutput(content);
    }

    // 发送完清空输入文字和图片列表
    inputTextITT.value = '';
    inputImgListITT.value = [];

    // 滚动条滚动到最底部
    scollToBottom();
  } catch (e) {
    console.log(e);
  } finally {
    sendingITT.value = false;
    disabledSendBtn.value = false;
  }
};

const submitTTI = async () => {
  sendingITT.value = true;
  try {
    const headers = {
      AccessKey: 'AKLTZTQ1NDUzYmIyMDljNDVlMmIyNGZhNmY0M2Q1MmJiNDA',
      SecretKey: 'WldJd1pqTmlNV0U1WmpCbU5EazBNbUkxTURVNVkyVXdNelJsWlRkaU5XUQ=='
    };
    const data = {
      req_key: 'high_aes_general_v20'
    };

    const res = await getauth({
      prompt: inputTextITT.value,
      access_key: headers.AccessKey,
      secret_key: headers.SecretKey
    });
    console.log(res.data.data);
    const urls = [res.data.data];

    // 如果没有聊天 新建一个 重新加载列表 选中新建的对话
    let themeId: string;
    if (activedChatID.value === 'new_chat') {
      themeId = await chatThemeCreate({
        theme: inputTextITT.value,
        model: data.req_key,
        type: 'text-to-image'
      });
      await getChatInfoList({});
      const idx = chatInfoList.value.findIndex((ele) => ele.id === themeId);
      activedChatID.value = chatInfoList.value[idx].id;
    } else {
      // 如果有聊天 加载聊天记录 更新模型名称
      const idx = chatInfoList.value.findIndex((ele) => ele.id === activedChatID.value);
      themeId = activedChatID.value;
      await putUpdateChatTheme({
        id: activedChatID.value,
        theme: chatInfoList.value[idx].theme,
        model: data.req_key,
        type: 'text-to-image'
      });
    }

    // 保存聊天记录
    await postCreateChatHistory({
      themeId,
      role: 'user',
      message: {
        text: inputTextITT.value,
        image: ''
      }
    });
    await postCreateChatHistory({
      themeId,
      role: 'system',
      message: {
        text: '',
        image: urls.join(',')
      }
    });

    await getMessageList(themeId);
    // 发送完清空输入文字
    inputTextITT.value = '';

    // 滚动条滚动到最底部
    scollToBottom();
  } catch (e) {
    console.log(e);
  } finally {
    sendingITT.value = false;
  }
};

const outputtingITT = ref(false);
// 流式输出
const flowOutput = (text: string) => {
  if (!text) {
    outputtingITT.value = false;
    return;
  }
  setTimeout(() => {
    const textArr = text.split('');
    const putText = textArr.shift();
    messageList.value[messageList.value.length - 1].message.text += putText;
    flowOutput(textArr.join(''));
    scollToBottom();
  }, 100);
};

// 消息记录滚动到最底下
const chatScrollIns = ref();
const scollToBottom = () => {
  if (!chatScrollIns.value) return;
  nextTick(() => {
    chatScrollIns.value.wrapRef.scrollTop = chatScrollIns.value.wrapRef.scrollHeight;
  });
};

const handleWatch = () => {
  if (useITT.value) {
    if (inputTextITT.value !== '' && inputImgListITT.value.length > 0) {
      disabledSendBtn.value = false;
    } else {
      disabledSendBtn.value = true;
    }
  } else {
    if (inputTextITT.value !== '') {
      disabledSendBtn.value = false;
    } else {
      disabledSendBtn.value = true;
    }
  }
};
watch(inputTextITT, handleWatch);
watch(inputImgListITT, handleWatch);

const handleMessageListScroll = throttle(() => {
  if (!messageList.value || messageList.value.length === 0) return;
  // 滚动到最上面以后加载更多
  const scrollMain = chatScrollIns.value.wrapRef;
  const scrollMainScrollTop = scrollMain.scrollTop;
  if (scrollMainScrollTop <= 8 && messageList.value.length < msgTotal.value) {
    getMessageList(activedChatID.value, msgPageSize.value + 10);
  }
}, 500);

/**
 * 中间 end
 */

/**
 * 右侧参数设置 start
 */

// 右侧参数设置
const returnStream = ref(true);
const maxResLength = ref(1);

// 改变最大返回长度的响应函数
const handleInputChange = (val: any) => {
  const n = Number(val);
  if (Number.isInteger(n)) {
    maxResLength.value = n;
  } else {
    maxResLength.value = 1;
  }
};

/**
 * 右侧参数设置 end
 */
// 文生图的尺寸列表
const sizeIdx = ref(0);
const sizeList = ref([
  { label: '1:1', iconClass: 'size-1', width: 512, height: 512 },
  { label: '4:3', iconClass: 'size-2', width: 512, height: 384 },
  { label: '3:4', iconClass: 'size-2-rotate', width: 384, height: 512 },
  { label: '3:2', iconClass: 'size-2', width: 512, height: 341 },
  { label: '2:3', iconClass: 'size-2-rotate', width: 341, height: 512 },
  { label: '16:9', iconClass: 'size-3', width: 512, height: 288 },
  { label: '9:16', iconClass: 'size-3-rotate', width: 288, height: 512 }
]);
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
        @click="handleNewChatInfo()"
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
        v-show="useITT"
        class="params-config-btn flex items-center space-x-8px text-14px px-16px py-8px rounded-full cursor-pointer absolute right-5 top-3"
        @click="rightPanelCollapsed = false"
      >
        <el-icon><Operation /></el-icon>
        <div>参数设置</div>
      </div>
      <div class="w-full mt-[12px] flex justify-center">
        <!-- tab -->
        <div
          class="tab-container w-[320px] h-[36px] relative grid grid-cols-2 rounded-full px-[4px] box-border shadow-md"
        >
          <div
            class="w-full h-[32px] my-[2px] flex justify-center items-center space-x-[12px] cursor-pointer rounded-[12px] z-10"
            @click="useITT = true"
          >
            <div :class="`${useITT && 'active-tab-text'}`">
              <span class="text-[16px]">图文解析</span>
            </div>
          </div>
          <div
            class="w-full h-[32px] my-[2px] flex justify-center items-center space-x-[12px] cursor-pointer rounded-[12px] z-10"
            @click="useITT = false"
          >
            <div :class="`${!useITT && 'active-tab-text'}`">
              <span class="text-[16px]">文生图</span>
            </div>
          </div>
          <div
            :class="`${useITT ? 'translate-x-0' : 'translate-x-full'}`"
            class="active-tab-bg absolute left-0 top-0 w-1/2 h-[36px] dark:h-[34px] rounded-full transition-all"
          ></div>
        </div>
      </div>
      <!-- content -->
      <div
        class="2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px] mx-auto flex flex-col"
        style="height: calc(100% - 64px)"
        @click="rightPanelCollapsed = true"
      >
        <div class="grow min-h-100px relative transition" style="flex: 1 1 auto">
          <el-scrollbar
            class="hide-scrollbar"
            ref="chatScrollIns"
            @scroll="handleMessageListScroll"
          >
            <div
              v-show="!messageList || messageList.length <= 0"
              class="w-full flex flex-col items-center mb-10px"
            >
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
            <div v-loading="msgLoading" class="space-y-[24px] pb-10px mt-[16px]">
              <div
                class="flex flex-col items-center 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px] transition duration-500"
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
                    v-show="!(!useITT && item.role === 'system')"
                    class="bg-white rounded-16px px-16px box-border text-wrap mx-8px box-border shadow-sm"
                    :style="`background: ${item.role === 'system' ? 'var(--system-message-bg)' : 'var(--user-message-bg)'};max-width: calc(100% - 94px);`"
                    :innerHTML="marked.parse(item.message.text)"
                  ></div>
                  <div
                    v-show="!useITT && item.role === 'system'"
                    class="w-full grid grid-cols-4 gap-[8px] ml-[8px]"
                  >
                    <div
                      v-for="ele in item.message.image.split(',')"
                      :key="ele"
                      class="pb-[100%] relative w-full"
                    >
                      <img
                        :src="ele"
                        class="absolute top-0 left-0 rounded-[6px] w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-show="item.role === 'user' && item.message.image"
                  class="w-full grid grid-cols-4 gap-[8px] mt-[16px]"
                  style="direction: rtl"
                >
                  <div
                    v-for="ele in item.message.image.split(',')"
                    :key="ele"
                    class="pb-[100%] relative w-full"
                  >
                    <img
                      :src="ele"
                      class="absolute top-0 left-0 rounded-[6px] w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="w-full absolute left-0 bottom-0 message-bottom-mask z-10 h-[16px]"></div>
        </div>
        <!-- size list -->
        <div v-show="!useITT" class="w-full h-[34px] mb-[8px]" style="flex: 0 0 auto">
          <el-scrollbar view-class="flex space-x-[8px]">
            <div
              v-for="(item, index) in sizeList"
              :key="item.label"
              class="size-bg"
              :class="index === sizeIdx && 'active-size'"
              @click.stop="sizeIdx = index"
            >
              <div :class="item.iconClass"></div>
              <span class="pl-[10px]">{{ item.label }}</span>
            </div>
          </el-scrollbar>
        </div>
        <div
          class="input-outer-container p-2px rounded-16px shadow-md relative"
          style="flex: 0 0 auto"
        >
          <div class="rounded-16px p-8px bg-white dark:bg-#121212 overflow-hidden">
            <div v-if="inputImgListITT.length > 0" class="h-[68px] flex space-x-[8px]">
              <div class="relative" v-for="(item, index) in inputImgListITT" :key="item.url">
                <el-image
                  :src="item.url"
                  :preview-src-list="[item.url]"
                  fit="cover"
                  class="w-[68px] h-[68px] rounded-[6px]"
                  preview-teleported
                  @mouseenter="item.showDel = true"
                  @mouseleave="item.showDel = false"
                />
                <div
                  v-show="item.showDel"
                  class="absolute right-[2px] bottom-[2px] w-[14px] h-[14px] delete-img"
                  @click="handleClickDelImg(index)"
                ></div>
              </div>
            </div>
            <div
              v-if="inputImgListITT.length > 0"
              class="my-[16px] h-[32px] flex items-center space-x-[8px]"
            >
              <div
                v-for="item in supportText"
                :key="item"
                class="flex items-center px-[16px] py-[6px] rounded-[6px] bg-[#F5F6FA] dark:bg-[#2C3240] cursor-pointer"
                @click="inputTextITT = item"
              >
                <span class="text-[14px]">{{ item }}</span>
                <el-icon class="ml-[18px]"><Right /></el-icon>
              </div>
            </div>
            <div class="flex items-end">
              <textarea
                class="ai-show-textarea grow"
                id="textarea"
                rows="2"
                wrap="soft"
                v-model="inputTextITT"
              ></textarea>
              <div
                class="w-24px h-24px overflow-hidden relative left-[-8px] top-[-4px] upload-icon-svg"
              >
                <el-button
                  v-show="useITT"
                  class="upload-btn opacity-0"
                  @click="handleClickShowUploadImg"
                >
                  <div class="w-[14px] h-[13px] upload-icon"></div>
                </el-button>
              </div>
              <div>
                <div
                  v-loading="sendingITT"
                  :class="`w-48px h-32px ${disabledSendBtn ? 'disabled-send' : 'send-btn'} cursor-pointer`"
                  @click="handleSendMsg(null)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- right -->
    <div
      v-show="useITT"
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
      <div style="height: calc(100% - 63px)" class="pb-[16px] text-14px px-25px">
        <div class="mb-[8px] mt-[16px]">是否流式返回</div>
        <div><el-switch v-model="returnStream" size="large" /></div>
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
    </div>
  </div>

  <Dialog v-model="showUploadImg" title="上传图片" width="662px" @close="handleClickCloseUploadImg">
    <div v-show="imgs.length <= 0" class="text-center mb-[16px]">
      <span class="text-[16px]">点击下方按钮上传图片</span>
    </div>
    <div class="flex justify-center">
      <UploadImgs v-model="imgs" :limit="10" aria-readonly="true" />
    </div>
    <div class="flex justify-center mt-[16px] space-x-[8px]">
      <el-button color="#615ced" @click="handleConfirmUploadImg">保存</el-button>
      <el-button @click="handleClickCloseUploadImg">取消</el-button>
    </div>
  </Dialog>
</template>
<style scoped lang="scss">
.ai-dark {
  @for $i from 1 through 6 {
    .card-bg-#{$i} {
      background-image: url(../../assets/vision-init-#{$i}-dark.png);
      background-size: 100% 100%;
    }
  }

  .text-to-img,
  .text-to-img-active {
    background-image: url(../../assets/vision-text-to-img-dark.png);
    background-size: 100% 100%;
  }

  .img-to-text,
  .img-to-text-active {
    background-image: url(../../assets/vision-img-to-text-dark.png);
    background-size: 100% 100%;
  }

  .active-tab-bg {
    background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
  }

  .tab-container {
    background-color: transparent;
    border: 0.1em solid #615ced;
  }

  .upload-icon {
    background-image: url(../../assets/vision-uploadImg-dark.svg);
    background-size: 100% 100%;
  }

  .size-bg {
    background-color: #2c3240;
    border: none;
    border-radius: 6px;
    width: 88px;
    height: 32px;
    display: flex;
    align-items: center;
  }

  .active-size {
    border: none;
    background: #615ced;
  }

  @for $i from 1 through 3 {
    .size-#{$i} {
      padding-left: 16px;
      width: 16px;
      height: 16px;
      background-image: url(../../assets/vision-img-size-#{$i}-dark.svg);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }
  }

  @for $i from 2 through 3 {
    .size-#{$i}-rotate {
      padding-left: 16px;
      width: 16px;
      height: 16px;
      background-image: url(../../assets/vision-img-size-#{$i}-dark.svg);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      transform: rotate(90deg);
    }
  }

  .upload-icon-svg {
    background-image: url(../../assets/vision-upload-img-dark.svg);
    background-size: 80% 80%;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.ai-light {
  @for $i from 1 through 6 {
    .card-bg-#{$i} {
      background-image: url(../../assets/vision-init-#{$i}.png);
      background-size: 100% 100%;
    }
  }

  .text-to-img {
    background-image: url(../../assets/vision-text-to-img.png);
    background-size: 100% 100%;
  }
  .text-to-img-active {
    background-image: url(../../assets/vision-text-to-img-active.png);
    background-size: 100% 100%;
  }

  .img-to-text {
    background-image: url(../../assets/vision-img-to-text.png);
    background-size: 100% 100%;
  }
  .img-to-text-active {
    background-image: url(../../assets/vision-img-to-text-active.png);
    background-size: 100% 100%;
  }

  .active-tab-bg {
    background-color: #615ced;
  }

  .tab-container {
    background-color: white;
  }

  .upload-icon {
    background-image: url(../../assets/vision-uploadImg.svg);
    background-size: 100% 100%;
  }

  .size-bg {
    padding-left: 16px;
    background-color: white;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
    width: 64px;
    height: 32px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .active-size {
    border: 1px solid #615ced;
    background: #f2f2fa;
  }

  @for $i from 1 through 3 {
    .size-#{$i} {
      width: 16px;
      height: 16px;
      background-image: url(../../assets/vision-img-size-#{$i}.svg);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  @for $i from 2 through 3 {
    .size-#{$i}-rotate {
      width: 16px;
      height: 16px;
      background-image: url(../../assets/vision-img-size-#{$i}.svg);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      transform: rotate(90deg);
    }
  }

  .upload-icon-svg {
    background-image: url(../../assets/vision-upload-img.svg);
    background-size: 80% 80%;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.active-tab-text {
  color: white;
}

// 不发送和发送按钮
.disabled-send {
  background-image: url(../../assets/disabledSend.svg);
  background-size: 100% 100%;
}
.send-btn {
  background-image: url(../../assets/sendBtn.svg);
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

// 隐藏横向和纵向滚动条
:deep(.hide-scrollbar .el-scrollbar__bar.is-vertical) {
  display: none;
}
:deep(.hide-scrollbar .el-scrollbar__bar.is-horizontal) {
  display: none;
}

.delete-img {
  background-image: url(../../assets/vision-delete.svg);
  background-size: 100% 100%;
}
</style>
