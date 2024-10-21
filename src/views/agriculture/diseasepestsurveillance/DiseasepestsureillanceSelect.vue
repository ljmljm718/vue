<template>
  <Dialog title="设备列表"  v-model="dialogVisible"  :appendToBody="true" :scroll="true" width="1400">
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="设备" prop="device">
        <el-input
          v-model="queryParams.device"
          placeholder="请输入设备"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="监测物种" prop="monitorSpecies">
        <el-select
v-model="queryParams.monitorSpecies" clearable placeholder="请选择监测物种"
                   class="!w-240px">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="监测类型" prop="monitorType">
        <el-select
          v-model="queryParams.monitorType"
          placeholder="请选择监测类型"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="监测时间" prop="monitorTime">
        <el-date-picker
          v-model="queryParams.monitorTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="监测抓图" prop="monitorPicture">
        <el-input
          v-model="queryParams.monitorPicture"
          placeholder="请输入监测抓图"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="地块" prop="belongPark">
        <el-select class="!w-240px" v-model="queryParams.belongPark">
          <el-option
            v-for="(item, index) in plotList"
            :key="index"
            :value="item.id"
            :label="item.name"
            placeholder="请选择"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="识别状态" prop="identifyStatus">
        <el-select v-model="queryParams.identifyStatus" class="!w-240px" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_IDENTIFY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="设备状态" prop="deviceStatus">
        <el-select
          v-model="queryParams.deviceStatus"
          placeholder="请选择设备状态"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <!-- 标题 -->
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        ref="suibian"
        :show-overflow-tooltip="true"
        @select="fangfa"
        scrollbar-always-on='false'
        @selection-change="handleSelectionChange" >
      <el-table-column fixed  width="30" label="选择" type="selection" />
    <!-- <el-table v-show="listType === 'list'" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"> -->
      <el-table-column label="设备" align="center" prop="device" />
      <el-table-column label="监测物种" align="center" prop="monitorSpecies" />
      <el-table-column label="监测类型" align="center" prop="monitorType" />
      <el-table-column
        label="监测时间"
        align="center"
        prop="monitorTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="监测抓图" align="center" prop="monitorPicture" >
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            :src="row.monitorPicture"
            :preview-src-list="[row.monitorPicture]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="地块" align="center" prop="belongPark" />
      <el-table-column label="识别状态" align="center" prop="identifyStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_IDENTIFY_STATUS" :value="scope.row.identifyStatus" />
        </template>
      </el-table-column>
    </el-table> 
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  
  </ContentWrap>
    <template #footer >
   
    <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
    </el-button>
    <el-button @click="clear()" >取 消</el-button>
  </template>
  </Dialog>
  <!-- 表单弹窗：添加/修改 -->
  <DiseasePestSurveillanceForm ref="formRef" @success="getList" />

  <!-- 识别表单 -->
  <RecognizeForm ref="recognizeFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DiseasePestSurveillanceApi, DiseasePestSurveillanceVO } from '@/api/agriculture/diseasepestsurveillance'
import DiseasePestSurveillanceForm from './DiseasePestSurveillanceForm.vue'
import RecognizeForm from './RecognizeForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  CategoryManagementApi,
  CategoryManagementVO,
  allDataCacheManager
} from "@/api/agriculture/categorymanagement";
import {page, parkPage} from '@/views/agriculture/IntelligentStatistics/api.ts'
import PestAmountIcon from "./assets/pest-amount-icon.png";
import PestCategoryIcon from "./assets/pest-category-icon.png";
import SpotResTable from "./spotResTable.vue";

/** 病虫害监测 列表 */
defineOptions({ name: 'DiseasePestSurveillance' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DiseasePestSurveillanceVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  device: undefined,
  monitorSpecies: undefined,
  monitorType: undefined,
  monitorTime: [],
  monitorPicture: undefined,
  belongPark: undefined,
  identifyStatus: undefined,
  deviceStatus: undefined,
  createTime: [],
})
const CategoryManagementQueryParams = reactive({})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const show = ref(false)
const selectedItem = ref({})

//开始

let suibian = ref(null)
const fangfa = (select: any, row: any) => {
  if (select.length > 1) {
    let del_row = select.shift()
    suibian.value.toggleRowSelection(del_row, false)
  }
}


window.addEventListener('keydown', (e) => {
     if (e.keyCode === 27) {
        resetQuery()
        dialogVisible.value = false
     }
})

const clear = async()=>{
  dialogVisible.value = false
  resetQuery()
}


