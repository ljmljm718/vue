<script lang="ts" setup>
defineOptions({ name: 'EditFrame' })
</script>
<template>
    <ContentWrap>
        <div class="flex justify-between w-full">
            <slot name="header">
                <div></div>
            </slot>
        </div>
    </ContentWrap>
    <ContentWrap>
        <el-scrollbar height="700px">
            <slot name="content"></slot>
        </el-scrollbar>
    </ContentWrap>
</template>
