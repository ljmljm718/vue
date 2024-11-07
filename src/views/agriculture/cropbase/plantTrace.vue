<!-- 种植溯源 -->
<script setup lang="ts">
import dayjs from 'dayjs'
import {
  CropBaseApi,
  CropBaseVO
} from '@/api/agriculture/cropbase'
import {
  CategoryManagementVO,
  allDataCacheManager
} from '@/api/agriculture/categorymanagement'
import {
  VarietyManagementApi,
  VarietyManagementVO
} from '@/api/agriculture/varietymanagement'

import { ParkDetailApi } from '@/api/agriculture/parkdetail'
import { generateUUID } from '@/utils'

const plotList = ref<any[]>([]);
const getPlotList = async () => {
  const { list } = await ParkDetailApi.getParkDetailPage({
    pageNo: 1,
    pageSize: 50
  })
  if (!Array.isArray(list)) return;
  plotList.value = list
}
getPlotList()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: '1813034390826102781',
  batchCode: undefined,
  recoveryNo: undefined,
  belongPark: undefined,
  parkName: undefined,
  plotName: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
  isEnableModel: undefined
})

// 品类列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([])
const getListCategoryManagementData = async () => {
  const res = await allDataCacheManager.getData({});
  if (Array.isArray(res)) listCategoryManagement.value = res
}
getListCategoryManagementData()

// 品种列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([])
const getListVarietyManagementVOData = async () => {
  const { list } = await VarietyManagementApi.getVarietyManagementPage({
    pageNo: 1,
    pageSize: 20
  })
  if (Array.isArray(list)) listVarietyManagementVO.value = list
}
getListVarietyManagementVOData()


// 开始查询
const queryFormRef = ref() // 搜索的表单
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.belongPlot = null
  handleQuery()
}
onMounted(() => { resetQuery() })

const cropDataList = ref<any[]>([])
const selectedBatchId = ref<string>('')
const cropDataTotal = ref<number>(0)
const cropDataLoading = ref<boolean>(false)
const getList = async () => {
  cropDataLoading.value = true
  try {
    const { list, total } = await CropBaseApi.getCropBasePage(queryParams);
    console.log("🚀 ~ getList ~ queryParams:", queryParams)
    console.log("🚀 ~ getList ~ list:", list)
    if (!Array.isArray(list)) return;
    cropDataList.value = list;
    cropDataTotal.value = total;
    if (list.length > 0) nextTick(() => {
      handleCropItemClick(list[0])
    })
  } catch(e) {
    console.error("error", e)
  } finally {
    cropDataLoading.value = false;
  }
}

const selectedCropTitle = ref<string>()
const handleCropItemClick = (item) => {
  console.log("🚀 ~ handleCropItemClick ~ item:", item)
  selectedCropTitle.value = `${item.plotName ?? ''} - ${item.cropName ?? ''} - ${item.batchCode ?? ''}批次`;
  selectedBatchId.value = item.id;
  getTimeLineData(item.batchCode)
}

const timelineData = ref<any[]>([])

