<!-- 设备列表 -->
<template>
  <Dialog
    title="绑定设备"
    v-model="dialogVisible"
    :appendToBody="true"
    :scroll="true"
    width="1080"
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
        <el-form-item label="设备号" prop="deviceCode">
          <el-input
            v-model="queryParams.deviceCode"
            placeholder="请输入设备号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="名称" prop="deviceName">
          <el-input
            v-model="queryParams.deviceName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="种类" prop="kinds">
          <el-select
            v-model="queryParams.kinds"
            placeholder="请选择种类"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_KINDS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            v-model="queryParams.deviceType"
            placeholder="请选择设备类型"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="deviceStatus">
          <el-select
            v-model="queryParams.deviceStatus"
            placeholder="请选择状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="所属基地" prop="belongPark">-->
        <!--          <el-input-->
        <!--            v-model="queryParams.belongPark"-->
        <!--            placeholder="请输入所属基地"-->
        <!--            clearable-->
        <!--            @keyup.enter="handleQuery"-->
        <!--            class="!w-240px"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="所属地块" prop="belongPlot">-->
        <!--          <el-input-->
        <!--            v-model="queryParams.belongPlot"-->
        <!--            placeholder="请输入所属地块"-->
        <!--            clearable-->
        <!--            @keyup.enter="handleQuery"-->
        <!--            class="!w-240px"-->
        <!--          />-->
        <!--        </el-form-item>-->
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
      <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true"
                :row-key="getRowKeys" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :reserve-selection="true"/>
        <el-table-column label="设备号" align="center" prop="deviceCode"/>
        <el-table-column label="名称" align="center" prop="deviceName"/>
        <el-table-column label="种类" align="center" prop="kinds">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_KINDS" :value="scope.row.kinds"/>
          </template>
        </el-table-column>
        <el-table-column label="设备类型" align="center" prop="deviceType">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_TYPE" :value="scope.row.deviceType"/>
          </template>
        </el-table-column>
        <el-table-column label="经度" align="center" prop="longitude"/>
        <el-table-column label="纬度" align="center" prop="latitude"/>
        <el-table-column label="状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.KAIZHOU_DEVICE_STATUS" :value="scope.row.deviceStatus"/>
          </template>
        </el-table-column>
        <el-table-column label="所属基地" align="center" prop="belongPark"/>
        <el-table-column label="所属地块" align="center" prop="belongPlot"/>
        <!--      <el-table-column label="URL" align="center" prop="url" />-->
        <!--        <el-table-column label="备注" align="center" prop="remark" />-->
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
      <el-button type="primary" @click="handleBindDevice">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElTable} from 'element-plus'
import {DeviceBaseApi, DeviceBaseVO} from '@/api/kaizhou/devicebase'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {dateFormatter} from "@/utils/formatTime";
import {WarningRuleDeviceApi} from "@/api/kaizhou/warningruledevice";

defineOptions({name: 'WarnRuleBindDevice'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const multipleSelection = ref([])
const ruleId = defineProps({
  warnRuleId: {
    type: String,
    default: ''
  },
})// 绑定的规则id
const ids = ref([]) // 绑定的设备id
const list = ref<DeviceBaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const loading = ref(false) // 列表的加载中
const dialogVisible = ref(false) // 弹窗的是否展示
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceCode: undefined,
  deviceName: undefined,
  kinds: undefined,
  deviceType: undefined,
  longitude: undefined,
  latitude: undefined,
  deviceStatus: undefined,
  belongPark: undefined,
  belongPlot: undefined,
  url: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单

/** 加载列表  */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceBaseApi.getDeviceBasePage(queryParams)
    list.value = data.list
    total.value = data.total
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

/** 确认绑定设备  */
const handleBindDevice = async () => {
  loading.value = true
  try {
    const temp = reactive({warnRuleId: ruleId, deviceId: ids})
    const data = temp as any
    await WarningRuleDeviceApi.WarnRuleBindDevice(data)
    message.success(t('common.createSuccess'))
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
