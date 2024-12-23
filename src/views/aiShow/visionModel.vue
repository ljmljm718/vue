<script setup lang="ts">
import {
  postImgToText,
  chatThemePage,
  chatHistoryPage,
  chatThemeDelete,
  chatThemeCreate,
  putUpdateChatTheme,
  postCreateChatHistory,
  getauth
} from './api';

const msg = useMessage();

/**
 * 后缀说明
 * ITT Image-To-Text 图文解析
 * TTI Text-To-Image 文生图
 *
 * 变量说明
 * dialogList        对话列表
 * dialogIdx         当前对话在对话列表的下标
 * dialogExpand      是否展开对话列表 true展开 false收起
 * chatList          当前对话内容列表
 * inputText         对话框输入文本
 * inputImgList      对话框输入的图片url列表
 * returnStream      是否流式返回 true流式 false非流式
 * maxResLen         最大返回长度 0-4096 这里最小设置为1
 * settingExpand     是否展开设置面板 true展开 false收起
 * inputting         是否是输入状态 true是 false否
 * chatRef           对话内容滚动区域的模板引用
 * dialogEditIdx     正在编辑的对话下标
 * dialogEditText    编辑绑定的对话标题
 * dialogCurPage     当前加载几页对话
 */

// true 展示图文解析 false 展示文生图
const useITT = ref(true);

const dialogListITT = ref<any[]>([]);
const dialogIdxITT = ref(-1);
const dialogExpandITT = ref(true);
const chatListITT = ref<any[]>([]);
const inputTextITT = ref('');
const inputImgListITT = ref<any[]>([]);
const returnStreamITT = ref(true);
const maxResLenITT = ref(1);
const settingExpandITT = ref(false);
const inputtingITT = ref(false);
const chatRefITT = ref();
const dialogEditIdxITT = ref(-1);
const dialogEditTextITT = ref('');
const dialogCurPageITT = ref(1);
const dialogRefITT = ref();
const chatCurPageITT = ref(1);
const outputtingITT = ref(false);

const dialogListTTI = ref<any[]>([]);
const dialogIdxTTI = ref(-1);
const dialogExpandTTI = ref(true);
const chatListTTI = ref<any[]>([]);
const inputTextTTI = ref('');
const inputtingTTI = ref(false);
const chatRefTTI = ref();
const dialogEditIdxTTI = ref(-1);
const dialogEditTextTTI = ref('');
const dialogCurPageTTI = ref(1);
const dialogRefTTI = ref();
const chatCurPageTTI = ref(1);
const outputtingTTI = ref(false);

// 获取对话列表 循环查询多页
const getDialogList = async () => {
  if (useITT.value) {
    dialogListITT.value = [];
    let tmp: any[] = [];

    for (let i = 0; i < dialogCurPageITT.value; ++i) {
      const params = {
        pageNo: i + 1,
        pageSize: 20,
        type: 'image-to-text'
      };
      const res = await chatThemePage(params);
      if (!res || !Array.isArray(res.list)) return;
      tmp = tmp.concat(res.list);
    }
    dialogListITT.value = tmp.map((ele) => ({ ...ele }));
  } else {
    dialogListTTI.value = [];
    let tmp: any[] = [];

    for (let i = 0; i < dialogCurPageTTI.value; ++i) {
      const params = {
        pageNo: i + 1,
        pageSize: 20,
        type: 'text-to-image'
      };
      const res = await chatThemePage(params);
      if (!res || !Array.isArray(res.list)) return;
      tmp = tmp.concat(res.list);
    }
    dialogListTTI.value = tmp.map((ele) => ({ ...ele }));
  }
};
getDialogList();
watch(useITT, async () => {
  await getDialogList();
});

// 获取对话内容列表 循环查询多页
const getChatList = async () => {
  if (useITT.value) {
    const themeId = dialogListITT.value[dialogIdxITT.value].id;
    // chatListITT.value = [];
    let tmplist: any[] = [];

    for (let j = chatCurPageITT.value; j > 0; --j) {
      const params = {
        pageNo: j,
        pageSize: 10,
        themeId
      };
      const res = await chatHistoryPage(params);
      if (!res || !Array.isArray(res.list)) return;
      for (let i = 0; i < res.list.length; i += 2) {
        if (res.list[i].role === 'user') {
          const tmp = {
            ask: {
              text: res.list[i].message.text,
              image: '' === res.list[i].message.image ? '' : res.list[i].message.image.split(',')
            },
            answer: {
              text: res.list[i + 1].message.text,
              image:
                '' === res.list[i + 1].message.image ? '' : res.list[i + 1].message.image.split(',')
            }
          };
          tmplist.push(tmp);
        } else {
          const tmp = {
            ask: {
              text: res.list[i + 1].message.text,
              image:
                '' === res.list[i + 1].message.image ? '' : res.list[i + 1].message.image.split(',')
            },
            answer: {
              text: res.list[i].message.text,
              image: '' === res.list[i].message.image ? '' : res.list[i].message.image.split(',')
            }
          };
          tmplist.push(tmp);
        }
      }
    }
    chatListITT.value = tmplist;
  } else {
    const themeId = dialogListTTI.value[dialogIdxTTI.value].id;
    // chatListTTI.value = [];
    let tmplist: any[] = [];

    for (let j = chatCurPageTTI.value; j > 0; --j) {
      const params = {
        pageNo: j,
        pageSize: 10,
        themeId
      };

      const res = await chatHistoryPage(params);
      if (!res || !Array.isArray(res.list)) return;
      for (let i = 0; i < res.list.length; i += 2) {
        if (res.list[i].role === 'user') {
          const tmp = {
            ask: {
              text: res.list[i].message.text,
              image: '' === res.list[i].message.image ? '' : res.list[i].message.image.split(',')
            },
            answer: {
              text: res.list[i + 1].message.text,
              image:
                '' === res.list[i + 1].message.image ? '' : res.list[i + 1].message.image.split(',')
            }
          };
          tmplist.push(tmp);
        } else {
          const tmp = {
            ask: {
              text: res.list[i + 1].message.text,
              image:
                '' === res.list[i + 1].message.image ? '' : res.list[i + 1].message.image.split(',')
            },
            answer: {
              text: res.list[i].message.text,
              image: '' === res.list[i].message.image ? '' : res.list[i].message.image.split(',')
            }
          };
          tmplist.push(tmp);
        }
      }
    }
    chatListTTI.value = tmplist;
  }
};
watch(dialogIdxITT, async () => {
  if (-1 !== dialogIdxITT.value) {
    await getChatList();
    await chatScrollBottom();
  }
});
watch(dialogIdxTTI, async () => {
  if (-1 !== dialogIdxTTI.value) {
    await getChatList();
    await chatScrollBottom();
  }
});

