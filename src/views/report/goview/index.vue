<template>
  <ContentWrap>
    <IFrame :src="src" />
  </ContentWrap>
</template>
<script lang="ts" setup>
defineOptions({ name: 'GoView' })

const src = 'http://117.73.12.97:48081'
</script>
