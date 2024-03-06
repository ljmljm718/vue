<!-- 下属地块列表 -->
<template>
  <Dialog
      title="地块"
      v-model="dialogVisible"
      :appendToBody="true"
      :scroll="true"
      width="1300"
  >
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
      >

        <el-form-item label="农事编码" prop="workCode">
          <el-input
              v-model="queryParams.workCode"
              placeholder="请输入农事编码"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="农事阶段" prop="workType">
          <el-input
              v-model="queryParams.workType"
              placeholder="请输入农事阶段"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
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

    <ContentWrap>
      <el-table
          v-loading="loading" :data="list"
          border
          :show-overflow-tooltip="true" :stripe="true"
          @selection-change="handleSelectionChange"
      >
        <el-table-column width="30" label="选择" type="selection" align="center"/>
        <el-table-column label="农事编码" align="center" prop="workCode" />
        <el-table-column label="农事阶段" align="center" prop="workType" />
        <el-table-column label="农事描述" align="center" prop="workRemark" />
      </el-table>
      <!-- 分页 -->
      <Pagination
          v-model:limit="queryParams.pageSize"
          v-model:page="queryParams.pageNo"
          :total="total"
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

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {FarmWorkDefineApi, FarmWorkDefineVO} from '@/api/kaizhou/farmworkdefine'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";


defineOptions({name: 'FarmWorkTemplateHelper'})
const list = ref<FarmWorkDefineVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  workCode: undefined,
  workType: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<FarmWorkDefineVO[]>([])
const handleSelectionChange = (rows: FarmWorkDefineVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'setFarmWorkInfo', value: FarmWorkDefineVO[]): void
}>()
const submitForm = () => {
  try {
    emits('setFarmWorkInfo', selectionList.value)
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

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmWorkDefineApi.getFarmWorkDefinePage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}
</script>
