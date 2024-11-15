<script setup lang="ts">
const props = defineProps({
  columns: {
    type: Array<any>,
    default: () => []
  },
  data: {
    type: Array<any>,
    default: () => []
  }
});
console.log('tavbv', props);
</script>
<template>
  <div class="h-full">
    <el-table :data="props.data" size="small" border height="100%">
      <el-table-column
        v-for="(item, index) in props.columns"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      />
    </el-table>
  </div>
</template>
<style scoped lang="scss"></style>
