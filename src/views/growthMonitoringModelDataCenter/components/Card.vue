<template>
  <div 
    class="w-full grid grid-cols-1 content-between"
    :style="`height: ${ height }px`"
  >
    <!-- 标题 -->
    <div class="title">
      <div class="title-border"></div>
      <div class="link-icon"></div>
      <div class="title-content">
        <div class="title-icon"></div>
        <div class="title-text">
          {{ titleText }}<span v-if="addText">-{{ addText }}</span>
        </div>
      </div>
      <div class="absolute top-[-4px] right-[130px] w-[104px] h-[24px]" v-if="showSelect">
        <slot name="selector"></slot>
      </div>
    </div>
    <!-- 内容 -->
    <div 
      class="content relative left-[3px] p-[15px] box-border"
      :style="`width: ${ cardWidth }px; height: ${ cardHeight }px;`"
    >
      <slot>
        卡片展示内容
      </slot>
    </div>
  </div>
</template>

<script setup>
/**
 * 组件：卡片
 * 如果要复用，请将../assets/card文件夹一同复制，并修改style里的图片路径
 * 要实现适应屏幕宽度缩放的效果应该需要在scale布局容器内，组件内的单位都是px
 */

/**
 * 父组件传来的值
 * height       卡片整体高度
 * titleText    卡片标题文字
 * cardHeight   卡片内容区高度
 * cardWidth    卡片内容区宽度
 * linkUrl      跳转链接
 * showSelect   是否展示下拉菜单
 * addText      在标题上新增的文字
 */
const props = defineProps({
  height: Number,
  titleText: String,
  cardHeight: Number,
  cardWidth: Number,
  linkUrl: String,
  showSelect: Boolean,
  addText: String,
})

const handleRoute = () => {
  window.open(props.linkUrl)
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 30px;
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/card/title-bg.png);
  background-size: 100% 100%;
  position: relative;
}
.title-border {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/card/title-border.png);
  background-size: 100% 100%;
  width: 100%;
  height: 30px;
  position: absolute;
  top: 4px;
  left: -3px;
}
.link-icon {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/card/link-icon.png);
  background-size: 100% 100%;
  width: 10px;
  height: 11px;
  position: absolute;
  top: 7.5px;
  right: 16.5px;
}
.title-content {
  display: flex;
  position: absolute;
  left: 20px;
  top: -12px;
  align-items: center;
}
.title-icon {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/card/title-icon.png);
  background-size: 100% 100%;
  width: 30px;
  height: 35px;
}
.title-text {
  font-size: 20px;
  letter-spacing: 0.025em;
  background-image: linear-gradient(180deg, #FFFFFF 15%, #A9FFE1 100%);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}
.content {
  background-image: url(/src/views/growthMonitoringModelDataCenter/assets/card/card-bg.png);
  background-size: 100% 100%;
}

</style>