<script setup lang="ts">
import {ElTree} from "element-plus";
import {ProjectCategoryApi, ProjectCategoryVO} from "@/api/portal/projectcategory";
import ProjectBase from "@/views/portal/projectbase/index.vue";

/** 项目信息 列表 */
defineOptions({name: 'ProjectInfo'})

const loading = ref(true) // 列表的加载中

interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const categoryTree = ref<ProjectCategoryVO[]>([]) // 列表的数据
/** 查询项目分类列表 */
const getCategoryList = async () => {
  loading.value = true
  try {
    const queryParams = {parentId: 0, status: 1}
    const data = await ProjectCategoryApi.getProjectCategoryTree(queryParams)
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

</script>

<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col :span="4">
      <ContentWrap>
        <ContentWrap>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
          />
        </ContentWrap>
        <ContentWrap style="max-height: 62vh; overflow: auto;">
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
      <ContentWrap style="max-height: 78vh; overflow: auto;">
        <project-base
          :currCategory="currCategory"
          @clear-category="clearCategory"
        />
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>
