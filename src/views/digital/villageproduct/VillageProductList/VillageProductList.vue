<template>
  <Dialog
    title="设备列表"
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
        <el-form-item label="产品名称" prop="product">
          <el-input
            v-model="queryParams.product"
            placeholder="请输入产品名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="所属基地" prop="park">
          <el-input
            v-model="queryParams.park"
            placeholder="请输入所属基地"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="产品码" prop="parkDetailId">
          <el-input
            v-model="queryParams.parkDetailId"
            placeholder="请输入产品码（所属地块id）"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="所属地块" prop="parkDetail">
          <el-input
            v-model="queryParams.parkDetail"
            placeholder="请输入所属地块"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="产品年份" prop="years">
          <el-input
            v-model="queryParams.years"
            placeholder="请输入产品年份"
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

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
                @selection-change="handleSelectionChange">
        <el-table-column width="30" label="选择" type="selection"/>
        <el-table-column label="产品名称" align="center" prop="product"/>
        <!--      <el-table-column label="所属基地id" align="center" prop="parkId" />-->
        <el-table-column label="所属基地" align="center" prop="park"/>
<!--        <el-table-column label="产品码" align="center" prop="parkDetailId"/>-->
        <el-table-column label="所属地块" align="center" prop="parkDetail"/>
        <el-table-column label="图片" align="center" prop="photo">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.photo"
              :preview-src-list="[row.photo]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="产品年份" align="center" prop="years"/>
        <el-table-column label="库存(袋)" align="center" prop="inventory"/>
        <el-table-column label="规格(Kg)" align="center" prop="specifications"/>
        <el-table-column label="批次号" align="center" prop="batchCode"/>
<!--        <el-table-column label="采收编号" align="center" prop="recoveryNum"/>-->
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import {getTenantId} from '@/utils/auth'
import {DeviceBaseApi, DeviceBaseVO} from '@/api/kaizhou/devicebase'
import {VillageProductApi, VillageProductVO} from "@/api/digital/villageproduct";


/** 设备管理 表单 */
defineOptions({name: 'VillageProductForm'})
const list = ref<VillageProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  product: undefined,
  parkId: undefined,
  park: undefined,
  parkDetailId: undefined,
  parkDetail: undefined,
  photo: undefined,
  years: undefined,
  inventory: undefined,
  specifications: undefined,
  remark: undefined,
  createTime: [],
  batchCode: undefined,
  recoveryNum: undefined,
})
const parentValue = ref('')
const queryFormRef = ref() // 搜索的表单

/** 选中操作 */
const selectionList = ref<VillageProductVO[]>([])
const handleSelectionChange = (rows: VillageProductVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: VillageProductVO[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}
const open = async (id: string) => {
  dialogVisible.value = true
  parentValue.value = id
  console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载列表
  await resetQuery()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗


/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await VillageProductApi.getVillageProductPage(queryParams)
    console.log(data)
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
  queryParams.id = parentValue.value
  getList()
}
</script>

