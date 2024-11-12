<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.type" placeholder="请选择类型" class="!w-240px">
            <el-option
              v-for="dict in parkCategoryOptions"
              :key="dict.value"
              :label="dict.categoryLabel"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="queryParams.area" placeholder="请输入面积"  class="!w-240px">
            <template #append>亩</template>
          </el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="queryParams.contact" placeholder="请输入联系人" class="!w-240px" />
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="queryParams.tel" placeholder="请输入联系电话" class="!w-240px" />
        </el-form-item>
        <el-form-item class="pl-8">
         <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          <span>搜索</span>
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          <span>重置</span>
        </el-button>
      </el-form-item>
      </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex justify-between items-center">
      <div>
        <el-button @click="handleBack()" v-if="showPlotList">返回</el-button>
        <el-button
          class="!bg-[#009688] !text-white"
          plain
          @click="openForm()"
          v-hasPermi="['agriculture:park-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:park-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </div>
      <div class="flex rounded-md cursor-pointer select-none" @click="handleTypeChange()">
        <div
          :class="[showType === 'card' ? 'tab-btn-selected' : 'tab-btn']"
          style="border-radius: 5px 0 0 5px"
          @click="showType = 'card'"
        >
          <el-icon><Menu /></el-icon>
          <div class="pl-1 text-[13px]">卡片</div>
        </div>
        <div
          :class="[showType === 'list' ? 'tab-btn-selected' : 'tab-btn']"
          style="border-radius: 0 5px 5px 0"
          @click="showType = 'list'"
        >
          <el-icon><List /></el-icon>
          <div class="pl-1 text-[13px]">列表</div>
        </div>
      </div>
    </div>
    <div v-if="showType === 'card'" class="inner-frame-wrapper">
      <div class="flex space-x-3 justify-between h-full" v-loading="loading">
        <div class="w-[24rem] flex flex-col">
          <div class="grow space-y-2 overflow-auto hidden-scroll-bar" v-if="!showPlotList">
            <div
              v-for="item in list"
              :key="item.id"
              :class="`border-solid border-[1px] border-slate-300 p-3 px-4 rounded-1 ${
                activeItemId === item.id ? '!border-green-400 shadow-md' : ''
              }`"
            >
              <div class="flex space-x-3 pl-.7rem">
                <div class="font-bold">{{ item.name }}</div>
                <div
                  class="bg-[#e5f4f3] text-[#009688] text-[.8rem] px-2 flex items-center rounded-1 shadow-sm"
                  >{{ item.categoryName }}</div
                >
              </div>
              <div class="max-w-[40rem] p-2" :style="`display: ${item.remark ? 'block' : 'none'};`">
                {{ item.remark }}
              </div>
              <div class="w-[100%] bg-[#66666626] h-[1px] my-3"></div>
              <div class="grid grid-container text-[#666666] !pb-[1rem]">
                <div class="space-x-2">
                  <span>海拔:</span>
                  <span>{{ item.altitude }}米</span>
                </div>
                <div class="space-x-2">
                  <span>经度:</span>
                  <span>{{ item.longitude }}</span>
                </div>
                <div class="space-x-2">
                  <span>纬度:</span>
                  <span>{{ item.latitude }}</span>
                </div>
                <div class="space-x-2">
                  <span>面积:</span>
                  <span>{{ item.area ?? '0' }}亩</span>
                </div>
                <div class="space-x-2">
                  <span>数量:</span>
                  <span>{{ item.quantity ?? '0' }}</span>
                </div>
                <div class="space-x-2">
                  <span>联系人:</span>
                  <span>{{ item.contact }}</span>
                </div>
                <div class="space-x-2">
                  <span>联系电话:</span>
                  <span>{{ item.tel }}</span>
                </div>
                <div class="space-x-2">
                  <span>通讯地址:</span>
                  <span>{{ item.address }}</span>
                </div>
                <div class="space-x-2">
                  <span>创建时间:</span>
                  <span>{{ dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
                </div>
              </div>
              <div class="w-full flex flex-row-reverse justify-center">
                <div class="flex items-center" @click="handleStopPropagation">
                  <el-button
                    class="!bg-[#009688] text-white"
                    type="primary"
                    @click="handleDraw(item)"
                    v-hasPermi="['agriculture:park-info:update']"
                  >
                    绘制围栏
                  </el-button>
                  <el-button
                    class="!bg-[#009688] text-white"
                    type="primary"
                    @click="handleParkClick(item)"
                  >
                    查看地块
                  </el-button>
                  <el-button
                    @click="openForm(item.id)"
                    v-hasPermi="['agriculture:park-info:update']"
                  >
                    编辑
                  </el-button>
                  <el-button @click="openFormDetail(item.id)">详情</el-button>
                  <el-button
                    @click="handleDelete(item.id)"
                    v-hasPermi="['agriculture:park-info:delete']"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="grow space-y-2 overflow-auto hidden-scroll-bar">
            <div
              v-for="item in plotDataList"
              :key="item.id"
              @click="handlePlotClick(item)"
              :class="`relative border-solid border-[1px] border-slate-300 pt-2 p-3 px-4 rounded-1 ${
                activePlotId === item.id ? '!border-green-400 shadow-md' : ''
              }`"
            >
              <div class="flex space-x-3">
                <div class="font-bold">{{ item.name }}</div>
              </div>
              <div class="flex space-x-2 mt-1 relative">
                <el-image
                  class="h-100px w-100px"
                  lazy
                  :src="item.img"
                  :preview-src-list="[item.img]"
                  preview-teleported
                  fit="cover"
                />
                <div class="space-y-1 text-[.8rem] px-3 text-[#666666]">
                  <div>
                    <span>基地名称:</span>
                    <span class="pl-2">{{ getListLabelByID(activeItemId) }}</span>
                  </div>
                  <div>
                    <span>经度:</span>
                    <span class="pl-2">{{ item.longitude }}</span>
                  </div>
                  <div>
                    <span>纬度:</span>
                    <span class="pl-2">{{ item.latitude }}</span>
                  </div>
                  <div>
                    <span>联系人:</span>
                    <span class="pl-2">{{ item.contact }}</span>
                  </div>
                  <div>
                    <span>面积:</span>
                    <span class="pl-2">{{ item.area ?? '0' }}亩</span>
                  </div>
                </div>
                <div @click="handleStopPropagation" class="absolute z-999 right-0 bottom-0">
                  <el-button
                    class="!bg-[#009688] text-white"
                    type="primary"
                    @click="handleDraw(item)"
                    v-hasPermi="['agriculture:park-info:update']"
                  >
                    绘制围栏
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="h-[2.5rem]">
            <Pagination
              v-show="!showPlotList"
              :total="total"
              v-model:page="queryParams.pageNo"
              v-model:limit="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>
        <div class="h-full grow bg-#f1f1f1">
          <map-custom ref="parkMapIns" />
        </div>
      </div>
    </div>
    <div v-if="showType === 'list'" class="inner-frame-wrapper">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!-- 子表的列表 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-tabs model-value="parkDetail">
              <el-tab-pane label="农业资源列表" name="parkDetail">
                <ParkDetailList :park-id="scope.row.id" />
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-table-column>
        <!--      <el-table-column label="编号" align="center" prop="code" width="200"/>-->
        <el-table-column label="名称" align="center" prop="name" width="150" />
        <el-table-column label="类型" align="center" prop="categoryName" width="150" />
        <el-table-column label="海拔" align="center" prop="altitude" width="100">
          <template #default="scope">
            {{ scope.row.altitude != undefined ? scope.row.altitude + '米' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="纬度" align="center" prop="latitude" />
        <el-table-column label="经度" align="center" prop="longitude" />
        <el-table-column label="通讯地址" align="center" prop="address" />
        <el-table-column label="联系人" align="center" prop="contact" />
        <el-table-column label="联系电话" align="center" prop="tel" />
        <el-table-column label="面积" align="center" prop="area" width="100">
          <template #default="scope">
            {{ scope.row.area != undefined ? scope.row.area + '亩' : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="quantity" width="100">
          <template #default="scope">
            {{
              scope.row.quantity != undefined
                ? scope.row.type === 'chicken'
                  ? scope.row.quantity + '只'
                  : scope.row.quantity + '株'
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column label="简介" align="center" prop="remark" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="220" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleDraw(scope.row)"
              v-hasPermi="['agriculture:park-info:update']"
            >
              绘制围栏
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm(scope.row.id)"
              v-hasPermi="['agriculture:park-info:update']"
            >
              编辑
            </el-button>
            <el-button link type="primary" @click="openFormDetail(scope.row.id)">详情</el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:park-info:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </ContentWrap>

  <fence-dialog
    v-model="showDrawDialog"
    title="绘制围栏"
    width="80vw"
    draggable
    append-to-body
    destroy-on-close
  >
    <div class="w-full h-full">
      <map-custom ref="tiandiIns" :enableEdit="true" />
    </div>
    <template #footer>
      <el-button size="small" @click="handleCancel()">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
    </template>
  </fence-dialog>
</template>

<script setup lang="ts">
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo'
import { ParkCategoryApi } from '@/api/agriculture/parkcategory'
import download from '@/utils/download'
import { ElMessage } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import dayjs from 'dayjs'
// TODO: 天地图调整leaflet
// @ts-ignore
import ParkDetailList from './components/ParkDetailList.vue'
import { CropGrowthNewApi } from '@/api/agri/cropgrowthnew'
import * as turf from '@turf/turf'
import FenceDialog from './components/fenceDialog.vue'

const showType = ref<string>('card')
const parkMapIns = ref() // 地图实例
const showPlotList = ref<boolean>(false)
const handleStopPropagation = (e) => e.stopPropagation()

/** 基地基本信息 列表 */
defineOptions({ name: 'ParkInfo' })
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const queryFormRef = ref() // 搜索的表单

const parkCategoryOptions = ref() //基地分类列表
const getParkCategoryOptionsData = async () => {
  const res = await ParkCategoryApi.getAllParkCategory()
  if (Array.isArray(res)) parkCategoryOptions.value = res
}
getParkCategoryOptionsData()

// 请求参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  type: undefined,
  altitude: undefined,
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  contact: undefined,
  tel: undefined,
  area: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
  quantity: undefined
})

/** 查询列表 */
const activeItemId = ref<string>('')
const loading = ref<boolean>(false)
const list = ref<ParkInfoVO[]>([]) // 列表的数据
const total = ref<number>(0) // 列表的总页数
const getList = async (onlyGetData:boolean = false) => {
  loading.value = true
  try {
    if (parkMapIns.value) parkMapIns.value.clearMap();
    const { list: list1, total: total1 } = await ParkInfoApi.getParkInfoPage(queryParams)
    list.value = list1
    console.log('🚀 ~ getList ~ list1:', list1)
    if (Array.isArray(list1) && list1.length > 0) {
      if (onlyGetData) {
        const _item = list1.find(ele => ele.id === activeItemId.value)
        console.log("_item", _item)
        handleParkClick(_item, false)
      } else handleParkClick(list1[0], false)
    }
    total.value = total1
  } finally {
    loading.value = false
  }
}

const getListLabelByID = (id: string) => {
  if (!Array.isArray(list.value)) return
  let res = ''
  list.value.forEach((item) => {
    if (id === item.id) res = item.name
  })
  return res
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
  handleBack() // 清空地块信息列表
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const router = useRouter() // 路由
onActivated(() => {
  const prevPath = localStorage.getItem("PREV_PATH")
  if (prevPath !== '/asset/base/parkInfo/create') return;
  getList()
  handleBack() // 清空地块信息列表
  // handleQuery()
})

/** 查看操作 */
const openFormDetail = (id?: number) => {
  if (id) router.push(`/asset/base/asset/base/parkinfo/detail?id=${id}`)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ParkInfoApi.deleteParkInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
/** 添加/修改操作 */
const formRef = ref()
const openForm = (id?: number) => {
  if (id) router.push(`/asset/base/parkInfo/create?id=${id}`)
  else router.push(`/asset/base/parkInfo/create`)
}

/** 导出按钮操作 */
const exportLoading = ref<boolean>(false)
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ParkInfoApi.exportParkInfo(queryParams)
    download.excel(data, '基地基本信息.xls')
  } catch (err) {
    console.error('ERR', err)
  } finally {
    exportLoading.value = false
  }
}

// 绘制围栏
const selectedDrawId = ref('')
const showDrawDialog = ref<boolean>(false)
const tiandiIns = ref()
const areaMatchZoom = (_pos: any[]) => {
  const area = turf.area(turf.polygon([[..._pos, _pos[0]]]))
  if (area < 3000) return 17
  if (area > 3600000000) return 5
  return Math.floor(17 - (12 * area) / 3600000000)
}
const handleDraw = (item) => {
  const { id, geofencing } = item;
  if (!id) {
    ElMessage.error('当前数据ID不存在')
    return
  }
  selectedDrawId.value = id
  showDrawDialog.value = true
  nextTick(() => {
    if (geofencing) {
      const _arr = JSON.parse(geofencing)
      if (Array.isArray(_arr) && _arr.length === 1) {
        const _polyArr = _arr[0].map((ele) => ([ele.lat, ele.lng]))
        setTimeout(() => {
          tiandiIns.value.createPolygon(_polyArr)
        }, 500)
      } else {
        // TODO： 新版
        const { corrdinates, option } = JSON.parse(geofencing);
        if (Array.isArray(corrdinates) && corrdinates.length > 0) {
          setTimeout(() => {
            tiandiIns.value.createPolygon(corrdinates[0].map(location => ([location.lat, location.lng])), option)
          }, 500)

        }

      }
    } else {
      // TODO 如果不存在围栏，把中心点设置在基地中间
      if (activeBaseCenter.value.length !== 2) return;
      nextTick(() => { tiandiIns.value.setCenterZoom(activeBaseCenter.value, 17) })
    }
  })
}

// 切换卡片或列表时触发
const handleTypeChange = () => {
  activePlotId.value = ''
  showPlotList.value = false;

  if (showType.value === 'card') {
    const item = list.value.find(ele => ele.id === activeItemId.value);
    if (!item) return;
    handleParkClick(item, false)
  }
}

// 在右侧地图中绘制基地
const handleDrawPark = (item) => {
  const { geofencing } = item
  if (!geofencing) return ElMessage.warning('当前基地或地块尚未绘制电子围栏！')
  const _arr = JSON.parse(geofencing)
  if (Array.isArray(_arr) && _arr.length === 1) {
    const _polyArr = _arr[0].map((ele) => ([ele.lat, ele.lng]))
    parkMapIns.value.createPolygon(_polyArr)
  } else {
    // TODO： 新版
    const { corrdinates, option } = JSON.parse(geofencing);
    if (Array.isArray(corrdinates) && corrdinates.length > 0) {
      parkMapIns.value.createPolygon(corrdinates, option)
    }
  }
}

// 点击基地
const handleBack = () => {
  plotDataList.value = []
  showPlotList.value = false
}
const activePlotId = ref<string>('')
const plotDataList = ref<any[]>([])
const handlePlotClick = (item) => {
  if (!item.id) return
  activePlotId.value = item.id
  handleDrawPark(item)
}
// TODO 设置活动的基地
const activeBaseCenter = ref<number[]>([]);
const setActiveBaseCenter = (item) => {
  console.log("setActiveBaseCenter Item => ", item);
  const { longitude, latitude, geofencing } = item;
  if (!longitude || !latitude) return;
  activeBaseCenter.value = [Number(latitude), Number(longitude)]
}
const handleParkClick = async (item, _showPlot = true) => {
  if (!item?.id) return;
  setActiveBaseCenter(item)
  const list = await ParkInfoApi.getParkDetailListByParkId(item.id)
  console.log('地块列表', list)

  if (Array.isArray(list)) plotDataList.value = list
  showPlotList.value = _showPlot
  activeItemId.value = item.id
  handleDrawPark(item)
}

const handleConfirm = async () => {
  const geofencing = tiandiIns.value.getCurrentSaveCoordinates()
  const { corrdinates, option } = geofencing;
  if (!Array.isArray(corrdinates)) return ElMessage.error('您还未选择区域!')
  if (corrdinates.length < 1) return ElMessage.error('您还未选择区域!')
  const data = await CropGrowthNewApi.saveGeofencing({
    id: selectedDrawId.value,
    geofencing: JSON.stringify(geofencing),
    infraType: showPlotList.value ? '2' : '1'
  })

  if (data) ElMessage.success('保存成功!')
  else ElMessage.error('保存失败！')
  showDrawDialog.value = false
  selectedDrawId.value = ''
  getList(true)
}

const handleCancel = () => {
  selectedDrawId.value = ''
  showDrawDialog.value = false
}

// 从 localStorage 获取数据
const localdata = ref([])
const mapCenter = ref([0, 0])

const fetchCoordinatesFromLocalStorage = () => {
  const storedData = localStorage.getItem('polygonCoordinates')
  if (storedData) {
    localdata.value = JSON.parse(storedData)

    const validPoints = localdata.value
      .flat()
      .map((ele:any) => {
        const lng = parseFloat(ele.lng)
        const lat = parseFloat(ele.lat)
        return [lng, lat]
      })
      .filter((item) => {
        const [lng, lat] = item
        return !isNaN(lng) && !isNaN(lat)
      })

    if (validPoints.length > 0) {
      const _center = turf.centroid(turf.points(validPoints))

      mapCenter.value = _center.geometry.coordinates // [lng, lat]
    } else {
      console.log('No valid coordinates found.')
    }
  } else {
    console.log('No coordinates found in localStorage')
  }
}
//fetchCoordinatesFromLocalStorage()
handleQuery()
</script>

<style lang="scss" scoped>
.tab-btn,
.tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 1.5rem;
}

.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
}

.tab-btn-selected {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}

.grid-container {
  grid-template-columns: 1fr;
  row-gap: 0.3rem;
  padding: 0.3rem 0.8rem;
}

.inner-frame-wrapper {
  height: max(25rem, calc(100vh - 21rem));
  padding-top: 1rem;
}

.hidden-scroll-bar::-webkit-scrollbar {
  width: 0;
}
</style>
