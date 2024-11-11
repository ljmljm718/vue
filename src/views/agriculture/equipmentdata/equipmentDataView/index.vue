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

// 根据右侧高度设置左侧菜单的高度
const treeHeight = ref(1);
const setLeftHeight = (height: number) => {
  treeHeight.value = height - 80;
}

</script>

<template>
  <div class="w-full flex relative">
    <!-- 左侧 -->
    <div
      :class="`
        w-[330px] pl-[20px] bg-white mb-[15px] border border-solid border-[#e4e7ed]
        ${isCollapse ? 'slide-from-right-to-left' : 'slide-from-left-to-right'}
      `"
    >
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo relative"
        :collapse="isCollapse"
      >
        <div class="w-[220px] h-80px flex justify-start items-center">
          <el-input
            class="!w-[220px] h-30px rounded"
            v-model="filterText"
            @focus="inputFoucs"
            ref='inputFous'
            placeholder="搜索基地"
            clearable
          />
        </div>
        <el-scrollbar :height="treeHeight">
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
      </el-menu>
    </div>

    <!-- 右侧 -->
    <div
      :class="`
        grid relative grow w-[calc(100%-350px)]
        ${ isCollapse ? 'content-grow' : 'content-shrink'}
      `"
    >
      <!-- 展开收起侧边面板按钮 -->
      <div
        @click="isCollapse = !isCollapse"
        :class="`
          h-[25px] w-[25px] rounded-full shadow-md bg-white
          cursor-pointer flex items-center justify-center text-[14px]
          absolute top-[30px] left-[0px] translate-x-[-12.5px]
        `"
        :style="{
          color: 'var(--el-color-primary)',
          border: '1px solid var(--el-color-primary)',
        }"
      >
        <el-icon v-show="!isCollapse"><ArrowLeftBold /></el-icon>
        <el-icon v-show="isCollapse"><ArrowRightBold /></el-icon>
      </div>

      <!-- 内容 需要想办法获取元素高度来设置左侧高度 -->
      <ContentWrap>
        <DeviceInfo
          :isCollapse="isCollapse"
          :currCategory="currCategory"
          @clear-category="clearCategory"
          @reset="resetTreeSelections"
          :collectionType="route.query"
          @clearTree="clearTree"
          @heightChange="setLeftHeight"
        />
      </ContentWrap>
    </div>
  </div>
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
:deep(.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content) {
  // background: pink !important;
  background-image: url('../../../../assets/imgs/treeActive.png') !important;
  background-size:100% 100%  !important;
}

@keyframes slide-from-left-to-right {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-from-left-to-right {
  animation: slide-from-left-to-right 0.1s ease-out forwards;
}

@keyframes slide-from-right-to-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.slide-from-right-to-left {
  animation: slide-from-right-to-left 0.1s ease-in forwards;
}

@keyframes content-grow {
  from {
    margin-left: 0;
  }
  to {
    margin-left: -350px;
  }
}

.content-grow {
  animation: content-grow 0.1s ease-out forwards;
}

@keyframes content-shrink {
  from {
    margin-left: -350px;
  }
  to {
    margin-left: 0;
  }
}

.content-shrink {
  animation: content-shrink 0.1s ease-out forwards;
}
</style>
