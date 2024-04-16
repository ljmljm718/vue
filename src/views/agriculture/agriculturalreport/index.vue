<script setup lang="ts">
import {ElTree} from "element-plus";
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import CropTypePopup from "@/views/agriculture/agriculturalreport/CropTypePopup.vue";
import {AgriculturalReportApi} from "@/api/agriculture/agricultyralreport";
import {CropGrowthVO} from "@/api/agriculture/cropgrowth";

/** 农事报表 列表 */
defineOptions({name: 'AgriculturalReport'})

const loading = ref(true) // 列表的加载中
const queryParams = reactive({
  cropId: undefined,
  cropName: undefined,
  parkId: undefined,
  plotId: undefined,
  growth: undefined,
})
const queryFormRef = ref() // 搜索的表单

const list = ref<CropGrowthVO[]>([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgriculturalReportApi.getAgriculturalReport({
      parkId: queryParams.parkId, plotId: queryParams.plotId, cropId: queryParams.cropId
    })
    list.value = data
    console.log("list.value", list.value)
  } finally {
    loading.value = false
  }
}



interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'child',
  label: 'name',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

const categoryTree = ref<ParkInfoVO[]>([]) // 列表的数据
/** 查询基地地块列表 */
const getCategoryList = async () => {
  loading.value = true
  try {
    const queryParams = null
    const data = await ParkInfoApi.getParkTree(queryParams)
    categoryTree.value = data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getCategoryList();
})

let currCategory = ref({})
const handleCurrentCategoryChange = (currNodeData) => {
  currCategory.value = currNodeData
}
// 取消选择
const clearCategory = () => {
  treeRef.value.setCurrentKey()
}

//品种的选择
const cropTypePopupRef = ref()
const openCropTypePopup = (id: string) => {
  cropTypePopupRef.value.open(id)
}
const handleCropTypePopupChange = (order: CropBaseVO) => {
  queryParams.cropId = String(order[0].id)
  queryParams.cropName = String(order[0].cropName)
  queryParams.parkId = String(order[0].belongPark)
  queryParams.plotId = String(order[0].belongPlot)
}

/** 搜索按钮操作 */
const handleQuery = () => {
  console.log("queryParams", queryParams)
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.cropId = undefined
  queryParams.parkId = undefined
  queryParams.plotId = undefined
  handleQuery()
}

</script>

<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col :span="4">
      <ContentWrap>
        <ContentWrap>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            clearable
          />
        </ContentWrap>
        <ContentWrap style="height: 62vh; overflow: auto;">
          <el-tree
            ref="treeRef"
            style="max-width: 600px"
            class="filter-tree"
            :data="categoryTree"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            highlight-current
            node-key="id"
            :expand-on-click-node="false"
            @current-change="handleCurrentCategoryChange"
          />
        </ContentWrap>
      </ContentWrap>
    </el-col>

    <el-col :span="20">
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="98px"
        >
          <el-form-item label="作物品种" prop="cropName">
            <el-input v-model="queryParams.cropName" placeholder="请选择作物品种" disabled>
              <template #append>
                <el-button @click="openCropTypePopup('0')">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="当前生长阶段" prop="growth">
            <el-input
              v-model="queryParams.growth"
              placeholder="当前未处于任何生长阶段"
              class="!w-240px"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery">
              <Icon icon="ep:search" class="mr-5px"/>
              搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px"/>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap>
        <el-table ref="dataTableRef" :border="false" :span-method="spanMethod" v-loading="loading" :data="list" size="large">
          <el-table-column label="月份" fixed="left" min-width="110" align="center">
            <el-table-column label="周" fixed="left" min-width="110" align="center">
              <el-table-column label="物候期" fixed="left" min-width="110" align="center">
                <el-table-column label="农事作业" fixed="left" min-width="110" align="center"/>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <template v-for="(month, index) in 12" :key="index">
            <el-table-column :label="`${month}月`" align="center">
              <el-table-column :label="`${month}周`" :prop="`growth[${month - 1}]`" align="center">
                <template #default="{ row: { growth } }">
                <span round style="width: 100%">
                  {{ growth[month - 1] }}
                </span>
                </template>
              </el-table-column>
            </el-table-column>
          </template>


        </el-table>
      </ContentWrap>
    </el-col>
  </el-row>

  <CropTypePopup ref="cropTypePopupRef"
                 :currCategory="currCategory"
                 @clear-category="clearCategory"
                 @success="handleCropTypePopupChange"/>
</template>

<style scoped lang="scss">

</style>
