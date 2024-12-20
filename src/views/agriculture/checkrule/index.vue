<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">巡检规则管理</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!-- 一级标题旁边的按钮 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:check-rule:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:check-rule:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>

        <button
          class="circle-arrow-up ml-[16px]"
          :class="showSearch ? 'rotate180andthemeBg' : 'rotate180andwhiteBg'"
          @click="handleClickShowSearch"
        >
          <Icon :size="14" icon="ep:arrow-up" />
        </button>
      </div>
    </div>

    <!-- 搜索栏 注意 :model 和 ref 的名称 -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full overflow-hidden form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <el-form-item label="规则名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入规则名称" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_JOB_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="w-full mt-[8px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="规则编号" width="200px" align="center" prop="id" />
        <el-table-column label="规则名称" width="300px" align="center" prop="name" />
        <el-table-column label="规则状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.INFRA_JOB_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <!--      <el-table-column label="处理器的名字" align="center" prop="handlerName" />-->
        <!--      <el-table-column label="处理器的参数" align="center" prop="handlerParam" />-->
        <el-table-column label="CRON 表达式" align="center" prop="cronExpression" />
        <el-table-column label="重试次数" align="center" prop="retryCount" />
        <el-table-column label="重试间隔" align="center" prop="retryInterval" />
        <el-table-column label="监控超时时间" align="center" prop="monitorTimeout" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" fixed="right" min-width="220px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button link type="primary" @click="getDeviceId(scope.row.handlerParam)">
                查看设备列表
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                type="primary"
                link
                @click="handleChangeStatus(scope.row)"
                v-hasPermi="['agriculture:check-rule:update']"
              >
                {{ scope.row.status === InfraJobStatusEnum.STOP ? '开启' : '暂停' }}
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>

              <el-popover :width="104" trigger="hover" popper-style="min-width: 0">
                <template #reference>
                  <div class="flex items-center">
                    <div
                      class="w-[2px] h-[2px] mx-[1px] rounded-full"
                      style="background-color: var(--el-color-primary)"
                    ></div>
                    <div
                      class="w-[2px] h-[2px] mx-[1px] rounded-full"
                      style="background-color: var(--el-color-primary)"
                    ></div>
                    <div
                      class="w-[2px] h-[2px] mx-[1px] rounded-full"
                      style="background-color: var(--el-color-primary)"
                    ></div>
                  </div>
                </template>

                <div class="flex flex-col items-start space-y-[8px] space-x-0">
                  <!-- 隐藏的其他按钮 -->
                  <el-button
                    type="primary"
                    link
                    @click="openDeviceInfoHelperDialog(scope.row)"
                    v-hasPermi="['agriculture:check-rule:update']"
                  >
                    绑定设备
                  </el-button>
                  <el-button
                    link
                    type="primary"
                    @click="openForm('update', scope.row.id)"
                    v-hasPermi="['agriculture:check-rule:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    link
                    type="danger"
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['agriculture:check-rule:delete']"
                  >
                    删除
                  </el-button>
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 页码组件 注意绑定的值和事件函数 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>

  <!-- 表单弹窗：添加/修改 -->
  <CheckRuleForm ref="formRef" @success="getList" />
  <!-- 弹窗:设备选择 -->
  <DeviceInfoHelper
    ref="deviceInfoHelperRef"
    :multi="true"
    @confirm-device-info-list="handleBindDevice"
  />

  <el-dialog v-model="dialogVisible" title="设备列表" width="75%">
    <DeviceInfoHelpers
      ref="deviceInfoHelpersRef"
      :multi="true"
      :deviceInfoList="deviceInfoList"
      @confirm-device-info-list="handleBindDevice"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { CheckRuleApi, CheckRuleVO } from '@/api/agriculture/checkrule';
import CheckRuleForm from './CheckRuleForm.vue';
import { DICT_TYPE, getIntDictOptions, getStrDictOptions } from '@/utils/dict';
import { InfraJobStatusEnum } from '@/utils/constants';
import DeviceInfoHelper from '@/views/components/DeviceInfoHelper/index.vue';
import { JobVO } from '@/api/infra/job';
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';

import DeviceInfoHelpers from '@/views/agriculture/deviceinfo/showDeviceInfo.vue';

