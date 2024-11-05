<script setup lang="ts">
import { generateUUID } from '@/utils'

defineOptions({ name: 'CustomForm' })
const props = defineProps({
  showLabels: {
    type: Array<any>,
    default: []
  },
});
const componentID = generateUUID()
const collapsed = ref<boolean>(false); // true 代表当前为折叠状态
const init = () => {
  const dom = document.getElementById(componentID);
  console.log("🚀 ~ init ~ dom:", dom)
}
onMounted(() => { init() })
const handleCollapse = () => {
  const dom = document.getElementById(componentID);
  const formItemList = dom.querySelectorAll(".el-form-item");
  if (collapsed.value) {
    // 当前折叠状态，使其展开
    for (let i = 0; i < Array.from(formItemList).length; i++) {
      formItemList[i].style.display = 'inline-flex';
    }
  } else {
    // 当前是展开状态，使其折叠
    for (let i = 0; i < Array.from(formItemList).length; i++) {
      const formItem = formItemList[i];
      const formItemLabel = formItem.querySelector(".el-form-item__label")?.innerText;
      console.log("🚀 ~ handleCollapse ~ formItemLabel:", formItemLabel)
      if (props.showLabels.indexOf(formItemLabel) !== -1) {
        formItem.style.display = 'inline-flex';
      } else {
        if (i > 1) {
          formItemList[i].style.display = 'none';
          const operateDom = formItemList[i];
          const btnDom = operateDom.querySelector('.el-button')
          if (btnDom) operateDom.style.display = 'inline-flex'
        }
      }
      
    }
  }
  collapsed.value = !collapsed.value
}

const customFormRef = ref();
const resetFields = () => {
  if (!customFormRef) return;
  customFormRef.value.resetFields()
}
  
defineExpose({ resetFields })
</script>
<template>
  <el-form ref="customFormRef" class="relative" :id="componentID" v-bind="$attrs">
    <slot></slot>
    <div class="absolute right-0 bottom-0" @click="handleCollapse()">
      {{ collapsed ? '展开' : '折叠' }}
    </div>
  </el-form>
</template>
<style scoped lang="scss">
</style>