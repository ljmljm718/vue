<template>
  <!-- upload file -->
  <div class="flex items-center">
    <div class="w-[176px] pr-[12px] text-end box-border">
      <span class="text-[16px]">上传文件</span>
    </div>
    <div
      class="relative w-[118px] h-[38px] rounded-[6px] bg-[#F7F7FE] border border-solid border-[#e6e6e6] hover:border-[#615ced] dark:bg-[#2c3240] dark:hover:bg-[#615ced] dark:border-[#4C4D4F] dark:hover:border-[#615ced] overflow-hidden"
    >
      <input type="file" @change="readFile" accept=".xlsx,.csv,.jsonl" id="upload-btn" />
      <div
        class="flex items-center justify-center absolute top-0 left-0 w-full h-full text-[#615ced] dark:text-white"
      >
        <el-icon class="mr-[4px]" :size="16"><Upload /></el-icon>
        <span class="text-[16px]">上传文件</span>
      </div>
    </div>
  </div>
  <!-- tip text -->
  <div class="mt-[12px] ml-[176px] text-[12px] text-[#999999]">
    可以上传示例文档，用于确定表结构。后续知识库文档必须符合该结构规范，支持xlsx, csv, jsonl格式
  </div>
  <!-- select table caption -->
  <div class="flex items-center mt-[16px]">
    <div class="w-[176px] pr-[12px] text-end box-border">
      <span class="text-[16px]">表结构</span>
    </div>
    <div class="w-[calc((100%-176px-48px)/4)] grid grid-cols-2 gap-[16px]">
      <el-select
        v-model="captionRow"
        @change="handleChangeCaptionRow"
        :disabled="disableCaptionRow"
        popper-class="knowledge-lib-popper"
      >
        <template #prefix>结构</template>
        <el-option
          v-for="item in captionTypeList"
          :key="item.id"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <el-select
        v-model="captionIdx"
        @change="handleChangeCaptionIdx"
        :disabled="disableCaptionIdx"
        popper-class="knowledge-lib-popper"
      >
        <template #prefix>表头</template>
        <el-option v-for="item in indexList" :key="item" :value="item" :label="item" />
      </el-select>
    </div>
  </div>
  <!-- edit caption -->
  <div class="mt-[16px] ml-[176px]">
    <el-table
      :data="captionList"
      :stripe="true"
      :show-overflow-tooltip="true"
      :header-cell-style="{ fontSize: '16px', paddingTop: '5px', paddingBottom: '5px' }"
      :cell-style="{ fontSize: '16px', paddingTop: '5px', paddingBottom: '5px' }"
      style="width: 85%"
      class="rounded-t-[6px] field-table"
      ref="fieldTableRef"
      highlight-current-row
    >
      <el-table-column label="字段名称" align="center" prop="name">
        <template #default="scope">
          <el-input v-model="scope.row.name" placeholder="请输入字段名称" />
        </template>
      </el-table-column>
      <el-table-column label="向量索引" :width="110" align="center" prop="vectorIndex">
        <template #default="scope">
          <el-checkbox v-model="scope.row.vectorIndex" />
        </template>
      </el-table-column>
      <el-table-column label="过滤字段" :width="110" align="center" prop="ifFilter">
        <template #default="scope">
          <el-checkbox v-model="scope.row.ifFilter" />
        </template>
      </el-table-column>
      <el-table-column label="字段类型" align="center" prop="type">
        <template #default="scope">
          <el-select
            v-model="scope.row.type"
            class="text-[10px]"
            popper-class="knowledge-lib-popper"
          >
            <el-option v-for="item in fieldTypes" :key="item" :value="item" :label="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="120" align="center" fixed="right">
        <template #default="scope">
          <el-icon
            v-show="0 !== scope.$index"
            class="cursor-pointer hover:text-[#615ced]"
            @click.stop="handleShiftUp(scope.$index, scope.row)"
          >
            <Top />
          </el-icon>
          <el-icon
            v-show="captionList.length - 1 !== scope.$index"
            class="cursor-pointer ml-[4px] hover:text-[#615ced]"
            @click.stop="handleShiftDown(scope.$index)"
          >
            <Bottom />
          </el-icon>
          <el-icon
            class="cursor-pointer ml-[4px] hover:text-[#615ced]"
            @click="handleDeleteCaption(scope.$index)"
          >
            <Delete />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
    <div
      class="flex items-center mt-[16px] bg-[#F7F7FE] border border-solid border-[#E6E6E6] text-[#615CED] w-fit px-[16px] py-[8px] cursor-pointer text-[16px] rounded-[6px] hover:border-[#615ced] dark:bg-[#2c3240] dark:border-[#4C4D4F] dark:text-white dark:hover:border-[#615ced] dark:hover:bg-[#615ced]"
      @click="handleAddField"
    >
      <el-icon><Plus /></el-icon>
      <span class="ml-[4px]">添加字段</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as XLSX from 'xlsx';

