<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="所属基地" prop="belongPark">-->
      <!--        <el-input v-model="formData.belongPark" placeholder="请输入所属基地" />-->
      <!--      </el-form-item>-->
      <el-form-item label="所属基地" prop="belongPark">
        <el-input v-model="formData.belongPark" placeholder="请输入所属基地">
          <template #append>
            <el-button @click="openParkInfoPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
        <!--                <el-input v-model="formData.belongPark" placeholder="请输入所属园区" />-->
      </el-form-item>
      <!--      <el-form-item label="基地名称" prop="parkName">-->
      <!--        <el-input v-model="formData.parkName" placeholder="请输入基地名称" />-->
      <!--      </el-form-item>-->
      <el-form-item label="基地名称" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="选择基地后自动写入" readonly disabled/>
      </el-form-item>
      <!--      <el-form-item label="所属地块" prop="belongPlot">-->
      <!--        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="所属地块" prop="belongPlot">
        <el-input v-model="formData.belongPlot" placeholder="请输入所属地块">
          <template #append>
            <el-button @click="openParkDetailPopup(formData.belongPark)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="选择地块后自动写入" readonly disabled/>
      </el-form-item>
      <!--      <el-form-item label="地块名称" prop="plotName">-->
      <!--        <el-input v-model="formData.plotName" placeholder="请输入地块名称"/>-->
      <!--      </el-form-item>-->
      <el-form-item label="螃蟹数量" prop="crabNum">
        <el-input v-model="formData.crabNum" placeholder="请输入螃蟹数量"/>
      </el-form-item>
      <el-form-item label="农事阶段" prop="farmingStage">
        <!--            <el-input v-model="formData.farmDefineType" placeholder="请输入农事阶段" />-->
        <el-select v-model="formData.farmingStage" placeholder="请选择农事阶段">
          <el-option
            v-for="dict in farmDefineOptions"
            :key="dict.id"
            :label="dict.defineName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投入品名称" prop="feedType">
        <!--        <el-input v-model="formData.feedType" placeholder="请填写饲料种类"/>-->
        <!--        <el-select v-model="formData.feedType" placeholder="请选择饲料种类">-->
        <!--          <el-option label="请选择字典生成" value=""/>-->
        <!--        </el-select>-->
        <el-select v-model="formData.feedType" placeholder="请选择投入品名称">
          <el-option
            v-for="item in productInfoListALL"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="投喂时间" prop="feedTime">
        <el-date-picker
          v-model="formData.feedTime"
          type="datetime"
          value-format="x"
          placeholder="选择投喂时间"
        />
      </el-form-item>
      <el-form-item label="操作人" prop="feedPerson">
        <el-input v-model="formData.feedPerson" placeholder="请输入操作人"/>
      </el-form-item>
      <el-form-item label="投喂数量" prop="feedNum">
        <el-input v-model="formData.feedNum" placeholder="请输入投喂数量"/>
      </el-form-item>
      <el-form-item label="单位" prop="feedOne">
        <el-input v-model="formData.feedOne" placeholder="请输入投喂数量单位，建议统一输入KG"/>
      </el-form-item>
      <el-form-item label="投入品费用/元" prop="feedCost">
        <el-input v-model="formData.feedCost" placeholder="请输入投入品费用"/>
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
  feedCost: undefined
})
const formRules = reactive({
  feedTime: [{required: true, message: '投喂时间不能为空', trigger: 'blur'}],
  belongPark: [{required: true, message: '基地选择不能为空', trigger: 'blur'}],
  belongPlot: [{required: true, message: '地块选择不能为空', trigger: 'blur'}],
  crabNum: [{required: true, message: '螃蟹数量不能为空', trigger: 'blur'}],
  feedNum: [{required: true, message: '投喂数量不能为空', trigger: 'blur'}],
  feedOne: [{required: true, message: '投喂单位不能为空', trigger: 'blur'}],
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
  console.log(productInfoListALL.value)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await FeedInfoApi.getFeedInfo(id)
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
    feedTime: undefined
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
</script>
