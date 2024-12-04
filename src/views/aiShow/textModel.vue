<script setup lang="ts">
import avatar from './assets/avatar.png';
import userAvatar from './assets/userAvatar.png';

const sideBarCollapsed = ref<boolean>(false);
const chatList = ref<any[]>([
  { role: 'user', text: '我是用户' },
  { role: 'robot', text: '我是机器人' }
]);
const questionText = ref<string>('');
const remindArr = ref<any[]>([
  { text: '智慧农业AI助手能为您做什么？' },
  { text: '水肥一体化灌溉流程需要注意什么？' },
  { text: '农作物病虫害知识库文档编写？' }
]);

// 参数配置
const knowledgeLib = ref<string>(''); // 知识库
const knowledgeLibOptions = ref<any[]>([]);
const modelSelected = ref<string>(''); // 大模型
const modelOptions = ref<any[]>([]);
const enabledflowRes = ref<boolean>(true); // 开启流式返回
const maxResLength = ref<number>(1000); // 最大返回长度

// 发送消息
const handleSendMsg = async () => {
  const text = questionText.value;
  console.log('🚀 ~ handleSendMsg ~ text:', text);
  if (!text) return;
  chatList.value.push({ role: 'user', text: text });
  scollToBottom();
  // TODO 返回请求结果
  chatList.value.push({ role: 'robot', text: '你好我是机器人' });
  scollToBottom();
  questionText.value = '';
};

const chatScrollIns = ref();
const scollToBottom = () => {
  if (!chatScrollIns.value) return;
  nextTick(() => {
    chatScrollIns.value.wrapRef.scrollTop = chatScrollIns.value.wrapRef.scrollHeight;
  });
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
            :label="item.label"
            :value="item.value"
            :key="item.value"
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
      <div class="!text-[#000]">
        <el-input-number v-model="maxResLength" :min="1" :max="10000" />
      </div>
    </div>
    <div
      class="collapse-btn w-24px h-48px absolute right-[-33px]"
      style="top: calc(50% - 24px)"
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
      <div class="h-full 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px]">
        <div class="mt-[12px]" style="height: calc(100% - 110px)">
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
                  <div style="width: calc(100% - 80px)" class="bg-white rounded-1 p-12px">
                    {{ item.text }}
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div
          class="relative h-56px mt-12px 2xl:w-[1000px] xl:w-[848px] lg:w-[600px] md:w-[400px] sm:w-[400px]"
        >
          <el-input
            v-model="questionText"
            type="primary"
            clearable
            class="h-full"
            placeholder="请输入问题，我可以完成智能问答、文档编写、代码生成等多种任务"
            @keyup.enter="handleSendMsg()"
          />
          <div
            class="z-20 absolute right-16px top-12px w-48px h-32px disabled-send cursor-pointer"
            @click="handleSendMsg()"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.collapse-btn {
  background-image: url(./assets/collapseBtn.png);
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

.arrow-bg {
  background-image: url(./assets/arrow.png);
  background-size: 100% 100%;
}

:deep(.el-input) {
  border: 2px solid #00c784;
  border-radius: 6px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
}

:deep(.el-input__inner) {
  color: #333;
  padding: 0 66px 0 12px;
}

:deep(.el-input__suffix) {
  position: relative;
  right: 63px;
}
</style>