/** 选中操作 */
const dialogVisible = ref(false) // 弹窗的是否展示
const selectionList = ref<DiseasePestSurveillanceVO[]>([])
const handleSelectionChange = (rows: DiseasePestSurveillanceVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: DiseasePestSurveillanceVO[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  Object.keys(queryParams).forEach(key => {
    queryParams[key] = undefined;
  });
  await resetQuery()
  // console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

//结束


/** 查询列表 */

const getList = async () => {
  loading.value = true
  try {
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams)
    const data = await DiseasePestSurveillanceApi.getDiseasePestSurveillancePage(queryParams)
    list.value = data.list
    console.log("🚀 ~ getList ~ list.value:", list.value)
    total.value = data.total

    // 设置当前展示的项为第一项 并查询病虫害数量 
    curItem.value = 0;
    if (list.value.length > 0) {
      getCountDetail(list.value[curItem.value].id);
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

// 识别操作
const recognizeFormRef = ref()
const openRecognizeForm = (type: string, id?: string) => {
  recognizeFormRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DiseasePestSurveillanceApi.deleteDiseasePestSurveillance(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await DiseasePestSurveillanceApi.exportDiseasePestSurveillance(queryParams)
    download.excel(data, '病虫害监测.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

//获取基地
const baseList = ref([])
const getPage = async () => {
  let res = await page()
  baseList.value = res.list
  // queryParams.belongPark = res.list[0].id
  getParkPage({parkId: res.list.id})
}
getPage()
//获取地块
const plotList = ref([])
const getParkPage = async (parkId) => {
  let res = await parkPage(parkId)
  plotList.value = res.list
}

const listType = ref<string>("card");  // 卡片 card 列表 list
const curItem = ref<number>(0);  // 当前list被查看的项

// 切换卡片或列表时 重新查询第一页内容
const handleCardChange = async () => {
  queryParams.pageNo = 1;
  await getList();
}

const mainImg = ref<any>();  // 大图的模板引用
const mainImgHeight = ref<any>();  // 大图高度
const mainImgContainer = ref<any>();  // 大图容器的模板引用
const cardContainer = ref<any>();  // 卡片容器的模板引用
const imgSideLength = ref<any>();  // 图片列表每个项的边长

// 设置图片容器的高度就是宽度的3/4 以及小图片的边长
const setImgContainerWidthAndImgStyle = () => {
  if (!cardContainer.value) return;
  const containerWidth = Number(window.getComputedStyle(cardContainer.value).width.slice(0, -2)) * 0.4 - 32;
  const imgContainerHeight = containerWidth * (3 / 4);
  mainImgHeight.value = imgContainerHeight;
  if (!mainImgContainer.value) return;
  mainImgContainer.value.style.height = imgContainerHeight + "px";
  imgSideLength.value = (containerWidth - 3 * 16) / 4;
}

window.addEventListener("resize", setImgContainerWidthAndImgStyle);
watchEffect(setImgContainerWidthAndImgStyle);

// 当图片高度大于容器高度时 显示滚动条
const showScroll = () => {
  if (!mainImg.value || !mainImgContainer.value) return;
  const imgHeight = Number(window.getComputedStyle(mainImg.value).height.slice(0, -2));
  const imgContainerHeight = Number(window.getComputedStyle(mainImgContainer.value).height.slice(0, -2));
  return imgHeight > imgContainerHeight;
}

const imgListRef = ref<any>();  // 图片列表的模板引用

// 图片列表左移 当前查看的不是最后一个时 左移一个单位 + 1rem
const handleClickNextImg = () => {
  if (curItem.value === list.value.length - 1) return;
  curItem.value = curItem.value + 1;
  getCountDetail(list.value[curItem.value].id);
  const curLeft = Number(window.getComputedStyle(imgListRef.value).left.slice(0, -2));
  imgListRef.value.style.left = curLeft - (imgSideLength.value + 16) + 'px';
}

// 图片列表右移 当前查看的不是第一个时 右移一个单位 + 1rem
const handleClickLastImg = () => {
  if (curItem.value === 0) return;
  curItem.value = curItem.value - 1;
  getCountDetail(list.value[curItem.value].id);
  const curLeft = Number(window.getComputedStyle(imgListRef.value).left.slice(0, -2));
  imgListRef.value.style.left = curLeft + imgSideLength.value + 16 + 'px';
}

// 点击图片切换到当前显示位置
const handleClickImg = (index) => {
  if (curItem.value === index) return;
  curItem.value = index;
  getCountDetail(list.value[curItem.value].id);
  imgListRef.value.style.left = (imgSideLength.value + 16) * (1 - index) + 'px';
}

// 初次显示列表时 右移一位 表示右二是当前查看的项
// 因为刚加载页面时可能没有cardContainer.value 因此不能用onMounted
watchEffect(() => {
  if (!cardContainer.value) return;
  imgListRef.value.style.left = imgSideLength.value + 16 + 'px';
});

// 病虫害数量
const countDetail = ref<any>({
  dataSumByName: 0,  // 分类数量
  dataSumById: 0  // 总数量
});

// 获取病虫害数量
const getCountDetail = async (id) => {
  const res = await DiseasePestSurveillanceApi.countDetails({ id });
  countDetail.value.dataSumByName = res.dataSumByName;
  countDetail.value.dataSumById = res.dataSumById;
}
</script>

<style lang="scss" scoped>
// 无数据
.no-data {
  background: {
    image: url(@/assets/imgs/chartNull.png);
    size: contain;
    position: center;
    repeat: no-repeat;
  }
  height: 10rem;
  width: 10rem;
  text-align: center;
  letter-spacing: 0.1rem;
}

// 图片边框四个角
.corner-left-top,
.corner-left-bottom,
.corner-right-top,
.corner-right-bottom {
  position: absolute;
  background-size: 100%, 100%;
  width: 24px;
  height: 24px;
}

.corner-left-top {
  background-image: url(./assets/border-left-top.png);
  left: 0;
  top: 0;
}

.corner-left-bottom {
  background-image: url(./assets/border-left-bottom.png);
  left: 0;
  bottom: 0;
}

.corner-right-top {
  background-image: url(./assets/border-right-top.png);
  right: 0;
  top: 0;
}

.corner-right-bottom {
  background-image: url(./assets/border-right-bottom.png);
  bottom: 0;
  right: 0;
}

.last-icon,
.next-icon {
  background: {
    position: center;
    repeat: no-repeat;
    size: contain;
  }
  position: absolute;
  transform: translate(-50%, -50%);
}

.last-icon {
  background-image: url(./assets/last-icon.png);
}

.next-icon {
  background-image: url(./assets/next-icon.png);
}
</style>