// 禁止选择表结构和表头
const disableCaptionRow = ref(false);
const disableCaptionIdx = ref(false);

// 读取文件
const readFile = (event: any) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const fileType = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  // 读取文件完成绑定的函数
  reader.onload = (e) => {
    if (!e.target) {
      console.log('event in FileReader.onload(e) does not exist!');
      return;
    }
    const data = e.target.result;

    switch (fileType) {
      case 'xlsx':
        parseXLSX(data);
        break;
      case 'csv':
        parseXLSX(data);
        break;
      case 'jsonl':
        parseJSONL(data);
        break;
      default:
        ElMessage.error('上传文件格式不支持，请上传xlsx, csv, jsonl格式的文件');
    }
  };
  // 读取文件 如果是jsonl类型 则禁止选择表结构和表头
  switch (fileType) {
    case 'xlsx':
      reader.readAsArrayBuffer(file);
      disableCaptionRow.value = false;
      disableCaptionIdx.value = false;
      break;
    case 'csv':
      reader.readAsText(file, 'GB2312');
      disableCaptionRow.value = false;
      disableCaptionIdx.value = false;
      break;
    case 'jsonl':
      reader.readAsText(file);
      disableCaptionRow.value = true;
      disableCaptionIdx.value = true;
      break;
  }
};

// 文件内容
const fileData = ref<any[]>([]);
const indexList = ref<any[]>([]);

// 解析xlsx和csv文件
const parseXLSX = (data: any) => {
  // 读取文件内容
  const workbook = XLSX.read(data, { type: 'string' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: '' });
  if (!Array.isArray(jsonData) || jsonData.length <= 0) {
    fileData.value = [];
    indexList.value = [];
    return;
  }
  // 初始化数据
  fileData.value = jsonData;
  const list: any[] = [];
  for (let i = 0; i < jsonData.length; ++i) {
    list.push(i + 1);
  }
  indexList.value = list;
  captionRow.value = true;
  captionIdx.value = 1;
  handleChangeCaptionRow();
};

// 解析jsonl文件 读取第一行作为表头
const parseJSONL = (data: any) => {
  const lines = data.split('\n');
  try {
    const caption = JSON.parse(lines[0]);
    const keys = Object.keys(caption);
    captionList.value = keys.map((ele) => {
      let fieldType: string;
      switch (typeof caption[ele]) {
        case 'boolean':
          fieldType = 'bool';
          break;
        case 'number':
          if (Number.isInteger(caption[ele])) {
            fieldType = 'int64';
          } else {
            fieldType = 'float32';
          }
          break;
        default:
          fieldType = 'string';
          break;
      }
      return {
        name: ele,
        vectorIndex: true,
        ifFilter: false,
        type: fieldType,
        defaultValue: ''
      };
    });
    captionRow.value = true;
    captionIdx.value = 1;
  } catch (e) {
    console.error('Error parsing JSONL line:', lines[0]);
    return null;
  }
};

// 表头选择是否选择行以及第几行
const captionRow = ref(true);
const captionIdx = ref(0);
const captionList = ref<any[]>([]);

// 获取第 index 行的数据 从 1 开始
const getRowData = (index: number) => {
  return fileData.value[index - 1];
};

