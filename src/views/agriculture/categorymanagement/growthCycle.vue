<template>
  <div>
    <div class="bg-white p-3">
      <div>
        <el-button class="!text-white !bg-[#009688]" @click="openForm('create')"
          v-hasPermi="['agri:crop-growth-new:create']">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
        <el-button @click="handleExport" :loading="exportLoading" v-hasPermi="['agri:crop-growth-new:export']">
          <Icon icon="ep:download" class="mr-5px" />导出
        </el-button>
      </div>
      <div class="mt-3 flex space-x-2">
        <div class="w-[10rem] flex flex-col" style="border-right: 1px solid #66666690">
          <div v-for="(item, index) in growthPeriod" :key="index" :class="[
            'flex p-3 space-x-2 transition',
            slectedItem == item.key ? 'bg-[#E5F4F3] selected-item' : ''
          ]" @click="selectGrowth(item.key)">
            <img :src="item.img" class="w-[3rem] h-[3rem]" alt="" />
            <div>
              <div>{{ item.title }}</div>
              <div>{{ item.value }}</div>
            </div>
          </div>
        </div>
        <div class="p-3 grow">
          <el-table :data="showList" :stripe="true" :show-overflow-tooltip="true"
            :header-cell-style="{ fontSize: '14px', backgroundColor: '#f8f8f8', color: '#333' }">
            <el-table-column label="生长期" align="center" prop="growth" />
            <el-table-column label="图片" align="center" prop="imgId">
              <template #default="{ row }">
                <el-image class="h-50px w-50px" :src="row.imgId" :preview-src-list="[row.imgId]" preview-teleported
                  fit="cover" />
              </template>
            </el-table-column>
            <el-table-column label="周期（/天）" align="center" prop="cycle" />
            <el-table-column label="特点" align="center" prop="feature" />
            <el-table-column label="环境" align="center" prop="envCondition" />
            <el-table-column label="农事建议" align="center" prop="farmAdvice" />
            <el-table-column label="操作" align="center" width="230px">
              <template #default="scope">
                <el-button link type="primary" @click="openForm('update', scope.row.id)"
                  v-hasPermi="['agri:crop-growth-new:update']">
                  编辑
                </el-button>
                <el-button link type="danger" @click="handleDelete(scope.row.id, '1')"
                  v-hasPermi="['agri:crop-growth-new:delete']">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-between mt-3 h-10">
            <span>周期事项</span>
            <el-button class="!text-white !bg-[#009688]" v-hasPermi="['agri:crop-growth-new:create']"
              @click="openSubDeviceForm()">
              <Icon icon="ep:plus" class="mr-5px" />新增
            </el-button>
          </div>
          <div>
            <el-table :data="EventList" :show-overflow-tooltip="true"
              :header-cell-style="{ fontSize: '14px', backgroundColor: '#f8f8f8', color: '#333' }">
              <el-table-column label="事项" align="center" prop="itemName" />
              <el-table-column label="事项要点" align="center" prop="itemContent" />
              <el-table-column label="操作" align="center" width="230px">
                <template #default="scope">
                  <el-button link type="primary" @click="EditSubDeviceForm(scope.row.id)"
                    v-hasPermi="['agri:crop-growth-new:update']">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleDelete(scope.row.id, '2')"
                    v-hasPermi="['agri:crop-growth-new:delete']">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 表单弹窗：添加/修改 -->
  <CropGrowthNewForm ref="formRef" @success="editGrowth" />
  <CropGrowthSubForm ref="subformRef" @success="getEventList" />
</template>
<script setup lang="ts">
import CropGrowthNewForm from '../../agri/cropgrowthnew/CropGrowthNewForm.vue'
import CropGrowthSubForm from '../../agri/cropgrowthnew/CropGrowthSubForm.vue'
import { isArray } from 'min-dash'
import {
  getGrowthCycleListApi,
  getVarietyGrowthList,
  getEventListApi,
  deleteCropGrowthNewApi,
  deleteEventApi,
  CropGrowthNew
} from './growthCycleApi'

