<script setup lang="ts">
import { cropBase } from './api';
import dayjs from 'dayjs'

//种养信息
const cropList = ref<any[]>([]);
const getCropBase = async () => {
  const { list } = await cropBase({ pageNo: 1, pageSize: 100 })
  console.log("🚀 ~ getCropBase ~ list:", list)
  if (!Array.isArray(list)) return;
  cropList.value = list;
}
getCropBase()

</script>
<template>
  <div class="w-full h-full pt-[10px] pb-[20px] box-border">
    <el-scrollbar style="height: 100%;height: 100%;">
      <div class="px-3 box-border grid grid-cols-2 gap-3 text-white">
        <div
          class="plant-bg w-full p-3 box-border"
          v-for="item in cropList"
          :key="item.id"
        >
          <img :src="item.imgId" class="w-full h-130px object-contain" />
          <div class="flex items-start space-x-2 mt-2">
            <div class="w-5px h-14px bg-#01F892 mt-1 ml-1"></div>
            <div class="space-y-2 text-#d1d1d1 text-12px">
              <div class="text-[16px] text-white">{{ item.cropName }}</div>
              <div class="text-[12px]">
                <span>所属地块:</span>
                <span>{{ item.plotName }}</span>
              </div>
              <div class="text-[12px]">
                <span>起止时间:</span>
                <div class="text-[12px]">
                  {{ dayjs(item.receiptStartTime).format('YYYY-MM-DD') }}
                  -
                  {{
                    item.receiptEndTime
                      ? dayjs(item.receiptEndTime).format('YYYY-MM-DD')
                      : '暂无数据'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<style scoped lang="scss">
.plant-bg {
  background-image: url(./assets/plantBg.png);
  background-size: 100% 100%;
}
</style>
