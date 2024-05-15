<!-- 工作人员列表 -->
<template>
  <Dialog
    title="选择工作人员"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="80%"
  >
    <el-row :gutter="20">
      <!-- 左侧部门树 -->
      <el-col :span="4" :xs="24">
        <ContentWrap class="h-1/1">
          <DeptTree @node-click="handleDeptNodeClick"/>
        </ContentWrap>
      </el-col>
      <el-col :span="20" :xs="24">
        <ContentWrap>
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="68px"
          >
            <el-form-item label="用户账号" prop="username">
              <el-input
                v-model="queryParams.username"
                placeholder="请输入用户账号"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                class="!w-240px"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleQuery">
                <Icon icon="ep:search"/>
                搜索
              </el-button>
              <el-button @click="resetQuery">
                <Icon icon="ep:refresh"/>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </ContentWrap>

        <ContentWrap>
          <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true" ref="multipleTableRef"
                    @select="select" @row-click="selectClick" @selection-change="handleSelectionChange">
            <el-table-column width="30" label="选择" type="selection"/>
            <el-table-column
              label="用户账号"
              align="center"
              prop="username"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="用户昵称"
              align="center"
              prop="nickname"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="部门"
              align="center"
              key="deptName"
              prop="deptName"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="手机号码" align="center" prop="mobile" width="120"/>
            <el-table-column label="状态" align="center" key="status" width="100">
              <template #default="scope">
                <el-switch
                  disabled
                  v-model="scope.row.status"
                  :active-value="0"
                  :inactive-value="1"
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
      </el-col>
    </el-row>
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
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import DeptTree from "@/views/system/user/DeptTree.vue";
import {UserVO} from "@/api/system/user";
import * as UserApi from "@/api/system/user";

defineOptions({name: 'SelectSysUser'})
const list = ref<UserVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(true) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const parentValue = ref('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  mobile: undefined,
  status: undefined,
  deptId: undefined,
  createTime: []
})

const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<UserVO[]>([])
const handleSelectionChange = (rows: UserVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: UserVO[]): void
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
    const data = await UserApi.getUserPage(queryParams)
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

/** 处理部门被点击 */
const handleDeptNodeClick = async (row) => {
  queryParams.deptId = row.id
  await getList()
}

// 人员单选
const multipleTableRef = ref()
const select = (selection, row)=> {
  // 清除 所有勾选项
  multipleTableRef.value.clearSelection()
  // 当表格数据都没有被勾选的时候 就返回
  // 主要用于将当前勾选的表格状态清除
  if(selection.length == 0) return
  multipleTableRef.value.toggleRowSelection(row, true);
}

// 控制单选——table选择项发生变化时
const selectClick = (row) => {
  const selectData = selectionList.value
  multipleTableRef.value.clearSelection()
  if (selectData.length == 1) {
    selectData.forEach(item => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        multipleTableRef.value.toggleRowSelection(row, false);
      }
      // 不然就让当前的一行勾选
      else {
        multipleTableRef.value.toggleRowSelection(row, true);
      }
    })
  } else {
    multipleTableRef.value.toggleRowSelection(row, true);
  }
}
</script>

<style scoped lang='scss'>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
