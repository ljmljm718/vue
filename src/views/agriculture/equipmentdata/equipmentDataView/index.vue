<script setup lang="ts">
import { ElTree } from 'element-plus'
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo'
import { EquipmentDataApi, EquipmentDataVO } from '@/api/agriculture/equipmentdata'
import DeviceInfo from '@/views/agriculture/equipmentdata/index.vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import img from '../../../../assets/imgs/retract.png'
import img2 from '../../../../assets/imgs/expand.png'
let route = useRoute()
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
const isCollapse = ref(false)

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
watch(isCollapse, (val) => {
  if(!val){
    outputFous.value=''
    filterText2.value=''
  }
  })

/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  console.log(data,'datadata')
  return data.name.includes(value)
}
//清空树节点
const clearTree = () => {
  clearCategory()
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
  getCategoryList()
})

let currCategory = ref({})
const handleCurrentCategoryChange = (currNodeData) => {
  console.log(currNodeData, '-------------')
  currCategory.value = currNodeData
}
// 取消选择
const clearCategory = () => {
  treeRef.value.setCurrentKey()
}
const resetTreeSelections = () => {
  clearCategory() // 清空选中的节点
}
//自动聚焦
const inputFous=ref()
const outputFous=ref('')
const filterText2=ref('')
const focusInput=(e)=>{
  if(e){
    isCollapse.value=false
    filterText.value=e
  }
}
const inputFoucs=()=>{
  
}
</script>

<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col :span="isCollapse ? 0 : 4" class="relative h-800px">
      <el-menu default-active="2" class="el-menu-vertical-demo h-100%" :collapse="isCollapse">
        <ContentWrap>
          <ContentWrap>
            <el-input v-model="filterText" @focus="inputFoucs" ref='inputFous' placeholder="搜索基地"  clearable />
          </ContentWrap>
          <ContentWrap style="height: 62vh; overflow: auto">
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
        <div
        @click="isCollapse = true"
        class=" mx-auto flex -mt-96px  items-center justify-center w-145px h-35px rounded bg-[#e5f4f3] color-[#38aca1]"
        style="cursor: pointer; "
      >
        <img :src="img" class="w-12px h-7px mr-10px" /> 收起</div
      >
      </el-menu>
      
    </el-col>
    <div v-show="isCollapse" class="flex h-50px !w-[98.5%] m-auto bg-[#fff] rounded mb-15px">
      <el-input
        v-model="filterText2"
        placeholder="搜索基地"
        :prefix-icon="Search"
        class="pl-[10px] searchTop"
        @input="focusInput"
      />
      <div
        @click="isCollapse = false"
        style="cursor: pointer"
        class="flex w-80px color-[#5abbb2] items-center justify-center"
      >
        <img :src="img2" class="w-12px h-7px mr-10px" />
        展开
      </div>
    </div>
    <el-col :span="isCollapse ? 24 : 20">
      <ContentWrap style="height: 78vh; overflow: auto">
        <DeviceInfo
          :isCollapse="isCollapse"
          :currCategory="currCategory"
          @clear-category="clearCategory"
          @reset="resetTreeSelections"
          @updataChange="updataChange"
          :collectionType="route.query"
          @clearTree="clearTree"
        />
      </ContentWrap>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.searchTop {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: default;
    .el-input__inner {
      cursor: default !important;
    }
  }
}

// 选中当前node的样式
::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  // background: pink !important;
  background-image: url('../../../../assets/imgs/treeActive.png') !important;
  background-size:100% 100%  !important;
}
</style>
