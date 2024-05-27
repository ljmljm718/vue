<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <!--      <el-form-item label="编号" prop="cropCode">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.cropCode"-->
      <!--            placeholder="请输入编号"-->
      <!--            clearable-->
      <!--            @keyup.enter="handleQuery"-->
      <!--            class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="名称" prop="cropName">
        <el-input
          v-model="queryParams.cropName"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="品种" prop="cropType">
        <el-select
          v-model="queryParams.cropType"
          placeholder="请选择品种"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_CROP_CULTIVARS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"  type="primary">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:crop-base:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:crop-base:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="编号" align="center" prop="cropCode" />-->
      <el-table-column label="名称" align="center" prop="cropName"/>
      <el-table-column label="品种" align="center" prop="cropType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="scope.row.cropType"/>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="imgId">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.imgId"
            :preview-src-list="[row.imgId]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark"/>-->
      <el-table-column label="所属基地" align="center" prop="parkName"/>
      <!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
      <el-table-column label="所属基地" align="center" prop="plotName"/>
      <el-table-column
        label="开始时间"
        align="center"
        prop="receiptStartTime"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="receiptEndTime"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column label="批次号" align="center" prop="batchCode" width="160px"/>
      <!--      <el-table-column label="是否采收" align="center" prop="recoveryNo" />-->
      <el-table-column label="二维码" align="center" prop="batchQrImg">
        <template #default="scope">
          <el-image :src="`data:image/png;base64,${scope.row.batchQrImg}`"
                    style="object-fit: cover;width: 2rem;height: 2rem;"
                    preview-teleported
                    :preview-src-list="[`data:image/png;base64,${scope.row.batchQrImg}`]"
          />
        </template>
      </el-table-column>
      <el-table-column label="采收状态" align="center" prop="recoveryNo">
        <template #default="scope">
          <span v-if="scope.row.recoveryNo">已采收</span>
          <span v-if="!scope.row.recoveryNo">未采收</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="cropDesc"/>
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <!--                    <el-button-->
          <!--                      link-->
          <!--                      type="success"-->
          <!--                      @click="goCheck(scope.row)"-->
          <!--                    >-->
          <!--                      溯源-->
          <!--                    </el-button>-->
          <el-button
            link
            type="success"
            @click="damn(scope.row)"
          >
            溯源
          </el-button>
          <el-button
            link
            type="warning"
            @click="openFormA('create', scope.row)"
            v-hasPermi="['agriculture:harvest-management:create']"
            v-if="!scope.row.recoveryNo"
          >
            采收
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:crop-base:update']"
            v-if="!scope.row.recoveryNo"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:crop-base:delete']"
          >
            删除
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <CropBaseForm ref="formRef" @success="getList"/>
  <!-- 表单弹窗：添加/修改 -->
  <HarvestManagementForm ref="formRefA" @success="getList"/>
  <el-drawer v-model="drawer2" :direction="direction" :data="formData">
    <template #header>
      <h3>生命周期-溯源</h3>
    </template>
    <template #default>
      <el-timeline style="max-width: 600px">
        <el-timeline-item
          v-for="item, index in formData"
          :key="index"
          :timestamp="formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') "
          placement="top"
        >
          <el-card>
            <h4>农事活动：{{ getValByDict(item.farmDefineType) }}</h4>
            <p>品种：
              <dict-tag :type="DICT_TYPE.AGRI_CROP_CULTIVARS" :value="item.cropType" />
           </p>
            <p>作物名称：{{ item.cropName }}</p>
            <p>记录时间：{{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import download from '@/utils/download'
import {CropBaseApi, CropBaseVO} from '@/api/agriculture/cropbase'
import CropBaseForm from './CropBaseForm.vue'
import HarvestManagementForm from "@/views/agriculture/harvestmanagement/HarvestManagementForm.vue";
import {DrawerProps} from "element-plus";
import {FarmRecordApi, FarmRecordVO} from "@/api/agriculture/farmrecord";
import {formatTime} from '@/utils/index'

/** 鲁渝协作品种管理 列表 */
defineOptions({name: 'AgriCropBase'})
const drawer2 = ref(false)
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const direction = ref<DrawerProps['direction']>('rtl')
const loading = ref(true) // 列表的加载中
const list = ref<CropBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  createTime: [],
  belongPark: undefined,
  belongPlot: undefined,
  deptId: undefined,
  userId: undefined,
})
const formData = ref<FarmRecordVO[]>([])
const queryParam = reactive({
  pageNo: 1,
  pageSize: 10,
  planId: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: [],
  endTime: [],
  recordTime: [],
  planArea: undefined,
  recordArea: undefined,
  recordState: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CropBaseApi.getCropBasePage(queryParams)
    list.value = data.list
    total.value = data.total
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

/** 添加/修改操作 */
const formRefA = ref()
const openFormA = (type: string, row?: any) => {
  formRefA.value.open(type, row)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CropBaseApi.deleteCropBase(id)
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
    const data = await CropBaseApi.exportCropBase(queryParams)
    download.excel(data, '鲁渝协作品种管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

function cancelClick() {
  drawer2.value = false
}

const damn = async (row) => {
  queryParam.batchCode = row.batchCode;
  const data = await FarmRecordApi.getFarmRecordPage(queryParam)
  data.list.forEach((item) => {
    item.farmDefineType = item.farmDefineType ? parseInt(item.farmDefineType) : ""
  })
  formData.value = data.list
  console.log("222222", formData.value)
  drawer2.value = true
}
/** */
const {push} = useRouter()
// const goCheck = (row) => {
//   //打开新的页签并传递参数
//   push(`/farm_work/farmManage/farm-record?batchCode=${row.batchCode}`);
// }

/** 初始化 **/
const farmDefineOptions = ref([])// 设备分类选项
const getValByDict = (item) => {
  let res = ''
  farmDefineOptions.value.forEach(dict => {
    if (dict.id === item) res = dict.defineName
  })
  return res
}
onMounted(async () => {
  await getList()
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1})
})
</script>
