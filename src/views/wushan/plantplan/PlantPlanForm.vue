<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <el-form-item label="计划编码" prop="plantCode">
        <el-input v-model="formData.plantCode" disabled placeholder="系统自动生成...."/>
      </el-form-item>
      <!--      <el-form-item label="园区id" prop="parkId">-->
      <!--        <el-input v-model="formData.parkId" placeholder="请输入园区id" />-->
      <!--      </el-form-item>-->


      <el-form-item label="种植作物品种名称" prop="plantVariety">
        <!--        <el-input v-model="formData.plantVariety" placeholder="请输入种植作物品种名称" />-->
        <el-input v-model="formData.plantVariety" placeholder="请输入种植作物品种名称" :disabled="true">
          <template #append>
            <el-button @click="openPurchaseOrderInEnableList">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="所属园区" prop="parkName">
        <el-input v-model="formData.parkName" placeholder="请输入园区名称" :disabled="true"/>
      </el-form-item>
      <!--      <el-form-item label="地块id" prop="plotId">-->
      <!--        <el-input v-model="formData.plotId" placeholder="请输入地块id" />-->
      <!--      </el-form-item>-->
      <el-form-item label="所属地块" prop="plotName">
        <el-input v-model="formData.plotName" placeholder="请输入地块名称" :disabled="true"/>
      </el-form-item>
      <el-form-item label="类别" prop="plantCategory">
        <!--        <el-input v-model="formData.plantCategory" placeholder="请输入类别" :disabled="true"/>-->
        <el-select v-model="formData.plantCategory" placeholder="请选择类别" style="width: 100%;"
                   :disabled="true">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WUSHAN_CROP_CULTIVARS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="plantStatus">
        <el-radio-group v-model="formData.plantStatus">
          <el-radio
            v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="面积/亩" prop="area">
        <el-input v-model="formData.area" placeholder="请输入面积"/>
      </el-form-item>
      <el-form-item label="负责人" prop="plantPerson">
        <el-input v-model="formData.plantPerson" placeholder="请输入负责人"/>
      </el-form-item>
      <el-form-item label="种植开始时间" prop="plantStarttime">
        <el-date-picker
          v-model="formData.plantStarttime"
          type="datetime"
          value-format="x"
          placeholder="选择种植开始时间"
        />
      </el-form-item>
      <el-form-item label="种植结束时间" prop="plantEndtime">
        <el-date-picker
          v-model="formData.plantEndtime"
          type="datetime"
          value-format="x"
          placeholder="选择种植结束时间"
        />
      </el-form-item>
      <!--      <el-form-item label="作物id" prop="cropId">-->
      <!--        <el-input v-model="formData.cropId" placeholder="请输入作物id" />-->
      <!--      </el-form-item>-->

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <SelectCropBaseList ref="purchaseOrderInEnableListRef"
                      @success="handlePurchaseOrderChange"/>
</template>
<script setup lang="ts">
import {getStrDictOptions, DICT_TYPE} from '@/utils/dict'
import {PlantPlanApi, PlantPlanVO} from '@/api/kaizhou/plantplan'
import SelectCropBaseList from '@/views/wushan/cropbase/SelectCropbaseList.vue'

/** 种植计划 表单 */
defineOptions({name: 'PlantPlanForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parkId: '1',
  parkName: undefined,
  plotId: '1',
  plotName: undefined,
  plantVariety: undefined,
  plantCategory: undefined,
  plantStatus: undefined,
  area: undefined,
  plantPerson: undefined,
  plantStarttime: undefined,
  plantEndtime: undefined,
  cropId: '1',
  plantCode: undefined,
})
const formRules = reactive({
  parkName: [{required: true, message: '园区名称不能为空', trigger: 'blur'}],
  plotName: [{required: true, message: '地块名称不能为空', trigger: 'blur'}],
  plantVariety: [{required: true, message: '种植作物品种名称不能为空', trigger: 'blur'}],
  plantCategory: [{required: true, message: '类别不能为空', trigger: 'blur'}],
  plantStatus: [{required: true, message: '状态不能为空', trigger: 'blur'}],
  area: [{required: true, message: '面积不能为空', trigger: 'blur'}],
  plantStarttime: [{required: true, message: '种植开始时间不能为空', trigger: 'blur'}],
  plantEndtime: [{required: true, message: '种植结束时间不能为空', trigger: 'blur'}],
  // cropId: [{ required: true, message: '作物id不能为空', trigger: 'blur' }],
  // plantCode: [{ required: true, message: '计划编码不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PlantPlanApi.getPlantPlan(id)
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
    const data = formData.value as unknown as PlantPlanVO
    if (formType.value === 'create') {
      await PlantPlanApi.createPlantPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlantPlanApi.updatePlantPlan(data)
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
    parkId: undefined,
    parkName: undefined,
    plotId: undefined,
    plotName: undefined,
    plantVariety: undefined,
    plantCategory: undefined,
    plantStatus: undefined,
    area: undefined,
    plantPerson: undefined,
    plantStarttime: undefined,
    plantEndtime: undefined,
    cropId: undefined,
    plantCode: undefined,
  }
  formRef.value?.resetFields()
}

/** 新加方法 */
const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}

const handlePurchaseOrderChange = (order: PlantPlanVO) => {
  // 将订单设置到入库单
  console.log("--->>查看查到的农资信息", order)
  //作物ID赋值
  formData.value.cropId = String(order[0].id)
  //作物名称赋值
  formData.value.plantVariety = String(order[0].cropName)
  // parkId: string // 园区id
  formData.value.parkId = String(order[0].belongPark)
  // 园区名称
  formData.value.parkName = String(order[0].belongPark)
  // 地块id
  formData.value.plotId = String(order[0].belongPlot)
  // 地块名称
  formData.value.plotName = String(order[0].belongPlot)
  formData.value.plantCategory = String(order[0].cropType)
}
</script>
