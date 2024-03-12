<!-- 预警规则列表 -->
<template>
  <Dialog
    title="绑定规则"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1150"
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
        <el-form-item label="规则类型" prop="ruleType">
          <el-select
            v-model="queryParams.ruleType"
            placeholder="请选择规则类型"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_DATA_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="responsiblePerson">
          <el-input
            v-model="queryParams.responsiblePerson"
            placeholder="请输入责任人"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="生效状态" prop="effectiveStatus">
          <el-select
            v-model="queryParams.effectiveStatus"
            placeholder="请选择生效状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_RULE_STATUS)"
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
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table ref="dialogTable" v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true"
                :row-key="getRowKeys" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="30" label="选择" :reserve-selection="true"/>
        <el-table-column label="规则类型" align="center" prop="ruleType" width="200">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_DATA_TYPE" :value="scope.row.ruleType" />
          </template>
        </el-table-column>
        <el-table-column label="预警下限" align="center" width="120">
          <template #default="scope">
            <div> {{ scope.row["warnLowValue"] }}{{ scope.row["warnUnit"] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="预警上限" align="center" width="120">
          <template #default="scope">
            <div> {{ scope.row["warnHighValue"] }}{{ scope.row["warnUnit"] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="低位预警消息模板" align="center" prop="lowMsgTemplate" />
        <el-table-column label="高位预警消息模板" align="center" prop="highMsgTemplate" />
        <el-table-column label="责任人" align="center" prop="responsiblePerson" width="150"/>
<!--        <el-table-column label="生效状态" align="center" width="130">-->
<!--          <template #default="scope">-->
<!--            <el-switch-->
<!--              v-model="scope.row.effectiveStatus"-->
<!--              active-color="#13ce66"-->
<!--              inactive-color="#ff4949"-->
<!--              active-value="1"-->
<!--              inactive-value="0"-->
<!--              @change="handleChangeEffectiveStatus(scope.row)"-->
<!--            />-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
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
      <el-button type="primary" @click="handleBindWarnRule">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {dateFormatter} from "@/utils/formatTime";
import {WarningRuleApi, WarningRuleVO} from "@/api/kaizhou/warningrule";
import {DeviceBaseApi} from "@/api/kaizhou/devicebase";

defineOptions({name: 'DeviceBindWarnRule'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps({
  deviceId: {
    type: String,
    default: ''
  },
  warnRuleId: {
    type: Array,
    default: () => []
  },
})// 绑定的设备id
const ids = ref([]) // 绑定的规则id
const list = ref<WarningRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  ruleType: undefined,
  responsiblePersonId: undefined,
  responsiblePerson: undefined,
  effectiveStatus: '1',
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

const multipleSelection: any = ref([])

const open = async (id: string) => {
  dialogVisible.value = true
  console.log("id:"+ id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
  await resetQuery()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 加载列表  */
const dialogTable = ref()
const getList = async () => {
  loading.value = true
  try {
    const data = await WarningRuleApi.getWarningRulePage(queryParams)
    list.value = data.list
    console.log("list.value", list.value)
    console.log("props.warnRuleId", props.warnRuleId)
    list.value.forEach(row => {
      if (Array.isArray(props.warnRuleId)) props.warnRuleId.forEach(ele => {
        if (row.id == ele) dialogTable.value.toggleRowSelection(row, true)
      })
    })

    total.value = data.total
    multipleSelection.value = props.warnRuleId
  } finally {
    loading.value = false
  }
}

//选中的list
const getRowKeys = (row) => {
  //记录每行的key值
  return row.id;
}

//当表格选择项发生变化时会触发该事件
const handleSelectionChange = (val) => {
  // 解决来回切换页面，也无法清除上次选中情况
  multipleSelection.value = val;
  ids.value = [];
  if (val) {
    undefined;
    val.forEach((row) => {
      undefined;
      if (row) {
        undefined;
        ids.value.push(row.id);
      }
    });
  }
}

/** 确认绑定规则 */
const handleBindWarnRule = async () => {
  loading.value = true
  try {
    console.log("ids", ids)
    const temp = reactive({deviceId: props.deviceId, warnRuleId: ids.value})
    const data = temp as any
    await DeviceBaseApi.DeviceBindWarnRule(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
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
