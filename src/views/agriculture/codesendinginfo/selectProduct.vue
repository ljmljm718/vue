<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <custom-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="98px"
      >
        <el-form-item label="产品名称" prop="product">
          <el-input
            v-model="queryParams.product"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
            class="!w-180px"
          />
        </el-form-item>
        <el-form-item label="所属基地" prop="park">
          <el-input
            v-model="queryParams.park" placeholder="请选择所属基地" readonly
            class="!w-180px">
            <template #append>
              <el-button @click="openParkPopup('0')">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="所属地块" prop="parkDetail">
          <el-input
            v-model="queryParams.parkDetail" placeholder="请选择所属地块" readonly
            class="!w-180px">
            <template #append>
              <el-button @click="openPlotPopup(queryParams.parkId)">
                <Icon icon="ep:search"/>
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="产品年份" prop="years">
          <el-input
            v-model="queryParams.years"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
            class="!w-180px"
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
      </custom-form>

    </ContentWrap>
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
                ref="suibian"
                style="height: 450px;overflow-y: auto"
                @row-click="selectClick"
                @select="fangfa">
        <!--        <el-table-column label="" width="55">-->
        <!--          <template #default="scope">-->
        <!--            <el-radio class="radio" v-model="selectedRow" label="scope.$index">&nbsp;</el-radio>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column width="30" label="选择" type="selection"/>
        <!--      <el-table-column label="主键" align="center" prop="id" />-->
        <el-table-column label="产品名称" align="center" prop="product"/>
        <!--      <el-table-column label="所属基地id" align="center" prop="parkId" />-->
        <el-table-column label="所属基地" align="center" prop="park"/>
        <!--      <el-table-column label="所属地块id" align="center" prop="parkDetailId"/>-->
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
        <el-table-column label="是否赋码" align="center" prop="codeType">
          <template #default="scope">
            <span v-if="scope.row.codeType === '0'">未赋码</span>
            <span v-else-if="scope.row.codeType === '2'">已赋码</span>
          </template>
        </el-table-column>
        <el-table-column label="产品年份" align="center" prop="years"/>
        <el-table-column label="产品数量(袋)" align="center" prop="inventory"/>
        <el-table-column label="产品规格(Kg)" align="center" prop="specifications"/>
        <el-table-column label="批次号" align="center" prop="batchCode"/>
        <!--      <el-table-column label="采收编号" align="center" prop="recoveryNum" />-->
        <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
        <!--      <el-table-column-->
        <!--        label="创建时间"-->
        <!--        align="center"-->
        <!--        prop="createTime"-->
        <!--        :formatter="dateFormatter"-->
        <!--        width="180px"-->
        <!--      />-->
        <!--        <el-table-column label="操作" align="center">-->
        <!--          <template #default="scope">-->
        <!--            <el-button-->
        <!--              link-->
        <!--              type="primary"-->
        <!--              @click="openForm('show', scope.row.id)"-->
        <!--            >-->
        <!--              详情-->
        <!--            </el-button>-->
        <!--            <el-button-->
        <!--              link-->
        <!--              type="primary"-->
        <!--              @click="openForm('update', scope.row.id)"-->
        <!--              v-hasPermi="['digital:village-product:update']"-->
        <!--            >-->
        <!--              编辑-->
        <!--            </el-button>-->
        <!--            <el-button-->
        <!--              link-->
        <!--              type="danger"-->
        <!--              @click="handleDelete(scope.row.id)"-->
        <!--              v-hasPermi="['digital:village-product:delete']"-->
        <!--            >-->
        <!--              删除-->
        <!--            </el-button>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
    <!--  选择基地-->
    <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
    <!--  选择地块-->
    <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
  </Dialog>
</template>
<script setup lang="ts">
import {VillageProductApi, VillageProductVO} from '@/api/digital/villageproduct'
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";
import {CodeApplyApi} from "@/api/agriculture/codeapply";
import {CodeSendingInfoApi, CodeSendingInfoVO} from "@/api/agriculture/codesendinginfo";

/** 发码记录 表单 */
defineOptions({name: 'CodeSendingInfoForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const router = useRouter() // 路由
const loading = ref(true) // 列表的加载中
const list = ref<VillageProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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
  codeType: "0",
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择基地")
  } else parkPopupRef.value.open(id)
}
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.parkId = String(order[0].code)
    queryParams.park = String(order[0].name)
  } else queryParams.parkDetailId = String(order[0].id)
}

//地块的选择
const plotPopupRef = ref()
const openType1 = ref('')
const openPlotPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error("请选择基地")
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  queryParams.parkDetailId = String(order[0].parkId)
  queryParams.parkDetailId = String(order[0].id)
  queryParams.parkDetail = String(order[0].name)
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await VillageProductApi.getVillageProductPage(queryParams)
    list.value = data.list
    list.value.forEach(item => {
      if (item.photo === '')
        item.photo = 'https://www.zhuangbeizz.cn/minio/inspur/微信图片_202408141509051723619406676.png'
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}
let multipleSelectionA = ref<CodeSendingInfoVO[]>([])
/** 打开弹窗 */
const open = async (multipleSelection: any) => {
  dialogVisible.value = true
  dialogTitle.value = "赋码选择产品"
  multipleSelectionA.value = multipleSelection
  await getList()
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.parkId = undefined
  queryParams.parkDetailId = undefined
  handleQuery()
}
// 用于记录当前选中的行
let selectedRow = ref(null)
let suibian = ref(null)
const fangfa = (select: any, row: any) => {
  if (select.length > 1) {
    let del_row = select.shift();
    suibian.value.toggleRowSelection(del_row, false);
  }
  selectedRow.value = row
}
const selectClick = (row) => {
  if (selectedRow.value && row.id === selectedRow.value.id) {
    suibian.value.toggleRowSelection(row, false);
    selectedRow.value = null
  } else {
    suibian.value.clearSelection()
    suibian.value.toggleRowSelection(row, true);
    selectedRow.value = row
  }
  console.log("selectedRow",selectedRow.value)
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (!selectedRow.value) {
    message.warning("请选择产品")
    return
  }
  //选择赋码对应的产品
  if (multipleSelectionA.value.length == selectedRow.value.inventory) {
    multipleSelectionA.value.forEach((multipleSelectionB, index) => {
      multipleSelectionB.batchNum = selectedRow.value.batchCode
      multipleSelectionB.prepareOne = selectedRow.value.id
    });
    await CodeSendingInfoApi.updateCodeSendingInfoA(multipleSelectionA.value)
    dialogVisible.value = false
    message.success("系统正在执行赋码...时间可能较长，稍后请刷新数据")
    emit('success')
  } else {
    message.warning("赋码数量为【" + multipleSelectionA.value.length + "】与产品数量不符,请重新选择产品")
    return;
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    codeContent: undefined,
    templateId: undefined,
    productName: undefined,
    producer: undefined,
    sourceArea: undefined,
    productCertification: undefined,
    productionTime: undefined,
    codeType: undefined,
    batchNum: undefined,
    prepareOne: undefined,
    prepareTwo: undefined,
    prepareThree: undefined,
    prepareThree: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
<style scoped lang='scss'>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
