<template>
  <Dialog     title="农事记录"
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
      <el-form-item label="记录编码" prop="recodeCode">
        <el-input
          v-model="queryParams.recodeCode"
          placeholder="请输入记录编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="农事定义" prop="farmWork">
        <el-select
          v-model="queryParams.farmWork"
          placeholder="请选择农事定义"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_FARM_WORK)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="记录时间" prop="recordTime">
        <el-date-picker
          v-model="queryParams.recordTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
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
    <el-table v-loading="loading" :data="list" :stripe="true" ref="suibian" :show-overflow-tooltip="true" @select="fangfa"  @selection-change="handleSelectionChange">
      <el-table-column width="30" label="选择" type="selection"/>
      <el-table-column label="记录编码" align="center" prop="recodeCode" />
      <el-table-column label="种植计划编码" align="center" prop="plantId" />
      <el-table-column label="农事定义" align="center" prop="farmWork">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_FARM_WORK" :value="scope.row.farmWork" />
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column
        label="记录时间"
        align="center"
        prop="recordTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="数值" align="center" prop="recordValue">
        <template #default="scope">{{ scope.row.recordValue + scope.row.recordUnit }}</template>
      </el-table-column>
      <!-- <el-table-column label="单位" align="center" prop="recordUnit" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
<!--      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:plan-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:plan-record:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>-->
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
  <!-- 表单弹窗：添加/修改 -->
<!--  <PlanRecordForm ref="formRef" @success="getList" />-->
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PlanRecordApi, PlanRecordVO } from '@/api/kaizhou/planrecord'
import PlanRecordForm from './PlanRecordForm.vue'
import {AgriculturalBaseVO} from "@/api/kaizhou/agriculturalbase";

/** 农事记录 列表 */
defineOptions({ name: 'PlanRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PlanRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  recodeCode: undefined,
  farmWork: undefined,
  recordTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

let suibian=ref(null)
const fangfa=(select:any,row:any)=>{
  if(select.length>1){
    let del_row =select.shift();
    suibian.value.toggleRowSelection(del_row,false);
  }
}

/** 选中操作 */
const dialogVisible = ref(false) // 弹窗的是否展示
const selectionList = ref<PlanRecordVO[]>([])
const handleSelectionChange = (rows: PlanRecordVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: PlanRecordVO[]): void
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
    const data = await PlanRecordApi.getPlanRecordPage(queryParams)
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
    await PlanRecordApi.deletePlanRecord(id)
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
    const data = await PlanRecordApi.exportPlanRecord(queryParams)
    download.excel(data, '农事记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
