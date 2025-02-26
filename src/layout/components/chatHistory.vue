<template>
  <div
    v-for="item in chatList"
    :key="item.id"
    class="bg-white dark:bg-[#1d1e1f] rounded-[8px] p-[16px] flex justify-between items-center chat-item cursor-pointer"
    @click="handleClickItem(item)"
  >
    <div class="w-4/5 overflow-hidden">
      <div class="truncate text-[16px]">{{ item.theme }}</div>
      <div class="truncate text-[#999999] mt-[8px]">{{ item.dateStr ? item.dateStr : '' }}</div>
    </div>
    <div class="w-[16px] h-[16px] right-arrow"></div>
  </div>
</template>
<script setup lang="ts">
import { chatThemePage } from '@/views/aiFrame/apis';
const chatList = ref<any[]>([]);
const totalChat = ref(0);
/* 获取历史对话列表 */
const obtainChatTheme = async () => {
  try {
    const { list, total } = await chatThemePage({
      pageNo: 1,
      pageSize: 30,
      type: 'text'
    });
    totalChat.value = isNaN(total) ? 0 : total;
    if (Array.isArray(list)) {
      const tmpList = list.map((ele) => {
        const date = new Date(ele.createTime);
        if (!isNaN(date.getTime())) {
          const dateStr = formatDate(date);
          return { ...ele, dateStr };
        } else {
          return { ...ele };
        }
      });
      chatList.value = tmpList;
    } else {
      chatList.value = [];
    }
  } catch (err) {
    console.log('获取对话记录失败', err);
  }
};
obtainChatTheme();
// 格式化日期时间为 "yyyy-MM-dd HH:mm:ss"
function formatDate(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}
const emit = defineEmits(['goToDetail']);
/* 跳转到详情 */
const handleClickItem = (item) => {
  emit('goToDetail', item.id);
};
</script>
<style scoped lang="scss">
.right-arrow {
  flex: none;
  background-image: url(@/views/aiFrame/assets/rightTri.svg);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
.chat-item:nth-child(n + 2) {
  margin-top: 8px;
}
</style>
