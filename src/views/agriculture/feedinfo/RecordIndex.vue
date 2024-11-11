<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="88px"
    >
      <!--      <el-form-item label="所属基地" prop="belongPark">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.belongPark"-->
      <!--          placeholder="请输入所属基地"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="基地名称" prop="parkName">
        <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="所属地块" prop="belongPlot">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.belongPlot"-->
      <!--          placeholder="请输入所属地块"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="plotName">
        <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农事阶段" prop="farmingStage">
        <!--            <el-input v-model="formData.farmDefineType" placeholder="请输入农事阶段" />-->
        <el-select v-model="queryParams.farmingStage" placeholder="请选择农事阶段"  class="!w-240px">
          <el-option
            v-for="dict in farmDefineOptions"
            :key="dict.id"
            :label="dict.defineName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="螃蟹数量" prop="crabNum">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.crabNum"-->
      <!--          placeholder="请输入螃蟹数量"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="饲料种类" prop="feedType">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.feedType"-->
      <!--          placeholder="请选择饲料种类"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option label="请选择字典生成" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="投喂数量" prop="feedNum">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.feedNum"-->
      <!--          placeholder="请输入投喂数量"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="备用字段" prop="feedOne">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.feedOne"-->
      <!--          placeholder="请输入备用字段"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="操作时间" prop="feedTime">
        <el-date-picker
          v-model="queryParams.feedTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <!--      <el-form-item label="创建时间" prop="createTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.createTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
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
      <el-row>
        <el-form-item>
          <!--        <el-button-->
          <!--          type="primary"-->
          <!--          plain-->
          <!--          @click="openForm('create')"-->
          <!--          v-hasPermi="['agriculture:feed-info:create']"-->
          <!--        >-->
          <!--          <Icon icon="ep:plus" class="mr-5px"/>-->
          <!--          新增-->
          <!--        </el-button>-->
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:feed-info:export']"
          >
            <Icon icon="ep:download" class="mr-5px"/>
            导出
          </el-button>
        </el-form-item>
      </el-row>
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="ID" align="center" prop="id"/>-->
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark"/>-->
      <el-table-column label="基地名称" align="center" prop="parkName"/>
      <!--      <el-table-column label="所属地块" align="center" prop="belongPlot"/>-->
      <el-table-column label="地块名称" align="center" prop="plotName"/>
<!--      <el-table-column label="螃蟹数量" align="center" prop="crabNum"/>-->
      <el-table-column label="农事阶段" align="center" prop="farmingStage" width="120" >
        <template #default="scope">
          <el-select v-model="scope.row.farmingStage" disabled>
            <el-option
              v-for="dict in farmDefineOptions"
              :key="dict.id"
              :label="dict.defineName"
              :value="dict.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="投入品名称" align="center" prop="productName"/>
      <el-table-column label="投入品分类名称" align="center" prop="categoryName" width="120" />
      <el-table-column
        label="生产日期"
        align="center"
        prop="produceDate"
        :formatter="dateFormatter2"
        width="140"
      />
      <el-table-column
        label="有效日期"
        align="center"
        prop="effectiveTime"
        :formatter="dateFormatter2"
        width="140"
      />
      <el-table-column label="消耗量" align="center" prop="consumeNum" width="60"/>
      <el-table-column label="消耗量单位" align="center" prop="consumeUnit" width="120"/>
      <el-table-column label="规格" align="center" prop="standard" width="120"/>
      <!-- <el-table-column label="投喂量" align="center" prop="feedNum" width="60"/>
      <el-table-column label="投喂量单位" align="center" prop="feedOne" width="120"/> -->
      <el-table-column
        label="操作时间"
        align="center"
        prop="feedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="投入品费用/元" align="center" prop="feedCost" width="120"/>
      <el-table-column label="操作人" align="center" prop="feedPerson" />
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:feed-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:feed-info:delete']"
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
  <FeedInfoFormRecord ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter, dateFormatter2} from '@/utils/formatTime'
import download from '@/utils/download'
import {FeedInfoApi, FeedInfoVO} from '@/api/agriculture/feedinfo'
import FeedInfoFormRecord from './FeedInfoFormRecord.vue'
import {FarmDefineApi} from "@/api/agriculture/farmdefine";

/** 投喂记录 列表 */
defineOptions({name: 'FeedInfo'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FeedInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  crabNum: undefined,
  feedType: undefined,
  feedNum: undefined,
  feedOne: undefined,
  feedTime: [],
  farmingStage: undefined,
  createTime: [],
  standard: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
let farmDefineOptions = ref([])// 设备分类选项
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FeedInfoApi.getFeedInfoPage(queryParams)
    //把品类数据的name拼接到列表中
    data.list.forEach((item)=>{
      item.farmingStage=item.farmingStage?parseInt(item.farmingStage):""
      farmDefineOptions.value.forEach(itm => {
        if (item.farmingStage == itm.id)
          item.farmingStage = itm.defineName
      })
    })
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeedInfoApi.deleteFeedInfo(id)
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
    const data = await FeedInfoApi.exportFeedInfo(queryParams)
    download.excel(data, '投喂记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async ()  => {
  farmDefineOptions.value =  await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  await getList()
})
onActivated(async () => {
  await getList()
})
</script>
