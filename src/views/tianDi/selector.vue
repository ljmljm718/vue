<template>
  <div>
    <el-input
      v-model="posInputVal"
      placeholder="输入搜索位置"
      @keyup.enter="handlePosSearch"
    >
      <template #append>
        <el-button :icon="Search" @click="handlePosSearch" />
      </template>
    </el-input>
    <div class="bg-white pt-2">
      <div
        v-for="item in searchResList"
        :key="item.lonlat"
        class="flex space-x-2 text-[.8rem] items-center py-2 px-2 cursor-pointer hover:bg-[#f1f1f1]"
        @click="handleSearchResClick(item)"
      >
        <Search class="w-[.7rem] h-[.7rem] text-[#666666]" />
        <div>{{ item.name }}</div>
        <div class="text-[#252525] text-[.7rem]">{{ item.address }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'

defineComponent({ name: 'Selector' })
const posInputVal = ref<string>('')
const searchResList = ref<any[]>([])
const handlePosSearch = () => {
  axios.get("https://api.tianditu.gov.cn/v2/search", {
    params: {
      type: 'query',
      postStr: JSON.stringify({
        yingjiType: 1,
        sourceType: 0,
        keyWord: posInputVal.value,
        level: 18,
        mapBound: '73.66, 3.86, 135.05, 53.55',
        queryType: '4',
        start: 0,
        count: 10,
        queryTerminal: 10000
      }),
      tk: '3499364c33fd4aa4415dd8765d4c5b77'
    },
    headers: {}
  }).then((res:any) => {
    const { data } = res;
    const { suggests } = data;
    if (Array.isArray(suggests)) searchResList.value = suggests
  }).catch(err => {
    console.error("ERR", err);
  })
}

const emit = defineEmits(['change'])
const handleSearchResClick = (item) => {
  const position = item.lonlat.split(',')
  if (Array.isArray(position) && position.length === 2) {
    emit('change', {
      ...item,
      position
    })
  }
}
</script>