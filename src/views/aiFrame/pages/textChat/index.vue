<script setup lang="ts">
const pageMainTitle = ref<string>('智能文本模型库V1.2.0');
// 左右两边内容是否折叠
const leftPanelCollapsed = ref<boolean>(false);
const rightPanelCollapsed = ref<boolean>(false);

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

const ss = ref<string>('');
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
      <div class="container bg-blue mx-auto flex flex-col" style="height: calc(100% - 64px)"></div>
    </div>
    <div
      class="side-bar-frame right-side-bar-frame z-30 h-full shadow-md transition-all duration-200px"
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
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
