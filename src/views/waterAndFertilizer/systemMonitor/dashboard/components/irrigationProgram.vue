<template>
  <div class="w-full">
    <div class="w-full flex justify-between items-center">
      <h2 class="m-0 text-[16px]">灌溉程式</h2>
      <div class="flex items-center space-x-[8px]">
        <el-button type="primary" @click="handleClickSetting">灌溉设置</el-button>
        <el-button
          :disabled="!latestRec.id || '启用' === latestRec.status"
          @click="handleClickEnable"
        >
          <Icon icon="ep:circle-check" class="mr-[4px]" />
          启用
        </el-button>
        <el-button
          :disabled="!latestRec.id || '未启用' === latestRec.status || '停用' === latestRec.status"
          @click="handleClickStop"
        >
          <Icon icon="ep:circle-close" class="mr-[4px]" />
          停用
        </el-button>
        <el-button
          @click="
            router.push({ path: '/integrationWaterFertilizer/taskManagement/wfi-task-irrigation' })
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
      <el-form
        :class="`grid ${getGridCols()} gap-y-[8px] mt-[16px] w-full form`"
        label-width="95px"
        :inline="true"
        :model="latestRec"
      >
        <el-form-item label="起始日期" prop="timeRange">
          <el-date-picker
            v-model="latestRec.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            disabled
          />
        </el-form-item>

        <el-form-item label="灌溉日" prop="execCron">
          <el-input v-model="latestRec.execCron" disabled />
        </el-form-item>

        <el-form-item label="灌溉时间" prop="tiExecBeginTime">
          <el-input v-model="latestRec.tiExecBeginTime" disabled />
        </el-form-item>

        <el-form-item label="水泵控制" prop="waterPumpStatus">
          <el-radio-group v-model="latestRec.waterPumpStatus" disabled>
            <el-radio label="是">是</el-radio>
            <el-radio label="否">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="灌溉类型">
          <el-select v-model="latestRec.irrigationType" disabled>
            <el-option
              v-for="item in irrigateTypeDictList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="latestRec.irrigationType === 'quantify' ? '灌溉量' : '灌溉时长'"
          prop="amountTimeNumber"
        >
          <el-input
            v-show="latestRec.irrigationType === 'quantify'"
            v-model="latestRec.amountTimeNumber"
            disabled
          >
            <template #append>L</template>
          </el-input>
          <el-input
            v-show="latestRec.irrigationType === 'timing'"
            v-model="latestRec.amountTimeNumber"
            disabled
          >
            <template #append>分钟</template>
          </el-input>
        </el-form-item>

        <el-form-item label="同时灌溉数">
          <el-input v-model="latestRec.concurrentTaskNumber" disabled />
        </el-form-item>

        <el-form-item label="施肥灌区" :class="getColSpan()">
          <el-select v-model="latestRec.iaIdList" multiple disabled>
            <el-option
              v-for="item in irrigationList"
              :key="item.id"
              :label="item.iaName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <Dialog v-model="dialogVisible" title="灌溉程式设置" :width="865" top="20px">
      <div class="flex border-b border-b-solid border-[#e6e6e6]">
        <el-scrollbar :height="350" class="w-[500px]">
          <h2 class="m-0 text-[16px]">灌区选择</h2>
          <el-form
            class="grid grid-cols-2 gap-y-[8px] mt-[16px] w-full form"
            label-width="105px"
            :inline="true"
            :model="formData"
          >
            <el-form-item v-model="formData.irrigationType" label="灌溉类型">
              <el-select v-model="formData.irrigationType">
                <el-option
                  v-for="item in irrigateTypeDictList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              :label="formData.irrigationType === 'quantify' ? '灌溉量' : '灌溉时长'"
              prop="amountTimeNumber"
            >
              <el-input
                v-show="formData.irrigationType === 'quantify'"
                v-model="formData.amountTimeNumber"
              >
                <template #append>L</template>
              </el-input>
              <el-input
                v-show="formData.irrigationType === 'timing'"
                v-model="formData.amountTimeNumber"
              >
                <template #append>分钟</template>
              </el-input>
            </el-form-item>

            <el-form-item label="水泵控制" prop="waterPumpStatus">
              <el-radio-group v-model="formData.waterPumpStatus">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="起始日期" prop="timeRange" class="col-span-2">
              <el-date-picker
                v-model="formData.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>

            <el-form-item label="灌溉日" class="col-span-2">
              <div class="w-2/3 space-y-[8px]">
                <div class="grid grid-cols-3">
                  <el-checkbox v-model="selectInterval" label="间隔周期" />
                  <el-input
                    v-show="selectInterval"
                    v-model="formData.tiExecCronDay"
                    class="col-span-2"
                  >
                    <template #append>天</template>
                  </el-input>
                  <el-input v-show="!selectInterval" class="col-span-2" disabled>
                    <template #append>天</template>
                  </el-input>
                </div>
                <div class="grid grid-cols-3">
                  <el-checkbox v-model="selectEach" label="每周" />
                  <el-select v-show="!selectEach" class="col-span-2" disabled />
                  <el-select
                    v-model="formData.tiExecCronDay"
                    v-show="selectEach"
                    class="col-span-2"
                  >
                    <el-option
                      v-for="item in weekList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div class="grid grid-cols-3">
                  <el-checkbox v-model="selectDate" label="具体日期后" />
                  <template v-if="!selectDate">
                    <el-date-picker type="date" class="col-span-2 !w-[175.56px]" disabled />
                  </template>
                  <template v-else>
                    <el-date-picker
                      v-model="formData.tiExecCronDay"
                      type="date"
                      class="col-span-2 !w-[175.56px]"
                    />
                  </template>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="灌溉开始时间" prop="tiExecBeginTime">
              <el-time-select
                v-model="execBeginTime"
                placeholder="请选择时间"
                start="00:00"
                step="00:15"
                end="23:59"
                @change="handleChangeExecBeginTime"
              />
            </el-form-item>

            <el-form-item label="同时灌溉灌区数量">
              <el-input-number v-model="formData.concurrentTaskNumber" :min="0" />
            </el-form-item>

            <div class="flex mt-[8px] col-span-2 space-x-[8px] pr-[5px]">
              <div class="flex-none w-[101px] text-[12px] text-right">已选择的时间</div>
              <div class="grow grid grid-cols-4 gap-[8px]">
                <div
                  v-for="(item, index) in execBeginTimeList"
                  :key="item"
                  class="px-[6px] flex justify-between items-center border border-solid border-[#e6e6e6] rounded-[6px] shadow-sm"
                >
                  <span>{{ item }}</span>
                  <el-icon class="cursor-pointer" @click="handleClickDeleteTime(index)">
                    <Close />
                  </el-icon>
                </div>
              </div>
            </div>
          </el-form>
        </el-scrollbar>

        <div class="w-[1px] mt-[-15px] mx-[16px] bg-[#e6e6e6]"></div>

        <div class="w-[300px] h-[350px]">
          <el-scrollbar :height="298" class="!h-[298px] w-[300px]">
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
          <div class="my-[16px]">
            <el-checkbox v-model="selectAll" label="全选" @change="selectAllIrrigation" />
          </div>
        </div>
      </div>

      <div class="mt-[16px] w-full flex justify-center">
        <el-button type="primary" @click="handleClickSubmit">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict';
