<template>
  <div class="flex space-x-3">
    <div class="flex flex-col space-y-3 p-2 w-[10rem] bg-white">
      <div
        v-for="(item, index) in leftList"
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
          v-for="(item, index) in topCardList"
          :key="index"
          class="flex space-x-3 justify-center items-center px-2"
        >
          <img
            src="https://echarts.apache.org/zh/images/logo.png?_v_=20240226"
            alt=""
            class="w-[2rem] h-[2rem] bg-black"
          />
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
        <div v-for="(item, index) in modelList" :key="index" class="flex space-x-1">
          <img src="./assets/daoxiangicon.png" alt="" class="w-[2rem] h-[2rem] bg-black" />
          <div>
            <div>稻香模型</div>
            <div class="flex space-x-1">
              <div>出苗期</div>
              <div class="text-[#009688]">30天</div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-x-3 bg-white p-2 min-h-[4rem]">
        <div>连梗11号模型周期与栽培要点</div>
        <div class="flex space-x-4">
          <img src="./assets/circleIcon.png" alt="" class="w-[10rem] h-[10rem] m-6" />
          <div class="flex flex-col w-full">
            <div class="flex space-x-30 text-[12px] mb-2">
              <div class="flex-col space-y-.5">
                <div> 播种期 </div>
                <div class="text-[#999999]"> 周期10天 </div>
              </div>
              <div class="flex-col space-y-.5">
                <div> 出苗期 </div>
                <div class="text-[#999999]"> 周期25天 </div>
              </div>
              <div class="flex-col space-y-.5">
                <div> 幼苗期 </div>
                <div class="text-[#999999]"> 周期20天 </div>
              </div>
              <div class="flex-col space-y-.5">
                <div> 拨穗期 </div>
                <div class="text-[#999999]"> 周期40天 </div>
              </div>
              <div class="flex-col space-y-.5">
                <div> 成熟期 </div>
                <div class="text-[#999999]"> 周期20天 </div>
              </div>
            </div>

            <div class="container w-full overflow-hidden relative my-2">
              <div class="line-with-circles flex items-center justify-between relative w-full">
                <div class="circle-container flex-1 relative">
                  <div class="circle"></div>
                </div>
                <div class="circle-container flex-1 relative">
                  <div class="circle"></div>
                </div>
                <div class="circle-container flex-1 relative">
                  <div class="circle"></div>
                </div>
                <div class="circle-container flex-1 relative">
                  <div class="circle"></div>
                </div>
                <div class="circle-container flex-1 relative">
                  <div class="circle"></div>
                </div>
              </div>
            </div>

            <div class="flex bg-[#f5f5f5] items-center text-center mb-3">
              <div
                v-for="(item, index) in topSelectorBtns"
                :key="index"
                :class="[
                  'text-[12px] p-2 px-4 transition w-27  ',
                  topSelectedBtn === item.key ? 'bg-[#009688] text-[#fff]' : ''
                ]"
                @click="topSelectedBtn = item.key"
                >{{ item.label }}</div
              >
            </div>
            <div
              >喜温暖湿润气候，不耐寒，幼苗怕霜冻，成苗后抗寒能力增强。最适宜温度20-23℃，温度低于-4℃则易遭冻害。耐湿，不耐干旱，年降雨量在1000-
              2000mm；年平均相对湿</div
            >
          </div>
        </div>
      </div>
      <div class="space-x-3 bg-white p-2 min-h-[4rem]">
        <div class="flex justify-between items-center">
          <div>连梗11号模型出苗期监测指标</div>
          <div class="flex bg-[#f5f5f5] rounded-2 overflow-hidden">
            <div
              v-for="(item, index) in selectorBtns"
              :key="index"
              :class="[
                'text-[12px] p-2 px-4 transition',
                selectedBtn === item.key ? 'bg-[#009688] text-[#fff]' : ''
              ]"
              @click="selectedBtn = item.key"
              >{{ item.label }}</div
            >
          </div>
        </div>
        <div class="mt-2">
          <el-table :data="tableData" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="要素名称" align="center" prop="name" />
            <el-table-column label="监测指标范围" align="center" prop="range">
              <template #default>
                <div>
                  <div class="bg-[#666666] text-[#fff] rounded-2 extra-triangle mb-2"
                    >温度适宜25-30</div
                  >
                  <div class="flex items-center space-x-2">
                    <div>0</div>
                    <div class="flex rounded-[4px] overflow-hidden space-x-.5">
                      <div class="h-[8px] w-[4rem] tool-bar-1"></div>
                      <div class="h-[8px] w-[4rem] tool-bar-2"></div>
                      <div class="h-[8px] w-[4rem] tool-bar-3"></div>
                    </div>
                    <div>25</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前值" align="center" prop="current" />
            <el-table-column label="健康评估" align="center" prop="evaluate" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const leftList = ref<any[]>([
  { img: 'https://echarts.apache.org/zh/images/logo.png?_v_=20240226', title: '明月村' }
])

const topCardList = ref<any[]>([
  { title: '总值', value: '83' },
  { title: '总值', value: '83' }
])

const modelList = ref<any[]>([])

const selectedBtn = ref<string>('qx')
const selectorBtns = ref<any[]>([
  { key: 'qx', label: '气象指标' },
  { key: 'tr', label: '土壤指标' },
  { key: 'wh', label: '物候指标' }
])

const topSelectedBtn = ref<string>('sfgy')
const topSelectorBtns = ref<any[]>([
  { key: 'sfgy', label: '水分供应' },
  { key: 'sfgl', label: '施肥管理' },
  { key: 'ymgg', label: '幼苗期灌溉要点' },
  { key: 'ymsf', label: '幼苗期施肥注意事项' },
  { key: 'ymsf1', label: '幼苗期施肥注意事项' }
])

const tableData = ref<any[]>([
  { name: '温度', current: '40', evaluate: '温度适宜' },
  { name: '温度', current: '40', evaluate: '温度适宜' },
  { name: '温度', current: '40', evaluate: '温度适宜' }
])
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
  position: relative;
}

.extra-triangle::after {
  content: '';
  position: absolute;
  left: calc(50% - 5px);
  top: 100%;
  width: 0;
  height: 0;
  border: 10px solid #666666;
  border-color: #666666 transparent transparent transparent;
}

.line-with-circles::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #d3d3d3;
  z-index: 1;
  transform: translateY(-50%);
}

.circle {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6px;
  height: 6px;
  border: 2px solid #008b8b;
  border-radius: 50%;
  background-color: white;
}

.circle::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
  z-index: 3;
}

.circle-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.circle-container:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: 100%;
  height: 2px;
  background-color: #d3d3d3;
  z-index: 1;
  transform: translateY(-50%);
}
</style>