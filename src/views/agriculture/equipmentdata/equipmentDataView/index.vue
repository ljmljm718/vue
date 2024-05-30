<script setup lang="ts">
import {ElTree} from "element-plus";
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import DeviceInfo from "@/views/agriculture/equipmentdata/index.vue"
import {useRoute} from 'vue-router'
let route=useRoute()
/** 设备信息 列表 */
defineOptions({name: 'DeviceView'})
console.log(route.query.collectionType,'router')

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
  console.log(currNodeData,"-------------");
  currCategory.value = currNodeData

}
// 取消选择
const clearCategory = () => {
  treeRef.value.setCurrentKey()
}
const resetTreeSelections = () => {
  clearCategory() // 清空选中的节点
};
 let isCollapse=ref(false)

</script>

<template>
  <el-row :gutter="20" v-loading="loading">
    <div v-if="isCollapse" @click="isCollapse=false" class="mt--13px w-30px mb-7px flex justify-end pr-15px" style="height: 20px;line-height: 20px; cursor: pointer;border-radius:0 25px 25px 0;text-align: center;"><el-icon style="font-size: 10px;text-align: center; margin-top: 4px;margin-left: -8px;"><DArrowRight /></el-icon></div>
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
        <DeviceInfo
          :currCategory="currCategory"
          @clear-category="clearCategory"
          @reset="resetTreeSelections"
          @updataChange='updataChange'
          :collectionType='route.query'
        />
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>
