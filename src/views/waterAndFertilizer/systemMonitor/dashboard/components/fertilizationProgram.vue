<template>
  <div class="w-full">
    <div class="w-full flex justify-between items-center">
      <h2 class="m-0 text-[16px]">施肥程式</h2>
      <div class="flex items-center space-x-[8px]">
        <el-button type="primary" @click.stop="handleClickSetting">施肥设置</el-button>
        <el-button disabled>
          <Icon icon="ep:circle-check" class="mr-[4px]" />
          启用
        </el-button>
        <el-button>
          <Icon icon="ep:circle-close" class="mr-[4px]" />
          停用
        </el-button>
        <el-button>历史任务</el-button>
      </div>
    </div>

    <el-table
      class="mt-[16px]"
      :data="data.baskets"
      header-cell-class-name="!bg-[#F5F6FA]"
      stripe
      show-overflow-tooltip
    >
      <el-table-column label="料桶" prop="id" align="center" />
      <el-table-column label="上水量(L)" prop="waterVolume" align="center" />
      <el-table-column label="是否搅拌" prop="mix" align="center">
        <template #default="scope">
          <div class="flex justify-center items-center space-x-[4px]">
            <Icon
              :icon="scope.row.mix ? 'ep:circle-check' : 'ep:circle-close'"
              :style="scope.row.mix ? 'color: var(--el-color-primary)' : 'color: #FF5951'"
            />
            <span>{{ scope.row.mix ? '是' : '否' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="定量桶" prop="quantitative" align="center">
        <template #default="scope">
          <div class="flex justify-center items-center space-x-[4px]">
            <Icon
              :icon="scope.row.quantitative ? 'ep:circle-check' : 'ep:circle-close'"
              :style="scope.row.quantitative ? 'color: var(--el-color-primary)' : 'color: #FF5951'"
            />
            <span>{{ scope.row.quantitative ? '是' : '否' }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-form
      :model="data"
      :class="`grid ${getGridCols()} gap-y-[8px] mt-[16px] w-full form`"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="搅拌类型" prop="mixType">
        <el-input v-model="data.mixType" readonly />
      </el-form-item>
      <el-form-item label="水泵控制" prop="waterPumpControl">
        <el-radio-group v-model="data.waterPumpControl" disabled>
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="施肥类型" prop="fertilizeType">
        <el-input v-model="data.fertilizeType" readonly />
      </el-form-item>
      <el-form-item
        :label="data.fertilizeType === '定量' ? '施肥量' : '施肥时长'"
        prop="fertilizeAmount"
      >
        <el-input v-show="data.fertilizeType === '定量'" v-model="data.fertilizeAmount">
          <template #append>L</template>
        </el-input>
        <el-input v-show="data.fertilizeType === '定时'" v-model="data.fertilizeAmount">
          <template #append>分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="同时施肥数" prop="fertilizeSync">
        <el-input v-model="data.fertilizeSync" readonly />
      </el-form-item>
      <el-form-item label="施肥灌区" prop="irrigationArea" :class="getColSpan()">
        <el-select v-model="data.irrigationArea" multiple disabled>
          <el-option v-for="item in data.irrigationArea" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <Dialog v-model="dialogVisible" title="施肥程式设置" :width="865" top="20px">
    <div class="flex">
      <el-scrollbar :height="350" class="w-[500px]">
        <h2 class="m-0 text-[16px]">施肥设置</h2>

        <el-table
          class="mt-[16px]"
          :data="data.baskets"
          header-cell-class-name="!bg-[#F5F6FA]"
          stripe
        >
          <el-table-column label="料桶" prop="id" align="center" />
          <el-table-column label="上水量(L)" prop="waterVolume" width="136" align="center">
            <template #default="scope">
              <el-input-number v-model="scope.row.waterVolume" />
            </template>
          </el-table-column>
          <el-table-column label="是否搅拌" width="140" prop="mix" align="center">
            <template #default="scope">
              <el-radio-group v-model="scope.row.mix">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="定量桶" width="140" prop="quantitative" align="center">
            <template #default="scope">
              <el-radio-group v-model="scope.row.quantitative">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
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
          <el-form-item label="搅拌类型" prop="mixType">
            <el-select v-model="data.mixType">
              <el-option v-for="item in mixTypeList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="水泵控制" prop="waterPumpControl">
            <el-radio-group v-model="data.waterPumpControl">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="施肥类型" prop="fertilizeType">
            <el-select v-model="data.fertilizeType">
              <el-option
                v-for="item in fertilizeTypeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="data.fertilizeType === '定量' ? '施肥量' : '施肥时长'"
            prop="fertilizeAmount"
          >
            <el-input v-show="data.fertilizeType === '定量'" v-model="data.fertilizeAmount">
              <template #append>L</template>
            </el-input>
            <el-input v-show="data.fertilizeType === '定时'" v-model="data.fertilizeAmount">
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="同时施肥数" prop="fertilizeSync">
            <el-input v-model="data.fertilizeSync" readonly />
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <div class="w-[1px] my-[-15px] mx-[16px] bg-[#e6e6e6]"></div>

      <el-scrollbar :height="350" class="w-[300px]">
        <h2 class="m-0 text-[16px]">灌区选择</h2>
        <div class="grid grid-cols-4 gap-[8px] mt-[16px]" @click="handleSelectIrrigation">
          <div
            v-for="(item, index) in irrigationAreaList"
            :key="item.name"
            :data-idx="index"
            :class="`
              flex justify-center items-center w-[66px] h-[32px] rounded-[6px]
              cursor-pointer ${item.selected && 'text-[#fff]'}
            `"
            :style="{
              backgroundColor: item.selected ? 'var(--el-color-primary)' : '#F5F5F5'
            }"
          >
            {{ item.name }}
          </div>
        </div>
      </el-scrollbar>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const width = defineModel('width', { type: Number, required: true });

const data = reactive({
  baskets: [],
  mixType: undefined,
  waterPumpControl: undefined,
  fertilizeType: undefined,
  fertilizeAmount: undefined,
  fertilizeSync: undefined,
  irrigationArea: []
});

const resetData = () => {
  data.baskets = [];
  data.mixType = undefined;
  data.waterPumpControl = undefined;
  data.fertilizeType = undefined;
  data.fertilizeAmount = undefined;
  data.fertilizeSync = undefined;
  data.irrigationArea = [];
};

const getData = async () => {
  resetData();

  // await
  const res = {
    baskets: [
      {
        id: 1,
        waterVolume: 100,
        mix: true,
        quantitative: false
      },
      {
        id: 2,
        waterVolume: 200,
        mix: true,
        quantitative: true
      },
      {
        id: 3,
        waterVolume: 300,
        mix: false,
        quantitative: true
      },
      {
        id: 4,
        waterVolume: 400,
        mix: true,
        quantitative: true
      },
      {
        id: 5,
        waterVolume: 500,
        mix: false,
        quantitative: true
      }
    ],
    mixType: '全程搅拌',
    waterPumpControl: true,
    fertilizeType: '定量',
    fertilizeAmount: 20,
    fertilizeSync: 2,
    irrigationArea: ['灌区1', '灌区2', '灌区3', '灌区4', '灌区5', '灌区6']
  };

  data.baskets = Array.isArray(res.baskets) ? res.baskets : [];
  data.mixType = res.mixType;
  data.waterPumpControl = res.waterPumpControl;
  data.fertilizeType = res.fertilizeType;
  data.fertilizeAmount = res.fertilizeAmount;
  data.fertilizeSync = res.fertilizeSync;
  data.irrigationArea = Array.isArray(res.irrigationArea) ? res.irrigationArea : [];
};
getData();

// 对话框开启或关闭
const dialogVisible = ref(false);

const handleClickSetting = () => {
  dialogVisible.value = true;
};

// 搅拌类型
const mixTypeList = ref<any[]>([]);

const getMixTypeList = () => {
  mixTypeList.value = [];

  // await
  const res = ['全程搅拌', '搅拌类型2', '搅拌类型3', '搅拌类型4'];

  mixTypeList.value = Array.isArray(res) ? res : [];
};
getMixTypeList();

// 施肥类型
const fertilizeTypeList = ref(['定量', '定时']);

// 灌区列表
const irrigationAreaList = ref<any[]>([]);

const getIrrigationAreaList = async () => {
  irrigationAreaList.value = [];

  // await
  const res = [
    '灌区1',
    '灌区2',
    '灌区3',
    '灌区4',
    '灌区5',
    '灌区6',
    '灌区7',
    '灌区8',
    '灌区9',
    '灌区10',
    '灌区11',
    '灌区12',
    '灌区13',
    '灌区14',
    '灌区15',
    '灌区16',
    '灌区17',
    '灌区18',
    '灌区19',
    '灌区20'
  ];
  const tmp = res.map((ele) => {
    if (data.irrigationArea.findIndex((e) => ele === e) !== -1) {
      return { name: ele, selected: true };
    } else {
      return { name: ele, selected: false };
    }
  });

  irrigationAreaList.value = Array.isArray(tmp) ? tmp : [];
};
getIrrigationAreaList();

// 选择灌区
const handleSelectIrrigation = (event: any) => {
  if (!event.target.dataset.idx) return;

  const idx = event.target.dataset.idx;
  irrigationAreaList.value[idx].selected = !irrigationAreaList.value[idx].selected;
  if (irrigationAreaList.value[idx].selected) {
    data.irrigationArea.push(irrigationAreaList.value[idx].name);
  } else {
    data.irrigationArea.splice(idx, 1);
  }
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
