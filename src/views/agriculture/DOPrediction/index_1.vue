<script lang="ts" setup>
import * as echarts from 'echarts'
</script>
<template>
  <el-container class="min-h-screen flex flex-col">
    <el-header class="flex items-center bg-[#009688] text-white">
      数字乡村塘兴服务管理平台
    </el-header>

    <el-container class="flex-1">
      <el-aside width="200px" class="bg-gray-100 p-4">
        <el-menu default-active="1">
          <el-menu-item index="1">
            <template #title>
              <img src="./assets/homeIcon.png" class="w-4rem h-4rem mr-2" />
              <span>溶解氧预警</span>
            </template>
          </el-menu-item>
          <el-menu-item index="2">一级菜单</el-menu-item>
          <el-menu-item index="3">一级菜单</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="p-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="md:col-span-3 mb-4">
            <el-card>
              <!-- <div class="font-bold">增氧机1号</div> -->
              <el-dropdown size="large" split-button type="primary">
                增氧机1号
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>Action 1</el-dropdown-item>
                    <el-dropdown-item>Action 2</el-dropdown-item>
                    <el-dropdown-item>Action 3</el-dropdown-item>
                    <el-dropdown-item>Action 4</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-row>
                <el-col :span="4" />增氧机状态：在线 <el-col :span="4" />地块名称：地块1
                <el-col :span="4" />通信时间：2024-7-24 10:20:00 <el-col :span="4" />负责人：张三
                <el-col :span="8" />
              </el-row>
            </el-card>
          </div>

          <div class="md:col-span-1 mb-4">
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
          </div>
          <div class="md:col-span-1 mb-4">
            <el-card class="w-full">
              <div class="font-bold mb-4">增氧机参数</div>
              <div class="flex h-17 gap-3 mx-3">
                <div
                  class="flex-1 bg-#E5F4F3 text-center border-0 border-t-3.5 border-t-#009688 border-solid p-2"
                  ><span class="text-#6666 block">当前功率</span>
                  <span class="text-#3333 block">37%</span></div
                >
                <div
                  class="flex-1 bg-#59B756 text-center border-0 border-t-3.5 border-t-#59B756 border-solid p-2"
                  ><span class="text-#6666 block">建议功率</span>
                  <span class="text-#3333 block">47%</span></div
                >
              </div>
              <div class="text-#009688 mx-3 my-2">调整建议：</div>
              <span class="block mx-3">调整水环境温度、增加增氧机功率等，</span>
              <div class="flex justify-end mr-3">
                <el-button type="primary" color="#009688">去调整</el-button></div
              >
            </el-card>
          </div>
          <div class="md:col-span-1 mb-4">
            <el-card>
              <div class="font-bold">评分占比分析图</div>
            </el-card>
          </div>

          <div class="md:col-span-3">
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
                  <el-select
                    v-model="value"
                    placeholder="2024-07-24"
                    size="large"
                    style="width: 240px"
                  >
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
      </el-main>
    </el-container>

    <el-footer class="bg-gray-800 text-white p-4"> Footer </el-footer>
  </el-container>
</template>


<style scoped lang='scss'>
.menu-icon {
  width: 50px;
  height: 50px;
  margin-right: 1px;
}
// .el-menu-item.is-active {
//   background-color: #e5f4f3 !important;
//   color: #009688;
// }
.el-menu-item:hover {
  background-color: #e5f4f3 !important;
  color: #009688;
  border-right: #009688 solid 3px;
}
</style>