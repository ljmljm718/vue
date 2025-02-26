<template>
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
  <div
    v-else
    class="w-full h-[300px] flex flex-col justify-center items-center text-[#999999] tracking-widest"
  >
    暂无数据
  </div>
</template>
<script setup lang="ts">
import { chatHistoryPage } from '@/views/aiFrame/apis';
import imgDeepSeek from '@/views/aiFrame/assets/deepseek.svg';
import imgUp from '@/views/aiFrame/assets/up.svg';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/felipec.css';
const props = defineProps(['id']);
/* 获取当前ID的历史记录 */
const infoList = ref<any[]>([]);
const totalChat = ref(0);
const obtainChatHistory = async () => {
  if (!props.id) {
    console.log('没有历史记录ID', props.id);
    return;
  }
  try {
    const { list, total } = await chatHistoryPage({
      themeId: props.id,
      pageNo: 1,
      pageSize: 30
    });
    totalChat.value = total;
    if (Array.isArray(list)) {
      // 把返回结果整理成对话时的格式
      infoList.value = list.map((ele) => {
        if ('user' === ele.role) {
          return { ...ele, type: ele.role, text: ele.message.text };
        }
        if ('assistant' === ele.role) {
          const type = ele.role;
          const { main, think } = splitThinkAndContent(ele.message.text);
          return { ...ele, type, text: main, thinkContent: think, showThink: true };
        }
      });
    } else {
      infoList.value = [];
    }
  } catch (err) {
    console.log(`获取id[${props.id}]的历史记录失败`, err);
  }
};
obtainChatHistory();
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
      // console.log('tempThinkText', tempThinkText.replace(/\n/g, ''));
      if (tempThinkText.replace(/\n/g, '')) thinkRes = thinkContent;
      mainRes = mainMessage;
    }
  } else {
    // 没有思考过程，直接全部返回
    mainRes = fullText;
  }
  return { main: mainRes, think: thinkRes };
};
</script>
