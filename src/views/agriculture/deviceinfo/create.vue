<script setup lang="ts">
import {
  EditFrame,
  addOrUpdateFormStorage,
  deleteFormStorage,
  getFormStorage
} from '@/components/EditFrame/index'
import {
  FolderChecked,
  TopRight,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTagsViewStore } from "@/store/modules/tagsView";
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { DeviceInfoApi, DeviceInfoVO } from '@/api/agriculture/deviceinfo'
import {DeviceCategoryApi} from '@/api/agriculture/devicecategory'
import {retainFirstTwoLayers} from "@/utils/tree";
import { ParkDetailVO } from '@/api/agriculture/parkdetail'
import {  ParkInfoVO } from '@/api/agriculture/parkinfo'
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import MapPosSelector from '@/components/MapPosSelector/index.vue'

const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '设备信息'
const ORIGIN_PATH = '/internetMonitor/device/deviceView' // 关闭表单时跳转的路径

// name使用创建菜单时填写的组件名
defineOptions({ name: 'DeviceInfoForm' })
const options=ref([
  {
    value: '温度',
    label: '温度'
  },
  {
    value: '风速',
    label: '风速'
  },
  {
    value: '光照',
    label: '光照'
  },
  {
    value: '湿度',
    label: '湿度'
  },
  {
    value: 'PH值检测',
    label: 'PH值检测'
  }]
)
let categoryOptions = ref([])// 设备分类选项
const deviceType = ref()
const getFormInfo = async () => {
  // 获取设备分类树
  const categoryTree = await DeviceCategoryApi.getDeviceCategoryTree({parentId: 0, status: 1});
  categoryOptions.value = retainFirstTwoLayers(categoryTree);
  resetForm()
  if (route.query.id){
    formData.value = await DeviceInfoApi.getDeviceInfo(route.query.id as any)
    loadData(route.query.id);
    formData.value.deviceMonitorType=formData.value.deviceMonitorType.split(',');
    deviceType.value = formData.value.deviceType.split(',').map(Number)
  }
}
// 页面 Loading
const formLoading = ref<boolean>(false)

// 表单 Ref
const formRef = ref()

// 表单字段数据
const formData = ref({
  id: undefined,
  deviceCode: undefined,
  deviceName: undefined,
  deviceType: '',
  longitude: undefined,
  latitude: undefined,
  deviceStatus: 'online',
  belongPark: undefined,
  belongPlot: undefined,
  remark: undefined,
  deptId: undefined,
  userId: undefined,
  imgId: undefined,
  location: undefined,
  url: undefined,
  deviceKind: undefined,
  deviceMonitorType: undefined,
  parkName: undefined,
  parkDetailName: undefined
})

// 表单校验规则
const formRules = reactive({
  deviceName: [{ required: true, message: '设备点位不能为空', trigger: 'blur' }],
  deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'change' }],
  deviceMonitorType: [{ required: true, message: '设备监测类型不能为空', trigger: 'change' }],
  deviceStatus: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  imgId: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
})

// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DeviceInfoVO
    if (!formData.value.id) {
      await DeviceInfoApi.createDeviceInfo(data)
      ElMessage.success('提交成功！')
    } else {
      await DeviceInfoApi.updateDeviceInfo(data)
      ElMessage.success('提交成功！')
    }
    // 表单已提交，从本地删除此表单
    deleteFormStorage(
      ROUTE_PATH,
      formData.value.id ? formData.value.id : 'new_form'
    )
    // 关闭当前页面
    useTagsViewStore().delView(router.currentRoute.value);
    router.push(ORIGIN_PATH)
  } catch (err) {
    ElMessage.error('提交失败, 请联系管理员')
  } finally {
    formLoading.value = false
  }
}
/**
 * 设备分类级联选择器
 */
const props = {
  value: 'id',
  label: 'categoryName',
  expandTrigger: 'hover' as const,
}
const handleChange = (value: any) => {
  console.log(value)
  formData.value.deviceType = value.join(',')
  formData.value.deviceKind = value[1]
}

//基地的选择
const parkInfoPopupRef = ref()
const openType = ref('')
const openParkInfoPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === ""){
    ElMessage.error("请选择基地")
  }else parkInfoPopupRef.value.open(id)
}
const handleParkInfoPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0'){
    formData.value.belongPark = String(order[0].code)
    formData.value.parkName = String(order[0].name)
  }
  else formData.value.belongPlot = String(order[0].id)
}

//地块的选择
const parkDetailPopupRef = ref()
const openType1 = ref('')
const openParkDetailPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value){
    ElMessage.error("请选择基地")
  }else parkDetailPopupRef.value.open(id)
}
const handleParkDetailPopupChange = (order: ParkDetailVO) => {

  console.log("--->>查看选择的地块信息：",order[0])
  formData.value.belongPark = String(order[0].parkId)
  formData.value.belongPlot = String(order[0].id)
  formData.value.parkDetailName = String(order[0].name)
}

