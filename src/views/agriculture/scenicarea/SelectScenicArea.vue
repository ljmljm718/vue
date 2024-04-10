<!-- 景点列表 -->
<template>
  <Dialog
    title="选择景点"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1000"
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
        <el-form-item label="景区名称" prop="scenicName">
          <el-input
            v-model="queryParams.scenicName"
            placeholder="请输入景区名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="星级" prop="starLevel">
          <el-select
            v-model="queryParams.starLevel"
            placeholder="请选择星级"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_SCENIC_STAR)"
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
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="景区名称" align="center" prop="scenicName" />
<!--        <el-table-column label="经度" align="center" prop="lon" />-->
<!--        <el-table-column label="纬度" align="center" prop="lat" />-->
        <el-table-column label="位置" align="center" prop="location" />
        <el-table-column label="星级" align="center" prop="starLevel">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.AGRI_SCENIC_STAR" :value="scope.row.starLevel" />
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center" prop="detail" />
        <el-table-column label="图片" align="center" prop="img" >
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.img"
              :preview-src-list="[row.img]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
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
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict"
import { ScenicAreaApi, ScenicAreaVO } from '@/api/agriculture/scenicarea'

defineOptions({name: 'SelectScenicArea'})
const list = ref<ScenicAreaVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(true) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  scenicName: undefined,
  starLevel: undefined,
})

const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<ScenicAreaVO[]>([])
const handleSelectionChange = (rows: ScenicAreaVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: ScenicAreaVO[]): void
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
    const data = await ScenicAreaApi.getScenicAreaPage(queryParams)
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
