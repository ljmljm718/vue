<template>
  <div class="w-full">
    <div class="w-full flex justify-between items-center">
      <h2 class="m-0 text-[16px]">灌溉程式</h2>
      <div class="flex items-center space-x-[8px]">
        <el-button type="primary" @click="handleClickSetting">灌溉设置</el-button>
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

    <el-form
      :class="`grid ${getGridCols()} gap-y-[8px] mt-[16px] w-full form`"
      label-width="95px"
      :inline="true"
    >
      <el-form-item label="起始日期">
        <el-date-picker
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item label="灌溉日">
        <el-input readonly />
      </el-form-item>

      <el-form-item label="灌溉时间">
        <el-input readonly />
      </el-form-item>

      <el-form-item label="水泵控制">
        <el-radio-group>
          <el-radio>是</el-radio>
          <el-radio>否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="灌溉类型">
        <el-input readonly />
      </el-form-item>

      <el-form-item label="灌溉时长">
        <el-input readonly>
          <template #append>分钟</template>
        </el-input>
      </el-form-item>

      <el-form-item label="同时灌溉数">
        <el-input readonly />
      </el-form-item>

      <el-form-item label="施肥灌区" :class="getColSpan()">
        <el-input readonly />
      </el-form-item>
    </el-form>

    <Dialog v-model="dialogVisible" title="灌溉程式设置" :width="865" top="20px">
      <div class="flex">
        <el-scrollbar :height="350" class="w-[500px]">
          <h2 class="m-0 text-[16px]">灌区选择</h2>
          <el-form
            class="grid grid-cols-2 gap-y-[8px] mt-[16px] w-full form"
            label-width="105px"
            :inline="true"
          >
            <el-form-item label="灌溉类型">
              <el-input readonly />
            </el-form-item>

            <el-form-item label="起始日期">
              <el-input readonly />
            </el-form-item>

            <el-form-item label="灌溉日" class="col-span-2">
              <div class="w-2/3 space-y-[8px]">
                <div class="grid grid-cols-3">
                  <el-checkbox v-model="selectInterval" label="间隔周期" />
                  <el-input class="col-span-2" :disabled="!selectInterval">
                    <template #append>天</template>
                  </el-input>
                </div>
                <div class="grid grid-cols-3">
                  <el-checkbox v-model="selectEach" label="每周" />
                  <el-select class="col-span-2" :disabled="!selectEach" />
                </div>
                <div class="grid grid-cols-3">
                  <el-checkbox v-model="selectDate" label="具体日期后" />
                  <el-date-picker
                    type="date"
                    class="col-span-2 !w-[175.56px]"
                    :disabled="!selectDate"
                  />
                </div>
              </div>
            </el-form-item>

            <el-form-item label="灌溉时长">
              <el-input readonly />
            </el-form-item>

            <el-form-item label="灌溉开始时间">
              <el-input readonly />
            </el-form-item>

            <el-form-item label="水泵控制 ">
              <el-input readonly />
            </el-form-item>

            <el-form-item label="同时灌溉灌区数量">
              <el-input readonly />
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
  </div>
</template>

<script lang="ts" setup>
const width = defineModel('width', { required: true, type: Number });

const dialogVisible = ref(false);

const handleClickSetting = () => {
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
    return { name: ele, selected: false };
  });

  irrigationAreaList.value = Array.isArray(tmp) ? tmp : [];
};
getIrrigationAreaList();

// 选择灌区
const handleSelectIrrigation = (event: any) => {};

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
