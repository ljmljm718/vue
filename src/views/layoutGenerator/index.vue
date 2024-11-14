<script setup lang="ts">
import LayoutItem from './components/layoutItem.vue';
import { cloneDeep, uniqueId } from 'lodash-es';
import { layoutGeneratorBus } from './eventBus';
import { isNumber } from '@/utils/is';

interface LayoutItemProps {
  id: number;
  rowSpan: number;
  colSpan: number;
}
const layoutItemList = ref<LayoutItemProps[]>([]);
const handleUpdateItemList = (id, row, column) => {
  layoutItemList.value = layoutItemList.value.map((item) => {
    if (item.id == id) {
      return { ...item, rowSpan: Number(row), colSpan: Number(column) };
    } else return item;
  });
};

const layoutMainId = 'layoutMain_' + uniqueId();
defineOptions({ name: 'LayoutGenerator' });

const tempX = ref<number>(0),
  tempY = ref<number>(0);
const temRowSpan = ref<number>(0),
  temColSpan = ref<number>(0);
const fixInitConfig = (item: number) => {
  if (tempX.value !== 0 || tempY.value !== 0) return;
  nextTick(() => {
    handleLayoutItemResize(item);
  });
};
const handleLayoutItemResize = (item: number, enable = true) => {
  const layoutMainDom = document.getElementById(layoutMainId);
  if (!layoutMainDom) return;
  const gridColumnsNum = window
    .getComputedStyle(layoutMainDom, null)
    ?.gridTemplateColumns?.split(' ')?.length;
  if (!isNumber(gridColumnsNum) || isNaN(gridColumnsNum)) return;
  // 鼠标所在的横纵坐标
  const targetX = item % gridColumnsNum === 0 ? gridColumnsNum : item % gridColumnsNum,
    targetY = Math.ceil(item / gridColumnsNum);
  const activeItemDom = document.getElementById(activeLayoutResizeDomID.value);
  if (!activeItemDom) return;

  const activeItemFullStyle = window.getComputedStyle(activeItemDom, null);
  if (!activeItemFullStyle) return;
  const activeItemGridColumn = activeItemFullStyle.gridColumn.match(/\d+/g).map(Number)[0];
  const activeItemGridRow = activeItemFullStyle.gridRow.match(/\d+/g).map(Number)[0];
  if (tempY.value === 0 && tempX.value === 0) {
    console.log('🚀 ~ handleLayoutItemResize ~ 坐标点初始化:', tempX.value, tempX.value);
    tempX.value = targetX;
    tempY.value = targetY;
    temRowSpan.value = activeItemGridRow;
    temColSpan.value = activeItemGridColumn;
    return;
  }

  const gridRowVal = temRowSpan.value + targetY - tempY.value;
  const gridColumnVal = Math.min(gridColumnsNum, temColSpan.value + targetX - tempX.value);
  if (enable) {
    console.log('🚀 ~ handleLayoutItemResize ~ resize row col:', gridRowVal, gridColumnVal);
    activeItemDom.style.gridRow = `span ${gridRowVal} / span ${gridRowVal}`;
    activeItemDom.style.gridColumn = `span ${gridColumnVal} / span ${gridColumnVal}`;
    const listItemID = activeLayoutResizeDomID.value.split('_')[1];
    handleUpdateItemList(listItemID, gridRowVal, gridColumnVal);
  }
};
const handleLayoutItemPositionChange = (item: number) => {};
const handleTipRectMouseOver = (item: number) => {
  // 如果没有正在进行 resize 或者 move， 退出
  if (!activeLayoutResizeDomID.value) handleLayoutItemResize(item, false);
  if (!(activeLayoutResizeDomID.value || activeLayoutPositionChangeDomID.value)) return;
  if (activeLayoutResizeDomID.value) return handleLayoutItemResize(item);
  else if (activeLayoutPositionChangeDomID.value) return handleLayoutItemPositionChange(item);
};

layoutGeneratorBus.on('itemKeyDown', (domId: string) => {
  console.log('🚀 ~ layoutGeneratorBus.on ~ itemKeyDown:', domId);
  activeLayoutPositionChangeDomID.value = domId;
});
layoutGeneratorBus.on('itemKeyUp', (domId: string) => {
  console.log('🚀 ~ layoutGeneratorBus.on ~ itemKeyUp:', domId);
  activeLayoutPositionChangeDomID.value = '';
});

