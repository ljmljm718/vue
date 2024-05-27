<script setup lang="ts">
import { ElTree } from 'element-plus'
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo'
import CropTypePopup from '@/views/agriculture/agriculturalreport/CropTypePopup.vue'
import { AgriculturalReportApi } from '@/api/agriculture/agricultyralreport'
import { CropGrowthVO } from '@/api/agriculture/cropgrowth'
import { formatTime } from '@/utils'

/** 农事报表 列表 */
defineOptions({ name: 'AgriculturalReport' })

const loading = ref(true) // 列表的加载中
const queryParams = reactive({
  cropId: undefined,
  cropName: undefined,
  parkId: undefined,
  plotId: undefined,
  growth: undefined
})
const queryFormRef = ref() // 搜索的表单

const list = ref<CropGrowthVO[]>([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgriculturalReportApi.getAgriculturalReport({
      parkId: queryParams.parkId,
      plotId: queryParams.plotId,
      cropId: queryParams.cropId
    })
    list.value = data
    console.log('list.value', list.value)
    loadDatatoTable(data)
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
  label: 'name'
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
  console.log('queryParams', queryParams)
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

const colNum = ref(0)
const allDateArr = ref<Array<any>>([])
const buildDateTree = () => {
  colNum.value = 0
  allDateArr.value = []
  const Sundays = new Array(13)
  const now = new Date()
  const year = now.getFullYear()

  for (let month = 0; month < 12; month++) {
    let count = 0
    Sundays[month + 1] = [] // 初始化每个月的周日数组

    // 获取月份的第一天
    let firstDayOfMonth = new Date(year, month, 1)
    // 调整到当月的第一个周日
    while (firstDayOfMonth.getDay() !== 0) {
      // 0 表示周日
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1)
    }

    // 遍历当前月，直到进入下个月
    while (firstDayOfMonth.getMonth() === month) {
      colNum.value++
      allDateArr.value.push(firstDayOfMonth.valueOf())
      Sundays[month + 1].push(firstDayOfMonth.valueOf()) // 存储日期部分
      count++
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 7) // 移动到下一个周日
    }

    console.log(`Month ${month + 1} has ${count} Sundays.`)
  }
  Sundays.shift()
  return Sundays
}

const formattedData = ref<Array<any>>([])
const loadDatatoTable = (data) => {
  formattedData.value = []
  if (Array.isArray(data)) {
    data.forEach((item) => {
      const _obj = { start: 0, end: 0, name: '' }
      let checked = false
      allDateArr.value.forEach((_date, index) => {
        if (!checked) {
          // 没有匹配到开始
          if (item.startTime < _date) {
            checked = true
            _obj.start = index
          }
        } else {
          if (item.endTime > _date) {
            _obj.end = index
          }
        }
      })
      if (checked && _obj.end !== 0) {
        _obj.name = item.growth
        formattedData.value.push(_obj)
      }
    })
  }
}
const yearMonthTableData = ref({})
yearMonthTableData.value = buildDateTree()
onMounted(() => {
  getList()
})

let isCollapse=ref(false)
</script>

<template>
  <el-row
    :gutter="20"
    v-loading="loading"
  >
    <div v-if="isCollapse" @click="isCollapse=false" class="mt--13px w-30px mb-7px bg-[#fff] flex justify-end pr-15px" style="height: 20px;line-height: 20px; cursor: pointer;border-radius:0 25px 25px 0;text-align: center;"><el-icon style="font-size: 10px;text-align: center; margin-top: 4px;margin-left: -8px;"><DArrowRight /></el-icon></div>

    <el-col :span="isCollapse?0:4">

      <el-menu
        default-active="2"
        class="el-menu-vertical-demo relative"
        :collapse="isCollapse"
      >

      <ContentWrap>
        <ContentWrap>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            clearable
            style="width:150px;"
          />
          <div class="absolute right-25px top-50px" @click="isCollapse=true" style="cursor: pointer;"><el-icon><DArrowLeft /></el-icon></div>
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

      </el-menu>
    </el-col>

    <el-col :span="isCollapse?24:20">
      <ContentWrap>
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="98px"
        >
          <el-form-item
            label="作物品种"
            prop="cropName"
          >
            <el-input
              v-model="queryParams.cropName"
              placeholder="请选择作物品种"
              disabled
            >
              <template #append>
                <el-button @click="openCropTypePopup('0')">
                  <Icon icon="ep:search" />
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="当前生长阶段"
            prop="growth"
          >
            <el-input
              v-model="queryParams.growth"
              placeholder="当前未处于任何生长阶段"
              class="!w-240px"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery">
              <Icon
                icon="ep:search"
                class="mr-5px"
              />
              搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon
                icon="ep:refresh"
                class="mr-5px"
              />
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap>
        <el-table
          v-show="false"
          ref="dataTableRef"
          :border="false"
          :span-method="spanMethod"
          v-loading="loading"
          :data="list"
          size="large"
        >
          <el-table-column
            label="月份"
            fixed="left"
            min-width="110"
            align="center"
          >
            <el-table-column
              label="周"
              fixed="left"
              min-width="110"
              align="center"
            >
              <el-table-column
                label="物候期"
                fixed="left"
                min-width="110"
                align="center"
              >
                <el-table-column
                  label="农事作业"
                  fixed="left"
                  min-width="110"
                  align="center"
                />
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <template
            v-for="(month, index) in 12"
            :key="index"
          >
            <el-table-column
              :label="`${month}月`"
              align="center"
            >
              <el-table-column
                :label="`${month}周`"
                :prop="`growth[${month - 1}]`"
                align="center"
              >
                <template #default="{ row: { growth } }">
                  <span
                    round
                    style="width: 100%"
                  >
                    {{ growth[month - 1] }}
                  </span>
                </template>
              </el-table-column>
            </el-table-column>
          </template>

        </el-table>
        <div>
          <div
            class="grid border"
            :style="`grid-template-columns: repeat(${colNum + 1}, 1fr);`"
          >
            <div class="w-[3rem] text-center p-2 border">月份</div>
            <div
              class="text-center p-2 border"
              :style="`grid-column: span ${item.length};`"
              v-for="item, index in yearMonthTableData"
              :key="index"
            >
              {{ index + 1 }}月
            </div>
            <div class="w-[3rem] p-2 text-center border">周</div>
            <template
              v-for="month, idx in yearMonthTableData"
              :key="idx"
            >
              <div
                v-for="item, index in month"
                :key="index"
                class="text-center p-2 border"
              >{{ index + 1 }}</div>
            </template>
            <div
              :style="`grid-column-start: ${item.start};grid-column-end: ${item.end};background-color: #e8d1ac;`"
              v-for="item, index in formattedData"
              :key="index"
              class="border text-center p-2"
            >{{ item.name }}</div>
          </div>
        </div>
      </ContentWrap>
    </el-col>
  </el-row>

  <CropTypePopup
    ref="cropTypePopupRef"
    :currCategory="currCategory"
    @clear-category="clearCategory"
    @success="handleCropTypePopupChange"
  />
</template>

<style scoped lang="scss">
.border {
  border: 1px solid #25252525;
}
</style>
