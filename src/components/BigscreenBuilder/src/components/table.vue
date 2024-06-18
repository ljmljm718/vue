<template>
  <div class="relative flex flex-col">
    <div
      class="table-cell-border sticky left-0 top-0 flex items-center table-header-color"
      :style="`background-color: ${props.headerBackgroundColor};`"
    >
      <div
        v-for="item, index in props.columns"
        :key="index"
        class="px-2 py-1"
        :style="`${item.width ? 'width: ' + item.width : 'flex-grow: 1;'};`"
      >
        {{ item.label }}
      </div>
    </div>
    <div v-loading="props.loading" class="grow">
      <div
        v-for="item, index in props.dataList"
        :key="index"
        class="flex items-center table-cell-border"
      >
        <div
          v-for="column, idx in props.columns"
          :key="idx"
          class="px-2 py-2"
          :style="`${column.width ? 'width: ' + column.width : 'flex-grow: 1;'};`"
        >{{ item[column.key] }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'BigscreenTable' })
interface TableColumnType {
  key: string,
  label: string,
  width?: string
}
const props = defineProps({
  columns: {
    type: Array<TableColumnType>,
    default: []
  },
  dataList: {
    type: Array<any>,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  },
  headerBackgroundColor: {
    type: String,
    default: '#00000000'
  }
})

const emit = defineEmits(['change']);
</script>
<style scoped>
.table-cell-border {
  border: 1px solid #0675d0;
}

.table-header-color {
  color: #2badf8;
}
</style>
