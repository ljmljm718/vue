<template>
  <div class="w-full">
    <div class="md:col-span-3 mb-4">
      <el-card>
        <el-select v-model="value" placeholder="增氧机一号" size="large" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="flex space-x-10 mt-4">
          <div v-for="item in topStatusData" :key="item.title">
            <span>{{ item.title }}:</span>
            <span class="pl-2">{{ item.value }}</span>
          </div>
          <div>增氧机状态：在线</div>
          <div>地块名称：地块1</div>
          <div>通信时间：2024-7-24 10:20:00</div>
          <div>负责人：张三</div>
        </div>
      </el-card>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <el-card>
        <div class="flex">
          <div class="font-bold">溶解氧当前值：</div>
          <div class="font-bold text-#009688">4mg/L</div></div
        >
        <div class="flex items-center my-2 bg-[#fdeceb] text-[#E31205] p-2">
          <img src="./assets/warnIcon.png" class="w-4 h-4 mr-2" />
          <span>设备警告：溶解氧含量偏低，请及时调整增氧机功率！</span>
        </div>

        <div class="flex items-center my-2 bg-[#fdeceb] text-[#E31205] p-2">
          <img src="./assets/warnIcon.png" class="w-4 h-4 mr-2" />
          <span>设备警告：溶解氧含量偏低，请及时调整增氧机功率！</span>
        </div>
      </el-card>
      <el-card class="w-full">
        <div class="font-bold mb-4">增氧机参数</div>
        <div class="flex h-17 gap-3 mx-3">
          <div
            class="flex-1 bg-#E5F4F3 text-center border-0 border-t-3.5 border-t-#009688 border-solid p-2"
            ><span class="text-#666 block">当前功率</span>
            <span class="text-#333 block">37%</span></div
          >
          <div
            class="flex-1 bg-#eef7ee text-center border-0 border-t-3.5 border-t-#59b756 border-solid p-2"
          >
            <span class="text-#666 block">建议功率</span>
            <span class="text-#333 block">47%</span>
          </div>
        </div>
        <div class="text-#009688 mx-3 my-2">调整建议：</div>
        <span class="block mx-3">调整水环境温度、增加增氧机功率等，</span>
        <div class="flex justify-end mr-3">
          <el-button type="primary" color="#009688">去调整</el-button></div
        >
      </el-card>
      <el-card>
        <div class="font-bold">评分占比分析图</div>
      </el-card>
    </div>

    <div class="md:col-span-3 mt-4">
      <el-card>
        <div class="flex justify-between items-center p-4">
          <div class="font-bold">实时数据</div>
          <div class="flex items-center">
            <div class="flex items-center mr-9">
              <img src="./assets/data1.png" class="w-6 h-3 mr-2" />
              <div>数据1</div>
            </div>
            <div class="flex items-center mr-9">
              <img src="./assets/data2.png" class="w-6 h-3 mr-2" />
              <div>数据2</div>
            </div>
            <div class="flex items-center mr-9">
              <img src="./assets/data3.png" class="w-6 h-3 mr-2" />
              <div>数据3</div>
            </div>
            <el-select v-model="value" placeholder="2024-07-24" size="large" style="width: 240px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'

const topStatusData = ref<any[]>([
  {
    title: '增氧机状态',
    value: '在线'
  },
  {
    title: '地块名称',
    value: '在线'
  }
])
</script>