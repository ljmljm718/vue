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
      <!--      <el-form-item label="增氧设备" prop="equipId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.equipId"-->
      <!--          placeholder="请输入增氧设备"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="监测设备ID" prop="equipjianId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.equipjianId"-->
      <!--          placeholder="请输入监测设备ID"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="基地ID" prop="baseId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.baseId"-->
      <!--          placeholder="请输入基地ID"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="地块ID" prop="plotId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.plotId"-->
      <!--          placeholder="请输入地块ID"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="因素" prop="oxygenId">
        <!--        <el-input-->
        <!--          v-model="queryParams.oxygenId"-->
        <!--          placeholder="请输入因素"-->
        <!--          clearable-->
        <!--          @keyup.enter="handleQuery"-->
        <!--          class="!w-240px"-->
        <!--        />-->
        <el-select v-model="queryParams.oxygenId" placeholder="请选择因素" class="!w-240px">
          <el-option
            v-for="item in formOxygenFactorAll"
            :key="item.id"
            :label="item.factorName"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否警告" prop="warnStatus">
        <el-select
          v-model="queryParams.warnStatus"
          placeholder="请选择是否警告"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="备注" prop="remark">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.remark"-->
      <!--          placeholder="请输入备注"-->
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
    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:oxygen-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:oxygen-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px"/>
          导出
        </el-button>
      </el-form-item>
    </div>

  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id"/>-->
      <el-table-column label="因素" align="center" prop="oxygenId">
        <template #default="scope">
          <span v-for="item in formOxygenFactorAll" :key="item.id"
                v-show="scope.row.oxygenId === item.id">
            {{ item.factorName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="最小值" align="center" prop="minNum"/>
      <el-table-column label="最大值" align="center" prop="maxNum"/>
      <el-table-column label="评分值" align="center" prop="scoreNum"/>
      <el-table-column label="目标分值" align="center" prop="targetNum"/>
      <el-table-column label="调整建议" align="center" prop="suggestText"/>
      <el-table-column label="建议功率" align="center" prop="suggestNum"/>
      <!--      <el-table-column label="增氧设备ID" align="center" prop="equipId"/>-->
      <!--      <el-table-column label="监测设备ID" align="center" prop="equipjianId"/>-->
      <!--      <el-table-column label="基地ID" align="center" prop="baseId"/>-->
      <!--      <el-table-column label="地块ID" align="center" prop="plotId"/>-->
      <el-table-column label="是否警告" align="center" prop="warnStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.warnStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="警告内容" align="center" prop="warnContent"/>
      <el-table-column label="备注" align="center" prop="remark"/>
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
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:oxygen-rule:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:oxygen-rule:delete']"
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
  <OxygenRuleForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {OxygenRuleApi, OxygenRuleVO} from '@/api/agriculture/oxygenrule'
import OxygenRuleForm from './OxygenRuleForm.vue'
import {OxygenFactorApi} from "@/api/agriculture/oxygenfactor";

/** 因素评分规则 列表 */
defineOptions({name: 'OxygenRule'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OxygenRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  maxNum: undefined,
  minNum: undefined,
  scoreNum: undefined,
  targetNum: undefined,
  suggestText: undefined,
  suggestNum: undefined,
  equipId: undefined,
  equipjianId: undefined,
  baseId: undefined,
  plotId: undefined,
  oxygenId: undefined,
  warnStatus: undefined,
  warnContent: undefined,
  remark: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const formOxygenFactorAll = ref([])

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    formOxygenFactorAll.value = await OxygenFactorApi.getAll()
    const data = await OxygenRuleApi.getOxygenRulePage(queryParams)
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
    await OxygenRuleApi.deleteOxygenRule(id)
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
    const data = await OxygenRuleApi.exportOxygenRule(queryParams)
    download.excel(data, '因素评分规则.xls')
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