const activeLayoutResizeDomID = ref<string>('');
const activeLayoutPositionChangeDomID = ref<string>('');
window.addEventListener('mouseup', () => {
  console.log('mouseup');
  activeLayoutResizeDomID.value = '';
  activeLayoutPositionChangeDomID.value = '';
  tempX.value = 0;
  tempY.value = 0;
});
layoutGeneratorBus.on('itemChangeBtnDown', (domId: string) => {
  console.log('🚀 ~ layoutGeneratorBus.on ~ itemChangeBtnDown:', domId);
  activeLayoutResizeDomID.value = domId;
});
layoutGeneratorBus.on('itemChangeBtnUp', (domId: string) => {
  console.log('🚀 ~ layoutGeneratorBus.on ~ itemChangeBtnUp:', domId);
  activeLayoutResizeDomID.value = '';
});

const handleListenItemResize = () => {
  const container = document.getElementById(layoutMainId);
  console.log('🚀 ~ handleListenItemResize ~ container:', container);
  // TODO 考虑在这里进行智能排序
};
onMounted(() => {
  handleListenItemResize();
});

// 新增 item
const dialogForm = ref<LayoutItemProps>({
  id: -1,
  colSpan: 4,
  rowSpan: 3
});
const showAddItemDialog = ref<boolean>(false);
const handleAddItem = () => {
  showAddItemDialog.value = true;
};
const handleConfirmAdd = () => {
  const _item = cloneDeep(dialogForm.value);
  layoutItemList.value.push({ ..._item, id: Number(uniqueId()) });
  showAddItemDialog.value = false;
};
</script>
<template>
  <div class="px-2 box-border h-33px mb-7px">
    <div class="w-full bg-white p-2">
      <el-button type="primary">设置</el-button>
      <el-button type="primary" @click="handleAddItem()">新增</el-button>
      <el-dialog
        title="新增"
        v-model="showAddItemDialog"
        width="600px"
        append-to-body
        destroy-on-close
      >
        <div class="flex">
          <el-input-number v-model="dialogForm.rowSpan" placeholder="行数" />
          <el-input-number v-model="dialogForm.colSpan" placeholder="列数" />
        </div>
        <template #footer>
          <el-button size="small" @click="showAddItemDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleConfirmAdd()">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
  <el-scrollbar height="calc(100vh - 165px)">
    <div
      :id="layoutMainId"
      class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 relative container w-full gap-2 layout-generator-out-frame p-2 box-border"
      style="grid-auto-rows: 30px"
    >
      <div class="absolute right-2 top-2 bg-white shadow-lg z-200">
        <div>resize: {{ activeLayoutResizeDomID }}</div>
        <div>position: {{ activeLayoutPositionChangeDomID }}</div>
        <div>初始化位置: x:{{ tempX }} y:{{ tempY }}</div>
      </div>
      <div
        class="grid grid-cols-4 sm:grid-cols-4 box-border md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 absolute left-0 top-0 w-full gap-2 p-2"
        :style="`
          grid-auto-rows: 30px;
          z-index: ${activeLayoutResizeDomID || activeLayoutPositionChangeDomID ? '120' : '1'}
        `"
      >
        <div
          class="w-full bg-[#e1e1f100] h-30px"
          v-for="item in 640"
          :key="item"
          @mouseover="handleTipRectMouseOver(item)"
          @mouseleave="fixInitConfig(item)"
        ></div>
      </div>
      <div
        class="grid grid-cols-4 sm:grid-cols-4 box-border md:grid-cols-8 lg:grid-cols-12 z-0 xl:grid-cols-16 2xl:grid-cols-20 absolute left-0 top-0 w-full gap-2 p-2"
        style="grid-auto-rows: 30px"
      >
        <div class="w-full bg-[#e1e1e1]" v-for="item in 640" :key="item"></div>
      </div>
      <layout-item
        v-for="item in layoutItemList"
        :key="item.id"
        :id="item.id"
        :rowSpan="item.rowSpan"
        :colSpan="item.colSpan"
      >
        <div class="w-full h-full bg-blue">ZBC{{ item.rowSpan }}</div>
      </layout-item>
    </div>
  </el-scrollbar>
</template>
<style lang="scss">
.layout-generator-out-frame {
  .layout-generator-item-frame {
    position: relative;
    z-index: 30;
  }
}
</style>
