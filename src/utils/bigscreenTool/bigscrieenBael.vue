<template>
   <div class="bigscreen-table-wrapper">
        <div class="bigscreen-table-header-wrapper">
            <div
                class="bigscreen-table-header-cell"
                v-for="column in columns"
                :style="`width: ${column.width};`"
            >{{ column.label }}</div>
        </div>
        <div
            class="bigscreen-table-row-wrapper"
            v-for="(item, index) in data"
            :style="`${index % 2 === 0 ? rowStyle : ''}${index % 2 !== 0 ? rowOddStyle : ''}`"
        >
            <div
                class="bigscreen-table-row-cell"
                v-for="column in columns"
                :style="`width: ${column.width};`"
            >
                <slot :name="column.key" :data="item" :column="column">
                    {{ item[column.key] }}
                </slot>
            </div>
        </div>
    </div>
</template>
<script setup>
</script>
<style lang='scss' scoped>
</style>