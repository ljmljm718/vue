<template>
 
  <el-tooltip :content="prop.content" :placement="prop.placement" effect="light" popper-class="tooltip-width">
   
  <el-icon size="15px" color="#b8b9b9" style="margin-right: 10px">
    <QuestionFilled />
    </el-icon>
  </el-tooltip>

</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { defineProps } from 'vue'

defineOptions({ name: 'QuestionMaskTip' })
const prop = defineProps({
  content: String,
  placement:{
    type: String as PropType<'top' | 'bottom' | 'left' | 'right'>,
    default : 'top'
  }
})
</script>

<style lang="less">
.tooltip-width {
  max-width: 150px;

}
</style>