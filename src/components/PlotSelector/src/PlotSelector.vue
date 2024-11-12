<template>
  <div class="relative z-20 h-full">
    <div
      @click="handleCollapse()"
      :class="`
        h-[25px] w-[25px] rounded-full shadow-md bg-white
        cursor-pointer flex items-center justify-center text-[14px]
        absolute top-[30px] right-[-25px] translate-x-[-12.5px]
      `"
      :style="{
        color: 'var(--el-color-primary)',
        border: '1px solid var(--el-color-primary)',
      }"
    >
      <el-icon v-show="!isCollapse"><ArrowLeftBold /></el-icon>
      <el-icon v-show="isCollapse"><ArrowRightBold /></el-icon>
    </div>
    <el-card
      class="h-full w-240px"
      v-show="!isCollapse"
    >
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        clearable
        class="mb-3"
      />
      <el-scrollbar height="100%">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          class="filter-tree"
          :data="categoryTree"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          highlight-current
          node-key="id"
          :expand-on-click-node="false"
          @current-change="handleCurrentCategoryChange"
        />
      </el-scrollbar>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
defineOptions({ name: 'PlotSelector' })

const emit = defineEmits(['current-change', 'collapse'])

const isCollapse = ref<boolean>(false)
const handleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  emit('collapse', isCollapse.value)
}

const handleCurrentCategoryChange = (e) => {
  emit('current-change', e)
}

const filterText = ref<string>('')
const treeRef = ref()
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

const defaultProps = { children: 'child', label: 'name' }
const categoryTree = ref<ParkInfoVO[]>([]) // 列表的数据
/** 查询基地地块列表 */
const getCategoryList = async () => {
  const data = await ParkInfoApi.getParkTree({})
  if (Array.isArray(data)) categoryTree.value = data
}
getCategoryList()

const clearCategory = () => {
  treeRef.value.setCurrentKey()
}

defineExpose({ clearCategory })
</script>