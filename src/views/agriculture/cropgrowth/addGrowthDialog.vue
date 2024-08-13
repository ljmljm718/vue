<script setup lang="ts">
import { ParkInfoApi } from '@/api/agriculture/parkinfo/index'
import { CropGrowthNewApi } from '@/api/agri/cropgrowthnew/index'
import { dateFormatter } from "@/utils/formatTime";
import { cloneDeep, debounce } from 'lodash-es';
import { allDataCacheManager } from "@/api/agriculture/categorymanagement";

const dialogVisible = ref<boolean>(false)
const formLoading = ref<boolean>(false)
const submitForm = () => {
  dialogVisible.value = false
}
const open = () => {
  dialogVisible.value = true
}
defineExpose({ open })

// 已选择的数据
const selectedData = ref<any[]>([])
// 已选择的地块
const selectedPlot = ref<any[]>([])
const handleCancel = () => {
  selectedData.value = []
  selectedPlot.value = []
  if (tableRef.value) tableRef.value.clearSelection();
}

// 左侧的树数据
const leftTreeData = ref<any[]>([])
const getLeftTreeData = async () => {
  const res = await ParkInfoApi.getParkTree({})
  console.log('🚀 ~ getLeftTreeData ~ res:', res)
  if (!Array.isArray(res)) return
  leftTreeData.value = res.map((item) => {
    return {
      id: item.id,
      label: item.name,
      children: Array.isArray(item.child)
        ? item.child.map((child) => {
            return {
              id: child.id,
              label: child.name
            }
          })
        : []
    }
  })
}
getLeftTreeData()

const handleCheckClick = debounce((item) => {
  const { data } = item;
  const { id } = data;
  const isExistID = selectedPlot.value.find(ele => ele === id);
  if (isExistID) {
    selectedPlot.value = selectedPlot.value.filter(ele => ele !== id);
  } else {
    selectedPlot.value.push(id)
  }
}, 100)

// 搜索表单
const formRef = ref()
const formData = ref({})
const formRules = reactive({})
const listCategoryManagement = ref<any[]>([]) // 品类列表的数据
const getListCategoryManagement = async () => {
  const res = await allDataCacheManager.getData({})
  if (!Array.isArray(res)) return;
  listCategoryManagement.value = res
}
getListCategoryManagement()

// 表格内容
const tableData = ref<any[]>([])
const tableRef = ref()
const loading = ref<boolean>(false)
const tableTotal = ref<number>(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  cropId: '',
  cropName: '',
  growth: ''
})
const getTableData = async () => {
  loading.value = true;
  const { list = [], total = 0 } = await CropGrowthNewApi.getCropGrowthNewPage({ ...queryParams })
  console.log("🚀 ~ getTableData ~ list:", list)
  if (!Array.isArray(list)) {
    return loading.value = false;
  }
  tableData.value = list;
  tableTotal.value = total;
  loading.value = false
}
getTableData()

const handleQuery = () => {
  getTableData()
}

const resetQuery = () => {
  queryParams.cropName = ''
  queryParams.cropId = ''
  queryParams.growth = ''
  handleQuery()
}

// 表格多选触发
const handleSelectionChange = (val: any) => {
  if (!Array.isArray(val)) return
  selectedData.value = val
}

const emits = defineEmits(["update"])

// 确认添加
const handleConfirm = async () => {
  const _selectedPlot = toRaw(selectedPlot.value);
  const cropGrowthNew = selectedData.value.map(item => toRaw(item)), basePlot:any[] = []
  
  const parkPlotList = cloneDeep(leftTreeData.value);
  parkPlotList.forEach(parkItem => {
    if (Array.isArray(parkItem.children)) {
      parkItem.children.forEach(plotItem => {
        if (_selectedPlot.indexOf(plotItem.id) !== -1) {
          basePlot.push({ baseId: parkItem.id, plotId: plotItem.id })
        }
      })
    }
  })

  const res = await CropGrowthNewApi.growthCreateList({
    cropGrowthNew, basePlot
  })
  console.log("🚀 ~ handleConfirm ~ res:", res)
  if (res == 1) {
    ElMessage.success("新增成功！");
    emits("update")
    handleCancel()
  } else ElMessage.error("新增失败，请联系管理员！");
}
</script>

