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
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入模板名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产商" prop="mfrsId">
        <el-select
          v-model="queryParams.mfrsId"
          placeholder="请选择生产商"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in producerEntryList"
            :key="item.id"
            :label="item.companyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适用品牌" prop="brandName">
        <el-input
          v-model="queryParams.brandName"
          placeholder="请输入适用品牌"
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
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex justify-between items-center mb-3">
      <div>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:trace-template:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:trace-template:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </div>
      <div class="flex rounded-md cursor-pointer select-none">
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
    <div v-if="showType === 'list'">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="模板名称" align="center" prop="templateName"/>
        <el-table-column label="生产商" align="center" prop="companyName"/>
        <el-table-column label="产地" align="center" prop="origin"/>
        <el-table-column label="适用品牌" align="center" prop="brandName"/>
        <el-table-column label="头部宣传图" align="center" prop="headerImg">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              :src="row.headerImg"
              :preview-src-list="[row.headerImg]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="二维码" align="center" prop="qrImg" width="100px">
          <template #default="scope">
            <el-image
              :src="scope.row.img"
              style="object-fit: cover; width: 2rem; height: 2rem"
              preview-teleported
              :preview-src-list="[scope.row.img]"
            />
          </template>
        </el-table-column> -->
        <!--      <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="备注1" align="center" prop="remark1" />-->
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openForm('detail', scope.row.id)"
            >
              详情
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:trace-template:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:trace-template:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else class="flex justify-center">
      <div class="grid gap-3 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 container">
        <div
          v-for="item in list"
          :key="item.id"
          class="shadow-md flex flex-col items-center"
          style="border: 1px solid #e1e1e1;"
        >
          <img :src="item.headerImg" class="w-full aspect-1.3 object-contain bg-[#f1f1f1]" />
          <div class="w-full box-border p-3 font-bold">{{ item.templateName }}</div>
          <div class="flex justify-center items-center pb-3">
            <el-button
              type="primary"
              @click="openForm('update', item.id)"
              v-hasPermi="['agriculture:trace-template:update']"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              @click="handleDelete(item.id)"
              v-hasPermi="['agriculture:trace-template:delete']"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <TraceTemplateForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { TraceTemplateApi, TraceTemplateVO } from '@/api/agriculture/tracetemplate'
import TraceTemplateForm from './TraceTemplateForm.vue'
import { ProducerEntryApi, ProducerEntryVO } from "@/api/agriculture/producerentry";
// import QRCode from 'qrcode'

/** 溯源模板 列表 */
defineOptions({name: 'TraceTemplate'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const showType = ref<string>('card')
const loading = ref(true) // 列表的加载中
const list = ref<TraceTemplateVO[]>([]) // 列表的数据
const producerEntryList = ref<ProducerEntryVO[]>([]) // 生产商的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  templateName: undefined,
  mfrsId: undefined,
  origin: undefined,
  brandId: undefined,
  headerImg: undefined,
  productImg: undefined,
  remark: undefined,
  remark1: undefined,
  brandName: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询生产商列表 */
const getProducerEntryList = async () => {
  const data = await ProducerEntryApi.getProducerEntryAll({approvalStatus: 1})
  producerEntryList.value = data
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await TraceTemplateApi.getTraceTemplatePage(queryParams)
    console.log("🚀 ~ getList ~ data:", data.list)
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
    await TraceTemplateApi.deleteTraceTemplate(id)
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
    const data = await TraceTemplateApi.exportTraceTemplate(queryParams)
    download.excel(data, '溯源模板.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getProducerEntryList()
  getList()
})
</script>
<style scoped lang="scss">
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
</style>
