<template>
  <div class="w-full h-[500px] box-border">
    <div class="h-[40px] text-[16px] flex justify-center items-center">
      <div class="font-bold">AI智能对话</div>
    </div>
    <el-scrollbar
      :height="374"
      style="height: 374px"
      ref="chatScrollIns"
      class="px-[12px] py-[10px] box-border scroll-view bg-[#f5f6fa] dark:bg-[#141414]"
    >
      <div v-if="infoList.length > 0" class="official-content pb-[20px]">
        <div v-for="item in infoList" :key="item.key">
          <template v-if="item.type === 'user'">
            <div class="flex" style="flex-direction: row-reverse">
              <div
                style="
                  background-color: #356bfb;
                  color: white;
                  border-radius: 8px 8px 6px 8px;
                  padding: 6px 8px;
                  margin: 10px 0;
                "
              >
                {{ item.text }}
              </div>
            </div>
          </template>
          <template v-if="item.type === 'assistant'">
            <div class="avatar">
              <div class="avatar-icon"></div>
              <div class="avatar-name">AI小农人</div>
            </div>
            <div
              class="bg-white dark:bg-[#1d1e1f] rounded-md"
              style="padding: 6px 8px; margin-top: 10px"
            >
              <div v-if="item.thinkContent" class="flex flex-col" style="align-items: flex-start">
                <div
                  class="rounded-md flex items-center bg-[#f6f6f6] dark:text-[#333] cursor-default"
                  style="padding: 6px 8px"
                  @click="item.showThink = !item.showThink"
                >
                  <img :src="imgDeepSeek" style="width: 16px; height: 16px" />
                  <div style="padding: 0 8px">{{ item.text ? '已经深度思考' : '思考中...' }}</div>
                  <img :src="imgUp" style="width: 16px; height: 16px" />
                </div>
                <div
                  v-if="item.showThink"
                  style="
                    border-left: 2px solid #b0b0b0;
                    color: #b0b0b0;
                    padding: 6px 8px;
                    margin: 8px 0;
                  "
                >
                  {{ item.thinkContent }}
                </div>
              </div>
              <div v-if="item.text">
                <div
                  class="text-wrap box-border w-full"
                  :innerHTML="marked.parse(item.text)"
                  v-highlight
                ></div>
              </div>
              <div v-if="!item.text && !item.thinkContent">思考中...</div>
            </div>
          </template>
        </div>
      </div>
      <div v-else class="w-full h-[300px] flex flex-col justify-center items-center">
        <div class="big-logo"></div>
        <div style="font-size: 18px">Hi，我是AI小农人</div>
        <div style="font-size: 18px">你的智能农业助手</div>
      </div>
    </el-scrollbar>
    <div class="h-[86px] box-border">
      <div
        class="input-outer-container p-[2px] rounded-[8px] shadow-md relative"
        style="flex: 0 0 auto"
      >
        <div class="p-8px rounded-8px bg-white dark:bg-#121212 flex items-end overflow-hidden">
          <textarea
            class="ai-show-textarea grow"
            style="font-size: inherit"
            id="textarea"
            rows="2"
            wrap="soft"
            placeholder="请输入问题，我可以完成智能问答、文档编写、代码生成等多种任务…"
          ></textarea>
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
</template>
<script setup lang="ts">
import imgDeepSeek from '@/views/aiFrame/assets/deepseek.svg';
import imgUp from '@/views/aiFrame/assets/up.svg';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/felipec.css';
// @ts-ignore
import RadioButton from '@/views/aiFrame/pages/textChat/radioButton.vue';
import {
  getCollectionList,
  chatThemeCreate,
  chatThemePage,
  chatHistoryPage,
  chatThemeDelete,
  putUpdateChatTheme,
  getContextSearch,
  getBotChat,
  postDeepSeekChat
} from '@/views/aiFrame/apis';
const infoList = ref<any[]>([]);
const questionText = ref('');
const messageLoading = ref(false);
const themeId = ref('');
// 实现自定义指令 高亮代码块
const highlightForce = (el) => {
  if (!el) el = document;
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block: any) => {
    hljs.highlightBlock(block);
  });
};
const vHighlight = {
  updated(el: any) {
    highlightForce(el);
  }
};
// 语音功能正在进行，阻止消息发送
const radioRecording = ref<boolean>(false);
const disabledSendBtn = ref<boolean>(false);
const handleRadioRecoOutput = (text: string) => {
  const textarea = document.querySelector('textarea');
  if (!textarea) return;
  textarea.value = text;
  questionText.value = text;
};
// 消息记录滚动到最底下
const chatScrollIns = ref();
const scollToBottom = () => {
  if (!chatScrollIns.value) return;
  nextTick(() => {
    chatScrollIns.value.wrapRef.scrollTop = chatScrollIns.value.wrapRef.scrollHeight;
  });
};
onActivated(() => nextTick(() => scollToBottom()));
// 处理textarea输入框
const handleTextChange = () => {
  const textarea = document.querySelector('textarea');
  if (!textarea) return;
  textarea.addEventListener('input', (e: any) => {
    const text = e.target.value;
    questionText.value = text;
  });
  textarea.addEventListener('keydown', (event: any) => {
    const keyCode = event.keyCode;
    const shiftKey = event.shiftKey;
    if (!shiftKey && keyCode === 13) {
      handleSendMsg(null);
    }
  });
};
onMounted(() => handleTextChange());
// 分离think和content
const splitThinkAndContent = (fullText) => {
  let thinkRes = '';
  let mainRes = '';
  if (fullText.startsWith('<think>')) {
    // 如果开头出现<think>，说明有思考过程，需要进行分离
    if (fullText.indexOf('</think>') === -1) {
      // 没有</think>说明全是思考
      const tempThinkText = fullText.replace('<think>', '');
      if (tempThinkText.replace(/\n/g, '')) thinkRes = fullText.replace('<think>', '');
    } else {
      // 既有思考，也有主要内容
      const scriptRegex = /<think>([\s\S]*?)<\/think>/gi;
      const parts = fullText.split(scriptRegex);
      const [_, thinkContent, mainMessage] = parts;
      const tempThinkText = fullText.replace('<think>', '');
      console.log('tempThinkText', tempThinkText.replace(/\n/g, ''));
      if (tempThinkText.replace(/\n/g, '')) thinkRes = thinkContent;
      mainRes = mainMessage;
    }
  } else {
    // 没有思考过程，直接全部返回
    mainRes = fullText;
  }
  return { main: mainRes, think: thinkRes };
};
// 发送消息
const handleSendMsg = async (text) => {
  // 获取要发送的文本
  const textarea = document.querySelector('textarea');
  if (!textarea) return;
  if (!text) text = textarea.value;
  if (!text) return;
  // 没有ID则获取主题ID
  if (!themeId.value) {
    const data = await chatThemeCreate({
      collectionId: '',
      model: 'deepseek-r1:7b',
      theme: text,
      type: 'text'
    });
    console.log('请求得到的主题ID', data);
    if (data) themeId.value = data;
  }
  // 页面上显示用户消息
  radioRecording.value = true;
  if (disabledSendBtn.value) return;
  disabledSendBtn.value = true;
  infoList.value.push({
    type: 'user',
    text
  });
  textarea.value = '';
  scollToBottom();
  // 获取返回结果
  const assistantItem = {
    type: 'assistant',
    text: '',
    thinkContent: '',
    showThink: true
  };
  infoList.value.push(assistantItem);
  let message;
  const { data } = await postDeepSeekChat({
    model: 'deepseek-r1:7b',
    messages: [
      {
        role: 'user',
        content: text
      }
    ],
    stream: false
  }).catch(() => {
    message = '请求错误，请稍后重试';
  });
  if (!data || !data.message || !data.message.content) {
    message = '请求错误，请稍后重试';
  } else {
    message = data.message.content;
  }
  const { main, think } = splitThinkAndContent(message);
  // 模拟流式输出
  const flowOutput = (innerText = '', isThink = false) => {
    if (!innerText) {
      if (!isThink) disabledSendBtn.value = false;
      return;
    }
    setTimeout(() => {
      // 输出字符串的第一个字符 剩下的字符再流式输出
      const textArr = innerText.split('');
      const addText = textArr.shift();
      if (!isThink) {
        infoList.value[infoList.value.length - 1].text += addText;
      } else {
        infoList.value[infoList.value.length - 1].thinkContent += addText;
      }
      flowOutput(textArr.join(''), isThink);
      if (!isThink) scollToBottom();
    }, 60);
  };
  if (think) {
    flowOutput(think, true);
  }
  if (main) {
    flowOutput(main, false);
  }
  scollToBottom();
  questionText.value = '';
  textarea.value = '';
  radioRecording.value = false;
};
</script>
<style scoped lang="scss">
.avatar {
  display: flex;
  align-items: center;
}
.avatar-icon {
  width: 24px;
  height: 24px;
  background-image: url(@/views/aiFrame/assets/avatar.png);
  background-size: 100% 100%;
  flex: none;
}
.avatar-name {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
}
.disabled-send {
  background-image: url(@/views/aiFrame/assets/disabledSend.svg);
  background-size: 100% 100%;
}
.send-btn {
  background-image: url(@/views/aiFrame/assets/sendBtn.svg);
  background-size: 100% 100%;
}
.big-logo {
  width: 160px;
  height: 160px;
  background-image: url(@/views/aiFrame/assets/bigLogo.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
