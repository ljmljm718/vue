<script setup name="BackOrHome"></script>
<template>
  <div class="flex items-center space-x-2" style="color: white;">
    <span @click="$router.go(-1)" title="返回上一级">
      <el-icon><CaretLeft /></el-icon>
    </span>
    <a href="/" title="回到首页" style="color: white;">
      <el-icon><HomeFilled /></el-icon>
    </a>
  </div>
</template>