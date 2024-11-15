<script setup lang="ts">
import LayoutItem from './components/layoutItem.vue';
import { cloneDeep, uniqueId } from 'lodash-es';
import { layoutGeneratorBus } from './eventBus';
import { isNumber } from '@/utils/is';
import LayoutGeneratorComponentsMap from './components';
import LyCardItem from './components/cardItem.vue';

interface LayoutItemProps {
  id: number;
  title: string;
  rowSpan: number;
  colSpan: number;
  component?: any;
  props?: any;
}
const layoutItemList = ref<LayoutItemProps[]>([]);
const handleUpdateItemList = (id, row, column) => {
  layoutItemList.value = layoutItemList.value.map((item) => {
    if (item.id == id) {
      return { ...item, rowSpan: Number(row), colSpan: Number(column) };
    } else return item;
  });
};

const layoutMainId = 'layoutMain_frame';
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

  const activeItemFullStyle: CSSStyleDeclaration = window.getComputedStyle(activeItemDom, null);
  if (!activeItemFullStyle) return;
  // @ts-ignore
  const activeItemGridColumn = activeItemFullStyle.gridColumn.match(/\d+/g).map(Number)[0];
  // @ts-ignore
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
    layoutGeneratorBus.emit('itemResized', activeLayoutResizeDomID.value);
  }
};

let activePositionChangeX = 0,
  activePositionChangeY = 0;
const handleLayoutItemPositionChange = (item: number) => {
  console.log('🚀 ~ handleLayoutItemPositionChange ~ item:', item);
};

let activePositionChangeFlag = false;
const handleMouseMove = (event) => {
  if (activeLayoutResizeDomID.value) return; // 如果在 resize item 退出
  if (!activeLayoutPositionChangeDomID.value) return; // 如果没有 position change exit
  const positionChangeItem = document.getElementById(activeLayoutPositionChangeDomID.value);
  if (!positionChangeItem) return;
  const { clientX, clientY } = event;
  if (!activePositionChangeFlag) {
    activePositionChangeX = clientX;
    activePositionChangeY = clientY;
    activePositionChangeFlag = true;
    return;
  }
  requestAnimationFrame(() => {
    positionChangeItem.style.zIndex = '99';
    positionChangeItem.style.left = `${clientX - activePositionChangeX}px`;
    positionChangeItem.style.top = `${clientY - activePositionChangeY}px`;
  });
};
onMounted(() => {
  const layoutMainDom = document.getElementById(layoutMainId);
  if (!layoutMainDom) return;
  layoutMainDom.addEventListener('mousemove', handleMouseMove);
});
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

const handleEndPositionChange = (activeDom: HTMLElement) => {
  const activeLeft = activeDom.offsetLeft,
    activeTop = activeDom.offsetTop;
  for (let idx = 0; idx < layoutItemList.value.length; idx++) {
    const item = layoutItemList.value[idx];
    const _domID = `layoutItem_${item.id}`;
    const itemDOM = document.getElementById(_domID);
    if (itemDOM) {
      const itemLeft = itemDOM.offsetLeft,
        itemTop = itemDOM.offsetTop;
      const itemWidth = itemDOM.offsetWidth,
        itemHeight = itemDOM.offsetHeight;
      if (activeLeft > itemLeft && activeTop > itemTop) {
        if (activeLeft < itemLeft + itemWidth && activeTop < itemTop + itemHeight) {
          const parsedArr: LayoutItemProps[] = cloneDeep(layoutItemList.value);
          const arrActiveItem = parsedArr.find(
            (ele) => `layoutItem_${ele.id}` === activeLayoutPositionChangeDomID.value
          );
          const resArr: any[] = [];
          parsedArr
            .filter((ele) => `layoutItem_${ele.id}` !== activeLayoutPositionChangeDomID.value)
            .forEach((ele) => {
              if (ele.id === item.id) resArr.push(arrActiveItem);
              resArr.push(ele);
            });
          layoutItemList.value = resArr;
          break;
        }
      }
    }
  }
};

