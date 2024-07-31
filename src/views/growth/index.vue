<template>
  <div class="flex space-x-3">
    <div class="flex flex-col space-y-3 p-2 w-[10rem] bg-white">
      <div
        v-for="item, index in leftList"
        :key="index"
        class="flex flex-col space-y-2 p-1 bg-[#f1f1f1] rounded-2 shadow-md"
      >
        <img :src="item.img" alt="" class="w-full" />
        <div class="w-full bg-[#f1f1f1] text-center py-2">{{ item.title }}</div>
      </div>
    </div>
    <div class="space-y-3 grow">
      <div class="flex space-x-6 bg-white p-2 min-h-[4rem]">
        <div
          v-for="item, index in topCardList"
          :key="index"
          class="flex space-x-3 justify-center items-center px-2"
        >
          <img src="https://echarts.apache.org/zh/images/logo.png?_v_=20240226" alt="" class="w-[2rem] h-[2rem] bg-black" />
          <div class="text-[.7rem]">
            <div class="text-[.8rem]">{{ item.value }}</div>
            <div>{{ item.title }}</div>
          </div>
        </div>
      </div>
      <div class="flex space-x-3 bg-white p-2 min-h-[4rem]">
        <div class="bg-[#e5f4f3] p-3 flex flex-col justify-center items-center">
          <div class="text-[#009688] text-[1rem] pb-1">2</div>
          <div class="text-[13px]">模型总数</div>
        </div>
        <div v-for="item, index in modelList" :key="index">

        </div>
      </div>
      <div class="space-x-3 bg-white p-2 min-h-[4rem]">
        <div>连梗11号模型周期与栽培要点</div>

      </div>
      <div class="space-x-3 bg-white p-2 min-h-[4rem]">
        <div class="flex justify-between items-center">
          <div>连梗11号模型出苗期监测指标</div>
          <div class="flex bg-[#f5f5f5] rounded-2 overflow-hidden">
            <div
              v-for="item, index in selectorBtns"
              :key="index"
              :class="['text-[12px] p-2 px-4 transition', selectedBtn === item.key ? 'bg-[#009688] text-[#fff]' : '']"
              @click="selectedBtn = item.key"
            >{{ item.label }}</div>
          </div>
        </div>
        <div class="mt-2">
          <el-table
            :data="tableData"
            :stripe="true"
            :show-overflow-tooltip="true"
          >
            <el-table-column label="要素名称" align="center" prop="name" />
            <el-table-column label="监测指标范围" align="center" prop="name">
              <template #default>
                <div>
                  <div class="bg-[#666666] text-[#fff] rounded-2 extra-triangle mb-2">温度适宜25-30</div>
                  <div class="flex items-center space-x-2">
                    <div>0</div>
                    <div class="flex rounded-[4px] overflow-hidden space-x-1">
                      <div class="h-[8px] w-[4rem] tool-bar-1"></div>
                      <div class="h-[8px] w-[4rem] tool-bar-2"></div>
                      <div class="h-[8px] w-[4rem] tool-bar-3"></div>
                    </div>
                    <div>25</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前值" align="center" prop="name" />
            <el-table-column label="健康评估" align="center" prop="name" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const leftList = ref<any[]>([
  { img: 'https://echarts.apache.org/zh/images/logo.png?_v_=20240226', title: '标题' }
])

const topCardList = ref<any[]>([
  { title: '总值', value: '83'},
  { title: '总值', value: '83'}
])

const modelList = ref<any[]>([])

const selectedBtn = ref<string>('qx')
const selectorBtns = ref<any[]>([
  { key: 'qx', label: '气象指标' },
  { key: 'tr', label: '土壤指标' },
  { key: 'wh', label: '物候指标' },
])

const tableData = ref<any[]>([])
</script>
<style lang="scss" scoped>
.tool-bar-1 {
  background: linear-gradient(to right, #06d41d, #4abd14);
}
.tool-bar-2 {
  background: linear-gradient(to right, #4abd14, #9ba30a);
}
.tool-bar-3 {
  background: linear-gradient(to right, #9ba30a, #e58a01);
}

.extra-triangle {
  position: relative
}

.extra-triangle::after {
  content: "";
  position: absolute;
  left: calc(50% - 5px);
  top: 100%;
  width: 0;
  height: 0;
  border: 10px solid #666666;
  border-color: #666666 transparent transparent transparent;
}
</style>