<script setup lang="ts">
import {UploadImg} from "@/components/UploadFile";
import {PythonServiceApi} from "@/api/python/pest/python";

defineOptions({name: 'PestPythonService'})

const formData = ref({
  img: undefined,
})

const res = ref()

const submitForm = async () => {
  // 提交请求
  const data = formData.value
  res.value = await PythonServiceApi.predict(data)
  console.log(res.value)
}
</script>
<template>
  <div>
    <h1>害虫识别模型</h1>
    <el-form
      :model="formData"
    >
      <el-form-item label="图片" prop="img">
        <UploadImg v-model="formData.img"/>
      </el-form-item>
    </el-form>
    <el-button @click="submitForm" type="primary">点击识别</el-button>

    <h1>⬇️识别结果⬇️</h1>
    <h1>害虫名：【{{res?.name}}】</h1>
    <h1>概率：【{{res?.score}}】</h1>
    <img :src="res?.imgId" alt="图片" style="width: 1000px;"/>
  </div>
</template>
