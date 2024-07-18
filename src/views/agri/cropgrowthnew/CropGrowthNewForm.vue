<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!--      <el-form-item label="编号" prop="cropCode">-->
      <!--        <el-input v-model="formData.cropCode" placeholder="请输入编号" />-->
      <!--      </el-form-item>-->
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="品种名称" prop="cropName">
            <el-input v-model="formData.cropName" readonly placeholder="请选择品种名称">
              <template #append>
                <el-button @click="openCropInfoPopup()">
                  <Icon icon="ep:search"/>
                  选择
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品种编号" prop="cropCode">
            <el-input v-model="formData.cropCode" placeholder="选择品种自动输入品种编号" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="品类名称" prop="cropType">
            <el-input v-model="formData.cropType" readonly placeholder="选择品种自动输入品类名称"
                      disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品类编号" prop="cropId">
            <el-input v-model="formData.cropId" placeholder="选择品种自动输入品类编号" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="生长期" prop="growth">
            <el-input v-model="formData.growth" placeholder="请输入生长期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="周期（/天）" prop="cycle">
            <el-input v-model="formData.cycle" placeholder="请输入周期"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="环境条件" prop="envCondition">
            <el-input v-model="formData.envCondition" type="textarea" placeholder="请选择环境条件"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特点" prop="feature">
            <el-input v-model="formData.feature" type="textarea" placeholder="请输入特点"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="date"
              value-format="x"
              placeholder="选择开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="date"
              value-format="x"
              placeholder="选择结束时间"
            />
          </el-form-item>

        </el-col>
      </el-row>
      <el-form-item label="生长地点" prop="growSite">
        <el-input v-model="formData.growSite" placeholder="请输入生长地点"/>
      </el-form-item>

      <el-form-item label="图片" prop="imgId">
        <UploadImg v-model="formData.imgId"/>
      </el-form-item>






    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <SelectVarietyManagement ref="cropInfoPopupRef" @success="selectVarietyManagement"/>

</template>
<script setup lang="ts">
import {CropGrowthNewApi, CropGrowthNewVO} from '@/api/agri/cropgrowthnew'
import SelectVarietyManagement
  from "@/views/agriculture/varietymanagement/SelectVarirtManagement.vue";
import {VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";

/** 作物生长周期 表单 */
defineOptions({name: 'CropGrowthNewForm'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  cropCode: undefined,
  cropName: undefined,
  cropType: undefined,
  imgId: undefined,
  growth: undefined,
  feature: undefined,
  remark: undefined,
  startTime: undefined,
  endTime: undefined,
  cropId: undefined,
  envCondition: undefined,
  growSite: undefined,
  cycle: undefined,
})
const formRules = reactive({
  cropName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref


//作物的选择
const cropInfoPopupRef = ref()
const openCropInfoPopup = () => {
  cropInfoPopupRef.value.open()
}
const selectVarietyManagement = (order: VarietyManagementVO) => {

  console.log("--->>查看选择的品类信息：", order[0])
  formData.value.cropCode = String(order[0].id)
  formData.value.cropName = String(order[0].varietyName)
  formData.value.cropType = String(order[0].categoryName)
  formData.value.cropId = String(order[0].categoryId)

}

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
      formData.value = await CropGrowthNewApi.getCropGrowthNew(id)
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
    const data = formData.value as unknown as CropGrowthNewVO
    if (formType.value === 'create') {
      await CropGrowthNewApi.createCropGrowthNew(data)
      message.success(t('common.createSuccess'))
    } else {
      await CropGrowthNewApi.updateCropGrowthNew(data)
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
    cropCode: undefined,
    cropName: undefined,
    cropType: undefined,
    imgId: undefined,
    growth: undefined,
    feature: undefined,
    remark: undefined,
    startTime: undefined,
    endTime: undefined,
    cropId: undefined,
    envCondition: undefined,
    growSite: undefined,
    cycle: undefined,
  }
  formRef.value?.resetFields()
}
</script>
