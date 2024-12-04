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
      <el-form-item label="灌区名称" prop="iaName">
        <el-input
          v-model="queryParams.iaName"
          placeholder="请输入灌区名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="灌溉类型" prop="irrigationType">
        <el-select
          v-model="queryParams.irrigationType"
          placeholder="请选择灌溉类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WFI_IRRIGATION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="principal">
        <el-input
          v-model="queryParams.principal"
          placeholder="请输入负责人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="contactInformation">
        <el-input
          v-model="queryParams.contactInformation"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:irrigation-area:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:irrigation-area:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="灌区编号" align="center" prop="iaCode" />
      <el-table-column label="灌区名称" align="center" prop="iaName" />
      <el-table-column label="灌溉类型" align="center" prop="irrigationType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WFI_IRRIGATION_TYPE" :value="scope.row.irrigationType" />
        </template>
      </el-table-column>
      <el-table-column label="阀门状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <el-switch
            v-model="scope.row.deviceStatus"
            active-value="online"
            inactive-value="offline"
            v-if="scope.row.deviceStatus != null"
          />
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="iaImage">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.iaImage"
            :preview-src-list="[row.iaImage]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="负责人" align="center" prop="principal" />
      <el-table-column label="联系方式" align="center" prop="contactInformation" />
      <el-table-column label="地址" align="center" prop="isAddress" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="bindSolenoidValve(scope.row.id)"
            v-if="scope.row.deviceId === null"
          >
            绑定电磁阀
          </el-button>
          <el-button
            link
            type="danger"
            @click="notBindSolenoidValve(scope.row.id)"
            v-if="scope.row.deviceId != null"
          >
            解绑电磁阀
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:irrigation-area:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:irrigation-area:delete']"
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
  <IrrigationAreaForm ref="formRef" @success="getList" />
  <SelectValvesDeviceFrom ref="selectValvesDeviceRef" @success="selectValvesDeviceSuccess" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { IrrigationAreaApi, IrrigationAreaVO } from '@/api/agriculture/irrigationarea';
import IrrigationAreaForm from './IrrigationAreaForm.vue';
import SelectValvesDeviceFrom from '@/views/agriculture/irrigationarea/components/SelectValvesDeviceFrom.vue';
/** 灌区信息 列表 */
defineOptions({ name: 'IrrigationArea' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<IrrigationAreaVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  iaCode: undefined,
  iaName: undefined,
  irrigationType: undefined,
  iaImage: undefined,
  geofencing: undefined,
  latitude: undefined,
  longitude: undefined,
  principal: undefined,
  contactInformation: undefined,
  isAddress: undefined,
  remark: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
const router = useRouter(); // 路由

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await IrrigationAreaApi.getIrrigationAreaPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  if (id) router.push(`/integrationWaterFertilizer/irrigate/irrigationArea/create?id=${id}`);
  else router.push(`/integrationWaterFertilizer/irrigate/irrigationArea/create`);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await IrrigationAreaApi.deleteIrrigationArea(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await IrrigationAreaApi.exportIrrigationArea(queryParams);
    download.excel(data, '灌区信息.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

const selectValvesDeviceRef = ref();
/** 绑定电磁阀 */
const bindSolenoidValve = async (id: string) => {
  selectValvesDeviceRef.value.open(id);
};
/** 绑定成功*/
const selectValvesDeviceSuccess = async (item: any) => {
  await IrrigationAreaApi.bindValvesDevice(item[0].belongIrrigationArea, item[0].id);
  message.success('绑定成功');
  await getList();
};
/** 解绑电磁阀*/
const notBindSolenoidValve = async (id: string) => {
  try {
    // 解绑的二次确认
    await message.confirm('是否确认解绑电磁阀');
    // 发起解绑
    await IrrigationAreaApi.notBindValvesDevice(id);
    message.success('解绑成功');
    // 刷新列表
    await getList();
  } catch {}
};

/** 初始化 **/
onMounted(() => {
  getList();
});

/** 初始化 **/
onActivated(() => {
  getList();
});
</script>
