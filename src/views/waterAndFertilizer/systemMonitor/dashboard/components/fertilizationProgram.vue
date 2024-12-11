<template>
  <div class="w-full">
    <div class="w-full flex justify-between items-center">
      <h2 class="m-0 text-[16px]">施肥程式</h2>
      <div class="flex items-center space-x-[8px]">
        <el-button type="primary" @click.stop="handleClickSetting">施肥设置</el-button>
        <el-button
          :disabled="!latestRec.status || '1' === latestRec.status"
          @click="updateLatestRecStatus('1')"
        >
          <Icon icon="ep:circle-check" class="mr-[4px]" />
          启用
        </el-button>
        <el-button
          :disabled="!latestRec.status || '0' === latestRec.status"
          @click="updateLatestRecStatus('0')"
        >
          <Icon icon="ep:circle-close" class="mr-[4px]" />
          停用
        </el-button>
        <el-button
          @click="
            router.push({ path: '/integrationWaterFertilizer/taskManagement/task-fertilization' })
          "
        >
          历史任务
        </el-button>
      </div>
    </div>

    <div v-if="!latestRec.id" class="w-full h-[430px] flex flex-col justify-center items-center">
      <div class="no-data"></div>
      <span class="tracking-widest mt-[8px]">暂无数据</span>
    </div>

    <template v-else>
      <el-table
        class="mt-[16px]"
        :data="latestRec.taskFertilizationDetailRespVOList"
        stripe
        show-overflow-tooltip
      >
        <el-table-column label="料桶" prop="chargingBasketName" align="center" />
        <el-table-column label="上水量(L)" prop="upperWaterYield" align="center" />
        <el-table-column label="是否搅拌" prop="mix" align="center">
          <template #default="scope">
            <div class="flex justify-center items-center space-x-[4px]">
              <Icon
                :icon="
                  '1' === scope.row.fertilizerMixerStatus ? 'ep:circle-check' : 'ep:circle-close'
                "
                :style="
                  '1' === scope.row.fertilizerMixerStatus
                    ? 'color: var(--el-color-primary)'
                    : 'color: #FF5951'
                "
              />
              <span>{{ '1' === scope.row.fertilizerMixerStatus ? '是' : '否' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="定量桶" prop="quantitative" align="center">
          <template #default="scope">
            <div class="flex justify-center items-center space-x-[4px]">
              <Icon
                :icon="
                  '1' === scope.row.measureBucketStatus ? 'ep:circle-check' : 'ep:circle-close'
                "
                :style="
                  '1' === scope.row.measureBucketStatus
                    ? 'color: var(--el-color-primary)'
                    : 'color: #FF5951'
                "
              />
              <span>{{ '1' === scope.row.measureBucketStatus ? '是' : '否' }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-form
        :model="latestRec"
        :class="`grid ${getGridCols()} gap-y-[8px] mt-[16px] w-full form`"
        label-width="95px"
        :inline="true"
      >
        <el-form-item label="搅拌类型" prop="mixingType">
          <el-select v-model="latestRec.mixingType" disabled>
            <el-option
              v-for="item in mixTypeDictList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="水泵控制" prop="waterPumpStatus">
          <el-radio-group v-model="latestRec.waterPumpStatus" disabled>
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="施肥类型" prop="fertilizationType">
          <el-select v-model="latestRec.fertilizationType" disabled>
            <el-option
              v-for="item in fertilizationTypeDictList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="latestRec.fertilizationType === 'quantify' ? '施肥量' : '施肥时长'"
          prop="amountTimeNumber"
        >
          <el-input
            v-show="latestRec.fertilizationType === 'quantify'"
            v-model="latestRec.amountTimeNumber"
            disabled
          >
            <template #append>L</template>
          </el-input>
          <el-input
            v-show="latestRec.fertilizationType === 'timing'"
            v-model="latestRec.amountTimeNumber"
            disabled
          >
            <template #append>分钟</template>
          </el-input>
        </el-form-item>

        <el-form-item label="同时施肥数" prop="concurrentTaskNumber">
          <el-input v-model="latestRec.concurrentTaskNumber" disabled />
        </el-form-item>

        <el-form-item label="施肥灌区" prop="irrigationArea" :class="getColSpan()">
          <el-select v-model="latestRec.iaCodeNameList" multiple disabled>
            <el-option
              v-for="item in irrigationList"
              :key="item.id"
              :label="item.iaName"
              :value="item.iaName"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </div>

  <Dialog
    v-model="dialogVisible"
    title="施肥程式设置"
    :width="865"
    top="20px"
    @close="getLatest({})"
  >
    <div class="flex border-b border-b-solid border-[#e6e6e6]">
      <el-scrollbar :height="350" class="w-[500px]">
        <h2 class="m-0 text-[16px]">施肥设置</h2>

        <el-table class="mt-[16px]" :data="data.taskFertilizationDetailSaveReqVOList" stripe>
          <el-table-column label="料桶" prop="chargingBasketName" align="center" />
          <el-table-column label="上水量(L)" prop="upperWaterYield" width="136" align="center">
            <template #default="scope">
              <el-input-number v-model="scope.row.upperWaterYield" :min="0" />
            </template>
          </el-table-column>
          <el-table-column label="是否搅拌" width="140" prop="fertilizerMixerStatus" align="center">
            <template #default="scope">
              <el-radio-group v-model="scope.row.fertilizerMixerStatus">
                <el-radio v-for="item in stirQuantDictList" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="定量桶" width="140" prop="measureBucketStatus" align="center">
            <template #default="scope">
              <el-radio-group v-model="scope.row.measureBucketStatus">
                <el-radio v-for="item in stirQuantDictList" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>

        <el-form
          :model="data"
          class="grid grid-cols-2 gap-y-[8px] mt-[16px] w-full form"
          label-width="95px"
          :inline="true"
        >
          <el-form-item label="搅拌类型" prop="mixingType">
            <el-select v-model="data.mixingType">
              <el-option
                v-for="item in mixTypeDictList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="水泵控制" prop="waterPumpStatus">
            <el-radio-group v-model="data.waterPumpStatus">
              <el-radio label="是">是</el-radio>
              <el-radio label="否">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="施肥类型" prop="fertilizationType">
            <el-select v-model="data.fertilizationType">
              <el-option
                v-for="item in fertilizationTypeDictList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="data.fertilizationType === 'quantify' ? '施肥量' : '施肥时长'"
            prop="amountTimeNumber"
          >
            <el-input
              v-show="data.fertilizationType === 'quantify'"
              v-model="data.amountTimeNumber"
            >
              <template #append>L</template>
            </el-input>
            <el-input v-show="data.fertilizationType === 'timing'" v-model="data.amountTimeNumber">
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="同时施肥数" prop="concurrentTaskNumber">
            <el-input-number v-model="data.concurrentTaskNumber" :min="0" />
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <div class="w-[1px] mt-[-15px] mx-[16px] bg-[#e6e6e6]"></div>

      <el-scrollbar :height="350" class="w-[300px]">
        <h2 class="m-0 text-[16px]">灌区选择</h2>
        <div class="grid grid-cols-4 gap-[8px] mt-[16px]" @click="handleSelectIrrigation">
          <div
            v-for="(item, index) in irrigationList"
            :key="item.id"
            :data-idx="index"
            :class="`
              flex justify-center items-center w-[66px] h-[32px] rounded-[6px]
              cursor-pointer ${item.selected && 'text-[#fff]'}
            `"
            :style="{
              backgroundColor: item.selected ? 'var(--el-color-primary)' : '#F5F5F5'
            }"
          >
            {{ item.iaName }}
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="mt-[16px] w-full flex justify-center">
      <el-button type="primary" @click="handleClickSubmit">保存</el-button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {
  getTaskFertilizationLatestData,
  putTaskFertilizationUpdateStatus,
  getIrrigationAreaPage,
  postTaskFertilizationCreateDetailList
} from '../apis';
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';

// 组件实时宽度
const width = defineModel('width', { type: Number, required: true });

const msg = useMessage();
const router = useRouter();

const mixTypeDictList = getStrDictOptions(DICT_TYPE.WFI_STIR_TYPE); // 搅拌类型
const fertilizationTypeDictList = getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE); // 施肥类型
const stirQuantDictList = getStrDictOptions(DICT_TYPE.FERTILIZE_STIR_MEASURING_TANK); // 是否搅拌 定量桶

// 获取最新施肥记录
const latestRec = ref<any>({});
const getLatest = async (parmas: any) => {
  latestRec.value = {};
  const res = await getTaskFertilizationLatestData({ parmas });
  if (!res) return;
  latestRec.value = res;
};
getLatest({});

// 启用和禁用
const updateLatestRecStatus = async (status: string) => {
  const data = {
    id: latestRec.value.id,
    status,
    fertilizationType: latestRec.value.fertilizationType,
    amountTimeNumber: latestRec.value.amountTimeNumber,
    iaCodeList: latestRec.value.iaCodeList
  };
  const res = await putTaskFertilizationUpdateStatus(data);
  if (res) {
    msg.success(`${'1' === status ? '启用' : '停用'}成功`);
  }
  await getLatest({});
};

// 获取灌区列表
const irrigationList = ref<any[]>([]);
const getIrrigationList = async () => {
  irrigationList.value = [];
  const res = await getIrrigationAreaPage({ pageNo: 1, pageSize: 50 });
  if (!res || !res.list || !Array.isArray(res.list)) return;
  irrigationList.value = res.list;
};
getIrrigationList();

// 对话框开启或关闭
const dialogVisible = ref(false);
const handleClickSetting = async () => {
  // 如果有当前记录 则查询当前记录并赋值给表单
  if (latestRec.value.id) {
    await getLatest({ id: latestRec.value.id });
    data.fertilizationType = latestRec.value.fertilizationType;
    data.mixingType = latestRec.value.mixingType;
    data.waterPumpStatus = latestRec.value.waterPumpStatus;
    data.concurrentTaskNumber = latestRec.value.concurrentTaskNumber;
    data.amountTimeNumber = latestRec.value.amountTimeNumber;
    data.iaCodeList = latestRec.value.iaCodeList;
    data.taskFertilizationDetailSaveReqVOList =
      latestRec.value.taskFertilizationDetailRespVOList.map((ele: any) => {
        return { ...ele };
      });
  } else {
    // 没记录初始化5个空桶
    const tmp: any[] = [];
    [1, 2, 3, 4, 5].forEach((ele) => {
      tmp.push({
        chargingBasketName: '料桶' + String(ele),
        upperWaterYield: 0,
        fertilizerMixerStatus: stirQuantDictList[0].value,
        measureBucketStatus: stirQuantDictList[0].value
      });
    });
    data.taskFertilizationDetailSaveReqVOList = tmp;
  }

  // 查询灌区列表 并添加selected属性
  await getIrrigationList();
  const iaCodeTmpList = data.iaCodeList ? data.iaCodeList.split(',') : [];
  for (let i = 0; i < irrigationList.value.length; ++i) {
    const idx = iaCodeTmpList.findIndex((ele: any) => {
      return ele === irrigationList.value[i].id;
    });
    irrigationList.value[i] = {
      ...irrigationList.value[i],
      selected: idx === -1 ? false : true
    };
  }

  dialogVisible.value = true;
};

// 新增表单数据
const data = reactive<any>({
  fertilizationType: fertilizationTypeDictList[0].value,
  mixingType: mixTypeDictList[0].value,
  waterPumpStatus: '是',
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  taskFertilizationDetailSaveReqVOList: []
});

// 选择灌区
const handleSelectIrrigation = (event: any) => {
  if (!event.target.dataset.idx) return;
  const idx = event.target.dataset.idx;
  irrigationList.value[idx].selected = !irrigationList.value[idx].selected;
};

// 表单校验
const checkForm = () => {
  let res = true;
  if (undefined === data.concurrentTaskNumber || null === data.concurrentTaskNumber) {
    msg.error('同时施肥数不能为空');
    res = false;
  }
  if (
    null === data.amountTimeNumber ||
    undefined === data.amountTimeNumber ||
    '' === data.amountTimeNumber
  ) {
    msg.error('施肥量/施肥时长不能为空');
    res = false;
  }
  if (undefined === data.iaCodeList || '' === data.iaCodeList || null === data.iaCodeList) {
    msg.error('灌区选择不能为空');
    res = false;
  }
  data.taskFertilizationDetailSaveReqVOList.forEach((ele: any) => {
    if (null === ele.upperWaterYield || undefined === ele.upperWaterYield) {
      msg.error('上水量不能为空');
      res = false;
    }
  });
  return res;
};

// 提交表单
const handleClickSubmit = async () => {
  // 获取iaCodeList
  const list: string[] = [];
  irrigationList.value.forEach((ele) => {
    if (ele.selected) {
      list.push(ele.id);
    }
  });
  data.iaCodeList = list.join(',');

  if (!checkForm()) return;
  await postTaskFertilizationCreateDetailList(data);

  await getLatest({});
  msg.success('保存成功');
  dialogVisible.value = false;
};

// 根据容器宽度改变表单分栏数
const getGridCols = () => {
  switch (true) {
    case width.value > 440 && width.value <= 700:
      return 'grid-cols-2';
    case width.value > 700 && width.value <= 1024:
      return 'grid-cols-3';
    case width.value > 1024 && width.value <= 1280:
      return 'grid-cols-4';
    case width.value > 1280:
      return 'grid-cols-5';
    default:
      return 'grid-cols-1';
  }
};

// 独占一行的项占据的栏数
const getColSpan = () => {
  switch (true) {
    case width.value > 440 && width.value <= 700:
      return 'col-span-2';
    case width.value > 700 && width.value <= 1024:
      return 'col-span-3';
    case width.value > 1024 && width.value <= 1280:
      return 'col-span-4';
    case width.value > 1280:
      return 'col-span-5';
    default:
      return 'grid-cols-1';
  }
};
</script>

<style scoped lang="scss">
// 无数据
.no-data {
  width: 180px;
  height: 180px;
  background-image: url(/images/noData.png);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

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
</style>
