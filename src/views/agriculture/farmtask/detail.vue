<template>
  <div>
    <EditFrame>
      <template #header>
        <div></div>
        <div>
          <el-button type="primary" plain @click="router.back()">返回</el-button>
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
            class="grid gap-3 p-4"
          >
            <!-- TODO: 表单项写在这里 -->
            <!-- TODO: 如果使用手风琴，参考下面的代码 下面的注意不用的话要删掉 -->
            <el-collapse v-model="activeName" simple>
              <el-collapse-item
                class="grid sm:grid-cols-1 gap-2 p-4"
                title="投入品信息"
                name="0"
                v-show="formData.status == 20 ? false : true"
              >
                <div class="grid sm:grid-cols-4">
                  <el-form-item label="投入品" prop="jobType">
                    <el-select
                      v-model="formData.jobType"
                      placeholder="请选择投入品"
                      style="width: 100%"
                      @change="productInfo"
                    >
                      <el-option
                        v-for="item in productInfoListALL"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="投入品费用/元" prop="agriCapitalConsume">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      placeholder="请输入内容"
                      v-model="formData.agriCapitalConsume"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="农资数量" prop="agriCapitalAmount">
                    <el-input-number
                      controls-position="right"
                      type="number"
                      placeholder="请输入内容"
                      v-model="formData.agriCapitalAmount"
                      style="width: 100%"
                    />
                  </el-form-item>
                  <el-form-item label="农资单位" prop="agriCapitalUnit">
                    <el-input
                      type="text"
                      v-model="formData.agriCapitalUnit"
                      placeholder="请输入单位"
                      style="width: 100%"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="规格" prop="standard">
                    <el-input v-model="formData1.standard" placeholder="请输入规格" disabled />
                  </el-form-item>
                  <el-form-item label="采购价格" prop="purchasePrice">
                    <el-input-number
                      v-model="formData1.purchasePrice"
                      placeholder="请输入采购价格，单位：元"
                      :min="0"
                      :precision="2"
                      class="!w-1/1"
                      disabled
                    />
                  </el-form-item>
                </div>
              </el-collapse-item>
              <el-collapse-item class="grid sm:grid-cols-1 gap-2 p-4" title="任务信息" name="1">
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
                      <el-input
                        v-model="formData.belongPark"
                        disabled
                        placeholder="请输入所属基地"
                      />
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
                      <el-input
                        v-model="formData.belongPlot"
                        disabled
                        placeholder="请输入所属地块"
                      />
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
                    <el-form-item label="开始时间" prop="startTime">
                      <el-date-picker
                        v-model="formData.startTime"
                        type="date"
                        disabled
                        style="width: 100%"
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
                        style="width: 100%"
                        value-format="x"
                        placeholder="选择结束时间"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="3">
                  <el-col :span="24">
                    <el-form-item label="完成要求" prop="completeRequirement">
                      <el-input
                        type="textarea"
                        disabled
                        v-model="formData.completeRequirement"
                        placeholder="请输入完成要求"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="验收标准" prop="acceptanceStandard">
                      <el-input
                        type="textarea"
                        disabled
                        v-model="formData.acceptanceStandard"
                        placeholder="请输入验收标准"
                      />
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
import { propTypes } from '@/utils/propTypes';
import { FarmTaskApi } from '@/api/agriculture/farmtask';
import { EditFrame } from '@/components/EditFrame';
import { ProductApi } from '@/api/erp/product/product';
import { toInteger } from 'lodash-es';

defineOptions({ name: 'FarmTaskDetail' });

const { query } = useRoute(); // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
});
const detailLoading = ref(false); // 表单的加载中
const type = ref(true);
const detailData = ref<any>({}); // 详情数据
const queryId = query.id as unknown as number; // 从 URL 传递过来的 id 编号
const activeName = ref(['0', '1']); // 当前激活的面板
let productInfoListALL = ref(); //所有投入品列表
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
  planCode: undefined,
  planName: undefined,
  agriCapitalUnit: undefined,
  agriCapitalAmount: undefined,
  agriCapitalConsume: undefined,
  jobType: undefined,
  taskImg: undefined,
  agriCapitalUnit: undefined,
  agriCapitalAmount: undefined,
  agriCapitalConsume: undefined,
  taskImg: undefined
});

const emit = defineEmits(['success', 'change']); // 定义 success 事件，用于操作成功后的回调

watch(
  () => formData.value,
  () => {
    emit('change', formData.value);
  },
  {
    deep: true
  }
);

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true;
  try {
    formData.value = await FarmTaskApi.getFarmTask(props.id || queryId);
    formData.value.jobType =
      formData.value.jobType == null ? '' : toInteger(formData.value.jobType);
  } finally {
    detailLoading.value = false;
  }
};
defineExpose({ open: getInfo }); // 提供 open 方法，用于打开弹窗

const router = useRouter();
const lookPlanDetail = (planId: any) => {
  router.push('/farm_work/farmManage/createOrUpdate?type=view&id=' + planId);
};
/** 初始化 **/
onMounted(async () => {
  await getInfo();
  await productInfo(formData.value.jobType);
  productInfoListALL.value = await ProductApi.selectAll();
});
const formData1 = ref({
  id: undefined,
  name: undefined,
  barCode: undefined,
  categoryId: undefined,
  unitId: undefined,
  status: undefined,
  standard: undefined,
  remark: undefined,
  expiryDay: undefined,
  weight: undefined,
  purchasePrice: undefined,
  salePrice: undefined,
  minPrice: undefined,
  img: undefined,
  produceDate: undefined,
  registerNum: undefined,
  packagingRelationship: undefined,
  effectiveTime: undefined
});
const productInfo = async (id) => {
  try {
    if (id) {
      const productData = await ProductApi.getProductUnit(id);
      formData1.value = productData;
      formData.value.agriCapitalUnit = productData.unitName;
    }
  } catch (error) {
    console.error('没有找到该条信息:', error);
  }
};

const openPopup = (type: any, row: any) => {
  if (type === 'park') {
    parkDetailPopupRef.value.open(row);
  } else if (type === 'plan') {
    planInfoPopupRef.value.open(row);
  }
};
</script>
