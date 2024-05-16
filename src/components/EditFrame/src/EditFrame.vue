<script lang="ts" setup>
const { back } = useRouter() 
defineOptions({ name: 'EditFrame' })
</script>
<template>
    <ContentWrap>
        <div class="flex justify-between w-full">
            <slot name="header">
                <div></div>
            </slot>
            <el-button type="primary" plain @click="back()">返回</el-button>
        </div>
    </ContentWrap>
    <ContentWrap>
        <el-scrollbar height="700px">
            <slot name="content"></slot>
        </el-scrollbar>
    </ContentWrap>
</template>
