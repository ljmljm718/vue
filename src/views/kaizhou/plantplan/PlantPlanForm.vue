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
        <el-input v-model="formData.plantCode" disabled placeholder="系统自动生成...." />
      </el-form-item>
<!--      <el-form-item label="园区id" prop="parkId">-->
<!--        <el-input v-model="formData.parkId" placeholder="请输入园区id" />-->
<!--      </el-form-item>-->
      <el-form-item label="园区名称" prop="parkName">
        <el-input v-model="formData.parkId" v-if="false"  placeholder="请输入园区id" />
        <el-input v-model="formData.parkName" placeholder="请输入园区名称" disabled>
          <template #append>
            <el-button @click="openParkTemplateHelper">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="地块id" prop="plotId">-->
<!--        <el-input v-model="formData.plotId" placeholder="请输入地块id" />-->
<!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="plotName">
        <el-input v-model="formData.plotId" v-if="false"  placeholder="请输入地块id" />
        <el-input v-model="formData.plotName"  placeholder="请输入地块名称" disabled>
          <template #append>
            <el-button @click="openPlotTemplateHelper">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="种植作物品种名称" prop="plantVariety">
        <el-input v-model="formData.cropId" v-if="false" placeholder="请输入作物id" />
        <el-input v-model="formData.plantVariety" disabled placeholder="请输入种植作物品种名称" >
          <template #append>
            <el-button @click="openCropTemplateHelper">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="类别" prop="plantCategory">
        <el-input v-model="formData.plantCategory" placeholder="请输入类别" />
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
      <el-form-item label="面积" prop="area">
        <el-input v-model="formData.area" placeholder="请输入面积" />
      </el-form-item>
      <el-form-item label="负责人" prop="plantPerson">
        <el-input v-model="formData.plantPerson" placeholder="请输入负责人" />
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

  <ParkTemplateHelper ref="parkTemplateHelper" @setParkInfo="setParkInfo"/>
  <CropTemplateHelper ref="cropTemplateHelper" @setCropInfo="setCropInfo"/>
  <PlotTemplateHelper ref="plotTemplateHelper" @setPlotInfo="setPlotInfo"/>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { PlantPlanApi, PlantPlanVO } from '@/api/kaizhou/plantplan'
import ParkTemplateHelper from "@/views/kaizhou/templateHelper/ParkTemplateHelper.vue";
import {ParkBaseVO} from "@/api/kaizhou/parkbase";
import {CropBaseVO} from "@/api/kaizhou/cropbase";

/** 种植计划 表单 */
defineOptions({ name: 'PlantPlanForm' })

const { t } = useI18n() // 国际化
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
  parkName: [{ required: true, message: '园区名称不能为空', trigger: 'blur' }],
  plotName: [{ required: true, message: '地块名称不能为空', trigger: 'blur' }],
  plantVariety: [{ required: true, message: '种植作物品种名称不能为空', trigger: 'blur' }],
  plantCategory: [{ required: true, message: '类别不能为空', trigger: 'blur' }],
  plantStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  area: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
  plantStarttime: [{ required: true, message: '种植开始时间不能为空', trigger: 'blur' }],
  plantEndtime: [{ required: true, message: '种植结束时间不能为空', trigger: 'blur' }],
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
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
const parkTemplateHelper=ref()
const openParkTemplateHelper = async () => {
    parkTemplateHelper.value.open()
}
const cropTemplateHelper=ref()
const openCropTemplateHelper = async () => {
    cropTemplateHelper.value.open()
}
const plotTemplateHelper=ref()
const openPlotTemplateHelper = async () => {
    plotTemplateHelper.value.open()
}
const setPlotInfo = async (order:ParkBaseVO) => {
  formData.value.plotId=String(order[0].code)
  formData.value.plotName=String(order[0].name)
}
const setParkInfo = async (order:order) => {
  formData.value.parkId=String(order[0].code)
  formData.value.parkName=String(order[0].name)
}
const setCropInfo = async (order:CropBaseVO) => {
  formData.value.cropId=String(order[0].cropCode)
  formData.value.plantVariety=String(order[0].cropName)
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
</script>
