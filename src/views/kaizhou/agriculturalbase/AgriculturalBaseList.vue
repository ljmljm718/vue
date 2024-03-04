<template>
  <Dialog     title="农资基本信息"
              v-model="dialogVisible"
              :appendToBody="true"
              :scroll="true"
              width="1300">
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="登记证号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入登记证号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农资名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入农资名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农资类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择农资类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_AGRICULTURAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品规格" prop="size">
        <el-input
          v-model="queryParams.size"
          placeholder="请输入产品规格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="采购公司" prop="company">
        <el-input
          v-model="queryParams.company"
          placeholder="请输入采购公司"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
      <el-form-item label="包装关系" prop="packageRelation">
        <el-input
          v-model="queryParams.packageRelation"
          placeholder="请输入包装关系"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"  @selection-change="handleSelectionChange">
      <el-table-column width="30" label="选择" type="selection"/>
      <el-table-column label="登记证号" align="center" prop="code" />
      <el-table-column label="农资名称" align="center" prop="name" />
      <el-table-column label="农资类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_AGRICULTURAL_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="产品规格" align="center" prop="size" />
      <el-table-column label="采购公司" align="center" prop="company" />
      <el-table-column label="采购单价" align="center" prop="price" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="包装关系" align="center" prop="packageRelation" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
    <template #footer>
      <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AgriculturalBaseApi, AgriculturalBaseVO } from '@/api/kaizhou/agriculturalbase'
import AgriculturalBaseForm from './AgriculturalBaseForm.vue'


/** 农资基础信息 列表 */
defineOptions({ name: 'AgriculturalBaseList' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AgriculturalBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  type: undefined,
  size: undefined,
  company: undefined,
  price: undefined,
  remark: undefined,
  createTime: [],
  packageRelation: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中


/** 选中操作 */
const selectionList = ref<AgriculturalBaseVO[]>([])
const handleSelectionChange = (rows: AgriculturalBaseVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: AgriculturalBaseVO[]): void
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
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AgriculturalBaseApi.getAgriculturalBasePage(queryParams)
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
    await AgriculturalBaseApi.deleteAgriculturalBase(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}



</script>