import { useRoute } from 'vue-router'
import download from '@/utils/download'

const slectedItem = ref<string>('')

const route = useRoute()
console.log('route.query=>', route.query.cropId)
const cropId = route.query.cropId
const tag = route.query.tag
const growthList = ref<any[]>([])
const growthPeriod = ref<any[]>([])
let showList = ref<any[]>([])
//--- 查询周期-----
const getGrowthPeriod = () => {
  growthPeriod.value = growthList.value.map((item) => ({
    key: item.id, //
    title: item.growth,
    value: item.cycle + '天',
    img: item.imgId
  }))
  console.log('growthPeriod.value=>', growthPeriod.value)
}
//--- 查询品类生长周期列表-----
const getCropGrowthList = async (id = route.query.cropId) => {
  if (!id) return ElMessage.warning('CropId 不存在!')
  growthList.value = await getGrowthCycleListApi({ cropId: id })
  console.log('growthList.value=>', growthList.value)
  getGrowthPeriod()
}
//--- 查询品种生长周期列表-----
const getVarietyList = async (id = route.query.cropId) => {
  if (!id) return ElMessage.warning('CropId 不存在!')
  console.log("getVarietyList")
  growthList.value = await getVarietyGrowthList({ cropCode: id })
  console.log('growthList.value=>', growthList.value)
  getGrowthPeriod()
}

if (tag == 'category') getCropGrowthList(cropId)
if (tag == 'variety') getVarietyList(cropId)

// ------------获得事项列表------------
const EventList = ref<any[]>([])
const getEventList = async (id = selectId.value, numPage = 1, size = 10) => {
  const myevents = await getEventListApi({ cropCode: id, pageNo: numPage, pageSize: size })
  EventList.value = myevents.list
  console.log('EventList.value=>', EventList.value)
  // console.log('事项列表显示周期id', cycleId.value)
}

//-----------点击生长周期按钮显示数据---------------

const cycleId = ref<number>(0)
const selectId = ref('')

const selectGrowth = (key) => {
  slectedItem.value = key
  const growthItem = growthList.value.find((item) => item.id == key)
  if (growthItem) showList.value = [growthItem]

  cycleId.value = Number(key)
  console.log('事项值的传入', key)
  selectId.value = key
  getEventList(key, 1, 10)
}
//

//-----------事项的添加-----------------

const subformRef = ref()
const openSubDeviceForm = () => {
  if (!selectId.value)
    return ElMessage.warning('请选择生长期')
  else
    subformRef.value.open('create', selectId.value)
}
//-----------事项的编辑-----------------

const EditSubDeviceForm = (id) => {
  subformRef.value.open('update', id)
}
// -------------------------------
const message = useMessage() // 消息弹窗
const exportLoading = ref(false) // 导出的加载中

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  console.log('id', id)

  formRef.value.open(type, id)
}

const editGrowth = () => {
  if (tag == 'category') getCropGrowthList(cropId)
  if (tag == 'variety') getVarietyList(cropId)
  if (cycleId.value !== 0) {
    console.log('编辑时候选中的cycleId', selectId.value)
    setTimeout(() => {
      selectGrowth(selectId.value)
    }, 500)
  }
}
/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data1 = await CropGrowthNew({ cropId: cropId })
    download.excel(data1, '作物生长周期.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
/** 删除按钮操作 */
const handleDelete = async (id: number, deleteTag: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    if (deleteTag == '1') {
      await deleteCropGrowthNewApi(id)
      if (tag == 'category') await getCropGrowthList(cropId)
      if (tag == 'variety') await getVarietyList(cropId)
      showList.value = [] // 清空数组
      EventList.value = []
    } else {
      await deleteEventApi(id)
      await getEventList(selectId.value, 1, 10)
    }

    message.success(t('common.delSuccess'))
  } catch { }
}
</script>
<style scoped>
.selected-item {
  border-right: 4px solid #009688;
}
</style>