<template>
  <Dialog
    title="批量添加生长周期"
    v-model="dialogVisible"
    width="70vw"
  >
    <ContentWrap>
      <div class="flex justify-between w-full">
        <div>生长日记</div>
        <div class="flex items-center space-x-3">
          <div>
            <span>已选择</span>
            <span :style="`color: ${selectedData.length > 0 ? '#009688' : '#da4e52'};padding: 0 .3rem;`">{{ selectedData.length }}</span>
            <span>条，新增到</span>
            <span :style="`color: ${selectedPlot.length > 0 ? '#009688' : '#da4e52'};padding: 0 .3rem;`">{{ selectedPlot.length }}</span>
            <span>个地块</span>
          </div>
          <el-button
            :class="`${(selectedData.length === 0 || selectedPlot.length === 0) ? '!bg-[#00968860]' : '!bg-[#009688]'} !text-white !px-5`"
            :disabled="selectedData.length === 0 || selectedPlot.length === 0"
            @click="handleConfirm"
          >
            确定
          </el-button>
          <el-button class="!px-5" @click="handleCancel">
            取消
          </el-button>
        </div>
      </div>
    </ContentWrap>
    <div class="flex justify-between">
      <div
        class="w-16rem bg-white px-2 py-4 box-border rounded-md overflow-auto max-h-[                 rem]"
        style="border: 1px solid #66666636;"
      >
        <el-tree
          style="max-width: 600px"
          :data="leftTreeData"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ node }">
            <div class="w-full flex justify-between items-center">
              <span>{{ node.label }}</span>
              <div class="cell" @click="handleCheckClick(node)" v-show="!node.data.children">
                <label :class="`el-checkbox el-checkbox--small ${selectedPlot.indexOf(node.data.id) !== -1 ? 'is-checked' : ''}`">
                  <span :class="`el-checkbox__input ${selectedPlot.indexOf(node.data.id) !== -1 ? 'is-checked' : ''}`">
                    <input class="el-checkbox__original" type="checkbox" />
                    <span class="el-checkbox__inner"></span>
                  </span>
                </label>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
      <div style="width:calc(100% - 16.8rem);">
        <ContentWrap>
          <div class="flex justify-between flex-wrap">
            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-width="80px"
              class="grid grid-cols-3 grow"
            >
              <el-form-item
                label="品类"
                prop="cropId"
              >
                <el-select
                  v-model="queryParams.cropId"
                  placeholder="请选择品类"
                  clearable
                  class="!w-200px"
                >
                  <el-option
                    v-for="item in listCategoryManagement"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="品种名称"
                prop="monitorType"
              >
                <el-input v-model="queryParams.cropName" placeholder="请输入品种名称" class="!w-200px" />
              </el-form-item>
              <el-form-item
                label="生长期"
                prop="growth"
              >
                <el-input v-model="queryParams.growth" placeholder="请输入生长期" class="!w-200px" />
              </el-form-item>
            </el-form>
            <div class="">
              <el-button class="!bg-[#009688] !text-white !px-5" @click="handleQuery">
                查询
              </el-button>
              <el-button class="!px-5" @click="resetQuery">
                重置
              </el-button>
            </div>
          </div>
        </ContentWrap>
        <ContentWrap class="!mb-0">
          <el-table
            ref="tableRef"
            :data="tableData"
            size="small"
            border
            v-loading="loading"
            max-height="400"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              label="品类"
              prop="cropType"
            />
            <el-table-column
              label="品种"
              prop="cropName"
            />
            <el-table-column
              label="生长期"
              prop="growth"
              width="100"
            />
            <el-table-column
              label="开始时间"
              prop="startTime"
              :formatter="dateFormatter"
            />
            <el-table-column
              label="结束时间"
              prop="endTime"
              :formatter="dateFormatter"
            />
            <el-table-column
              label="周期/天"
              prop="cycle"
              width="70"
            />
            <el-table-column
              label="环境条件"
              width="350"
              prop="envCondition"
            />
          </el-table>
          <Pagination
            :total="tableTotal"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getTableData"
          />
        </ContentWrap>
      </div>
    </div>
    <!-- <template #footer>
      <el-button
        @click="submitForm"
        type="primary"
        :disabled="formLoading"
      >确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template> -->
  </Dialog>
</template>