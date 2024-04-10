<script setup lang="ts">
import {ElTree} from "element-plus";
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import DeviceInfo from "@/views/agriculture/deviceinfo/index.vue";

/** 设备信息 列表 */
defineOptions({name: 'DeviceView'})

const loading = ref(true) // 列表的加载中

interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'child',
  label: 'name',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

const categoryTree = ref<ParkInfoVO[]>([]) // 列表的数据
/** 查询基地地块列表 */
const getCategoryList = async () => {
  loading.value = true
  try {
    const queryParams = null
    const data = await ParkInfoApi.getParkTree(queryParams)
    console.log(data)
    categoryTree.value = data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getCategoryList();
})

let currCategory = ref({})
const handleCurrentCategoryChange = (currNodeData) => {
  console.log(currNodeData)
  currCategory.value = currNodeData
}
// 取消选择
const clearCategory = () => {
  treeRef.value.setCurrentKey()
}
const resetTreeSelections = () => {
  clearCategory() // 清空选中的节点
};
</script>

<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col :span="4">
      <ContentWrap>
        <ContentWrap>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            clearable
          />
        </ContentWrap>
        <ContentWrap style="height: 62vh; overflow: auto;">
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
        </ContentWrap>

      </ContentWrap>
    </el-col>

    <el-col :span="20">
      <ContentWrap style="height: 78vh; overflow: auto;">
        <device-info
          :currCategory="currCategory"
          @clear-category="clearCategory"
          @reset="resetTreeSelections"
        />
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>
