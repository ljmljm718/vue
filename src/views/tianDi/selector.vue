<template>
  <div>
    <el-input v-model="posInputVal" placeholder="输入搜索位置" @keyup.enter="handlePosSearch">
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
import { searchDoc } from './searchTool'
import { ref, defineComponent } from 'vue'
import { uniqBy } from 'lodash-es'

defineComponent({ name: 'Selector' })
const posInputVal = ref<string>('')
const searchResList = ref<any[]>([])

//密钥
const tkArray = [
  '3499364c33fd4aa4415dd8765d4c5b77',
  '10d3a30c08edf2c4a8a8256f69971e4e',
  'b46466202244272a7ace01d3b065e779',
  '729b3945ad130e240045f81a9f9e9cc7',
  '64a1e8cacb148e96b889f032696fcc20',
  '75f0434f240669f4a2df6359275146d2' //网页上的tk
]
let currentTkIndex = 0
const getNextTk = () => {
  const tk = tkArray[currentTkIndex]
  currentTkIndex = (currentTkIndex + 1) % tkArray.length
  return tk
}

const handlePosSearch = () => {
  const localSuggests = searchDoc(posInputVal.value)
  console.log('🚀 ~ handlePosSearch ~ localSuggests:', localSuggests)

  //重试次数
  const maxRetries = tkArray.length * 2
  const fetchData = (retryCount: number) => {
    if (retryCount <= 0) {
      alert('当前服务不稳定，请稍后再尝试。')
      return
    }

    const currentTk = getNextTk()
    const queryCount = localSuggests.length ? 10 - localSuggests.length : 10
    axios
      .get('https://api.tianditu.gov.cn/v2/search', {
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
            count: queryCount,
            queryTerminal: 10000
          }),
          tk: currentTk
        },
        headers: {}
      })
      .then((res: any) => {
        const { data } = res
        console.log('🚀 ~ handlePosSearch ~ data:', data)
        const { suggests } = data
        if (Array.isArray(suggests)) {
          if (Array.isArray(localSuggests)) {
            searchResList.value = uniqBy(
              [...localSuggests.map((item) => ({ ...item.meta })), ...suggests],
              'lonlat'
            )
          } else {
            searchResList.value = suggests
          }
        }
      })
      .catch((err) => {
        console.error(`Failed with tk:${currentTk}  retrying....`, err)
        fetchData(retryCount - 1)
        if (!Array.isArray(localSuggests)) return
        searchResList.value = localSuggests.map((item) => ({ ...item.meta }))
      })
  }
  fetchData(maxRetries)
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

const hiddenOptions = () => {
  searchResList.value = []
  posInputVal.value = ''
}

defineExpose({
  hiddenOptions
})
</script>