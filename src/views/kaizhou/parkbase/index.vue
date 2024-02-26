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
      <el-form-item label="编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分类" prop="grade">
        <el-select
          v-model="queryParams.grade"
          placeholder="请选择分类"
          clearable
          class="!w-240px"
        >
        <el-option
          v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_GRADE)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in queryParams.grade === '0' ? getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,4) === 'park') : getStrDictOptions(DICT_TYPE.KAIZHOU_PARK_BASE_TYPE).filter(item => item.value.toString().substring(0,6) === 'massif')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="创建时间" prop="createTime">
              <el-date-picker
                v-model="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                class="!w-240px"
              />
            </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['kaizhou:park-base:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增基地
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['kaizhou:park-base:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
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
      <el-table-column label="通讯地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="面积" align="center" prop="area" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template #default="scope">
          <el-button
            link
            type="success"
            v-hasPermi="['kaizhou:park-base:create']"
            @click="openParkBaseMassifList(scope.row.id)"
            v-show="scope.row.parentId === '0'"
          >
            查询下属地块
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('add', scope.row.id)"
            v-hasPermi="['kaizhou:park-base:create']"
            v-show="scope.row.parentId === '0'"
          >
            添加地块
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['kaizhou:park-base:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['kaizhou:park-base:delete']"
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
  <ParkBaseForm ref="formRef" @success="getList" />

  <!-- 下属地块列表 -->
  <ParkBaseMassifList ref="parkBaseMassifListRef"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ParkBaseApi, ParkBaseVO } from '@/api/kaizhou/parkbase'
import ParkBaseForm from './ParkBaseForm.vue'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import ParkBaseMassifList from '@/views/kaizhou/parkbase/ParkBaseMassifList.vue'

/** 园区/地块基本信息 列表 */
defineOptions({ name: 'ParkBase' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ParkBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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
const exportLoading = ref(false) // 导出的加载中

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
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ParkBaseApi.deleteParkBase(id)
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
    const data = await ParkBaseApi.exportParkBase(queryParams)
    download.excel(data, '园区/地块基本信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
/** 打开【下属地块】弹窗 */
const parkBaseMassifListRef = ref() // 可出库的订单列表 Ref
const openParkBaseMassifList = (id: string) => {
  parkBaseMassifListRef.value.open(id)
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
