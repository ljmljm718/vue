//templateCreateOrUpdate
//class="grid 2xl:grid-cols-2 gap-3 p-4"
//class="col-span-2"
<template>
  <div>
    <EditFrame>
      <template #header>
        <div class="flex">
          <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
          >
            保存
          </el-button>
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交
          </el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            @click="resetForm()"
          >清空
          </el-button>
        </div>
      </template>


      <template #content>
        <el-scrollbar class="croll-bar-template">
          <!-- 原内容 -->
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            v-loading="formLoading"
          >
            <!--      <el-form-item label="巡检编号" prop="inspectionNum">-->
            <!--        <el-input v-model="formData.inspectionNum" placeholder="请输入巡检编号"/>-->
            <!--      </el-form-item>-->


            <el-form-item label="设备编号" prop="equNum">
              <!--        <el-input v-model="formData.equNum" placeholder="请输入设备编号" />-->
              <el-input v-model="formData.equNum" readonly>
                <template #append>
                  <el-button @click="openPurchaseOrderInEnableList">
                    <Icon icon="ep:search"/>
                    选择
                  </el-button>
                </template>
              </el-input>
            </el-form-item>

            <el-row :gutter="3">
              <el-col :span="12">
                <el-form-item label="巡检状态" prop="inspectionState">
                  <el-select v-model="formData.inspectionState" placeholder="请选择巡检状态">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.CHECK_STATE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="巡检结果状态" prop="resultState">
                  <el-select v-model="formData.resultState" placeholder="请选择巡检结果状态">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.CHECK_RESULT_STATE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="3">
              <el-col :span="24">
                <el-form-item label="巡检结果" prop="inspectionResults">
                  <el-input type="textarea" v-model="formData.inspectionResults"
                            placeholder="请输入巡检结果"/>
                </el-form-item>
              </el-col>
            </el-row>


            <el-form-item label="所属基地" prop="base">
              <el-input v-model="formData.base" placeholder="请输入所属基地" disabled/>
            </el-form-item>
            <el-form-item :label="getTenantId() === 157 ? '所属鱼塘' : '地块名称'" prop="massif">
              <el-input v-model="formData.massif" placeholder="请输入所属地块/地块" disabled/>
            </el-form-item>
            <el-row :gutter="3">
              <el-col :span="12">
                <el-form-item label="巡检人id" prop="inspectorId">
                  <!--        <el-input v-model="formData.inspector" placeholder="请输入巡检人id"/>-->
                  <el-input v-model="formData.inspectorId" readonly>
                    <template #append>
                      <el-button @click="openUserList">
                        <Icon icon="ep:search"/>
                        选择
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="巡检人" prop="inspector">
                  <el-input v-model="formData.inspector" placeholder="请输入巡检人" disabled/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="巡检时间" prop="inspectionTime">
              <el-date-picker
                v-model="formData.inspectionTime"
                type="datetime"
                value-format="x"
                style="width: 100%;"
                placeholder="选择巡检时间"
              />
            </el-form-item>
            <el-row :gutter="3">
              <el-col :span="8">
                <el-form-item label="巡检影像" prop="inspectionImage">
                  <UploadImg v-model="formData.inspectionImage"/>
                  <!--        <ImageUpload v-model="formData.inspectionImage"/>-->
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="巡检内容" prop="content">
                  <el-input type="textarea" :rows="6" v-model="formData.content"
                            placeholder="请输入巡检内容"/>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <!-- 截至 -->
        </el-scrollbar>
      </template>
    </EditFrame>

  </div>
</template>
<script setup lang="ts">
import {
  EditFrame,
  addOrUpdateFormStorage,
  getFormStorage,
} from '@/components/EditFrame/index'
import {DICT_TYPE, getStrDictOptions} from "@/utils/dict";
import {getTenantId} from "@/utils/auth";
import {CheckLogsApi, CheckLogsVO} from '@/api/agriculture/checklogs'
import {ParkBaseVO} from "@/api/kaizhou/parkbase";

/** 巡检记录 表单 */
defineOptions({name: 'CreateOrUpdateCheckLogsLkh'})
// 本地保存表单
const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '巡检记录'
const ORIGIN_PATH = '/internetMonitor/check/check-logs' // 关闭表单时跳转的路径 路由
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  inspectionNum: undefined,
  inspectionState: undefined,
  inspectionResults: undefined,
  equNum: undefined,
  equName: undefined,
  base: undefined,
  massif: undefined,
  inspectorId: undefined,
  inspector: undefined,
  inspectionTime: undefined,
  inspectionImage: undefined,
  content: undefined,
  resultState: undefined,
  dealTime: undefined,
  dealPerson: undefined,
  dealResult: undefined,
  dealImage: undefined,
})
const formRules = reactive({})
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
      formData.value = await CheckLogsApi.getCheckLogs(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

const purchaseOrderInEnableListRef = ref()
const openPurchaseOrderInEnableList = () => {
  purchaseOrderInEnableListRef.value.open()
}
const handlePurchaseOrderChange = (order: ParkBaseVO) => {
  formData.value.equNum = String(order[0].deviceCode)
  formData.value.equName = String(order[0].deviceName)
  formData.value.base = String(order[0].belongPark)
  formData.value.massif = String(order[0].belongPlot)
}


const userListRef = ref()
const openUserList = () => {
  userListRef.value.open()
}
const handlePurchaseOrderChange2 = (order: ParkBaseVO) => {
  console.log(order)
  formData.value.inspectorId = String(order[0].id)
  formData.value.inspector = String(order[0].nickname)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CheckLogsVO
    if (formType.value === 'create') {
      await CheckLogsApi.createCheckLogs(data)
      message.success(t('common.createSuccess'))
    } else {
      await CheckLogsApi.updateCheckLogs(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    await router.push(ORIGIN_PATH)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    inspectionNum: undefined,
    inspectionState: undefined,
    inspectionResults: undefined,
    equNum: undefined,
    base: undefined,
    massif: undefined,
    inspectorId: undefined,
    inspector: undefined,
    inspectionTime: undefined,
    inspectionImage: undefined,
    content: undefined,
    resultState: undefined,
    dealTime: undefined,
    dealPerson: undefined,
    dealResult: undefined,
    dealImage: undefined,
  }
  formRef.value?.resetFields()
}


//保存到浏览器缓存
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}
//获取浏览器缓存
const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id)
  if (_form) formData.value = _form.formContent
}
if (!formData.value.id) loadData()

//起步函数
const getFrom = async () => {
  resetForm();
  if (route.query.id) {
    formData.value = await CheckLogsApi.getCheckLogs(route.query.id as any);
    loadData(route.query.id);
  }
}

// 方式二 调用立即执行函数
onMounted(async () => {
  await getFrom();
});
// 注意需要在submit最后一行,即faill前面加--router.push(ORIGIN_PATH),即跳转回原地址
// submit后面加入删除缓存
// 将 !formData.value.id

</script>
