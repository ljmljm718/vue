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
      <el-form-item label="标识码" prop="identificationCode">
        <el-input
          v-model="queryParams.identificationCode"
          placeholder="请输入标识码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="二维码" prop="qrCode">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.qrCode"-->
      <!--          placeholder="请输入二维码"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="赋码时间" prop="uniqueCodeTime">
        <el-date-picker
          v-model="queryParams.uniqueCodeTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否绑定" prop="isBinding">
        <el-select
          v-model="queryParams.isBinding"
          placeholder="请选择是否绑定"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_IDENTIFICATION_BINDING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
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
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['kaizhou:basic-identification:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <!--        <el-button-->
        <!--          type="success"-->
        <!--          plain-->
        <!--          @click="handleExport"-->
        <!--          :loading="exportLoading"-->
        <!--          v-hasPermi="['kaizhou:basic-identification:export']"-->
        <!--        >-->
        <!--          <Icon icon="ep:download" class="mr-5px" /> 导出-->
        <!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" width="80" align="center">
        <template v-slot="scope">
          <span>{{ scope.$index + (queryParams.pageNo - 1) * (queryParams.pageSize) + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标识码" align="center" prop="identificationCode"/>
      <el-table-column label="二维码" align="center" prop="qrCode">
        <template #default="scope">
          <img v-if="scope.row.qrCode != undefined && scope.row.qrCode != null"
               :src="scope.row.qrCode"
               @click="handlePicturePreview(scope.row)"
               style="width: 50px;height: 50px;cursor: pointer;"/>
          <span v-else>未赋码</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="赋码时间"
        align="center"
        prop="uniqueCodeTime"
        :formatter="dateFormatter"
        width="180px"
      >
        <template #default="scope">
          <span v-if="scope.row.uniqueCodeTime == null">未赋码</span>
        </template>
      </el-table-column>
      <el-table-column label="是否绑定" align="center" prop="isBinding">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KAIZHOU_IDENTIFICATION_BINDING" :value="scope.row.isBinding"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:basic-identification:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:basic-identification:delete']"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            @click="uniqueCode(scope.row)"
            v-hasPermi="['kaizhou:basic-identification:update']"
          >
            {{scope.row.qrCode != undefined && scope.row.qrCode != null ? '重新赋码' : '赋码'}}
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
  <BasicIdentificationForm ref="formRef" @success="getList"/>

  <!-- 图片预览 -->
  <el-dialog title="图片预览" v-model="dialogVisible" width="800" draggable>
    <img
      :src="dialogImageUrl"
      style="display: block; max-width: 100%; margin: 0 auto"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {BasicIdentificationApi, BasicIdentificationVO} from '@/api/kaizhou/basicidentification'
import BasicIdentificationForm from './BasicIdentificationForm.vue'

/** 标识管理 列表 */
defineOptions({name: 'BasicIdentification'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BasicIdentificationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  identificationCode: undefined,
  qrCode: undefined,
  uniqueCodeTime: [],
  isBinding: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const dialogVisible = ref(false) // 图片预览弹出框
const dialogImageUrl = ref('') // 图片地址
const formData = ref('')

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BasicIdentificationApi.getBasicIdentificationPage(queryParams)
    list.value = data.list
    console.log(data.list)
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
    await BasicIdentificationApi.deleteBasicIdentification(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 赋码按钮操作 */
const uniqueCode = async (data: BasicIdentificationVO) => {
  try {
    formData.value = {
      id: data.id,
      identificationCode: data.identificationCode,
      qrCode: window.location.origin + "/QRCode?qrCode=",
      uniqueCodeTime: data.uniqueCodeTime,
      isBinding: data.isBinding,
      isUniqueCode: data.isUniqueCode,
    }
    // 赋码的二次确认
    await message.delConfirm("是否确认赋码所选中数据")
    // 发起赋码
    await BasicIdentificationApi.uniqueCodeIdentification(formData.value)
    message.success(t('common.uniqueCodeSuccess'))
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
    const data = await BasicIdentificationApi.exportBasicIdentification(queryParams)
    download.excel(data, '标识管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const handlePicturePreview = (data: BasicIdentificationVO) => {
  dialogImageUrl.value = data.qrCode
  dialogVisible.value = true
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