// 重置表单方法
const resetForm = () => {
  formData.value = {
    id: undefined,
    deviceCode: undefined,
    deviceName: undefined,
    deviceType: '',
    longitude: undefined,
    latitude: undefined,
    deviceStatus: 'online',
    belongPark: undefined,
    belongPlot: undefined,
    remark: undefined,
    deptId: undefined,
    userId: undefined,
    imgId: undefined,
    location: undefined,
    url: undefined,
    deviceKind: undefined,
    deviceMonitorType: undefined,
    parkName: undefined,
    parkDetailName: undefined
  }
  deviceType.value = []
}

// 本地保存表单
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('暂存成功！')
}

const loadData = async (id = 'new_form') => {
  const _form = await getFormStorage(ROUTE_PATH, id)
  if (_form) formData.value = _form.formContent
}
if (!formData.value.id) loadData()
/** 初始化 **/
onMounted(() => {
  getFormInfo()
})
// 手风琴展开项
const activeName = ref<any>('1')

const openPosSelector = ref<boolean>(false)
const handleSelectorChange = (val) => {
  console.log("handleSelectorChange", val[0]);
  if (val.length !== 2) return
  formData.value.longitude = val[0]
  formData.value.latitude = val[1]
}
</script>
<template>
  <div>
    <MapPosSelector
      ref="mapPosSelectorRef"
      v-model="openPosSelector"
      @change="handleSelectorChange"
    />
    <EditFrame>
      <template #header>
        <div class="flex">
          <el-button
            type="success"
            :icon="TopRight"
            plain
            @click="submitForm"
          >提交</el-button>
          <el-button
            type="danger"
            :icon="Refresh"
            plain
            @click="resetForm()"
          >清空
          </el-button>
        </div>
        <div>
          <el-button
            type="primary"
            plain
            @click="router.back()"
          >返回</el-button>
          <el-button
            type="primary"
            :icon="FolderChecked"
            plain
            @click="localSave()"
            v-if="route.query.type as any !=='detail'"
          >
            暂存
          </el-button>
        </div>
      </template>
      <template #content>
        <el-scrollbar class="croll-bar-template">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            v-loading="formLoading"
            class="grid 2xl:grid-cols-3 gap-2 p-4"
          >
            <el-form-item label="设备编号" prop="deviceCode">
              <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" />
            </el-form-item>
            <el-form-item label="设备点位" prop="deviceName">
              <el-input v-model="formData.deviceName" placeholder="请输入设备点位" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-cascader
                style="width: 100%"
                v-model="deviceType"
                :options="categoryOptions"
                @change="handleChange"
                :props="props"
                filterable
              />
            </el-form-item>
            <el-form-item label="设备检测类型" prop="deviceMonitorType">
              <el-select
                v-model="formData.deviceMonitorType"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择设备检测类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属基地" prop="belongPark">
              <el-input v-model="formData.parkName" placeholder="请输入所属基地" readonly>
                <template #append>
                  <el-button @click="openParkInfoPopup('0')">
                    <Icon icon="ep:search"/>
                    选择
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="所属地块" prop="belongPlot">
              <el-input v-model="formData.parkDetailName" placeholder="请输入所属地块" readonly >
                <template #append>
                  <el-button @click="openParkDetailPopup(formData.belongPark)">
                    <Icon icon="ep:search"/>
                    选择
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="deviceStatus">
              <el-radio-group v-model="formData.deviceStatus">
                <el-radio
                  v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="formData.longitude" placeholder="请输入经度">
                <template #append>
                  <el-button @click="openPosSelector = true">
                    <Icon icon="ep:search"/>
                    选择点
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="formData.latitude" placeholder="请输入纬度">
                <template #append>
                  <el-button @click="openPosSelector = true">
                    <Icon icon="ep:search"/>
                    选择点
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="位置" prop="location">
              <el-input v-model="formData.location" placeholder="请输入位置" />
            </el-form-item>
            <el-form-item label="视频地址" prop="url">
              <el-input v-model="formData.url" placeholder="请输入视频地址" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="图片" prop="imgId">
              <UploadImg v-model="formData.imgId" />
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </template>
    </EditFrame>
  </div>
  <!--  选择基地-->
  <ParkInfoPopup ref="parkInfoPopupRef" @success="handleParkInfoPopupChange"/>
  <!--  选择大棚-->
  <ParkDetailPopup ref="parkDetailPopupRef" @success="handleParkDetailPopupChange"/>
</template>
<style scoped>
.scroll-bar-template {
  height: calc(100vh - 250px);
  overflow: auto;
}
</style>
