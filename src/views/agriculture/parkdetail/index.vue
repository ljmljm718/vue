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
          v-hasPermi="['agriculture:park-detail:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:park-detail:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="所属基地" align="center" prop="parkId" width="200"/>
      <el-table-column label="基地名称" align="center" prop="parkName" width="200"/>
      <el-table-column label="基地类型" align="center" prop="parkType" width="200"/>
      <el-table-column label="编号" align="center" prop="code" width="200"/>
      <el-table-column label="名称" align="center" prop="name" width="200"/>
      <el-table-column label="地块类型" align="center" prop="type" width="150">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_PLOT_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="海拔" align="center" prop="altitude">
        <template #default="scope">
          {{ scope.row.altitude != undefined ? scope.row.altitude + '米' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center" prop="latitude" width="120"/>
      <el-table-column label="经度" align="center" prop="longitude" width="120"/>
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
      <el-table-column label="通讯地址" align="center" prop="address"  width="200"/>
      <el-table-column label="联系人" align="center" prop="contact"/>
      <el-table-column label="联系电话" align="center" prop="tel"  width="120"/>
      <el-table-column label="面积" align="center" prop="area" width="100">
        <template #default="scope">
          {{ scope.row.area != undefined ? scope.row.area + '亩' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="quantity" width="100"/>
      <el-table-column label="模式" align="center" prop="adoptionType" width="100"/>
      <el-table-column label="备注" align="center" prop="remark"/>

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="二维码图片" fixed="right" align="center" prop="qrImg" width="200px">
        <template #default="scope">
          <el-image
:src="`data:image/png;base64,${scope.row.qrImg}`"
                    style="object-fit: cover;width: 2rem;height: 2rem;"
                    preview-teleported
                    :preview-src-list="[`data:image/png;base64,${scope.row.qrImg}`]"
          />
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" fixed="right" align="center">-->
<!--&lt;!&ndash;        <template #default="scope">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-button&ndash;&gt;-->
<!--&lt;!&ndash;            link&ndash;&gt;-->
<!--&lt;!&ndash;            type="primary"&ndash;&gt;-->
<!--&lt;!&ndash;            @click="goCheck(scope.row)"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            溯源&ndash;&gt;-->
<!--&lt;!&ndash;          </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;          <el-button&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;            link&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;            type="danger"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;            @click="handleDelete(scope.row.id)"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;            v-hasPermi="['agriculture:park-detail:delete']"&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;          >&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;            删除&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          &lt;!&ndash;          </el-button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        </template>&ndash;&gt;-->
<!--      </el-table-column>-->
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
  <ParkDetailForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {ParkDetailApi, ParkDetailVO} from '@/api/agriculture/parkdetail'
import ParkDetailForm from './ParkDetailForm.vue'
import {  DICT_TYPE } from '@/utils/dict'

/** 地块基本信息 列表 */
defineOptions({name: 'ParkDetail'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ParkDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  parkId: undefined,
  code: undefined,
  name: undefined,
  type: undefined,
  altitude: undefined,
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  contact: undefined,
  tel: undefined,
  area: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined,
  qrImg: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ParkDetailApi.getParkDetailPage(queryParams)
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ParkDetailApi.deleteParkDetail(id)
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
    const data = await ParkDetailApi.exportParkDetail(queryParams)
    download.excel(data, '地块基本信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** */
const {push} = useRouter()
const goCheck = (row) => {
  console.log(row.id)
  //打开新的页签并传递参数
  push(`/farm_work/farmManage/farm-record?baseId=${row.id}`);
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
