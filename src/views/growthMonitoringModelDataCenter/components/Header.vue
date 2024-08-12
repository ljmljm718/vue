<template>
  <!-- 标题设置水平垂直居中 -->
  <div 
    class="w-full flex flex-wrap justify-center content-center" 
    :style="`height: ${ props.height }px; background-image: url( ${bgImg} );`"
  >
    <!-- 标题用图片 -->
    <div
      class="bg-no-repeat bg-center bg-[length:100%_100%] relative"
      :style="`background-image: url( ${ title } ); width: ${ titleWidth }px; height: ${ titleHeight }px;`"
    >
      <!-- 标题上下左右的装饰，用定位 -->
      <div class="title-left"></div>
      <div class="title-right"></div>
      <div class="title-above"></div>
      <div class="title-under relative">
        <div class="absolute top-[28px] left-[675px] w-[565px] h-[3px] bg-[#1DFFFF] blur-[16.32px]"></div>
      </div>
    </div>

    <!-- 时间，每秒获取一次 -->
    <div class="absolute top-[7px] right-[35px]">
      <div class="text-white text-[24px]">
        {{ curTime.hours }}:{{ curTime.minutes }}:{{ curTime.seconds }}
      </div>
      <div class="text-[14px] text-white opacity-50">
        {{ curTime.year }}年{{ curTime.month }}月{{ curTime.day }}日
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 组件：标题
 * 如果要复用，请将../assets/header文件夹一同复制，并修改style里的图片路径
 * 要实现适应屏幕宽度缩放的效果应该需要在scale布局容器内，组件内的单位都是px
 */
import { ref, onMounted } from "vue"

/**
 * 父组件传来的值
 * height       标题高度
 * bgImg        标题背景图片路径
 * title        标题文字的图片路径
 * titleHeight  标题文字高度
 * titleWidth   标题文字的宽度
 */
const props = defineProps({
  height: Number,
  bgImg: String,
  title: String,
  titleHeight: Number,
  titleWidth: Number,
})

const curTime = ref({})

const getCurTime = () => {
  const tmpTime = new Date()
  let year = tmpTime.getFullYear()
  let month = (tmpTime.getMonth() + 1)
  let day = tmpTime.getDate() < 10 ? "0" + tmpTime.getDate() : tmpTime.getDate();
  let hours = tmpTime.getHours() < 10 ? "0" + tmpTime.getHours() : tmpTime.getHours();
  let minutes = tmpTime.getMinutes() < 10 ? "0" + tmpTime.getMinutes() : tmpTime.getMinutes();
  let seconds = tmpTime.getSeconds() < 10 ? "0" + tmpTime.getSeconds() : tmpTime.getSeconds();
  curTime.value = {
    year,
    month,
    day,
    hours,
    minutes,
    seconds
  }
}

onMounted(() => {
  getCurTime()
  setInterval(() => {
    getCurTime()
  }, 1000)
})
</script>

<style lang="scss" scoped>
.title-left {
  position: absolute;
  top: 5px;
  left: -535px;
  background-image: url("/src/views/growthMonitoringModelDataCenter/assets/header/title-left.png");
  width: 487px;
  height: 15px;
}
.title-right {
  position: absolute;
  top: 5px;
  left: 430px;
  background-image: url("/src/views/growthMonitoringModelDataCenter/assets/header/title-right.png");
  width: 487px;
  height: 15px;
}
.title-above {
  position: absolute;
  top: -20px;
  left: -420px;
  background-image: url("/src/views/growthMonitoringModelDataCenter/assets/header/title-above.png");
  width: 1233px;
  height: 4px;
}
.title-under {
  position: absolute;
  top: 34px;
  left: -767px;
  background-image: url("/src/views/growthMonitoringModelDataCenter/assets/header/title-under.png");
  background-size: 100% 100%;
  width: 1920px;
  height: 30.5px;
}
</style>
