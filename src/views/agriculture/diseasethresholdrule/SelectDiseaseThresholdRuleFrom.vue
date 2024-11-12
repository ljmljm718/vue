<template>
  <Dialog title="设备列表" v-model="dialogVisible" :appendToBody="true" :scroll="true" width="1400">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
      >
        <el-form-item label="农作物" prop="breedId">
          <el-select
            v-model="queryParams.breedId"
            placeholder="请选择农作物"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="item in listCategoryManagement"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="虫害种类" prop="diseaseType">
          <el-select v-model="queryParams.diseaseType" clearable placeholder="请选择病虫害种类"
                     class="!w-240px">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
              :key="dict.label"
              :label="dict.label"
              :value="dict.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="病虫害等级" prop="reservedOne">
          <el-input
            v-model="queryParams.reservedOne"
            placeholder="请输入病虫害等级"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        ref="suibian"
        :show-overflow-tooltip="true"
        @select="fangfa"
        scrollbar-always-on='false'
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed width="30" label="选择" type="selection"/>
        <el-table-column label="农作物" align="center" prop="reservedTwo"/>
        <el-table-column label="虫害种类" align="center" prop="diseaseType"/>
        <el-table-column label="监测周期" align="center" prop="monitorPeriod"/>
        <el-table-column label="阈值下限" align="center" prop="warnLowValue"/>
        <el-table-column label="阈值上限" align="center" prop="warnHighValue"/>
        <el-table-column label="单位" align="center" prop="warnUnit"/>
        <el-table-column label="病虫害等级" align="center" prop="reservedOne"/>
        <el-table-column label="预警信息" align="center" prop="lowMsg"/>
        <!--      <el-table-column label="品种名称" align="center" prop="cropName"/>-->
        <!--      <el-table-column label="病虫害Id" align="center" prop="diseaseId"/>-->
        <!--      <el-table-column label="监测类型" align="center" prop="warnType"/>-->
        <!--      <el-table-column label="预留2" align="center" prop="reservedTwo"/>-->
        <!--      <el-table-column label="预留3" align="center" prop="reservedThree"/>-->
        <!--      <el-table-column label="预留4" align="center" prop="reservedFour"/>-->
        <!--      <el-table-column label="预留5" align="center" prop="reservedFive"/>-->
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button :disabled="!selectionList.length" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="clear()">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE, getIntDictOptions} from '@/utils/dict'
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {DeviceInfoApi, DeviceInfoVO} from '@/api/agriculture/deviceinfo'
import DeviceInfoForm from './DeviceInfoForm.vue'
import {DeviceCategoryApi} from '@/api/agriculture/devicecategory'
import {defaultProps} from '@/utils/tree'
import {
  DiseaseThresholdRuleApi,
  DiseaseThresholdRuleVO
} from "@/api/agriculture/diseasethresholdrule";
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

/** 设备信息 列表 */
defineOptions({name: 'DiseaseThresholdRule'})
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
let categoryOptions = ref([]) // 设备分类选项
const deviceType = ref()
const loading = ref(true) // 列表的加载中
const list = ref<DiseaseThresholdRuleVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnType: undefined,
  breedId: undefined,
  cropName: undefined,
  diseaseType: undefined,
  diseaseId: undefined,
  warnLowValue: undefined,
  warnHighValue: undefined,
  warnUnit: undefined,
  lowMsg: undefined,
  monitorPeriod: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  reservedFive: undefined,
  remark: undefined,
  createTime: []
})


//开始

let suibian = ref(null)
const fangfa = (select: any, row: any) => {
  if (select.length > 1) {
    let del_row = select.shift()
    suibian.value.toggleRowSelection(del_row, false)
  }
}

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    resetQuery()
    dialogVisible.value = false
  }
})
const clear = async () => {
  dialogVisible.value = false
  resetQuery()
}

/** 选中操作 */
const dialogVisible = ref(false) // 弹窗的是否展示
const selectionList = ref<DiseaseThresholdRuleVO[]>([])
const handleSelectionChange = (rows: DeviceInfoVO[]) => {
  selectionList.value = rows
}

/** 提交选择 */
const emits = defineEmits<{
  (e: 'success', value: DiseaseThresholdRuleVO[]): void
}>()
const submitForm = () => {
  try {
    emits('success', selectionList.value)
  } finally {
    // 关闭弹窗
    dialogVisible.value = false
  }
}
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const getType = async () => {
  listCategoryManagement.value = await allDataCacheManager.getData({})
}
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  Object.keys(queryParams).forEach(key => {
    queryParams[key] = undefined;
  });
  await resetQuery()
  // console.log("id:" + id)
  await nextTick() // 等待，避免 queryFormRef 为空
  // 加载下属地块列表
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

//结束

// 定义属性
const props = defineProps({
  currCategory: {
    type: Object,
    default: () => ({})
  },
  deviceTypeA: {
    type: String,
    default: ''
  }
})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DiseaseThresholdRuleApi.getDiseaseThresholdRulePage(queryParams)
    list.value = data.list
    //把品类数据的namep拼接到列表中
    list.value.forEach(item => {
      listCategoryManagement.value.forEach(itm => {
        if (item.breedId == itm.id)
          item.reservedTwo = itm.categoryName
      })
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  Object.keys(queryParams).forEach(key => {
    queryParams[key] = undefined;
  });
  deviceType.value = null
  handleQuery()
}
/**
 * 设备分类级联选择器
 */
const categoryProps = {
  value: 'id',
  label: 'categoryName'
}

/** 初始化 **/
onMounted(async () => {
  await getType()
  await getList()
})

// 监听父组件category变化
watch(
  () => props.currCategory,
  () => {
    if (props.currCategory) {
      if (props.currCategory.parentId === 0) {
        queryParams.deviceType = props.currCategory.id
      } else {
        queryParams.deviceType = props.currCategory.parentId + ',' + props.currCategory.id
      }
    } else {
      queryParams.deviceType = undefined
    }
    handleQuery()
  }
)
</script>
<style lang='scss' scoped>
</style>
