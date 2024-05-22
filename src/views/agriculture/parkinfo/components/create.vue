<script setup lang="ts">
import {
  EditFrame,
  addFormStorage,
  addOrUpdateFormStorage,
  getFormStorage,
  deleteFormStorage
} from '@/components/EditFrame/index'
import {
  FolderChecked,
  TopRight,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTagsViewStore } from "@/store/modules/tagsView";
import {ParkInfoApi, ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkCategoryApi} from "@/api/agriculture/parkcategory";
import ParkDetailForm from "@/views/agriculture/parkinfo/components/ParkDetailForm.vue";

const route = useRoute()
const router = useRouter()
// 下面是抽象出的基本配置
const ROUTE_PATH = route.path
const FORMPAGE_NAME = '基地'
const ORIGIN_PATH = '/asset/base/parkinfo' // 关闭表单时跳转的路径

// TODO: name使用创建菜单时填写的组件名
defineOptions({ name: 'ParkInfoCreateDetail' })

const parkCategoryOptions = ref() //基地分类列表
const getFormInfo = async () => {
  parkCategoryOptions.value =  await ParkCategoryApi.getAllParkCategory()
  resetForm()
  formData.value = await ParkInfoApi.getParkInfo(route.query.id as any)
  formData.value.parkDetails = await ParkInfoApi.getParkDetailListByParkId(route.query.id)
}
if (route.query.id) getFormInfo()
// 页面 Loading
const formLoading = ref<boolean>(false)

// 表单 Ref
const formRef = ref()

// 表单字段数据
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  type: undefined,
  altitude: undefined,
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  contact: undefined,
  tel: undefined,
  area: undefined,
  remark: undefined,
  deptId: undefined,
  userId: undefined,
  quantity: undefined,
  img: undefined,
  parkDetails: []
})

// 表单校验规则
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  altitude: [{ required: true, message: '海拔不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
  longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '通讯地址不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  tel: [
    {
      required: true,
      pattern: /^(?:(?:\+|00)86)?1(?:3[\d]|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8[\d]|9[189])\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  area: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
})

/** 子表的表单 */
const subTabsName = ref('parkDetail')
const parkDetailFormRef = ref()

/** 计算 面积 */
watch(
  () => formData.value,
  (val) => {
    if (!val) {
      return
    }
    if (val.parkDetails){
      const totalArea = val.parkDetails.reduce((prev, curr) => Number(prev) + Number(curr.area != null ? curr.area : 0), 0)
      formData.value.area = totalArea
    }
  },
  { deep: true }
)

// 提交表单
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await parkDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'parkDetail'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    formData.value.parkDetails.forEach(parkDetail => {
      if (!parkDetail.parkId){
        parkDetail.parkId = formData.value.id
      }
    })
    console.log("parkInfo", formData.value)
    const data = formData.value as unknown as ParkInfoVO
    if (!formData.value.id) {
      await ParkInfoApi.createParkInfo(data)
      ElMessage.success('提交成功！')
    } else {
      await ParkInfoApi.updateParkInfo(data)
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

// 重置表单方法
const resetForm = () => {
  formData.value = {
    id: undefined,
    code: undefined,
    name: undefined,
    type: undefined,
    altitude: undefined,
    latitude: undefined,
    longitude: undefined,
    address: undefined,
    contact: undefined,
    tel: undefined,
    area: undefined,
    remark: undefined,
    deptId: undefined,
    userId: undefined,
    quantity: undefined,
    img: undefined,
    parkDetails: []
  }
}

// 本地保存表单
const localSave = () => {
  addOrUpdateFormStorage(
    ROUTE_PATH,
    FORMPAGE_NAME + (formData.value.id ? '编辑' : '新增'), // TODO: 前面的表单名称写成当前页面名称
    formData.value.id ? formData.value.id : 'new_form',
    formData.value
  )
  ElMessage.success('保存成功！')
}
// 手风琴展开项
const activeName = ref<any>('1')
</script>
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
          >提交</el-button>
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
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            v-loading="formLoading"
            class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-2 p-4"
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择类型" style="width: 100%">
                <el-option
                  v-for="dict in parkCategoryOptions"
                  :key="dict.value"
                  :label="dict.categoryLabel"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="formData.longitude" placeholder="请输入经度" />
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="formData.latitude" placeholder="请输入纬度" />
            </el-form-item>
            <el-form-item label="海拔" prop="altitude">
              <el-input v-model="formData.altitude" placeholder="请输入海拔" >
                <template #append>米</template>
              </el-input>
            </el-form-item>
            <el-form-item label="面积" prop="area">
              <el-input v-model="formData.area" placeholder="请输入面积" disabled>
                <template #append>亩</template>
              </el-input>
            </el-form-item>
            <el-form-item label="通讯地址" prop="address">
              <el-input v-model="formData.address" placeholder="请输入通讯地址" />
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
              <el-input v-model="formData.quantity" placeholder="请输入数量" />
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="formData.contact" placeholder="请输入联系人" />
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="formData.tel" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="简介" prop="remark" class="col-span-2">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item label="图片" prop="img">
              <UploadImg v-model="formData.img" />
            </el-form-item>
          </el-form>
          <!-- 子表的表单 -->
          <el-tabs v-model="subTabsName">
            <el-tab-pane label="地块基本信息" name="parkDetail">
              <ParkDetailForm ref="parkDetailFormRef" :parkDetails="formData.parkDetails" />
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </template>
    </EditFrame>
  </div>
</template>
<style scoped>
.scroll-bar-template {
  height: calc(100vh - 250px);
  overflow: auto;
}
</style>