// 改变最大返回长度的响应函数
const handleInputChange = (val: any) => {
  const n = Number(val);
  if (Number.isInteger(n)) {
    maxResLenITT.value = n;
  } else {
    maxResLenITT.value = 1;
  }
};

// 删除输入框中的图片
const handleClickDelImg = (index: number) => {
  inputImgListITT.value.splice(index, 1);
};

// 上传图片的弹框
const showUploadImg = ref(false);
const imgs = ref<any[]>([]);

// 打开上传弹框
const handleClickShowUploadImg = () => {
  showUploadImg.value = true;
  if (!inputtingITT.value) inputtingITT.value = true;
};

// 确认上传 把imgs的项目添加到inputImgList中 然后清空imgs
const handleConfirmUploadImg = () => {
  imgs.value.forEach((ele) => {
    inputImgListITT.value.push({ url: ele, showDel: false });
  });
  imgs.value = [];
  showUploadImg.value = false;
};

// 取消上传
const handleClickCloseUploadImg = () => {
  imgs.value = [];
  showUploadImg.value = false;
};

// 提示文本列表
const supportText = ['总结图片内容', '提取图中文字'];

// 发送
const handleSubmit = () => {
  if (useITT.value) {
    submitITT();
  } else {
    submitTTI();
  }
};

// 流式输出
const flowOutput = (text: string) => {
  if (!text) {
    outputtingITT.value = false;
    return;
  }
  setTimeout(() => {
    const textArr = text.split('');
    const putText = textArr.shift();
    chatListITT.value[chatListITT.value.length - 1].answer.text += putText;
    flowOutput(textArr.join(''));
    chatScrollBottom();
  }, 100);
};

