<script setup lang="ts">
import { DiseasePestSurveillanceApi } from '@/api/agriculture/diseasepestsurveillance'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
defineOptions({ name: 'RecognizeForm' })
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
// const dialogTitle = ref('') // 弹窗的标题
// const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
// const formType = ref('') // 表单的类型：create - 新增；update - 修改
const loading = ref(false) // 列表的加载中
const mainTableId = ref('')
const baseForm = reactive({
  demoList: [
    {
      mainTableId: mainTableId.value,
      name: '',
      quantity: '',
      density: '',
      recognitionTime: parseInt('0'),
      recognitionType: '',
      recorder: '',
      isEditing: true
    }
  ]
})

/** 打开弹窗 */
const open = (type: string, id: string) => {
  if (!baseForm.demoList) {
    console.error('demoList is not initialized.')
    return // 如果 demoList 未初始化，终止执行
  }
  dialogVisible.value = false // 先设置为 false
  nextTick(() => {
    // 确保状态更新
    dialogVisible.value = true // 然后设置为 true
    mainTableId.value = id
    // dialogTitle.value = t('action.' + type)
    // formType.value = type
  })

  // console.log('🚀 ~ open ~ mainTableId.value:', mainTableId.value)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 添加识别信息 */
const addLine = () => {
  const newLine = {
    mainTableId: mainTableId.value,
    name: '',
    quantity: '',
    density: '',
    recognitionTime: parseInt('0'),
    recognitionType: '',
    recorder: '',
    isEditing: true // 默认为编辑状态
  }
  baseForm.demoList.push(newLine)
}
/** 保存信息 */
const saveInfo = (index) => {
  const row = baseForm.demoList[index]
  if (row.isEditing) {
    row.isEditing = false
  } else {
    row.isEditing = true
  }
}

/** 提交识别信息 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const handleSubmit = async () => {
  baseForm.demoList.forEach((line) => {
    if (!line.mainTableId) {
      line.mainTableId = mainTableId.value // 如果发现 mainTableId 为空，则尝试再次赋值
    }
  })
  const data = baseForm.demoList.map(({ isEditing, recognitionTime, recognitionType, ...rest }) => {
    const timestamp = new Date(recognitionTime).getTime()
    // 根据 recognitionType 的值转换为英文
    const typeMapping = {
      手动标注: 'manual_labeling',
      自动识别: 'automatic_recognition'
    }
    return {
      ...rest,
      recognitionTime: timestamp,
      recognitionType: typeMapping[recognitionType] || recognitionType // 保留原样，如果没有匹配到任何预定义值
    }
  })
  // console.log('🚀 ~ handleSubmit ~ data:', data)
  const hasEmpty = data.some(item => Object.values(item).some(value => value === ''));
  if (hasEmpty) {
    alert('请填写完整信息');
    return; // 如果有空字符串，则显示警告并中断函数
  }
  console.log("🚀 ~ handleSubmit ~ data:", data)
  try {
    await DiseasePestSurveillanceApi.createDiseasePestSurveillanceRecognize(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    emit('success')
  } finally {
  }
    
}
const closeDialog = () => {
  dialogVisible.value = false
}

const baseFormRef = ref()
</script>

<template>
  <Dialog title="" v-model="dialogVisible" :width="900" :height="1000">
    <div class="flex justify-between items-center p-2">
      <div class="text-[16px] text-black font-bond">识别</div>
      <div>
        <el-button type="primary" @click="addLine">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </div>
    </div>
    <el-form class="p-2" ref="baseFormRef" :model="baseForm" auto-complete="on">
      <el-table
        v-loading="loading"
        :data="baseForm.demoList"
        :stripe="true"
        :show-overflow-tooltip="true"
        highlight-current-row
        header-cell-class-name="table_header"
      >
        <el-table-column label="名称" align="center" prop="name">
          <template #default="scope" >
            <el-form-item :prop="'demoList.' + scope.$index + '.name'" v-if="scope.row.isEditing">
              <el-input v-model="scope.row.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="quantity">
          <template #default="scope">
            <el-form-item
              :prop="'demoList.' + scope.$index + '.quantity'"
              v-if="scope.row.isEditing"
            >
              <el-input v-model="scope.row.quantity" placeholder="请输入数量" clearable  oninput="value=value.replace(/[^\d.]/g,'')"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="密度" align="center" prop="density">
          <template #default="scope">
            <el-form-item
              :prop="'demoList.' + scope.$index + '.density'"
              v-if="scope.row.isEditing"
            >
              <el-input v-model="scope.row.density" placeholder="请输入密度" clearable />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="识别时间" show-overflow-tooltip prop="recognitionTime">
          <template #default="scope">
            <el-form-item
              :prop="'demoList.' + scope.$index + '.recognitionTime'"
              v-if="scope.row.isEditing"
            >
              <el-date-picker
                v-model="scope.row.recognitionTime"
                value-format="YYYY-MM-DD hh:mm:ss"
                type="datetime"
                placeholder="请选择时间"
                class="!w-240px"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="识别类型" align="center" prop="recognitionType">
          <template #default="scope">
            <dict-tag
              :type="DICT_TYPE.AGRI_RECOGNITION_TYPE"
              :value="
                {
                  手动标注: 'manual_labeling',
                  自动识别: 'automatic_recognition'
                }[scope.row.recognitionType] || scope.row.recognitionType
              "
              v-if="!scope.row.isEditing"
            />

            <el-form-item
              :prop="'demoList.' + scope.$index + '.recognitionType'"
              v-if="scope.row.isEditing"
            >
              <el-select v-model="scope.row.recognitionType" placeholder="请选择类型">
                <el-option label="自动识别" value="自动识别" />
                <el-option label="手动标注" value="手动标注" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="记录人" align="center" prop="recorder">
          <template #default="scope">
            <el-form-item
              :prop="'demoList.' + scope.$index + '.recorder'"
              v-if="scope.row.isEditing"
            >
              <el-input v-model="scope.row.recorder" placeholder="请输入记录人" clearable />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="identifyStatus">
          <template #default="scope">
            <el-form-item >
              <div style="width: 100%; text-align: center;">
              <el-button link type="primary" @click="saveInfo(scope.$index)">
                {{ scope.row.isEditing ? '保存' : '编辑' }}
                
              </el-button>
            </div>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="flex w-full h-15 flex justify-center items-center">
      <el-button type="primary" @click="handleSubmit">确定 </el-button>
      <el-button type="primary" @click="closeDialog">取消 </el-button>
    </div>
  </Dialog>
</template>
<style scoped>
.el-select {
  padding: 1px 7px;
}
::v-deep .table_header{
  background-color: #f5f5f5 !important;
  color:#333;
  font-weight: 800;
  text-align: center;
  padding: 4px;
}
::v-deep .el-form-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
