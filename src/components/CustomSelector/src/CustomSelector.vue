<script setup lang="ts">
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo/index';

defineOptions({ name: 'CustomSelector' });
const collapsed = ref<boolean>(false);
const props = defineProps({
  menuTitle: {
    type: String,
    default: () => ''
  },
  menuType: {
    type: String, // "default"使用menuList， "plot"使用地块
    default: () => 'default'
  },
  menuList: {
    type: Array<any>,
    default: () => []
  }
});

const basePlotDataList = ref<ParkInfoVO[]>([]);
const getBasePlotDataList = async () => {
  const data = await ParkInfoApi.getParkTree({});
  console.log('🚀 ~ getBasePlotDataList ~ data:', data);
  if (Array.isArray(data))
    basePlotDataList.value = data.map((item) => ({ ...item, children: item.child }));
};
if (props.menuType === 'plot') getBasePlotDataList();

const showedMenuList = computed(() => {
  if (props.menuType === 'default') return props.menuList;
  if (props.menuType === 'plot') return basePlotDataList.value;
});

const emit = defineEmits(['change', 'join', 'leave']);
const handleSelect = (e) => {
  emit('change', e);
};
const handleJoinArea = (id) => {
  emit('join', id);
};
const handleLeaveArea = (id) => {
  emit('leave', id);
};
</script>
<template>
  <div
    class="custom-selector-wrapper w-full bg-white dark:bg-#1d1e1f text-[#666] dark:text-#ccc rounded-[6px] text-[14px] flex relative"
  >
    <div
      class="collapse-btn absolute left-[267px] top-[16px] z-999"
      :style="`left: ${collapsed ? '-8px' : '267px'};transform: rotate(${collapsed ? '180deg' : '0'});`"
      @click="collapsed = !collapsed"
    ></div>
    <div
      class="w-280px flex flex-col p-18px pr-8px box-border relative z-20"
      :style="`display: ${collapsed ? 'none' : 'block'}`"
    >
      <div class="pb-14px h-18px mr-10px font-bold" style="border-bottom: 1px solid #ccc">
        {{ props.menuTitle }}
      </div>
      <div style="height: calc(100% - 19px)">
        <el-scrollbar style="height: 100%">
          <div class="pr-10px py-6px">
            <el-menu @select="handleSelect">
              <el-sub-menu
                :index="firstItem.id"
                :key="firstItem.id"
                v-for="firstItem in showedMenuList"
              >
                <template #title>
                  <div class="flex space-x-2 items-center">
                    <el-icon><Folder /></el-icon>
                    <div class="text-[14px] font-bold">{{ firstItem.name }}</div>
                  </div>
                </template>
                <el-menu-item
                  :index="secondItem.id"
                  :key="secondItem.id"
                  v-for="secondItem in firstItem.children"
                >
                  <template #title>
                    <div class="flex space-x-2 items-center">
                      <el-icon><DocumentCopy /></el-icon>
                      <div class="text-[14px]">{{ secondItem.name }}</div>
                      <el-button
                        type="primary"
                        plain
                        @click="handleJoinArea(secondItem.id)"
                        v-if="firstItem.name === '未分配灌区'"
                      >
                        加入灌区
                      </el-button>
                      <el-button
                        type="primary"
                        plain
                        @click="handleLeaveArea(secondItem.id)"
                        v-else
                      >
                        移出灌区
                      </el-button>
                    </div>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </el-menu>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div
      :style="`
        width: ${collapsed ? '100%' : 'calc(100% - 280px)'};
        border-radius: ${collapsed ? '6px 6px 6px 6px' : '0 6px 6px 0'};
      `"
      class="bg-[#275021] relative z-0 overflow-hidden"
    >
      <slot></slot>
    </div>
  </div>
</template>
<style scoped lang="scss">
.custom-selector-wrapper {
  height: calc(100vh - 102px);
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item.is-active) {
  background-color: #00968830;
  border-radius: 6px;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #009688;
}

.collapse-btn {
  background-image: url(./collapse.png);
  width: 26px;
  height: 26px;
  background-size: contain;
}
</style>
