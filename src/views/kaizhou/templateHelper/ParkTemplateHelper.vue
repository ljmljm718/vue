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
        <el-table
            v-loading="loading"
            :data="list"
            border
            :stripe="true"
            :show-overflow-tooltip="true"
            @selection-change="handleSelectionChange"
        >
          <el-table-column width="30" label="选择" type="selection" align="center"/>
          <el-table-column label="编号" align="center" prop="code" width="200"/>
          <el-table-column label="名称" align="center" prop="name" width="200"/>
          <el-table-column label="分类" align="center" prop="grade" >
              <template #default="scope">
                  <dict-tag :type="DICT_TYPE.KAIZHOU_PARK_BASE_GRADE" :value="scope.row.grade" />
              </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="type" >
              <template #default="scope">
                  <dict-tag :type="DICT_TYPE.KAIZHOU_PARK_BASE_TYPE" :value="scope.row.type" />
              </template>
          </el-table-column>
          <el-table-column label="海拔" align="center" prop="altitude" />
          <el-table-column label="纬度" align="center" prop="latitude" />
          <el-table-column label="经度" align="center" prop="longitude" />
          <el-table-column label="面积" align="center" prop="area" />
          <el-table-column label="备注" align="center" prop="remark"/>
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
import {ParkBaseApi, ParkBaseVO} from '@/api/kaizhou/parkbase'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {dateFormatter} from "@/utils/formatTime";

defineOptions({name: 'ParkTemplateHelper'})
const list = ref<ParkBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    code: undefined,
    name: undefined,
    grade: '0',
    type: undefined,
    altitude: undefined,
    latitude: undefined,
    longitude: undefined,
    address: undefined,
    contact: undefined,
    tel: undefined,
    area: undefined,
    parentId: undefined,
    remark: undefined,
    createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<ParkBaseVO[]>([])
const handleSelectionChange = (rows: ParkBaseVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'setParkInfo', value: ParkBaseVO[]): void
}>()
const submitForm = () => {
  try {
    emits('setParkInfo', selectionList.value)
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


/** 查询列表 */
const getList = async () => {
    loading.value = true
    try {
        const data = await ParkBaseApi.getParkBasePage(queryParams)
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
