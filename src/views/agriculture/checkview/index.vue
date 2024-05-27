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
let isCollapse=ref(false)

</script>

<template>
  <el-row :gutter="20" v-loading="loading">
    <div v-if="isCollapse" @click="isCollapse=false" class="mt--13px w-30px mb-7px bg-[#fff] flex justify-end pr-15px" style="height: 20px;line-height: 20px; cursor: pointer;border-radius:0 25px 25px 0;text-align: center;"><el-icon style="font-size: 10px;text-align: center; margin-top: 4px;margin-left: -8px;"><DArrowRight /></el-icon></div>
    <el-col :span="isCollapse?0:4">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo relative"
        :collapse="isCollapse"
      >
      <ContentWrap>
        <ContentWrap>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            clearable
          />
          <div class="absolute right-25px top-50px" @click="isCollapse=true" style="cursor: pointer;"><el-icon><DArrowLeft /></el-icon></div>
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
