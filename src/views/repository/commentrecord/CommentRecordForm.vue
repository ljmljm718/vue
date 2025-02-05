<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!-- <el-form-item label="评价对象序号" prop="toId">
        <el-input v-model="formData.toId" placeholder="请输入评价对象序号" />
      </el-form-item>
      <el-form-item label="回复评论序号" prop="recoverId">
        <el-input v-model="formData.recoverId" placeholder="请输入回复评论序号" />
      </el-form-item> -->
      <el-form-item label="留言内容" prop="comment">
        <el-input v-model="formData.comment" placeholder="请输入留言内容" />
      </el-form-item>
      <!-- <el-form-item label="评论时间" prop="commentTime">
        <el-date-picker
          v-model="formData.commentTime"
          type="datetime"
          value-format="x"
          placeholder="选择评论时间"
        />
      </el-form-item> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CommentRecordApi, CommentRecordVO } from '@/api/repository/commentrecord';

/** 评价记录 表单 */
defineOptions({ name: 'CommentRecordForm' });

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗

const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const formData = ref({
  commentId: undefined,
  toId: undefined,
  recoverId: undefined,
  comment: undefined,
  commentTime: undefined
});
const formRules = reactive({});
const formRef = ref(); // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, toId?: number, id?: number) => {
  dialogVisible.value = true;
  dialogTitle.value = t('action.' + type);
  formType.value = type;
  resetForm();
  if (toId) {
    formData.value.toId = toId;
  }
  if (id) {
    formData.value.recoverId = id;
  }
  console.log(id);
  console.log(toId);
  // 修改时，设置数据
  if (id && type === 'update') {
    formLoading.value = true;
    try {
      formData.value = await CommentRecordApi.getCommentRecord(id);
    } finally {
      formLoading.value = false;
    }
  }
};
defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate();
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as CommentRecordVO;
    if (formType.value === 'create') {
      await CommentRecordApi.createCommentRecord(data);
      message.success(t('common.createSuccess'));
    } else {
      await CommentRecordApi.updateCommentRecord(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    commentId: undefined,
    toId: undefined,
    recoverId: undefined,
    comment: undefined,
    commentTime: undefined
  };
  formRef.value?.resetFields();
};
</script>