const activeLayoutResizeDomID = ref<string>('');
const activeLayoutPositionChangeDomID = ref<string>('');
window.addEventListener('mouseup', () => {
  console.log('mouseup');
  if (activeLayoutPositionChangeDomID.value) {
    const _dom = document.getElementById(activeLayoutPositionChangeDomID.value);
    if (_dom) {
      handleEndPositionChange(_dom);
      _dom.style.zIndex = '30';
      _dom.style.left = '0px';
      _dom.style.top = '0px';
    }
  }
  activeLayoutResizeDomID.value = '';
  activeLayoutPositionChangeDomID.value = '';
  tempX.value = 0;
  tempY.value = 0;
  activePositionChangeX = 0;
  activePositionChangeY = 0;
  if (activePositionChangeFlag) {
    activePositionChangeFlag = false;
  }
});
layoutGeneratorBus.on('itemChangeBtnDown', (domId: string) => {
  console.log('🚀 ~ layoutGeneratorBus.on ~ itemChangeBtnDown:', domId);
  activeLayoutResizeDomID.value = domId;
});
layoutGeneratorBus.on('itemChangeBtnUp', (domId: string) => {
  console.log('🚀 ~ layoutGeneratorBus.on ~ itemChangeBtnUp:', domId);
  activeLayoutResizeDomID.value = '';
});

layoutGeneratorBus.on('itemDelete', (domId: string) => {
  layoutItemList.value = layoutItemList.value.filter((ele) => `layoutItem_${ele.id}` !== domId);
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
  rowSpan: 3,
  title: ''
});
const showAddItemDialog = ref<boolean>(false);
const handleAddItem = () => {
  showAddItemDialog.value = true;
};
const handleConfirmAdd = () => {
  const _item = cloneDeep(dialogForm.value);
  layoutItemList.value.push({
    ..._item,
    id: Number(uniqueId()),
    component: LayoutGeneratorComponentsMap.get(_item.component ? _item.component : 'LyTable'),
    props: {
      columns: [
        {
          label: '测hi是',
          prop: 'test'
        },
        {
          label: '测hi是',
          prop: 'test1'
        },
        {
          label: '测hi是',
          prop: 'test2'
        },
        {
          label: '测hi是',
          prop: 'test3'
        },
        {
          label: '测hi是',
          prop: 'test4'
        },
        {
          label: '测hi是',
          prop: 'test5'
        }
      ],
      data: [
        // {
        //   test: 'ssss',
        //   test1: 'ssss',
        //   test2: 'ssss',
        //   test3: 'ssss',
        //   test4: 'ssss',
        // },
      ]
    }
  });
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
        width="300px"
        append-to-body
        destroy-on-close
      >
        <div class="flex">
          <el-form ref="formRef" :model="dialogForm" label-width="90px">
            <el-form-item label="组件类型" prop="rowSpan">
              <el-select v-model="dialogForm.component" placeholder="请选择组件类型">
                <el-option label="表格" value="LyTable" />
                <el-option label="图表" value="LyChart" />
              </el-select>
            </el-form-item>
            <el-form-item label="组件标题" prop="title">
              <el-input v-model="dialogForm.title" placeholder="请输入组件标题" />
            </el-form-item>
            <el-form-item label="占用行数" prop="rowSpan">
              <el-input-number v-model="dialogForm.rowSpan" placeholder="请输入行数" />
            </el-form-item>
            <el-form-item label="占用列数" prop="colSpan">
              <el-input-number v-model="dialogForm.colSpan" placeholder="请输入列数" />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="small" @click="showAddItemDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleConfirmAdd()">确 定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
  <el-scrollbar height="calc(100vh - 165px)">
    <div class="w-full flex justify-center">
      <div
        :id="layoutMainId"
        class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 relative container w-full gap-2 layout-generator-out-frame p-2 box-border"
        style="grid-auto-rows: 30px"
      >
        <div class="absolute right-2 top-2 bg-white shadow-lg z-200 !hidden">
          <div>resize: {{ activeLayoutResizeDomID }}</div>
          <div>position: {{ activeLayoutPositionChangeDomID }}</div>
          <div>初始化位置: x:{{ tempX }} y:{{ tempY }}</div>
        </div>
        <div
          class="grid grid-cols-4 sm:grid-cols-4 box-border md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-16 2xl:grid-cols-20 absolute left-0 top-0 w-full gap-2 p-2"
          :style="`
            grid-auto-rows: 30px;
            z-index: ${activeLayoutResizeDomID ? '120' : '1'}
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
          class="grid grid-cols-4 sm:grid-cols-4 box-border md:grid-cols-8 lg:grid-cols-12 z-0 xl:grid-cols-16 2xl:grid-cols-20 absolute -0 top-0 w-full gap-2 p-2"
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
          <div class="w-full h-full" v-if="item.component">
            <ly-card-item :title="item.title">
              <component :is="item.component" v-bind="item.props" />
            </ly-card-item>
          </div>
        </layout-item>
      </div>
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
