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
const collapsed = ref<boolean>(false); // true 代表当前为收起状态
const init = () => {
  const dom = document.getElementById(componentID);
  handleCollapse()
}
onMounted(() => { init() })
const handleCollapse = () => {
  const dom = document.getElementById(componentID);
  const formItemList = dom.querySelectorAll(".el-form-item");
  console.log('🚀 ~ formItemList',formItemList);
  if (collapsed.value) {
    // 当前折叠状态，使其展开
    for (let i = 0; i < Array.from(formItemList).length; i++) {
      formItemList[i].style.display = 'inline-flex';
    }
  } else {
    // 当前是展开状态，使其折叠
    for (let i = 0; i < Array.from(formItemList).length; i++) {
      const formItem = formItemList[i];
      //获取label名称
      const formItemLabel = formItem.querySelector(".el-form-item__label")?.innerText;
      console.log("🚀 ~ handleCollapse ~ formItemLabel:", formItemLabel)
      console.log("🚀 ~ !formItemLabel:", !formItemLabel)
      //获取button
      const btnDom = formItem.querySelector('.el-button')
      console.log("🚀 ~ btnDom:", !btnDom)
      //定义展示查询框，只展示定义的前2个，其余隐藏；如未定义默认展示前2个查询框，其余隐藏
      //button全部显示不隐藏
      if (props.showLabels.length > 0) {
        if (props.showLabels.indexOf(formItemLabel) <= -1 && (!btnDom || formItemLabel)) formItem.style.display = 'none';
      } else {
        if (i > 1 && (!btnDom || formItemLabel)) {
          formItem.style.display = 'none';
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
    <div class="absolute collapsed-css" @click="handleCollapse()">
      <!-- {{ collapsed ? '展开' : '收起' }} -->
      <el-icon v-if="collapsed"><ArrowDown/></el-icon>
      <el-icon v-else><ArrowUp/></el-icon>
    </div>
  </el-form>
</template>
<style scoped lang="scss">
.collapsed-css{
  right: 0;
  bottom: -5px;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  background: #009688;
  padding: 3px 8px 1px 8px;
  border-radius: 5px 5px 0 0;
}
</style>
