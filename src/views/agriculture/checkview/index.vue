<script setup lang="ts">
import {ElTree} from "element-plus";
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import CheckList from "@/views/agriculture/checkview/checklist.vue";

/** 设备信息 列表 */
defineOptions({name: 'CheckView'})

const loading = ref(true) // 列表的加载中

interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children:{
    disabled:true
  },
  label: 'name',
  value: 'id',
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
    categoryTree.value = data
    nextTick(() => {
      if (treeRef.value) {
        treeRef.value.setCurrentKey(categoryTree.value[0].id);
      }
    });
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
//定义是否展开
let isCollapse=ref(true)

</script>

<template>
  <el-row :gutter="24" v-loading="loading">
    <div
      v-if="isCollapse"
      @click="isCollapse = false"
      class="
        flex items-center space-x-1
        text-white relative top-[-.5rem]
        box-border p-3 py-1 text-[.9rem]
        shadow-md bg-#009688
        transition-all cursor-pointer
      "
      style="border-radius: 0 1000px 1000px 0;"
    >
      <div>展开</div>
      <el-icon><DArrowRight /></el-icon>
    </div>
    <el-col :span="isCollapse ? 0 : 4">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo relative"
        :collapse="isCollapse"
      >
        <ContentWrap>
          <div
            class="flex items-center box-border p-3 justify-between rounded-2 mb-2"
            style="border: 1px solid #e1e1e1;"
          >
            <el-input
              v-model="filterText"
              placeholder="输入关键字进行过滤"
              clearable
            />
            <div
              class="
                flex items-center space-x-1
                rounded-2 p-1 w-[3.5rem] text-[.7rem]
                px-2 shadow-sm cursor-pointer
              "
              style="border: 1px solid #e1e1e1;"
              @click="isCollapse = true"
            >
              <el-icon><DArrowLeft /></el-icon>
              <div>收起</div>
            </div>

          </div>
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
      </el-menu>
    </el-col>

    <el-col :span="isCollapse?24:20">
      <ContentWrap style="height: 78vh; overflow: auto;">
        <check-list
          :currCategory="currCategory"
          @clear-category="clearCategory"
        />
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>
