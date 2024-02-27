<template>
    <div class="bigscreen-wrappper bigscreen-main-wrapper">
        <div class="header-main-wrapper">
            <div class="header-left-part-wrapper">
                <!-- <BigScreenTime /> -->
            </div>
            <div class="header-title-wrapper">鲁渝协作乡村振兴示范村</div>
            <div class="header-right-part-wrapper"></div>
        </div>
        <div class="content-main-wrapper">
            <div class="left">
                <div class="left1"></div>
                <div class="left1"></div>
                <div class="left1"></div>
                <div class="left1"></div>
            </div>
            <div class="main"></div>
            <div class="right">
                <div class="right1"></div>
                <div class="right1"></div>
                <div class="right1"></div>
                <div class="right1"></div>
            </div>
        </div>
  </div>
</template>
<script setup lang='ts'>
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'

</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.bigscreen-wrappper {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .header-main-wrapper {
      background-size: 100% 100%;
        background-image: url(./assets/headerBg.png);
    }

    .content-main-item {
        padding: 10px;
        position: relative;
        z-index: 99;
    }
}
.content-main-wrapper {
  padding: 0px 20px !important;
  color: #fff;
  display: grid;
  overflow: hidden;
  grid-template-columns: 25% calc(50% - 20px) 25%;
  grid-auto-rows: 100%;
  gap: 10px;
  .left{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows:25% 25% 25% calc(75% - 30px);
    grid-auto-columns: 100%;
    gap: 10px;
    .left1{
        width: 100%;
        height:100%;
        background: pink;
    }
  }
  .main{}
  .right{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows:24% 24% 24% calc(72% - 45px);
    grid-auto-columns: 100%;
    gap: 15px;
    .right1{
        width: 100%;
        height:100%;
        background: #c1c1c1;
    }
  }
}
</style>