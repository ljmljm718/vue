<template>
  <ContentWrap>
    <div class="flex items-start">
      <el-form
        class="grow"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="名称" prop="cropName">
          <el-input
            v-model="queryParams.cropName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="品类" prop="cropId">
          <el-select v-model="queryParams.cropId" clearable placeholder="请选择品类" class="!w-240px">
            <el-option
              v-for="item in listCategoryManagement"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="品种" prop="cropName">
          <el-select v-model="queryParams.cropName" clearable placeholder="请选择品种" class="!w-240px">
            <el-option
              v-for="item in listVarietyManagementVO.list"
              :key="item.varietyName"
              :label="item.varietyName"
              :value="item.varietyName"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="w-[1px] bg-#25252545 h-[3rem] mx-2"></div>
      <div class="w-[100px] flex space-x-2 lg:w-[150px] lg:flex-row flex-col space-y-2 items-center">
        <div class="w-0 h-0 sm:hidden"></div>
        <el-button @click="handleQuery" class="!bg-[#009688] !text-[#fff]">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap>
    <div class="flex justify-between items-center">
      <div class="space-x-1">
        <el-button
          class="!text-white !bg-[#009688]"
          @click="openForm('create')"
          v-hasPermi="['agri:crop-growth-new:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:crop-growth-new:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />导出
        </el-button>
      </div>
      <div class="flex items-center">
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
    <div
      class="w-full pt-5"
      v-show="showType === 'list'"
    >
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!-- <el-table-column type="selection" width="55" /> -->
        <!--      <el-table-column label="主键" align="center" prop="id" />-->
        <el-table-column label="品种名称" align="center" prop="cropName"/>
        <el-table-column label="品类名称" align="center" prop="cropType"/>
        <!--      <el-table-column label="品种编号" align="center" prop="cropCode" />-->
        <!--      <el-table-column label="品类编号" align="center" prop="cropId" />-->
        <!--      <el-table-column label="图片" align="center" prop="imgId" />-->
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              :src="row.imgId"
              :preview-src-list="[row.imgId]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="生长期" align="center" prop="growth"/>
        <el-table-column
          label="开始时间"
          align="center"
          prop="startTime"
          :formatter="dateFormatter3"
          width="180px"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter3"
          width="180px"
        />

        <el-table-column label="环境条件" align="center" prop="envCondition"/>
        <el-table-column label="生长地点" align="center" prop="growSite"/>
        <el-table-column label="周期（/天）" align="center" prop="cycle"/>
        <el-table-column label="特点" align="center" prop="feature"/>

        <!--      <el-table-column-->
        <!--        label="创建时间"-->
        <!--        align="center"-->
        <!--        prop="createTime"-->
        <!--        :formatter="dateFormatter"-->
        <!--        width="180px"-->
        <!--      />-->
        <el-table-column label="操作" align="center" width="230px">
          <template #default="scope">
            <el-button
              link
              type="success"
              plain
              @click="damn(scope.row)"
            >
              事项查看
            </el-button>
            <el-button
              link
              type="warning"
              plain
              @click="openSubDeviceForm(scope.row.id)"
            >
              事项添加
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agri:crop-growth-new:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agri:crop-growth-new:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="w-full space-y-2 pt-2"
      v-show="showType === 'card'"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="p-3 rounded-2 px-4"
        style="border: 1px solid #66666666"
      >
        <div class="w-full flex justify-between items-center mb-2">
          <div class="text-[1rem] font-bold">{{ item.cropName + ' - ' + item.cropType }}</div>
          <div class="space-x-2">
            <el-button
              class="!hover:bg-[#009688] !hover:text-white"
              @click="openForm('update', item.id)"
              v-hasPermi="['agri:crop-growth-new:update']"
            >编辑</el-button>
            <!-- <el-button>详情</el-button> -->
            <el-button
              class="!hover:bg-[#009688] !hover:text-white"
              @click="handleDelete(item.id)"
              v-hasPermi="['agri:crop-growth-new:delete']"
            >删除</el-button>
          </div>
        </div>
        <div class="flex justify-between item-start">
          <div class="text-[15px]">
            <div class="text-[#666666]">
              <span>品类:</span>
              <span>{{ item.cropName }}</span>
              <span>|</span>
              <span>品种:</span>
              <span>{{ item.cropType }}</span>
            </div>
            <div class="flex items-start mt-[1rem]">
              <el-image
                class="h-130px w-130px"
                lazy
                :src="item.imgId"
                :preview-src-list="[item.imgId]"
                preview-teleported
                fit="cover"
              />
              <div class="ml-2 text-[15px] w-[14rem]">
                <div class="mb-1 font-bold">环境条件:</div>
                <div class="line-clamp-2">
                  <el-tooltip
                    class="box-item"
                    :content="item.envCondition"
                    placement="top-start"
                  >
                    <div>{{ item.envCondition }}</div>
                  </el-tooltip>
                </div>
                <div class="mt-2 mb-1 font-bold">特点:</div>
                <div class="line-clamp-2">
                  <el-tooltip
                    class="w-[300px]"
                    :content="item.feature"
                    placement="top-start"
                  >
                    <div>{{ item.feature }}</div>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="w-[1px] bg-[#66666640] h-[7rem] mt-3 mx-5"></div>
          <div class="w-[9rem] h-[9rem] mt-1 mx-3 chart-bg flex items-center justify-center flex-col text-[.9rem]">
            <div>{{ item.growth }}</div>
            <div>{{ item.cycle + '天' }}</div>
          </div>
          <div class="w-[1px] bg-[#66666640] h-[7rem] mt-3 mx-5"></div>
          <div class="right-content-wrapper">
            <div class="flex justify-between items-center mt-3 px-6 overflow-hidden pb-[25px]">
              <div
                v-for="item, index in growthDateList"
                :key="index"
                class="relative"
              >
                <div>{{ item.label }}</div>
                <div>{{ item.value }}</div>
                <div :class="[item.actived ? 'progress-bar-active' : 'progress-bar']"></div>
              </div>
            </div>
            <div class="flex mt-2">
              <div class="grow text-[#ffffff] bg-[#009688] text-center py-2">幼苗期栽培要点</div>
              <div class="grow text-[#666666] bg-[#f5f5f5] text-center py-2">幼苗期栽培要点</div>
              <div class="grow text-[#666666] bg-[#f5f5f5] text-center py-2">幼苗期栽培要点</div>
              <div class="grow text-[#666666] bg-[#f5f5f5] text-center py-2">幼苗期栽培要点</div>
            </div>
            <div class="px-[1rem] pt-3">{{ item.growSite }}</div>
          </div>
        </div>
      </div>
    </div>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CropGrowthNewForm ref="formRef" @success="getList"/>
  <CropGrowthSubForm ref="subformRef" @success="getList" />
  <!-- start事项查看弹窗 -->
  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>{{ thisGrowth }}注意事项</h3>
    </template>
    <template #default>
      <div class="relative">
        <div v-if='formData.length>0'
             class="flex absolute top--30px left-50px flex-col items-center">
          <div class="flex items-center">
            <div class="w-15px h-15px rounded-full bg-[#089df7]"></div>
            <div class="ml-185px">
              <!-- {{ formatTime(formData[0].createTime, 'yyyy-MM-dd HH:mm:ss') }} -->
            </div>
          </div>
          <div v-if='formData.length>1' class="w-2px h-190px bg-[#089df7] ml--185px"></div>
          <div class="flex items-center" v-if='formData.length>1'>
            <div class="w-15px h-15px rounded-full bg-[#089df7]"></div>
            <div class="ml-185px">
            </div>
          </div>
        </div>
        <el-card class="w-400px ml-80px mt-50px" v-for="item, index in formData" :key="index">
          <!-- <h4>农事活动：{{ getValByDict(item.farmDefineType) }}</h4>
          <p>品种：
            <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="item.cropType"/>
          </p>
          <p>作物名称：{{ item.cropName }}</p>
          <p>记录时间：{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</p> -->
          <p>品种: {{ thisCropType }}</p>
          <p>事项名称: {{ item.itemName }}</p>
          <p>事项内容：{{ item.itemContent }}</p>
        </el-card>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- end事项查看弹窗 -->

</template>

<script setup lang="ts">
import {dateFormatter, dateFormatter2, dateFormatter3} from '@/utils/formatTime'
import download from '@/utils/download'
import { Menu, List } from '@element-plus/icons-vue'
import {CropGrowthNewApi, CropGrowthNewVO} from '@/api/agri/cropgrowthnew'
import CropGrowthNewForm from './CropGrowthNewForm.vue'
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {VarietyManagementApi, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import CropGrowthSubForm from './CropGrowthSubForm.vue'
//本次请求接口 生长周期子表接口
import { CropGrowthSubApi, CropGrowthSubVO } from '@/api/agriculture/cropgrowthsub'
// 时间格式化工具类
import {formatTime} from '@/utils/index'
/** 作物生长周期 列表 */
defineOptions({name: 'CropGrowthNew'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const showType = ref("card")
const growthDateList = ref<any[]>([
  {
    label: '播种期',
    value: '周期20天',
    actived: true
  },
  {
    label: '出苗期',
    value: '周期10天',
    actived: true
  },
  {
    label: '幼苗期',
    value: '周期30天',
    actived: false
  },
  {
    label: '移栽期',
    value: '周期8天',
    actived: false
  },
  {
    label: '成年期',
    value: '周期60天',
    actived: false
  },
])

const loading = ref(true) // 列表的加载中
const list = ref<CropGrowthNewVO[]>([]) // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const listVarietyManagementVO = ref<VarietyManagementVO[]>([]) // 品种列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  createTime: [],
  startTime: [],
  endTime: [],
  cropId: undefined,
  envCondition: undefined,
  growSite: undefined,
  cycle: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const CategoryManagementQueryParams = reactive({})
const VarietyManagementVOQueryParams = reactive({})

//start事件查看方法
const drawer2 = ref(false)
function cancelClick() {
  thisCropType.value = undefined
  thisGrowth.value = undefined
  drawer2.value = false
}
const formData = ref<CropGrowthSubVO[]>([])
const thisCropType = ref()
const thisGrowth = ref()
const damn = async (row) =>{
  thisCropType.value = row.cropType
  thisGrowth.value = row.growth
  const datas = await CropGrowthSubApi.getCropGrowthSubPage({cropCode:row.id});
  formData.value = datas.list;
  drawer2.value = true
}
//end事件查看

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CropGrowthNewApi.getCropGrowthNewPage(queryParams)

    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams)

    // const pageRes = await VarietyManagementApi.getVarietyManagementPage(CategoryManagementQueryParams)
    // if (Array.isArray(pageRes.list)) listVarietyManagementVO.value = pageRes
    // console.log(listVarietyManagementVO.value)
    list.value = data.list
    total.value = data.total
  } catch (err) {
    console.error(err);
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CropGrowthNewApi.deleteCropGrowthNew(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CropGrowthNewApi.exportCropGrowthNew(queryParams)
    download.excel(data, '作物生长周期.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 添加生长周期子表操作 */
const subformRef = ref()
const openSubDeviceForm = (id) => {
  subformRef.value.open('create', id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.tab-btn, .tab-btn-selected {
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

.chart-bg {
  background-image: url(./chart.png);
  background-size: 100% 100%;
}

.progress-bar-active {
  position: absolute;
  left: 0px;
  bottom: -15px;
  width: 400px;
  height: 2px;
  background-color: #b7b7b7;
}

.progress-bar-active::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #009688;
  border-radius: 5px;
  position: absolute;
  top: -4px;
}

.progress-bar {
  position: absolute;
  left: 0px;
  bottom: -15px;
  width: 400px;
  height: 2px;
  background-color: #b7b7b7;
}

.progress-bar::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #009688;
  border-radius: 5px;
  position: absolute;
  top: -4px;
}

.right-content-wrapper {
  display: none;
}

@media screen and (min-width: 1400px) {
  .right-content-wrapper {
    display: block;
    width: 500px;
  }
}

@media screen and (min-width: 1500px) {
  .right-content-wrapper {
    display: block;
    width: 600px;
  }
}

@media screen and (min-width: 1700px) {
  .right-content-wrapper {
    display: block;
    width: 800px;
  }
}

@media screen and (min-width: 2000px) {
  .right-content-wrapper {
    display: block;
    width: 1100px;
  }
}
</style>
