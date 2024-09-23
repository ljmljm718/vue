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
      <el-form-item label="源码" prop="codeContent">
        <el-input
          v-model="queryParams.codeContent"
          placeholder="请输入源码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产商" prop="producer">
        <el-input
          v-model="queryParams.producer"
          placeholder="请输入生产商"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="原产地" prop="sourceArea">
        <el-input
          v-model="queryParams.sourceArea"
          placeholder="请输入原产地"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产品认证" prop="productCertification">
        <el-input
          v-model="queryParams.productCertification"
          placeholder="请输入产品认证"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产时间" prop="productionTime">
        <el-date-picker
          v-model="queryParams.productionTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          style="width: 220px"
        />
      </el-form-item>
      <el-form-item label="是否赋码" prop="codeType">
        <el-select
          v-model="queryParams.codeType"
          placeholder="请选择是否赋码"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="批次号" prop="batchNum">
        <el-input
          v-model="queryParams.batchNum"
          placeholder="请输入批次号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          style="width: 220px"
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
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:code-sending-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
        <el-button
          plain
          type="primary"
          @click="fuMa()"
          v-hasPermi="['agriculture:code-sending-info:update']"
        >
          赋码
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true"
              @selection-change="handleSelectionChange" :show-overflow-tooltip="true">
      <!--      <el-table-column label="id" align="center" prop="id"/>-->
      <el-table-column type="selection" width="55"/>
      <el-table-column label="源码" align="center" prop="codeContent" width="180px"/>
      <!--      <el-table-column label="模板ID" align="center" prop="templateId"/>-->
      <el-table-column label="产品名称" align="center" prop="productName"/>
      <el-table-column label="生产商" align="center" prop="producer"/>
      <el-table-column label="原产地" align="center" prop="sourceArea"/>
      <el-table-column label="产品认证" align="center" prop="productCertification"/>
      <el-table-column
        label="生产时间"
        align="center"
        prop="productionTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="是否赋码" align="center" prop="codeType">
        <template #default="scope">
          <span v-if="scope.row.codeType === '1'">未赋码</span>
          <span v-else-if="scope.row.codeType === '2'">已赋码</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center" prop="qrImg" width="100px">
        <template #default="scope">
          <el-image
            :src="`data:image/png;base64,${scope.row.qrImg}`"
            style="object-fit: cover; width: 2rem; height: 2rem"
            preview-teleported
            :preview-src-list="[`data:image/png;base64,${scope.row.qrImg}`]"
          />
        </template>
      </el-table-column>
      <el-table-column label="批次号" align="center" prop="batchNum"/>
      <!--      <el-table-column label="备用字段" align="center" prop="prepareOne" />-->
      <!--      <el-table-column label="备用字段" align="center" prop="prepareTwo" />-->
      <!--      <el-table-column label="备用字段" align="center" prop="prepareThree" />-->
      <!--      <el-table-column label="备注" align="center" prop="remark" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:code-sending-info:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CodeSendingInfoForm ref="formRef" @success="getList"/>
  <SelectProduct ref="formRefA" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {CodeSendingInfoApi, CodeSendingInfoVO} from '@/api/agriculture/codesendinginfo'
import CodeSendingInfoForm from './CodeSendingInfoForm.vue'
import SelectProduct from './selectProduct.vue'

/** 发码记录 列表 */
defineOptions({name: 'CodeSendingInfo'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CodeSendingInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  codeContent: undefined,
  templateId: undefined,
  productName: undefined,
  producer: undefined,
  sourceArea: undefined,
  productCertification: undefined,
  productionTime: [],
  codeType: "1",
  batchNum: undefined,
  prepareOne: undefined,
  prepareTwo: undefined,
  prepareThree: undefined,
  remark: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const options = [{
  value: '1',
  label: '未赋码'
}, {
  value: '2',
  label: '已赋码'
}]
let multipleSelection = []
/** 查询列表 */
const getList = async () => {
  loading.value = true
  multipleSelection = []
  try {
    const data = await CodeSendingInfoApi.getCodeSendingInfoPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
//选中
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
}
//选中
/** 赋码操作 */
const formRefA = ref()
const fuMa = () => {
  if (multipleSelection.value == null) {
    message.warning("请先选择列表行")
  } else {
    if (multipleSelection.value.length == 0) {
      message.warning("请先选择列表行")
    } else {
      formRefA.value.open(multipleSelection.value)
    }
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
    await CodeSendingInfoApi.deleteCodeSendingInfo(id)
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
    const data = await CodeSendingInfoApi.exportCodeSendingInfo(queryParams)
    download.excel(data, '发码记录.xls')
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
