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
        <el-form-item label="编号" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-160px"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-160px"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择类型"
            clearable
            class="!w-160px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,6) === 'massif')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
      <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true"
                @selection-change="handleSelectionChange">
        <el-table-column label="编号" align="center" prop="cropCode" />
        <el-table-column label="名称" align="center" prop="cropName" />
        <el-table-column label="品种" align="center" prop="cropType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_CROP_CULTIVARS" :value="scope.row.cropType" />
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
        <el-table-column label="描述" align="center" prop="cropDesc" />
        <el-table-column label="备注" align="center" prop="remark" />
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
import {CropBaseApi, CropBaseVO} from '@/api/kaizhou/cropbase'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {dateFormatter} from "@/utils/formatTime";

defineOptions({name: 'CropTemplateHelper'})
const list = ref<CropBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  remark: undefined,
  createTime: [],
  cropCode: undefined,
  cropDesc: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<CropBaseVO[]>([])
const handleSelectionChange = (rows: CropBaseVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: CropBaseVO[]): void
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
  parentValue.value = id
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
    const data = await CropBaseApi.getCropBasePage(queryParams)
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
  queryParams.parentId = parentValue.value
  getList()
}
</script>