// 获取第 index 列的数据 从 1 开始
const getColData = (index: number) => {
  const list: any[] = [];
  fileData.value.forEach((ele) => {
    list.push(ele[index - 1]);
  });
  return list;
};

// 返回行数
const getRows = () => {
  return fileData.value.length;
};

// 返回列数
const getCols = () => {
  return fileData.value[0].length;
};

// 选择行/列切换
const handleChangeCaptionRow = () => {
  if (fileData.value.length <= 0) {
    indexList.value = [];
    captionIdx.value = 1;
    return;
  }
  const n = captionRow.value ? getRows() : getCols();
  const list: any[] = [];
  for (let i = 0; i < n; ++i) {
    list.push(i + 1);
  }
  captionIdx.value = 1;
  indexList.value = list;
  handleChangeCaptionIdx();
};

// 选择表头的列或行切换
const handleChangeCaptionIdx = () => {
  if (fileData.value.length <= 0) {
    captionList.value = [];
    return;
  }
  captionList.value = captionRow.value
    ? getRowData(captionIdx.value).map((ele: any) => ({
        name: ele,
        vectorIndex: true,
        ifFilter: false,
        type: 'string',
        defaultValue: ''
      }))
    : getColData(captionIdx.value).map((ele: any) => ({
        name: ele,
        vectorIndex: true,
        ifFilter: false,
        type: 'string',
        defaultValue: ''
      }));
};

// 选择行或列作为表头
const captionTypeList = [
  { id: 'captionType1', value: true, label: '行' },
  { id: 'captionType2', value: false, label: '列' }
];

// 删除表头中某个字段
const handleDeleteCaption = (index: number) => {
  captionList.value.splice(index, 1);
  // 如果此时没有字段了 表头设为0
  if (0 >= captionList.value.length) {
    captionIdx.value = 0;
  }
};

// 增加字段
const handleAddField = () => {
  // 如果此时表头为0 则设置为1
  if (0 === captionIdx.value) {
    captionIdx.value = 1;
  }
  captionList.value.push({
    name: '',
    vectorIndex: true,
    ifFilter: false,
    type: 'string',
    defaultValue: ''
  });
};

// 字段类型
const fieldTypes = ['string', 'int64', 'float32', 'bool'];

// 返回当前captionRow captionIdx captionList
const getCaptionList = () => {
  return {
    list: captionList.value,
    isRow: captionRow.value,
    index: captionIdx.value
  };
};

// 交换数组中元素的位置
const swap = (arr: any[], index1: number, index2: number) => {
  [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
};

const fieldTableRef = ref();

// 上移操作 高亮显示交换上去的行
const handleShiftUp = (index: number, row: any) => {
  if (!fieldTableRef.value) {
    return;
  }
  swap(captionList.value, index - 1, index);
  nextTick(() => {
    fieldTableRef.value.setCurrentRow(captionList.value[index - 1]);
  });
};

// 下移操作
const handleShiftDown = (index: number) => {
  if (!fieldTableRef.value) {
    return;
  }
  swap(captionList.value, index, index + 1);
  nextTick(() => {
    fieldTableRef.value.setCurrentRow(captionList.value[index + 1]);
  });
};

defineExpose({ getCaptionList });
</script>

<style lang="scss" scoped>
#upload-btn::file-selector-button {
  // padding: 6px 10px;
  // background-color: #F7F7FE;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  // color: #615CED;
  // font-size: 16px;
  font-size: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

#upload-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 40;
  font-size: 0;
  width: 118px;
  height: 38px;
}

// .ai-dark {
//   #upload-btn::file-selector-button {
//     background-color: #2c3240;
//     color: white;
//     border-color: #4C4D4F;

//     &:hover {
//       border-color: #615CED;
//       background-color: #615CED;
//     }
//   }
// }

:deep(.field-table .el-table__body tr.current-row > td.el-table__cell) {
  background-color: #ededfd;
}
</style>

<style lang="scss">
.knowledge-lib-popper {
  .el-select-dropdown__item.is-selected {
    color: #615ced;
  }
}
</style>
