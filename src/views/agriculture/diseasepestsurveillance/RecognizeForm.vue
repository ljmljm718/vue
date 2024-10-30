<script setup lang="ts">
import { DiseasePestSurveillanceApi } from '@/api/agriculture/diseasepestsurveillance'
import router from '@/router';
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
interface DemoItem {
  mainTableId: string
  name: string
  quantity: string
  density: string
  recognitionTime: number
  recognitionType: string
  recorder: string
  isEditing: boolean
}
const baseForm = reactive({
  demoList: [] as DemoItem[]
})
const isSubmitting = ref(false) // 用于控制提交按钮状态

/** 打开弹窗 */
const open = (type: string, id: string) => {
  if (!baseForm.demoList) {
    console.error('demoList is not initialized.')
    return // 如果 demoList 未初始化，终止执行
  }
  // 初始化 baseForm
  baseForm.demoList = [
    {
      mainTableId: id, // 动态设置 mainTableId
      name: '',
      quantity: '',
      density: '',
      recognitionTime: 0,
      recognitionType: '',
      recorder: '',
      isEditing: true
    }
  ]
  dialogVisible.value = false // 先设置为 false
  nextTick(() => {
    // 确保状态更新
    dialogVisible.value = true // 然后设置为 true
    mainTableId.value = id
  })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 添加识别信息 */
const addLine = () => {
  const newLine = {
    mainTableId: mainTableId.value,
    name: '',
    quantity: '',
    density: '',
    recognitionTime: 0,
    recognitionType: '',
    recorder: '',
    isEditing: true // 默认为编辑状态
  }
  baseForm.demoList.push(newLine)
}
/** 保存信息 */
const saveInfo = (index) => {
  console.log('baseForm.demoList[index]',baseForm.demoList[index])
  if(baseForm.demoList[index].name == ''|| baseForm.demoList[index].
recognitionTime == 0||baseForm.demoList[index].density == ''||baseForm.demoList[index].
quantity == ''||baseForm.demoList[index].
recognitionType == '' ||baseForm.demoList[index].
recorder == ''){
  alert('请填写完整信息')
  return
}

  const row = baseForm.demoList[index]
  if (row.isEditing) {
    row.isEditing = false
  } else {
    row.isEditing = true
  }
}

/**删除信息 */
const handleDelete = async (index) => {
  // 删除的二次确认
  await message.delConfirm()
  // 发起删除
  await baseForm.demoList.splice(index, 1)
  message.success(t('common.delSuccess'))
}

/** 提交识别信息 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const handleSubmit = async () => {
  if (isSubmitting.value) {
    return // 如果正在提交，直接返回，防止重复提交
  }

  isSubmitting.value = true // 设置为正在提交状态
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
  const hasEmpty = data.some((item) => Object.values(item).some((value) => value === ''))
  if (hasEmpty) {
    alert('请填写完整信息并点击保存')
    isSubmitting.value = false
    return // 如果有空字符串，则显示警告并中断函数
  }
  const hasUnsavedRow = baseForm.demoList.some((item) => item.isEditing)
  if (hasUnsavedRow) {
    alert('请保存所有正在编辑的信息后再提交')
    isSubmitting.value = false
    return // 如果有未保存的行，则提示并中断提交
  }
  try {
    await DiseasePestSurveillanceApi.createDiseasePestSurveillanceRecognize(data)
    dialogVisible.value = false
    message.success(t('common.createSuccess'))
    emit('success')
  } catch (error) {
    ElMessage.error('提交失败，请重试') // 提交失败时的提示框
  } finally {
    isSubmitting.value = false // 无论成功还是失败，最后都要重置状态
  }
}
//****关闭弹窗****
const closeDialog = () => {
  baseForm.demoList = [] // 清空 demoList 或重置为初始状态
  dialogVisible.value = false
}

const baseFormRef = ref()
</script>

<template>
  <Dialog title="" v-model="dialogVisible" :width="900" :height="1000">
    <div class="flex justify-between items-center p-2">
      <div class="text-[16px] text-black font-bond">识别</div>
      <!-- <el-button @click="$router.push('/dict/type/data/agri_disease_name')">字典</el-button>    -->
      <!-- 'SystemDictType' -->
      <div>
        <el-button type="primary" @click="addLine">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </div>
    </div>
    <el-form class="flex justify-center items-center p-2" ref="baseFormRef" :model="baseForm" auto-complete="on">
      <el-table
        v-loading="loading"
        :data="baseForm.demoList"
        :stripe="true"
        highlight-current-row
        header-cell-class-name="table_header"
      >
        <el-table-column label="名称" align="center" prop="name" >
          <template #default="scope">
            <el-form-item :prop="'demoList.' + scope.$index + '.name'" v-if="scope.row.isEditing" class="flex justify-center items-center ">
              <el-select v-model="scope.row.name" clearable placeholder="请选择病虫害名称" class="!w-280px relative top-[.5rem]">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_DISEASE_NAME)"
                  :key="dict.label"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="quantity">
          <template #default="scope">
            <el-form-item
              :prop="'demoList.' + scope.$index + '.quantity'"
              v-if="scope.row.isEditing"
            >
              <el-input
                class="relative top-[.5rem]"
                v-model="scope.row.quantity"
                placeholder="请输入数量"
                clearable
                oninput="value=value.replace(/[^\d.]/g,'')"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="密度" align="center" prop="density">
          <template #default="scope">
            <el-form-item
              :prop="'demoList.' + scope.$index + '.density'"
              v-if="scope.row.isEditing"
            >
              <el-input class="relative top-[.5rem]" v-model="scope.row.density" placeholder="请输入密度" clearable  />
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
                class="!w-240px relative top-[.5rem]"
                
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
              v-if="!scope.row.isEditing && scope.row.recognitionType"
            />

            <el-form-item
              :prop="'demoList.' + scope.$index + '.recognitionType'"
              v-if="scope.row.isEditing"
            >
              <el-select v-model="scope.row.recognitionType" placeholder="请选择类型" class="relative top-[.5rem]">
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
              <el-input class="relative top-[.5rem]" v-model="scope.row.recorder" placeholder="请输入记录人" clearable />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="identifyStatus">
          <template #default="scope">
            <el-form-item>
              <div class="relative top-[.4rem]" style="width: 100%; text-align: center">
                <el-button link type="primary" @click="saveInfo(scope.$index)">
                  {{ scope.row.isEditing ? '保存' : '编辑' }}
                </el-button>
                <el-button link type="primary" @click="handleDelete(scope.$index)">删除</el-button>
              </div>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="flex w-full h-15 flex justify-center items-center">
      <el-button type="primary" @click="handleSubmit" :disabled="isSubmitting">确定 </el-button>
      <el-button type="primary" @click="closeDialog">取消 </el-button>
    </div>
  </Dialog>
</template>
<style scoped>
.el-select {
  padding: 1px 7px;
}
::v-deep .table_header {
  background-color: #f5f5f5 !important;
  color: #333;
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