// 图文解析发送
const sendingITT = ref(false);
const submitITT = async () => {
  sendingITT.value = true;
  try {
    // 构造请求参数
    const model = 'ep-20241206121046-84924';
    const messages = [{ role: 'user', content: [] as any[] }];
    messages[0].content.push({ type: 'text', text: inputTextITT.value });
    inputImgListITT.value.forEach((ele) => {
      messages[0].content.push({ type: 'image_url', image_url: { url: ele.url } });
    });
    const max_tokens = maxResLenITT.value;
    const data = { model, messages, max_tokens };

    // 请求数据
    const res = await postImgToText(data);
    // TODO: 错误处理
    const content = res.data.choices[0].message.content;
    const modelName = res.data.model;

    // 如果没有聊天 新建一个 重新加载列表 选中新建的对话
    let themeId: string;
    if (-1 === dialogIdxITT.value) {
      themeId = await chatThemeCreate({
        theme: inputTextITT.value,
        model: modelName,
        type: 'image-to-text'
      });
      await getDialogList();
      dialogIdxITT.value = dialogListITT.value.findIndex((ele) => ele.id === themeId);
    } else {
      // 如果有聊天 加载聊天记录 更新模型名称
      themeId = dialogListITT.value[dialogIdxITT.value].id;
      await putUpdateChatTheme({
        id: themeId,
        theme: dialogListITT.value[dialogIdxITT.value].theme,
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

    chatListITT.value.push({
      ask: { text: inputTextITT.value, image: [...list] },
      answer: { text: returnStreamITT.value ? '' : content, image: '' }
    });

    if (returnStreamITT.value) {
      outputtingITT.value = true;
      flowOutput(content);
    }

    // 发送完清空输入文字和图片列表
    inputTextITT.value = '';
    inputImgListITT.value = [];

    // 滚动条滚动到最底部
    await chatScrollBottom();
  } catch (e) {
    console.log(e);
  } finally {
    sendingITT.value = false;
  }
};

// 文生图发送
const imageUrl = ref('');
const sending = ref(false);
const submitTTI = async () => {
  sending.value = true;
  try {
    const headers = {
      AccessKey: 'AKLTZTQ1NDUzYmIyMDljNDVlMmIyNGZhNmY0M2Q1MmJiNDA',
      SecretKey: 'WldJd1pqTmlNV0U1WmpCbU5EazBNbUkxTURVNVkyVXdNelJsWlRkaU5XUQ=='
    };
    const data = {
      req_key: 'high_aes_general_v20'
    };

    const res = await getauth({
      prompt: inputTextTTI.value,
      access_key: headers.AccessKey,
      secret_key: headers.SecretKey
    });
    console.log(res.data.data);
    const urls = [res.data.data];

    imageUrl.value = res.data.data;
    console.log('imageUrl', imageUrl.value);
    //  TODO 错误处理

    // 如果没有聊天 新建一个 重新加载列表 选中新建的对话
    let themeId: string;
    if (-1 === dialogIdxTTI.value) {
      themeId = await chatThemeCreate({
        theme: inputTextTTI.value,
        model: data.req_key,
        type: 'text-to-image'
      });
      await getDialogList();
      dialogIdxTTI.value = dialogListTTI.value.findIndex((ele) => ele.id === themeId);
    } else {
      // 如果有聊天 加载聊天记录 更新模型名称
      themeId = dialogListTTI.value[dialogIdxTTI.value].id;
      await putUpdateChatTheme({
        id: themeId,
        theme: dialogListTTI.value[dialogIdxTTI.value].theme,
        model: data.req_key,
        type: 'text-to-image'
      });
    }

    // 保存聊天记录
    await postCreateChatHistory({
      themeId,
      role: 'user',
      message: {
        text: inputTextTTI.value,
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

    chatListTTI.value.push({
      ask: { text: inputTextTTI.value, image: '' },
      answer: { text: '', image: urls }
    });

    // 发送完清空输入文字
    inputTextTTI.value = '';

    // 滚动条滚动到最底部
    await chatScrollBottom();
  } catch (e) {
    console.log(e);
  } finally {
    sending.value = false;
  }
};

// 对话内容滚动到底部
const chatScrollBottom = async () => {
  await nextTick();
  if (useITT.value) {
    const scrollbar = chatRefITT.value;
    if (scrollbar) {
      const scroll = scrollbar.wrapRef;
      scrollbar.setScrollTop(scroll.scrollHeight);
    }
  } else {
    const scrollbar = chatRefTTI.value;
    if (scrollbar) {
      const scroll = scrollbar.wrapRef;
      scrollbar.setScrollTop(scroll.scrollHeight);
    }
  }
};

// 对话列表滚动到底部
const dialogScrollBottom = async () => {
  await nextTick();
  if (useITT.value) {
    const scrollbar = dialogRefITT.value;
    if (scrollbar) {
      const scroll = scrollbar.wrapRef;
      scrollbar.setScrollTop(scroll.scrollHeight);
    }
  } else {
    const scrollbar = dialogRefTTI.value;
    if (scrollbar) {
      const scroll = scrollbar.wrapRef;
      scrollbar.setScrollTop(scroll.scrollHeight);
    }
  }
};

// 新建对话(开启新对话) 对话下标设置为-1 输入状态设置为false 输入内容清空 对话内容清空
const handleCreateDialog = async () => {
  if (useITT.value) {
    if (-1 === dialogIdxITT.value) {
      msg.warning('当前已经是新对话');
      return;
    }
    dialogIdxITT.value = -1;
    inputtingITT.value = false;
    inputTextITT.value = '';
    inputImgListITT.value = [];
    chatListITT.value = [];
  } else {
    if (-1 === dialogIdxTTI.value) {
      msg.warning('当前已经是新对话');
      return;
    }
    dialogIdxTTI.value = -1;
    inputtingTTI.value = false;
    inputTextTTI.value = '';
    chatListTTI.value = [];
  }
};

// 删除对话
const handleDelDialog = async (index: number) => {
  try {
    await msg.delConfirm();

    if (useITT.value) {
      const themeId = dialogListITT.value[dialogIdxITT.value].id;
      await chatThemeDelete({ id: themeId });

      // 删除完重置对话列表和输入内容 下标设置为-1 重新设置当前查询页数
      dialogIdxITT.value = -1;
      inputtingITT.value = false;
      inputTextITT.value = '';
      inputImgListITT.value = [];
      chatListITT.value = [];
      if ((dialogCurPageITT.value - 1) * 20 >= dialogListITT.value.length) {
        dialogCurPageITT.value -= 1;
      }
    } else {
      const themeId = dialogListTTI.value[dialogIdxTTI.value].id;
      await chatThemeDelete({ id: themeId });

      dialogIdxTTI.value = -1;
      inputtingTTI.value = false;
      inputTextTTI.value = '';
      chatListTTI.value = [];
      if ((dialogCurPageTTI.value - 1) * 20 >= dialogListTTI.value.length) {
        dialogCurPageTTI.value -= 1;
      }
    }

    // 删除完重新查询对话列表
    await getDialogList();
  } catch (e) {
    if ('cancel' === e) {
      console.log('取消删除对话');
    } else {
      console.log(e);
    }
  }
};

// 修改对话名称
const handleEditDialog = async () => {
  if (useITT.value) {
    const id = dialogListITT.value[dialogEditIdxITT.value].id;
    const theme = dialogEditTextITT.value;
    const model = dialogListITT.value[dialogEditIdxITT.value].model;
    const type = 'image-to-text';
    await putUpdateChatTheme({ id, theme, model, type });

    dialogEditIdxITT.value = -1;
    dialogEditTextITT.value = '';
    await getDialogList();
  } else {
    const id = dialogListTTI.value[dialogEditIdxTTI.value].id;
    const theme = dialogEditTextTTI.value;
    const model = dialogListTTI.value[dialogEditIdxTTI.value].model;
    const type = 'text-to-image';
    await putUpdateChatTheme({ id, theme, model, type });

    dialogEditIdxTTI.value = -1;
    dialogEditTextTTI.value = '';
    await getDialogList();
  }
};

// 对话列表滚动事件 滚动到最底部时 决定是否请求新一页对话
const handleDialogScroll = async ({ scrollLeft, scrollTop }) => {
  if (useITT.value) {
    const h = dialogRefITT.value.wrapRef.scrollHeight;
    const clientHeight = dialogRefITT.value.wrapRef.clientHeight;
    const fullNum = dialogCurPageITT.value * 20;
    const len = dialogListITT.value.length;
    if (h === scrollTop + clientHeight && len === fullNum) {
      dialogCurPageITT.value += 1;
      await getDialogList();
      await dialogScrollBottom();
    }
  } else {
    const h = dialogRefTTI.value.wrapRef.scrollHeight;
    const fullNum = dialogCurPageTTI.value * 20;
    const len = dialogListTTI.value.length;
    if (h === scrollTop && len === fullNum) {
      dialogCurPageTTI.value += 1;
      await getDialogList();
      await dialogScrollBottom();
    }
  }
};

// 对话内容滚动事件
const loadingITT = ref(false);
const loadingTTI = ref(false);
const handleChatScroll = async ({ scrollLeft, scrollTop }) => {
  if (useITT.value) {
    const fullNum = chatCurPageITT.value * 10;
    const len = chatListITT.value.length * 2;
    if (0 === scrollTop && len === fullNum) {
      loadingITT.value = true;
      const oldHeight = chatRefITT.value.wrapRef.scrollHeight;
      chatCurPageITT.value += 1;
      await getChatList();
      await nextTick();
      const newHeight = chatRefITT.value.wrapRef.scrollHeight;
      chatRefITT.value.setScrollTop(newHeight - oldHeight);
      loadingITT.value = false;
    }
  } else {
    const fullNum = chatCurPageTTI.value * 10;
    const len = chatListTTI.value.length * 2;
    if (0 === scrollTop && len === fullNum) {
      loadingTTI.value = true;
      const oldHeight = chatRefTTI.value.wrapRef.scrollHeight;
      chatCurPageTTI.value += 1;
      await getChatList();
      await nextTick();
      const newHeight = chatRefTTI.value.wrapRef.scrollHeight;
      chatRefTTI.value.setScrollTop(newHeight - oldHeight);
      loadingTTI.value = false;
    }
  }
};

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
  <div
    class="vision-model w-full flex text-[3px] md:text-[4px] lg:text-[6px] xl:text-[7px] 2xl:text-[10px]"
  >
    <template v-if="useITT">
      <!-- 对话历史 -->
      <div
        class="flex-none relative side-bar-wrapper w-[25.6em] h-full transition-all"
        :style="{
          marginLeft: dialogExpandITT ? '0' : '-25.7em',
          borderRight: '0.1em solid var(--default-border-color)'
        }"
      >
        <!-- 收起展开 -->
        <div
          @click="dialogExpandITT = !dialogExpandITT"
          class="w-[2.4em] h-[4.8em] absolute top-1/2 right-[-3.2em] -translate-y-1/2 collapse-btn cursor-pointer z-10"
          :style="{ transform: dialogExpandITT ? 'rotate(0deg)' : 'rotate(180deg)' }"
        ></div>

        <!-- 新建按钮 -->
        <div
          @click="handleCreateDialog"
          class="flex justify-center items-center new-chat-btn !mx-[1.6em] text-white cursor-pointer select-none shadow-md"
        >
          <el-icon class="mr-[0.4em] !text-[1.4em]"><Plus /></el-icon>
          <span class="text-white text-[1.4em]">新建对话</span>
        </div>

        <!-- 对话历史列表 -->
        <div class="h-[calc(100%-8.8em)]">
          <el-scrollbar
            ref="dialogRefITT"
            @scroll="handleDialogScroll"
            view-class="space-y-[1.6em]"
          >
            <div
              v-for="(item, index) in dialogListITT"
              :key="item.id"
              class="w-full px-[1.6em] box-border cursor-pointer"
              @click="dialogIdxITT = index"
            >
              <div
                class="w-full px-[1.6em] py-[0.8em] box-border space-y-[0.4em] relative"
                :class="`${index === dialogIdxITT && 'active-chat-info-item'}`"
              >
                <div v-show="dialogEditIdxITT !== index" class="truncate text-[1.4em]">
                  {{ item.theme }}
                </div>
                <div v-show="dialogEditIdxITT === index">
                  <el-input v-model="dialogEditTextITT" />
                </div>
                <div class="text-[#999] text-[1.2em]">{{ item.model }}</div>
                <div
                  v-show="index === dialogIdxITT"
                  class="absolute top-0 right-[0.6em] w-[1.6em] h-full !mt-0 flex flex-col justify-center space-y-[0.8em] text-[1.4em]"
                >
                  <template v-if="dialogEditIdxITT === -1">
                    <el-icon
                      @click.stop="
                        dialogEditIdxITT = index;
                        dialogEditTextITT = item.theme;
                      "
                    >
                      <Edit />
                    </el-icon>
                    <el-icon @click.stop="handleDelDialog(index)"><Delete /></el-icon>
                  </template>
                  <template v-else>
                    <el-icon @click.stop="handleEditDialog"><Check /></el-icon>
                    <el-icon
                      @click.stop="
                        dialogEditIdxITT = -1;
                        dialogEditTextITT = '';
                      "
                    >
                      <Close />
                    </el-icon>
                  </template>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <!-- 内容 -->
      <div class="grow h-full main-container-wrapper">
        <h1 class="m-0 mt-[3.2em] ml-[2.4em] text-[1em]">
          <span class="text-[1.8em]">智能视觉模型库V1.2.0</span>
        </h1>

        <div class="w-full h-[calc(100%-5em)] relative flex flex-col items-center">
          <!-- 切换模式 -->
          <div
            class="flex-none tab-container w-[63.73%] h-[4.8em] relative grid grid-cols-2 rounded-[1.6em] px-[0.4em] box-border shadow-md"
          >
            <div
              class="w-full h-[4em] my-[0.4em] flex justify-center items-center space-x-[1.2em] cursor-pointer rounded-[1.2em] z-10"
              @click="useITT = true"
            >
              <div
                class="w-[1.4em] h-[1.6em]"
                :class="`${useITT ? 'img-to-text-active' : 'img-to-text'}`"
              ></div>
              <div :class="`${useITT && 'active-tab-text'}`">
                <span class="text-[1.6em]">图文解析</span>
              </div>
            </div>
            <div
              class="w-full h-[4em] my-[0.4em] flex justify-center items-center space-x-[1.2em] cursor-pointer rounded-[1.2em] z-10"
              @click="useITT = false"
            >
              <div
                class="w-[1.4em] h-[1.6em]"
                :class="`${useITT ? 'text-to-img' : 'text-to-img-active'}`"
              ></div>
              <div :class="`${!useITT && 'active-tab-text'}`">
                <span class="text-[1.6em]">文生图</span>
              </div>
            </div>
            <div
              :class="`${useITT ? 'translate-x-0' : 'translate-x-full'}`"
              class="active-tab-bg absolute left-[0.4em] top-[0.4em] w-[calc((100%-0.8em)/2)] h-[4em] rounded-[1.2em] transition-all"
            ></div>
          </div>

          <!-- 初始内容 -->
          <div v-show="chatListITT.length <= 0" class="w-[63.37%] grow overflow-hidden">
            <el-scrollbar class="hide-scrollbar">
              <div class="mt-[6em] space-y-[4.8em]">
                <div class="flex items-center space-x-[1.6em]">
                  <div class="flex-none w-[2.8em] h-[2.8em] logo"></div>
                  <div class="text-[2.4em]">欢迎使用，智慧农业图文解析模型</div>
                </div>
                <div class="w-full grid grid-cols-3 gap-[0.8em]">
                  <div class="aspect-.9 card-bg-1 p-[2.2em] box-border">
                    <div class="text-[#333] dark:text-[#fff] text-[1.8em] font-bold">
                      识别图像中的内容
                    </div>
                    <div class="text-[#999] mt-[0.4em]">
                      <span class="text-[1.4em]">识别图像中作物种类，判断生长情况</span>
                    </div>
                  </div>
                  <div class="aspect-.9 card-bg-2 p-[2.2em] box-border">
                    <div class="text-[#333] dark:text-[#fff] text-[1.8em] font-bold">
                      总结图片中的内容
                    </div>
                    <div class="text-[#999] mt-[0.4em]">
                      <span class="text-[1.4em]">识别图片中病虫害并给出防治方法</span>
                    </div>
                  </div>
                  <div class="aspect-.9 card-bg-3 p-[2.2em] box-border">
                    <div class="text-[#333] dark:text-[#fff] text-[1.8em] font-bold">
                      提取图片中的文字
                    </div>
                    <div class="text-[#999] mt-[0.4em]">
                      <span class="text-[1.4em]">识别图片中农资说明上的文字</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <!-- 对话内容 -->
          <div v-if="chatListITT.length > 0" class="w-[calc(63.37%+10.4em)] grow overflow-hidden">
            <el-scrollbar
              class="hide-scrollbar"
              ref="chatRefITT"
              @scroll="handleChatScroll"
              view-class="px-[5.2em] pb-[2em]"
            >
              <div
                v-show="loadingITT"
                class="flex items-center justify-center w-full h-[3em] tracking-widest"
              >
                <span class="text-[#999999]">加载中......</span>
              </div>
              <template v-for="(item, index) in chatListITT" :key="index">
                <div class="relative flex flex-col items-end space-y-[1.6em] mt-[3.6em]">
                  <div class="bg-[#E0DFFF] dark:bg-[#615CED] px-[2.5em] py-[1.4em] rounded-[1.6em]">
                    <span class="text-[1.4em]">{{ item.ask.text }}</span>
                  </div>
                  <div class="w-full grid grid-cols-4 gap-[0.8em] direction-rtl">
                    <div v-for="ele in item.ask.image" :key="ele" class="pb-[100%] relative w-full">
                      <img
                        :src="ele"
                        class="absolute top-0 left-0 rounded-[0.6em] w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div
                    class="w-[3.6em] h-[3.6em] absolute top-0 right-[-1.6em] vision-avatar !mt-0 translate-x-full"
                  ></div>
                </div>

                <div class="relative flex mt-[2.4em]">
                  <div class="answer-bg rounded-[1.6em] px-[2.2em] py-[1.8em]">
                    <span class="text-[1.4em]">{{ item.answer.text }}</span>
                  </div>
                  <div
                    class="w-[3.6em] h-[3.6em] absolute top-0 left-[-1.6em] -translate-x-full logo"
                  ></div>
                </div>
              </template>
            </el-scrollbar>
          </div>

          <!-- 初始输入框 -->
          <div
            v-if="!inputtingITT"
            class="flex-none mt-[2.4em] w-[63.73%] h-[4.8em] flex justify-between items-center mb-[5.2em] input-out-container z-10 px-[2em] box-border cursor-pointer hover:!border-[#615CED]"
            @click="inputtingITT = true"
          >
            <div class="flex items-center space-x-[1.6em]">
              <el-button
                class="upload-btn !text-[1em] !px-[1.1em] !py-[0.5em] !h-fit"
                @click.stop="handleClickShowUploadImg"
              >
                <div class="w-[1.4em] h-[1.3em] upload-icon"></div>
                <span class="ml-[0.4em] text-[1.2em]">上传图片</span>
              </el-button>
              <span class="text-[#999] self-baseline text-[1.6em]">
                请输入问题，我可以完成智能回答、图片内容解答等多种任务
              </span>
            </div>
            <div class="w-[4.8em] h-[3.2em] no-send-btn"></div>
          </div>

          <!-- 输入框 -->
          <div
            v-else
            class="flex-none w-[63.73%] mb-[5.2em] mt-[2.4em] fix-border-color p-[0.2em] rounded-[1.6em]"
          >
            <div class="input-out-container w-full px-[2em] py-[0.8em] box-border">
              <div v-if="inputImgListITT.length > 0" class="h-[6.8em] flex space-x-[0.8em]">
                <div class="relative" v-for="(item, index) in inputImgListITT" :key="item.url">
                  <el-image
                    :src="item.url"
                    :preview-src-list="[item.url]"
                    fit="cover"
                    class="w-[6.8em] h-[6.8em] rounded-[0.6em]"
                    preview-teleported
                    @mouseenter="item.showDel = true"
                    @mouseleave="item.showDel = false"
                  />
                  <div
                    v-show="item.showDel"
                    class="absolute right-[0.2em] bottom-[0.2em] w-[1.4em] h-[1.4em] delete-img"
                    @click="handleClickDelImg(index)"
                  ></div>
                </div>
              </div>
              <div
                v-if="inputImgListITT.length > 0"
                class="my-[1.6em] h-[3.2em] flex items-center space-x-[0.8em]"
              >
                <div
                  v-for="item in supportText"
                  :key="item"
                  class="flex items-center px-[1.6em] py-[0.6em] rounded-[0.6em] bg-[#F5F6FA] dark:bg-[#2C3240] cursor-pointer"
                  @click="inputTextITT += item + ' '"
                >
                  <span class="text-[1.4em]">{{ item }}</span>
                  <el-icon class="ml-[1.8em]"><Right /></el-icon>
                </div>
              </div>
              <el-input
                type="textarea"
                v-model="inputTextITT"
                class="input-text"
                resize="none"
                :autosize="{ minRows: 1, maxRows: 6 }"
                placeholder="请输入问题，我可以完成智能回答、图片内容解答等多种任务"
                input-style="font-size: 1.6em;"
              />
              <div class="mt-[1.6em] flex justify-between items-center">
                <el-button
                  class="upload-btn !text-[1em] !px-[1.1em] !py-[0.5em] !h-fit"
                  @click="handleClickShowUploadImg"
                >
                  <div class="w-[1.4em] h-[1.3em] upload-icon"></div>
                  <span class="ml-[0.4em] text-[1.2em]">上传图片</span>
                </el-button>
                <div
                  v-loading="sendingITT"
                  v-if="
                    inputtingITT &&
                    '' !== inputTextITT &&
                    inputImgListITT.length > 0 &&
                    !outputtingITT
                  "
                  @click="handleSubmit"
                  class="w-[4.8em] h-[3.2em] send-btn cursor-pointer"
                ></div>
                <div v-else class="w-[4.8em] h-[3.2em] no-send-btn cursor-pointer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图文解析参数设置 -->
      <div
        :class="`${settingExpandITT ? 'mr-0' : 'mr-[-25.7em]'}`"
        class="right-panel-wrapper flex-none relative w-[25.6em] h-full border-l-[0.1em] border-l-solid border-[#F7F8FA] dark:border-0 transition-all"
      >
        <!-- 展开收起 -->
        <div
          @click="settingExpandITT = !settingExpandITT"
          class="absolute top-[2.4em] left-[-13.4em] w-[11em] h-[3.6em] flex justify-between items-center px-[1.6em] box-border rounded-full bg-white cursor-pointer setting-bg"
        >
          <el-icon><Operation /></el-icon>
          <span class="text-[1.4em]">参数设置</span>
        </div>

        <!-- 配置内容 -->
        <div class="w-full h-full box-border space-y-[2.4em]">
          <div
            class="w-full flex items-center justify-between pb-[1.6em]"
            style="border-bottom: 0.1em solid var(--default-border-color)"
          >
            <div class="text-[1.4em]">参数设置</div>
            <div
              class="close w-[1.6em] h-[1.6em] cursor-pointer"
              @click="settingExpandITT = false"
            ></div>
          </div>
          <div class="space-y-[1.6em]">
            <div class="text-[1.4em]">是否流式返回</div>
            <el-switch v-model="returnStreamITT" />
          </div>
          <div class="space-y-[1.6em]">
            <div class="text-[1.4em]">最大返回长度</div>
            <div class="flex space-x-[1.6em]">
              <el-slider v-model="maxResLenITT" :max="4096" :min="1" />
              <el-input
                v-model="maxResLenITT"
                style="width: 9.6em"
                input-style="font-size: 1.4em"
                @input="handleInputChange"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- 对话历史 -->
      <div
        class="flex-none relative side-bar-wrapper w-[25.6em] h-full transition-all"
        :style="{
          marginLeft: dialogExpandTTI ? '0' : '-25.7em',
          borderRight: '0.1em solid var(--default-border-color)'
        }"
      >
        <!-- 收起展开 -->
        <div
          @click="dialogExpandTTI = !dialogExpandTTI"
          class="w-[2.4em] h-[4.8em] absolute top-1/2 right-[-3.2em] -translate-y-1/2 collapse-btn cursor-pointer z-10"
          :style="{ transform: dialogExpandTTI ? 'rotate(0deg)' : 'rotate(180deg)' }"
        ></div>

        <!-- 新建按钮 -->
        <div
          @click="handleCreateDialog"
          class="flex justify-center items-center new-chat-btn !mx-[1.6em] text-white cursor-pointer select-none shadow-md"
        >
          <el-icon class="mr-[0.4em] !text-[1.4em]"><Plus /></el-icon>
          <span class="text-white text-[1.4em]">新建对话</span>
        </div>

        <!-- 对话历史列表 -->
        <div class="h-[calc(100%-8.8em)]">
          <el-scrollbar
            ref="dialogRefTTI"
            @scroll="handleDialogScroll"
            view-class="space-y-[1.6em]"
          >
            <div
              v-for="(item, index) in dialogListTTI"
              :key="item.id"
              class="w-full px-[1.6em] box-border cursor-pointer"
              @click="dialogIdxTTI = index"
            >
              <div
                class="w-full px-[1.6em] py-[0.8em] box-border space-y-[0.4em] relative"
                :class="`${index === dialogIdxTTI && 'active-chat-info-item'}`"
              >
                <div v-show="dialogEditIdxTTI !== index" class="truncate text-[1.4em]">
                  {{ item.theme }}
                </div>
                <div v-show="dialogEditIdxTTI === index">
                  <el-input v-model="dialogEditTextTTI" />
                </div>
                <div class="text-[#999] text-[1.2em]">{{ item.model }}</div>
                <div
                  v-show="index === dialogIdxTTI"
                  class="absolute top-0 right-[0.6em] w-[1.6em] h-full !mt-0 flex flex-col justify-center space-y-[0.8em]"
                >
                  <template v-if="dialogEditIdxTTI === -1">
                    <el-icon
                      @click.stop="
                        dialogEditIdxTTI = index;
                        dialogEditTextTTI = item.theme;
                      "
                      class="text-[1.4em]"
                    >
                      <Edit />
                    </el-icon>
                    <el-icon @click.stop="handleDelDialog(index)"><Delete /></el-icon>
                  </template>
                  <template v-else>
                    <el-icon @click.stop="handleEditDialog"><Check /></el-icon>
                    <el-icon
                      @click.stop="
                        dialogEditIdxTTI = -1;
                        dialogEditTextTTI = '';
                      "
                    >
                      <Close />
                    </el-icon>
                  </template>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <!-- 内容 -->
      <div class="grow h-full main-container-wrapper">
        <h1 class="m-0 text-[1em] mt-[3.2em] ml-[2.4em]">
          <span class="text-[1.8em]">智能视觉模型库V1.2.0</span>
        </h1>

        <div class="w-full h-[calc(100%-5em)] flex flex-col items-center">
          <!-- 切换模式 -->
          <div
            class="flex-none tab-container w-[63.73%] h-[4.8em] relative grid grid-cols-2 rounded-[1.6em] px-[0.4em] box-border shadow-md"
          >
            <div
              class="w-full h-[4em] my-[0.4em] flex justify-center items-center space-x-[1.2em] cursor-pointer rounded-[1.2em] z-10"
              @click="useITT = true"
            >
              <div
                class="w-[1.4em] h-[1.6em]"
                :class="`${useITT ? 'img-to-text-active' : 'img-to-text'}`"
              ></div>
              <div :class="`${useITT && 'active-tab-text'}`">
                <span class="text-[1.6em]">图文解析</span>
              </div>
            </div>
            <div
              class="w-full h-[4em] my-[0.4em] flex justify-center items-center space-x-[1.2em] cursor-pointer rounded-[1.2em] z-10"
              @click="useITT = false"
            >
              <div
                class="w-[1.4em] h-[1.6em]"
                :class="`${useITT ? 'text-to-img' : 'text-to-img-active'}`"
              ></div>
              <div :class="`${!useITT && 'active-tab-text'}`">
                <span class="text-[1.6em]">文生图</span>
              </div>
            </div>
            <div
              :class="`${useITT ? 'translate-x-0' : 'translate-x-full'}`"
              class="active-tab-bg absolute left-[0.4em] top-[0.4em] w-[calc((100%-0.8em)/2)] h-[4em] rounded-[1.2em] transition-all"
            ></div>
          </div>

          <!-- 初始内容 -->
          <div v-show="chatListTTI.length <= 0" class="w-[63.37%] grow overflow-hidden">
            <el-scrollbar class="hide-scrollbar">
              <div class="mt-[6em] space-y-[4.8em]">
                <div class="flex items-center space-x-[1.6em]">
                  <div class="flex-none w-[2.8em] h-[2.8em] logo"></div>
                  <div class="text-[2.4em]">欢迎使用，智慧农业文生图模型</div>
                </div>
                <div class="w-full grid grid-cols-3 gap-[0.8em]">
                  <div class="aspect-.9 card-bg-4 p-[2.2em] box-border">
                    <div class="text-[#333] dark:text-[#fff] text-[1.8em] font-bold">
                      生成作物图片
                    </div>
                    <div class="text-[#999] mt-[0.4em]">
                      <span class="text-[1.4em]">农业，葡萄，科技，阳光</span>
                    </div>
                  </div>
                  <div class="aspect-.9 card-bg-5 p-[2.2em] box-border">
                    <div class="text-[#333] dark:text-[#fff] text-[1.8em] font-bold">
                      生成动物图片
                    </div>
                    <div class="text-[#999] mt-[0.4em]">
                      <span class="text-[1.4em]">草地，公鸡，蓝天白云</span>
                    </div>
                  </div>
                  <div class="aspect-.9 card-bg-6 p-[2.2em] box-border">
                    <div class="text-[#333] dark:text-[#fff] text-[1.8em] font-bold">
                      生成农田图片
                    </div>
                    <div class="text-[#999] mt-[0.4em]">
                      <span class="text-[1.4em]">乡村，农田，秧苗，房屋，远山</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <!-- 对话内容 -->
          <div v-if="chatListTTI.length > 0" class="w-[calc(63.37%+10.4em)] grow overflow-hidden">
            <el-scrollbar
              class="hide-scrollbar"
              ref="chatRefTTI"
              @scroll="handleChatScroll"
              view-class="px-[5.2em] pb-[6em]"
            >
              <div
                v-show="loadingTTI"
                class="flex items-center justify-center w-full h-[3em] tracking-widest"
              >
                <span class="text-[#999999]">加载中......</span>
              </div>
              <template v-for="(item, index) in chatListTTI" :key="index">
                <div class="relative flex justify-end mt-[3.6em]">
                  <div class="bg-[#E0DFFF] dark:bg-[#615CED] px-[2.5em] py-[1.4em] rounded-[1.6em]">
                    <span class="text-[1.4em]">{{ item.ask.text }}</span>
                  </div>
                  <div
                    class="w-[3.6em] h-[3.6em] absolute top-0 right-[-1.6em] vision-avatar !mt-0 translate-x-full"
                  ></div>
                </div>

                <div class="relative flex space-y-[1.6em] mt-[2.4em]">
                  <div class="w-full grid grid-cols-4 gap-[0.8em]">
                    <div
                      v-for="ele in item.answer.image"
                      :key="ele"
                      class="pb-[100%] relative w-full"
                    >
                      <img
                        :src="ele"
                        class="absolute top-0 left-0 rounded-[0.6em] w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div
                    class="w-[3.6em] h-[3.6em] absolute top-0 left-[-1.6em] -translate-x-full logo"
                  ></div>
                </div>
              </template>
            </el-scrollbar>
          </div>

          <!-- 初始输入框 -->
          <div
            v-if="!inputtingTTI"
            class="flex-none w-[63.73%] h-[4.8em] flex justify-between items-center mb-[5.2em] mt-[2.4em] input-out-container px-[2em] box-border cursor-pointer hover:!border-[#615CED]"
            @click="inputtingTTI = true"
          >
            <div class="flex items-center space-x-[1.6em]">
              <div></div>
              <span class="text-[#999] self-baseline text-[1.6em]">
                请输入问题，我可以完成智能回答、图片内容解答等多种任务
              </span>
            </div>
            <div class="w-[4.8em] h-[3.2em] no-send-btn relative"></div>
            <!-- size list -->
            <div class="w-full h-[3.4em] absolute left-0 top-[-4em]">
              <el-scrollbar view-class="flex space-x-[0.8em]">
                <div
                  v-for="(item, index) in sizeList"
                  :key="item.label"
                  class="size-bg"
                  :class="index === sizeIdx && 'active-size'"
                  @click.stop="sizeIdx = index"
                >
                  <div :class="item.iconClass" class="mr-[1em]"></div>
                  <span class="text-[1.4em]">{{ item.label }}</span>
                </div>
              </el-scrollbar>
            </div>
          </div>

          <!-- 输入框 -->
          <div
            v-else
            class="flex-none relative w-[63.73%] mb-[5.2em] mt-[5.8em] box-border fix-border-color p-[0.2em] rounded-[1.6em]"
          >
            <div class="input-out-container w-full px-[2em] py-[0.8em] box-border">
              <el-input
                type="textarea"
                v-model="inputTextTTI"
                class="input-text"
                resize="none"
                :autosize="{ minRows: 1, maxRows: 6 }"
                placeholder="请输入问题，我可以完成智能回答、图片内容解答等多种任务"
                input-style="font-size: 1.6em;"
              />
              <div class="mt-[1.6em] flex justify-between items-center">
                <div></div>
                <div
                  v-loading="sending"
                  v-if="inputtingTTI && '' !== inputTextTTI"
                  @click="handleSubmit"
                  class="w-[4.8em] h-[3.2em] send-btn cursor-pointer relative"
                ></div>
                <div v-else class="w-[4.8em] h-[3.2em] no-send-btn cursor-pointer"></div>
              </div>
              <!-- size list -->
              <div class="w-full h-[3.4em] absolute left-0 top-[-0.8em] z-10 -translate-y-full">
                <el-scrollbar view-class="flex space-x-[0.8em]">
                  <div
                    v-for="(item, index) in sizeList"
                    :key="item.label"
                    class="size-bg"
                    :class="index === sizeIdx && 'active-size'"
                    @click.stop="sizeIdx = index"
                  >
                    <div :class="item.iconClass"></div>
                    <span class="pl-[1em]">{{ item.label }}</span>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <Dialog
      v-model="showUploadImg"
      title="上传图片"
      width="66.2em"
      @close="handleClickCloseUploadImg"
    >
      <div v-show="imgs.length <= 0" class="text-center mb-[16px]">
        <span class="text-[1.6em]">点击下方按钮上传图片</span>
      </div>
      <div class="flex justify-center">
        <UploadImgs v-model="imgs" :limit="10" aria-readonly="true" />
      </div>
      <div class="flex justify-center mt-[16px] space-x-[8px]">
        <el-button color="#615ced" @click="handleConfirmUploadImg">保存</el-button>
        <el-button @click="handleClickCloseUploadImg">取消</el-button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.dark {
  .side-bar-wrapper {
    .active-chat-info-item {
      box-shadow: inset 0px 0px 1.6em 0px rgba(97, 92, 237, 0.5);
      border-radius: 0.8em;
      border: 0.1em solid #615ced;
      background: none;
    }
  }
  .main-container-wrapper {
    background: linear-gradient(to top, rgba(147, 98, 218, 0) 0%, rgba(67, 120, 255, 0.3) 100%),
      #0f121b;
    .fix-border-color {
      background: linear-gradient(to right, #4378ff, #9362da);
    }
    .input-out-container {
      background: #0f121b;
      border-radius: 1.6em;
      border: 0.2em solid transparent;
    }
    @for $i from 1 through 6 {
      .card-bg-#{$i} {
        background-image: url(./assets/vision-init-#{$i}-dark.png);
        background-size: 100% 100%;
      }
    }
    .params-config-btn {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2em;
      border: 0.1em solid rgba(255, 255, 255, 0.12);
    }
  }

  .setting-bg {
    background: rgba(255, 255, 255, 0.08);
  }

  .tab-container {
    background-color: transparent;
    border: 0.1em solid #615ced;
  }

  .active-tab-bg {
    background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
  }

  .active-tab-text {
    color: white;
  }

  .text-to-img,
  .text-to-img-active {
    background-image: url(./assets/vision-text-to-img-dark.png);
    background-size: 100% 100%;
  }

  .img-to-text,
  .img-to-text-active {
    background-image: url(./assets/vision-img-to-text-dark.png);
    background-size: 100% 100%;
  }

  .vision-avatar {
    background-image: url(./assets/user-avatar-dark.png);
    background-size: 100% 100%;
  }

  .answer-bg {
    background: radial-gradient(
        circle at -1% 0%,
        rgba(97, 92, 237, 0.24) 0%,
        rgba(97, 92, 237, 0) 100%
      ),
      #1f2531;
  }

  .size-bg {
    background-color: #2c3240;
    border: none;
    border-radius: 0.6em;
    width: 8.8em;
    height: 3.2em;
    display: flex;
    align-items: center;
  }

  .active-size {
    border: none;
    background: #615ced;
  }

  @for $i from 1 through 3 {
    .size-#{$i} {
      padding-left: 1.6em;
      width: 1.6em;
      height: 1.6em;
      background-image: url(./assets/vision-img-size-#{$i}.png);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
    }
  }

  @for $i from 2 through 3 {
    .size-#{$i}-rotate {
      width: 1.6em;
      height: 1.6em;
      background-image: url(./assets/vision-img-size-#{$i}.png);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      transform: rotate(90deg);
    }
  }

  .upload-icon {
    background-image: url(./assets/vision-uploadImg-dark.png);
    background-size: 100% 100%;
  }
}

.side-bar-wrapper {
  background-color: var(--side-panel-bg-color);
  .new-chat-btn {
    width: 22.4em;
    height: 4em;
    background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
    border-radius: 2em;
    margin: 2.4em 0;
  }
  .active-chat-info-item {
    border: 0.1em solid #615ced !important;
    background-image: linear-gradient(to top, #fff, #fafafe, #f0f0fe);
  }
}
.main-container-wrapper {
  background: linear-gradient(to top, #ffffff, #ffffff, #ffffff, #ededfd);
  .fix-border-color {
    background-color: #615ced;
  }
  .input-out-container {
    background: #ffffff;
    box-shadow: 0px 0.4em 1.6em 0px rgba(214, 213, 222, 0.5);
    border-radius: 1.6em;
    border: 0.2em solid transparent;
  }
  @for $i from 1 through 6 {
    .card-bg-#{$i} {
      background-image: url(./assets/vision-init-#{$i}.png);
      background-size: 100% 100%;
    }
  }
}

.params-config-btn {
  background: rgba(255, 255, 255, 1);
  border-radius: 2em;
  border: 0.1em solid rgba(255, 255, 255, 0.12);
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
  height: calc(100% - 5em);
}
.dark textarea {
  color: #fff;
}

:deep(textarea::-webkit-scrollbar) {
  width: 0.6em;
  height: 0.6em;
}
:deep(textarea::-webkit-scrollbar-thumb) {
  border-radius: 0.3em;
  -moz-border-radius: 0.3em;
  -webkit-border-radius: 0.3em;
  background-color: #c3c3c3;
}
:deep(textarea::-webkit-scrollbar-track) {
  background-color: transparent;
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

.content {
  background: linear-gradient(180deg, #ededfd 0%, #fff 40%, #fff 100%);
}

.create-btn {
  background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
}

.plus {
  width: 1.3em;
  height: 1.3em;
  background-image: url(./assets/vision-plus.png);
  background-size: 100% 100%;
}

.selected-history {
  background: linear-gradient(180deg, #efeffe 0%, #ffffff 100%);
  border-radius: 0.8em;
  border: 0.1em solid #615ced;
  box-shadow: 0px 0.4em 1.6em 0px rgba(214, 213, 222, 0.5);
}

.close {
  background-image: url(./assets/vision-close.png);
  background-size: 100% 100%;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #615ced;
  background-color: #615ced;
}

:deep(.el-slider__button) {
  border-color: #615ced;
}

:deep(.el-slider__bar) {
  background-color: #615ced;
}

.tab-container {
  background-color: white;
}

.active-tab-bg {
  background-color: #efeffe;
}

.active-tab-text {
  color: #615ced;
}

.text-to-img {
  background-image: url(./assets/vision-text-to-img.png);
  background-size: 100% 100%;
}
.text-to-img-active {
  background-image: url(./assets/vision-text-to-img-active.png);
  background-size: 100% 100%;
}

.img-to-text {
  background-image: url(./assets/vision-img-to-text.png);
  background-size: 100% 100%;
}
.img-to-text-active {
  background-image: url(./assets/vision-img-to-text-active.png);
  background-size: 100% 100%;
}

.logo {
  background-image: url(./assets/extraLogo.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.input-shadow {
  box-shadow: 0px 0.4em 1.6em 0px rgba(214, 213, 222, 0.5);
}

.upload-icon {
  background-image: url(./assets/vision-uploadImg.png);
  background-size: 100% 100%;
}

.no-send-btn {
  background-image: url(./assets/disabledSend.png);
  background-size: 100% 100%;
}

:deep(.upload-btn.el-button:hover),
:deep(.upload-btn.el-button:active),
:deep(.upload-btn.el-button:focus) {
  color: black;
  border-color: #f2f2fa;
  background-color: #f2f2fa;
}

:deep(.input-text .el-textarea__inner),
:deep(.input-text .el-textarea__inner:focus) {
  box-shadow: none;
}

.right-arrow {
  background-image: url(./assets/vision-right-arrow.png);
  background-size: 100% 100%;
}

.delete-img {
  background-image: url(./assets/vision-delete.png);
  background-size: 100% 100%;
}

.direction-rtl {
  direction: rtl;
}

.vision-avatar {
  background-image: url(./assets/userAvatar.png);
  background-size: 100% 100%;
}

.answer-bg {
  background-color: white;
}

.size-bg {
  padding-left: 1.6em;
  background-color: white;
  border: 0.1em solid #e6e6e6;
  border-radius: 0.6em;
  width: 6.4em;
  height: 3.2em;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.active-size {
  border: 0.1em solid #615ced;
  background: #f2f2fa;
}

@for $i from 1 through 3 {
  .size-#{$i} {
    width: 1.6em;
    height: 1.6em;
    background-image: url(./assets/vision-img-size-#{$i}.png);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
}

@for $i from 2 through 3 {
  .size-#{$i}-rotate {
    width: 1.6em;
    height: 1.6em;
    background-image: url(./assets/vision-img-size-#{$i}.png);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transform: rotate(90deg);
  }
}

:deep(.hide-scrollbar .el-scrollbar__bar.is-vertical) {
  display: none;
}

:deep(.el-textarea) {
  font-size: 1em !important;
}

:deep(.el-textarea__inner) {
  min-height: 0 !important;
  height: none !important;
}

:deep(.el-dialog__body) {
  font-size: 1em;
}

:deep(.el-dialog__header) {
  font-size: 1.6em;
}

:deep(.upload-box .upload .el-upload--picture-card),
:deep(.upload-box .upload .el-upload-list__item) {
  width: 15em;
  height: 15em;
  font-size: 1em;
}

:deep(.upload-box .upload .el-upload-dragger:hover) {
  border: 1px dashed #615ced;
}

:deep(.el-button:focus),
:deep(.el-button:hover) {
  color: #615ced;
  border-color: #615ced;
  background-color: transparent;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #615ced inset;
}

:deep(.el-input) {
  font-size: 1em;
}

.right-panel-wrapper {
  padding: 2.5em;
}
</style>

<style lang="scss">
.dark {
  .vision-model {
    .upload-btn.el-button:hover,
    .upload-btn.el-button:active,
    .upload-btn.el-button:focus {
      color: #ffffff;
      border-color: #615ced;
      background-color: #615ced;
    }
  }
}
</style>