import {
  getWfiTaskIrrigationPage,
  getIrrigationAreaPage,
  getWfiTaskIrrigationEnable,
  getWfiTaskIrrigationStop,
  getWfiTaskIrrigationGet,
  postWfiTaskIrrigationCreate
} from '../apis';

const width = defineModel('width', { required: true, type: Number });

const msg = useMessage();
const router = useRouter();

const irrigateExecCronDictList = getStrDictOptions(DICT_TYPE.WFI_IRRIGATE_EXEC_CRON);
const irrigateTypeDictList = getStrDictOptions(DICT_TYPE.WFI_FERTILIZE_TYPE);

// 获取最新记录
const latestRec = ref<any>({});
const getLatest = async () => {
  latestRec.value = {};
  const res = await getWfiTaskIrrigationPage({ pageNo: 1, pageSize: 1 });
  if (!res || !res.list || !Array.isArray(res.list)) return;

  latestRec.value = {
    ...res.list[0],
    timeRange: [new Date(res.list[0].tiBeginTime), new Date(res.list[0].tiEndTime)],
    execCron: getExecCronStr(res.list[0].tiExecCron, res.list[0].tiExecCronDay),
    iaIdList: res.list[0].iaNameList.split(',')
  };
};
getLatest();

// 获取灌溉日字符串 = 灌溉周期类型 + 时间
const getExecCronStr = (type: string, day: string) => {
  const weekMap = {
    '1': '每周一',
    '2': '每周二',
    '3': '每周三',
    '4': '每周四',
    '5': '每周五',
    '6': '每周六',
    '7': '每周日'
  };

  const item = irrigateExecCronDictList.find((ele) => {
    return ele.value === type;
  });
  switch (type) {
    case 'weekly':
      return item?.label + ': ' + weekMap[day];
    default:
      return item?.label + ': ' + day;
  }
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

// 启用
const handleClickEnable = async () => {
  await getWfiTaskIrrigationEnable({ id: latestRec.value.id });
  msg.success('启用成功');
  await getLatest();
};

// 停用
const handleClickStop = async () => {
  await getWfiTaskIrrigationStop({ id: latestRec.value.id });
  msg.success('停用成功');
  await getLatest();
};

const formData = reactive<any>({
  tiName: undefined,
  irrigationType: irrigateTypeDictList[0].value,
  timeRange: [],
  tiExecCron: irrigateExecCronDictList[0].value,
  tiExecBeginTime: undefined,
  waterPumpStatus: '是',
  concurrentTaskNumber: undefined,
  amountTimeNumber: undefined,
  iaCodeList: undefined,
  tiExecCronDay: undefined
});

// 打开灌溉设置
const dialogVisible = ref(false);
const handleClickSetting = async () => {
  execBeginTimeList.value = [];
  execBeginTime.value = null;

  if (latestRec.value.id) {
    const data = await getWfiTaskIrrigationGet({ id: latestRec.value.id });
    formData.irrigationType = data.irrigationType;
    formData.timeRange = [new Date(data.tiBeginTime), new Date(data.tiEndTime)];
    formData.tiExecCron = data.tiExecCron;
    formData.waterPumpStatus = data.waterPumpStatus;
    formData.concurrentTaskNumber = data.concurrentTaskNumber;
    formData.amountTimeNumber = data.amountTimeNumber;
    formData.iaCodeList = data.iaCodeList;
    formData.tiExecCronDay = data.tiExecCronDay;
  }

  // 查询灌区列表 并添加selected属性
  await getIrrigationList();
  const iaCodeTmpList = formData.iaCodeList ? formData.iaCodeList.split(',') : [];
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

const selectInterval = ref(true);
const selectEach = ref(false);
const selectDate = ref(false);

// 三个变量中有一个变成true时 另外两个设置成false
watch(selectInterval, () => {
  if (!selectInterval.value) return;
  selectEach.value = false;
  selectDate.value = false;
});

watch(selectEach, () => {
  if (!selectEach.value) return;
  selectInterval.value = false;
  selectDate.value = false;
});

watch(selectDate, () => {
  if (!selectDate.value) return;
  selectInterval.value = false;
  selectEach.value = false;
});

const weekList = [
  { label: '周一', value: '1' },
  { label: '周二', value: '2' },
  { label: '周三', value: '3' },
  { label: '周四', value: '4' },
  { label: '周五', value: '5' },
  { label: '周六', value: '6' },
  { label: '周日', value: '7' }
];

// 灌溉开始时间
const execBeginTimeList = ref<any[]>([]);
const execBeginTime = ref();
const handleChangeExecBeginTime = (val: any) => {
  execBeginTimeList.value.push(val + ':00');
  execBeginTime.value = undefined;
};

// 删除index下标处的时间
const handleClickDeleteTime = (index: number) => {
  execBeginTimeList.value.splice(index, 1);
};

// 选择灌区
const handleSelectIrrigation = (event: any) => {
  if (!event.target.dataset.idx) return;
  const idx = event.target.dataset.idx;
  irrigationList.value[idx].selected = !irrigationList.value[idx].selected;
};

// 全选灌区列表
const selectAll = ref(false);
const selectAllIrrigation = () => {
  // 遍历灌区列表 selected值设置成selectAll的值
  irrigationList.value = irrigationList.value.map((ele) => {
    return { ...ele, selected: selectAll.value };
  });
};

// 表单校验
const checkForm = (execCron: string) => {
  let res = true;
  if (!Array.isArray(formData.timeRange) || formData.timeRange.length === 0) {
    msg.error('起止时间不能为空');
    res = false;
  }
  if (execBeginTimeList.value.length === 0) {
    msg.error('灌溉开始时间不能为空');
    res = false;
  }
  if (undefined === formData.concurrentTaskNumber || null === formData.concurrentTaskNumber) {
    msg.error('同时灌溉灌区数量不能为空');
    res = false;
  }
  if (
    null === formData.amountTimeNumber ||
    undefined === formData.amountTimeNumber ||
    '' === formData.amountTimeNumber
  ) {
    msg.error('灌溉量/灌溉时长不能为空');
    res = false;
  }
  if (
    undefined === formData.iaCodeList ||
    '' === formData.iaCodeList ||
    null === formData.iaCodeList
  ) {
    msg.error('灌区选择不能为空');
    res = false;
  }
  if (undefined === execCron || '' === execCron || null === execCron) {
    msg.error('灌溉日类型不能为空');
    res = false;
  }
  if (
    undefined === formData.tiExecCronDay ||
    '' === formData.tiExecCronDay ||
    null === formData.tiExecCronDay
  ) {
    msg.error('间隔周期/每周/具体日期后不能为空');
    res = false;
  }
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
  formData.iaCodeList = list.join(',');

  // 灌溉日类型
  let execCron: string = '';
  if (selectDate.value) {
    execCron = 'after_date';
  }
  if (selectEach.value) {
    execCron = 'weekly';
  }
  if (selectInterval.value) {
    execCron = 'interval';
  }

  // 根据当前时间生成灌溉任务名称
  const date = new Date();
  formData.tiName = '灌溉任务 ' + getDateStr(date) + ' ' + getTimeStr(date);

  if (!checkForm(execCron)) return;
  const data = {
    tiName: formData.tiName,
    irrigationType: formData.irrigationType,
    tiBeginTime: formData.timeRange[0].getTime(),
    tiEndTime: formData.timeRange[1].getTime(),
    tiExecBeginTime: execBeginTimeList.value.join(','),
    waterPumpStatus: formData.waterPumpStatus,
    concurrentTaskNumber: formData.concurrentTaskNumber,
    amountTimeNumber: Number(formData.amountTimeNumber),
    iaCodeList: formData.iaCodeList,
    tiExecCronDay: selectDate.value ? getDateStr(formData.tiExecCronDay) : formData.tiExecCronDay,
    tiExecCron: execCron,
    status: '未启用'
  };

  await postWfiTaskIrrigationCreate(data);

  await getLatest();
  msg.success('保存成功');
  dialogVisible.value = false;
};

// 传入Date对象 获取YYYY-MM-DD字符串
const getDateStr = (item: any) => {
  const year = item.getFullYear();
  const month = item.getMonth() + 1 >= 10 ? item.getMonth() + 1 : '0' + (item.getMonth() + 1);
  const day = item.getDate() >= 10 ? item.getDate() : '0' + item.getDate();
  return year + '-' + month + '-' + day;
};

// 传入Date对象 获取HH:MM:SS字符串
const getTimeStr = (item: any) => {
  const hour = item.getHours() >= 10 ? item.getHours() : '0' + item.getHours();
  const minute = item.getMinutes() >= 10 ? item.getMinutes() : '0' + item.getMinutes();
  const sec = item.getSeconds() >= 10 ? item.getSeconds() : '0' + item.getSeconds();
  return hour + ':' + minute + ':' + sec;
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

<style lang="scss" scoped>
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