const getTimeLineData = async (batchCode:string) => {
  const colorIconMap = {
    "浇水": { color: "#73c0de", icon: "icon-1" },
    "除草": { color: "#fac858", icon: "icon-2" },
    "施肥": { color: "#3ba272", icon: "icon-3" },
    "打药": { color: "#ee6666", icon: "icon-4" },
  }
  const data = await CropBaseApi.getFarmRecordByBatchCode({ batchCode })
  console.log("🚀 ~ getTimeLineData ~ res:", data)
  if (!Array.isArray(data)) return;
  if (data.length > 0) {
    const _item = data[0];
    const selectedBatchItem = cropDataList.value.find(ele => ele.id === selectedBatchId.value)
    selectedCropTitle.value = `${_item.plotName} - ${_item.categoryName} - ${_item.cropName} - ${selectedBatchItem?.batchCode ?? ''}批次`
  }
  timelineData.value = data.map(item => ({
    id: generateUUID(), ...item, ...colorIconMap[item.farmDefineType]
  }))
  console.log("🚀 ~ getTimeLineData ~ timelineData.value:", timelineData.value)
}
</script>
<template>
  <ContentWrap>
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="地块名称" prop="belongPlot">
        <el-select
          v-model="queryParams.belongPlot"
          clearable
          placeholder="请选择地块名称"
          class="!w-240px"
        >
          <el-option
            v-for="item in plotList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品类" prop="cropType">
        <el-select
          v-model="queryParams.cropType"
          clearable
          placeholder="请选择品类"
          class="!w-240px"
        >
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="品种" prop="breedId">
        <el-select
          v-model="queryParams.breedId"
          clearable
          placeholder="请选择品种"
          class="!w-240px"
        >
          <el-option
            v-for="item in listVarietyManagementVO"
            :key="item.id"
            :label="item.varietyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input
          v-model="queryParams.batchCode"
          placeholder="请输入批次号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </custom-form>
  </ContentWrap>
  <ContentWrap>
    <div class="flex" style="height: calc(100vh - 250px);">
      <div class="w-16rem h-full">
        <div class="w-full h-2rem font-bold">批次号</div>
        <el-scrollbar
          class="w-full box-border pr-2"
          style="border-right: 1px solid #d1d1d1;height: calc(100% - 4.5rem);"
        >
          <div
            v-for="item in cropDataList"
            :key="item.id"
            :class="`${
              selectedBatchId === item.id ? 'bg-#e5f5f2 text-#4e8f87' : ''
            } text-center py-1rem cursor-pointer`"
            :style="`border-right: 3px solid ${
              selectedBatchId === item.id ? '#4e8f87' : 'transparent'
            };`"
            @click="handleCropItemClick(item)"
          >{{ item.batchCode }}</div>
        </el-scrollbar>
        <div class="h-2.5rem flex justify-center items-center">
          <Pagination
            :total="cropDataTotal"
            layout="prev, pager, next"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </div>
      </div>
      <div class="box-border pl-1rem grow bit-map">
        <div class="px-3">{{ selectedCropTitle }}</div>
        <div
          class="w-full mt-.6rem overflow-auto flex flex-col items-center py-3rem box-border"
          style="height: calc(100% - 2rem);"
        >
          <div class="w-4px bg-#e2e6e7 flex flex-col space-y-1rem items-center justify-center my-3rem" v-if="timelineData.length !== 0">
            <div class="w-3rem h-3rem rounded-full collect-icon mb-2rem relative">
              <div class="absolute right-3.8rem h-3rem w-6rem flex flex-col items-end justify-center pr-.6rem">收获</div>
            </div>
            <div
              :class="`relative ${
                (index + 1) % 2 === 1 ? 'left-15rem'
                : 'right-15rem'
              } w-30rem`"
              v-for="item, index in timelineData"
              :key="item.id"
            >
              <template v-if="(index + 1) % 4 === 0">
                <div class="flex flex-row-reverse items-center relative right-[-8px]">
                  <div
                    class="w-12px h-12px rounded-full bg-#f1f1f1"
                    :style="`border: 3px solid ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    class="w-17rem h-2px bg-#c1c1c1"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    :class="`w-2.6rem h-2.6rem rounded-full shadow-md ${item.icon ?? ''}`"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div class="space-y-1 pr-1rem text-right">
                    <div>{{ item.farmDefineType }}</div>
                    <div class="text-.6rem">{{ dayjs(item.recordTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
                  </div>
                </div>
              </template>
              <template v-if="(index + 1) % 4 === 1">
                <div class="flex items-center relative left-[-8px]">
                  <div
                    class="w-12px h-12px rounded-full bg-#f1f1f1"
                    :style="`border: 3px solid ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    class="w-17rem h-2px bg-#c1c1c1"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    :class="`w-2.6rem h-2.6rem rounded-full shadow-md ${item.icon ?? ''}`"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div class="space-y-1 pl-1rem">
                    <div>{{ item.farmDefineType }}</div>
                    <div class="text-.6rem">{{ dayjs(item.recordTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
                  </div>
                </div>
              </template>
              <template v-if="(index + 1) % 4 === 2">
                <div class="flex flex-row-reverse items-center relative right-[-8px]">
                  <div
                    class="w-12px h-12px rounded-full bg-#f1f1f1"
                    :style="`border: 3px solid ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    class="w-10rem h-2px bg-#c1c1c1"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    :class="`w-2.6rem h-2.6rem rounded-full shadow-md ${item.icon ?? ''}`"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div class="space-y-1 pr-1rem text-right">
                    <div>{{ item.farmDefineType }}</div>
                    <div class="text-.6rem">{{ dayjs(item.recordTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
                  </div>
                </div>
              </template>
              <template v-if="(index + 1) % 4 === 3">
                <div class="flex items-center relative left-[-8px]">
                  <div
                    class="w-12px h-12px rounded-full bg-#f1f1f1"
                    :style="`border: 3px solid ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    class="w-10rem h-2px bg-#c1c1c1"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div
                    :class="`w-2.6rem h-2.6rem rounded-full shadow-md ${item.icon ?? ''}`"
                    :style="`background-color: ${item.color ?? 'green'};`"
                  ></div>
                  <div class="space-y-1 pl-1rem">
                    <div>{{ item.farmDefineType }}</div>
                    <div class="text-.6rem">{{ dayjs(item.recordTime).format("YYYY-MM-DD HH:mm:ss") }}</div>
                  </div>
                </div>
              </template>
            </div>
            <div class="w-3rem h-3rem rounded-full sowing-icon top-2.5rem relative">
              <div class="absolute left-3.8rem h-3rem w-6rem flex flex-col items-start justify-center pl-.6rem">播种</div>
            </div>
          </div>
          <div v-else class="w-full h-[20rem] flex flex-col justify-center space-y-2 items-center">
            <img src="/images/noData.png" class="aspect-1 w-8rem" />
            <div
              class="py-3 text-[.9rem] text-[#999]"
            >暂无数据</div>
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>
<style scoped lang="scss">
.collect-icon {
  background-image: url(./assets/collect.png);
  background-size: 100% 100%;
}

.sowing-icon {
  background-image: url(./assets/sowing.png);
  background-size: 100% 100%;
}

@for $i from 1 through 4 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 1.2rem 1.2rem;
    background-position: center center;
    background-repeat: no-repeat;
  }
}

.bit-map {
  background-image: url(./assets/bitMap.png);
  background-size: 100% auto;
  background-position: bottom center;
  background-repeat: no-repeat;
}
</style>