/** 巡检规则 列表 */
defineOptions({ name: 'CheckRule' });
//产看设备列表弹框
const dialogVisible = ref(false);
const { wsCache } = useCache();

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<CheckRuleVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  handlerName: undefined,
  handlerParam: undefined,
  cronExpression: undefined,
  retryCount: undefined,
  retryInterval: undefined,
  monitorTimeout: undefined,
  remark: undefined,
  createTime: [],
  deptId: undefined,
  userId: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await CheckRuleApi.getCheckRulePage(queryParams);
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

/** 修改状态操作 */
const handleChangeStatus = async (row: CheckRuleVO) => {
  try {
    // 修改状态的二次确认
    const text = row.status === InfraJobStatusEnum.STOP ? '开启' : '关闭';
    await message.confirm(
      '确认要' + text + '巡检规则编号为"' + row.id + '"的数据项?',
      t('common.reminder')
    );
    const status =
      row.status === InfraJobStatusEnum.STOP ? InfraJobStatusEnum.NORMAL : InfraJobStatusEnum.STOP;
    await CheckRuleApi.updateCheckRuleStatus(row.id, status);
    message.success(text + '成功');
    // 刷新列表
    await getList();
  } catch {
    // 取消后，进行恢复按钮
    row.status =
      row.status === InfraJobStatusEnum.NORMAL
        ? InfraJobStatusEnum.NORMAL
        : InfraJobStatusEnum.STOP;
  }
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await CheckRuleApi.deleteCheckRule(id);
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
    const data = await CheckRuleApi.exportCheckRule(queryParams);
    download.excel(data, '巡检规则.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/**
 * 绑定设备操作
 */
// 打开设备选择弹窗
const deviceInfoHelperRef = ref();
const currRule = ref();
const openDeviceInfoHelperDialog = (job: JobVO) => {
  currRule.value = job;
  deviceInfoHelperRef.value.open(job.handlerParam ? JSON.parse(job.handlerParam).deviceIds : []);
};
// 绑定设备
const handleBindDevice = async (val) => {
  const user = wsCache.get(CACHE_KEY.USER).user;
  const handlerParam = {
    userId: user.id,
    deptId: user.deptId,
    deviceIds: val.map((item) => item.id)
  };
  const formData: CheckRuleVO = {
    id: currRule.value.id,
    handlerParam: JSON.stringify(handlerParam)
  };
  await CheckRuleApi.checkRuleBindDeviceInfo(formData);
  await getList();
  message.success('绑定设备成功！');
};

/** 初始化 **/
onMounted(() => {
  getList();
});
const deviceInfoList = ref([]);
const getDeviceId = async (str: any) => {
  const a = JSON.parse(str);
  console.log(a.deviceIds);
  deviceInfoList.value = await DeviceInfoApi.getDeviceInfoByIds([...a.deviceIds]);

  dialogVisible.value = true;
};
/* 原页面的代码复制在上面 */

/**
 * topMenuHeight      顶部菜单和标签页高度
 * contentPadding     页面内容外边距
 */
const topMenuHeight = 85;
const contentPadding = 8;

// 展开或收起搜索栏
const showSearch = ref(false);
const handleClickShowSearch = () => {
  showSearch.value = !showSearch.value;
};
</script>

<style lang="scss" scoped>
// 鼠标移在按钮上时显示主题色边框
:deep(.el-button:hover) {
  border-color: var(--el-color-primary);
}

// 去掉表单的边距
:deep(.form > *) {
  margin: 0;
}

// 调整表单标签和输入框之间的距离
:deep(.form .el-form-item__label) {
  padding: 0 4px 0 0;
}

// 收起
.circle-arrow-up {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ebebeb;
  color: #333;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    color: white;
    border-width: 0;
    background-color: var(--el-color-primary);
  }
}

// 向上箭头展开收起的动画
@keyframes rotate180andwhiteBg {
  from {
    transform: rotate(0deg);
    color: #333;
    background-color: white;
  }
  to {
    transform: rotate(180deg);
    color: white;
    background-color: var(--el-color-primary);
  }
}

.rotate180andwhiteBg {
  animation-duration: 0.5s;
  animation-name: rotate180andwhiteBg;
  animation-fill-mode: forwards;
}

@keyframes rotate180andthemeBg {
  from {
    transform: rotate(180deg);
    color: white;
    background-color: var(--el-color-primary);
  }
  to {
    transform: rotate(360deg);
    color: #333;
    background-color: white;
  }
}

.rotate180andthemeBg {
  animation-duration: 0.5s;
  animation-name: rotate180andthemeBg;
  animation-fill-mode: forwards;
}
</style>
