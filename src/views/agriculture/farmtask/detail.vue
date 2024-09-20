<template>
  <div>
    <EditFrame>
      <template #content>
        <el-scrollbar class="croll-bar-template">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"

            label-width="100px"
            v-loading="formLoading"
            class="grid gap-3 p-4"
          >
            <!-- TODO: 表单项写在这里 -->
            <!-- TODO: 如果使用手风琴，参考下面的代码 下面的注意不用的话要删掉 -->
            <el-collapse v-model="activeName" simple >
              <el-collapse-item class="grid sm:grid-cols-1 gap-2 p-4"  title="投入品信息" name="0" v-show="formData.status==20?false:true">
                <div class="grid sm:grid-cols-4 ">
                  <el-form-item label="投入品" prop="jobType">
                    <el-select v-model="formData.jobType" placeholder="请选择投入品" style="width: 100%;">
                      <el-option
                        v-for="item in productInfoListALL"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="投入品费用/元" prop="agriCapitalConsume">
                    <el-input-number controls-position="right" type="number"  placeholder="请输入内容" v-model="formData.agriCapitalConsume" style="width: 100%"/>
                  </el-form-item>
                  <el-form-item label="农资数量" prop="agriCapitalAmount">
                    <el-input-number controls-position="right" type="number"  placeholder="请输入内容" v-model="formData.agriCapitalAmount" style="width: 100%"/>
                  </el-form-item>
                  <el-form-item label="农资单位" prop="agriCapitalUnit">
                    <el-input type="text" v-model="formData.agriCapitalUnit" placeholder="请输入单位" style="width: 100%;"/>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item  class="grid sm:grid-cols-1 gap-2 p-4"
                                title="任务信息" name="1" >
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="农事计划" prop="planCode">
                      <el-input v-model="formData.planCode" disabled placeholder="请选择农事计划" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="农事计划名称" prop="planName" label-width="120">
                      <el-input v-model="formData.planName" disabled placeholder="请选择农事计划" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="所属基地" prop="belongPark">
                      <el-input v-model="formData.belongPark" disabled placeholder="请输入所属基地" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="基地名称" prop="parkName">
                      <el-input v-model="formData.parkName" disabled placeholder="请输入基地名称" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="所属地块" prop="belongPlot">
                      <el-input v-model="formData.belongPlot" disabled placeholder="请输入所属地块" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="地块名称" prop="plotName">
                      <el-input v-model="formData.plotName" disabled placeholder="请输入地块名称" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="3">
                  <el-col :span="12">
                    <el-form-item label="开始时间"  prop="startTime">
                      <el-date-picker
                        v-model="formData.startTime"
                        type="date"
                        disabled
                        style="width: 100%;"
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
                        disabled
                        style="width: 100%;"
                        value-format="x"
                        placeholder="选择结束时间"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="3">
                  <el-col :span="24">
                    <el-form-item label="完成要求" prop="completeRequirement">
                      <el-input type="textarea" disabled v-model="formData.completeRequirement" placeholder="请输入完成要求" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="验收标准" prop="acceptanceStandard">
                      <el-input type="textarea" disabled v-model="formData.acceptanceStandard" placeholder="请输入验收标准" />
                    </el-form-item>
                  </el-col>
                </el-row>
<!--                <el-row>-->
<!--                  <el-col :span="24">-->
<!--                    <el-form-item label="图片" prop="taskImg" >-->
<!--                      <UploadImg v-model="formData.taskImg" />-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-row>-->
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-scrollbar>
      </template>
    </EditFrame>
  </div>

</template>
<script lang="ts" setup>
import {DICT_TYPE, getStrDictOptions} from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import * as LeaveApi from '@/api/bpm/leave'
import { FarmTaskApi, FarmTaskVO } from '@/api/agriculture/farmtask'
import {TopRight} from "@element-plus/icons-vue";
import {EditFrame} from "@/components/EditFrame";
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import PlanInfoPopup from "@/views/agriculture/farmtask/PlanInfoPopup.vue";
import {ProductApi} from "@/api/erp/product/product";
import {toInteger} from "lodash-es";


defineOptions({ name: 'FarmTaskDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const type = ref(true)
const detailData = ref<any>({}) // 详情数据
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号
const activeName = ref(['0','1']) // 当前激活的面板
let productInfoListALL = ref() //所有投入品列表
const formData = ref({
  id: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  processInstanceId: undefined,
  status: undefined,
  startTime: undefined,
  endTime: undefined,
  completeRequirement: undefined,
  acceptanceStandard: undefined,
  planCode:undefined,
  planName:undefined,
  agriCapitalUnit:undefined,
  agriCapitalAmount:undefined,
  agriCapitalConsume:undefined,
  jobType:undefined,
  taskImg: undefined,
  agriCapitalUnit:undefined,
  agriCapitalAmount:undefined,
  agriCapitalConsume:undefined,
  jobType:undefined,
  taskImg: undefined,
})

const emit = defineEmits(['success', 'change']) // 定义 success 事件，用于操作成功后的回调

watch(() => formData.value, () => {
  emit('change', formData.value)
}, {
  deep: true
})

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    formData.value = await FarmTaskApi.getFarmTask(props.id || queryId)
    formData.value.jobType=toInteger(formData.value.jobType)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗


const router = useRouter();
const lookPlanDetail = (planId:any) => {
  router.push('/farm_work/farmManage/createOrUpdate?type=view&id='+planId)
}
/** 初始化 **/
onMounted( async () => {
  getInfo()
  productInfoListALL.value = await ProductApi.selectAll()
})
</script>
