<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <custom-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="标识号" prop="addressNumber">
        <el-input
          v-model="queryParams.addressNumber"
          placeholder="请输入地址标识号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input
          v-model="queryParams.contact"
          placeholder="请输入联系人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="地区信息" prop="areaInfo">-->
<!--        <el-input-->
<!--          v-model="queryParams.areaInfo"-->
<!--          placeholder="请输入地区信息"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="详细地址" prop="fullAddress">-->
<!--        <el-input-->
<!--          v-model="queryParams.fullAddress"-->
<!--          placeholder="请输入详细地址"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="邮政编码" prop="zipCode">-->
<!--        <el-input-->
<!--          v-model="queryParams.zipCode"-->
<!--          placeholder="请输入邮政编码"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="是否默认" prop="isDefault">-->
<!--        <el-input-->
<!--          v-model="queryParams.isDefault"-->
<!--          placeholder="请输入是否默认"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:address-info-record:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button
            type="success"
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:address-info-record:export']"
          >
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
        </el-form-item>
      </el-row>
    </custom-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="主键id" align="center" prop="id" />-->
      <el-table-column label="地址标识号" align="center" prop="addressNumber" width="160" />
      <el-table-column label="联系人" align="center" prop="contact" width="160" />
      <el-table-column label="手机号码" align="center" prop="phoneNumber" width="160" />
      <el-table-column label="地区信息" align="center" prop="areaInfo" width="200" />
      <el-table-column label="详细地址" align="center" prop="fullAddress" width="240" />
      <el-table-column label="邮政编码" align="center" prop="zipCode" width="160"/>
      <el-table-column label="是否默认" align="center" prop="isDefault" width="120" >
        <template #default="scope">
          <el-switch
            v-model="scope.row.isDefault"
            active-value="0"
            inactive-value="1"
            @change="handleStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="160" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="160">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:address-info-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:address-info-record:delete']"
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
  <AddressInfoRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AddressInfoRecordApi, AddressInfoRecordVO } from '@/api/agriculture/addressinforecord'
import AddressInfoRecordForm from './AddressInfoRecordForm.vue'
import {codeToText} from 'element-china-area-data';

/** 地址信息记录 列表 */
defineOptions({ name: 'AddressInfoRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AddressInfoRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  addressNumber: undefined,
  contact: undefined,
  phoneNumber: undefined,
  areaInfo: undefined,
  fullAddress: undefined,
  zipCode: undefined,
  isDefault: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  enableSwitch.value = false
  try {
    const data = await AddressInfoRecordApi.getAddressInfoRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
    nextTick(() => {
      enableSwitch.value = true
    })
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
    await AddressInfoRecordApi.deleteAddressInfoRecord(id)
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
    const data = await AddressInfoRecordApi.exportAddressInfoRecord(queryParams)
    download.excel(data, '地址信息记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getCodeToText = (codeStr) => {
  if (null === codeStr || undefined === codeStr) {
    return null;
  }
  let codeArray = codeStr.split(",")

  let area = ""
  switch (codeArray.length) {
    case 1:
      area += codeToText[codeArray[0]]
      break
    case 2:
      area += codeToText[codeArray[0]] + "/" + codeToText[codeArray[1]]
      break
    case 3:
      area += codeToText[codeArray[0]] + "/" + codeToText[codeArray[1]] + "/" + codeToText[codeArray[2]]
      break
    default:
      break
  }
  return area;
}

const enableSwitch = ref<boolean>(false)
const handleStatus = async (item: any) => {
  if (!enableSwitch.value) return
  let s = item.isDefault === '0' ? '该地址为默认地址': '关闭默认地址'

  try {
    // 开关机的二次确认
    await message.confirm("是否确认" + s + "?", s + "确认")
    // 发起开关机
    item.isDefault = item.isDefault === '0' ? '0': '1'
    await AddressInfoRecordApi.updateAddressInfoRecord(item)
    // message.alertSuccess(s + "成功")
    // 刷新列表
    await getList()
  } catch {
    item.isDefault = item.isDefault === '0' ? '1' : '0'
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
