<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属基地" prop="belongPark">
            <el-input v-model="formData.parkName" placeholder="请输入所属基地">
              <template #append>
                <el-button @click="openParkInfoPopup('0')">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属地块" prop="belongPlot">
            <el-input v-model="formData.plotName" placeholder="请输入所属地块">
              <template #append>
                <el-button @click="openParkDetailPopup(formData.belongPark)">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="农事阶段" prop="farmingStage">
            <el-select v-model="formData.farmingStage" placeholder="请选择农事阶段">
              <el-option
                v-for="dict in farmDefineOptions"
                :key="dict.id"
                :label="dict.defineName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投入品名称" prop="feedType">
            <el-select v-model="formData.feedType" placeholder="请选择投入品名称"
                       @change="feedTypeSelect">
              <el-option
                v-for="item in productInfoListALL"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="采购价格" prop="purchasePrice">
            <el-input v-model="formData.purchasePrice" placeholder="选择投入品后自动填入采购价格" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投入品规格" prop="standard">
            <el-input v-model="formData.standard" placeholder="选择投入品后自动填入规格" :disabled="true"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作时间" prop="feedTime">
            <el-date-picker
              v-model="formData.feedTime"
              type="datetime"
              value-format="x"
              placeholder="选择操作时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作人" prop="feedPerson">
            <el-input v-model="formData.feedPerson" placeholder="请输入操作人"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="消耗量" prop="consumeNum">
            <el-input v-model="formData.consumeNum" placeholder="请输入消耗量"
                      @change="consumeNumInput"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消耗量单位" prop="consumeUnit">
            <el-input v-model="formData.consumeUnit" placeholder="请输入消耗量单位"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="投喂量" prop="feedNum" >
            <el-input v-model="formData.feedNum" placeholder="请输入使用量（消耗量*规格）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="投喂量单位" prop="feedOne">
            <el-input v-model="formData.feedOne" placeholder="请输入使用量单位，建议统一输入KG"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="投入品费用/元" prop="feedCost">
        <el-input v-model="formData.feedCost" placeholder="请输入投入品费用(消耗量*采购价格)" :disabled="true"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>

  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>
</template>
<script setup lang="ts">
import {FeedInfoApi, FeedInfoVO} from '@/api/agriculture/feedinfo'
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import {ProductApi} from '@/api/erp/product/product'
import {FarmDefineApi} from "@/api/agriculture/farmdefine";
import { log } from 'console';

/** 投喂记录 表单 */
defineOptions({name: 'FeedInfoForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  crabNum: undefined,
  feedType: undefined,
  feedNum: undefined,
  feedOne: undefined,
  feedTime: undefined,
  feedPerson: undefined,
  farmingStage: undefined,
  consumeNum: undefined,
  consumeUnit: undefined,
  standard: undefined,
  purchasePrice: undefined,
  feedCost: ''
})
const formRules = reactive({
  feedTime: [{required: true, message: '操作时间不能为空', trigger: 'blur'}],
  belongPark: [{required: true, message: '基地选择不能为空', trigger: 'blur'}],
  belongPlot: [{required: true, message: '地块选择不能为空', trigger: 'blur'}],
  crabNum: [{required: true, message: '螃蟹数量不能为空', trigger: 'blur'}],
  farmingStage: [{required: true, message: '农事阶段不能为空', trigger: 'blur'}],
  feedNum: [{required: true, message: '投喂量不能为空', trigger: 'blur'}],
  feedOne: [{required: true, message: '投喂量单位不能为空', trigger: 'blur'}],
  consumeNum: [{required: true, message: '消耗量不能为空', trigger: 'blur'}],
  consumeUnit: [{required: true, message: '消耗量单位不能为空', trigger: 'blur'}],
  feedType: [{required: true, message: '投入品名称不能为空', trigger: 'blur'}]
})
const formRef = ref() // 表单 Ref
let productInfoListALL = ref() //所有投入品列表
let farmDefineOptions = ref([])// 设备分类选项
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  // 获取设备分类树
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({parentId: 0, status: 1});
  productInfoListALL.value = await ProductApi.selectAll()
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FeedInfoApi.getFeedInfo(id)
      farmDefineOptions.value.forEach((item) => {
        if (item.id == formData.value.farmingStage) {
          formData.value.farmingStage = item.id
        }
      })
      productInfoListALL.value.forEach((item) => {
        if (item.id == formData.value.feedType) {
          formData.value.feedType = item.id
          formData.value.standard = item.standard
          formData.value.purchasePrice = item.purchasePrice
          if (!formData.value.consumeUnit) {
            formData.value.consumeUnit = item.unitName
          }
        }
      })
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FeedInfoVO
    if (formType.value === 'create') {
      await FeedInfoApi.createFeedInfo(data)
      message.success(t('common.createSuccess'))
    } else {
      await FeedInfoApi.updateFeedInfo(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    belongPark: undefined,
    parkName: undefined,
    belongPlot: undefined,
    plotName: undefined,
    crabNum: undefined,
    feedType: undefined,
    feedNum: undefined,
    feedOne: undefined,
    feedTime: undefined,
    feedPerson: undefined,
    farmingStage: undefined,
    consumeNum: undefined,
    consumeUnit: undefined,
    standard: undefined,
    purchasePrice: undefined,
    feedCost: ''
  }
  formRef.value?.resetFields()
}

//基地的选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择基地")
  } else parkInfoPopupRef.value.open(id)
}
const handleParkInfoPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    formData.value.belongPark = String(order[0].code)
    formData.value.parkName = String(order[0].name)
  } else formData.value.belongPlot = String(order[0].id)
}

//地块的选择
const parkDetailPopupRef = ref()
const openType1 = ref('')
const openParkDetailPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error("请选择基地")
  } else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.plotName = String(order[0].name)
}
const feedTypeSelect = (feedType) => {
  productInfoListALL.value.forEach((item) => {
    if (item.id == formData.value.feedType) {
      formData.value.feedType = item.id
      formData.value.standard = item.standard
      formData.value.purchasePrice = item.purchasePrice
      formData.value.consumeUnit = item.unitName
      formData.value.feedOne = 'KG'
      formData.value.consumeNum = null
      // formData.value.consumeUnit = item.unitName
      // formData.value.feedOne = item.unitName
    }
  })
}

const consumeNumInput = async (consumeNum) => {
  // 使用正则表达式仅获取数字
  if(formData.value.standard && formData.value.purchasePrice){
    let standards = formData.value.standard.match(/^\d+/)[0];
    // console.log(standards,"standards=======");
    // console.log(consumeNum * standards,"consumeNum * standards=======");
    // console.log(consumeNum *  formData.value.purchasePrice,"consumeNum *  formData.value.purchasePrice=======");
    formData.value.feedNum = consumeNum * standards
    formData.value.feedCost =  consumeNum *  formData.value.purchasePrice
  }
}
</script>
