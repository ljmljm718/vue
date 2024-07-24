<template>
  <div class="bg-[#0e2c46] w-[100vw] h-[100vh]">
    <ScaleBox>
      <div class="w-full h-full overflow-hidden home-bg">
        <div class="h-[8%] bg-[#000] flex justify-center items-center header-title mb-[1%]">
          鲁渝协作乡村振兴数商兴农大数据平台
        </div>
        <div class="h-[91%] flex justify-center items-center relative bottom-bg bg-[#00000030]">
          <div class="relative top-[-10em] z-20 w-[32em] h-[32em]">
            <div class="up-down-frame" @click="routerHandler('可视化驾驶舱')">
              <div class="absolute left-0 top-0 circle-bg w-[32em] h-[32em]"></div>
              <div class="absolute center-bg w-[31em] h-[31em] left-[1em] top-[1em]">
                <div :class="['icon-frame', 'icon-' + curIcon]"></div>
              </div>
            </div>
            <div class="up-line">
              <div class="sensor-bg relative left-[-7em] top-[-10em]" @click="routerHandler('智能感知')"></div>
              <div class="resource-bg absolute right-[-7em] top-[-10em]" @click="routerHandler('农业资源')"></div>
            </div>
            <div class="left-line">
              <div class="agri-bg relative left-[-9em] top-[1em]" @click="routerHandler('智慧农事')"></div>
            </div>
            <div class="right-line">
              <div class="digital-bg relative right-[-9em] top-[1em]" @click="routerHandler('数字产销')"></div>
            </div>
            <div class="down-line">
              <div class="monitor-bg relative left-[0em] top-[8em]" @click="routerHandler('视频监控')"></div>
            </div>
            <div class="rect-bg text-[#fff] text-[1.2em] relative">
              <div class="lt-label-1 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-12.7em] top-[2em]" @click="routerHandler('GIS一张图')">GIS一张图</div>
              <div class="lt-label-2 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-14.5em] top-[6.8em]" @click="routerHandler('数字监测')">数字监测</div>
              <div class="lt-label-3 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-15.9em] top-[11.6em]" @click="routerHandler('智能预警')">智能预警</div>
              <div class="lt-label-4 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-16.9em] top-[16.4em]" @click="routerHandler('设备巡检')">设备巡检</div>

              <div class="lb-label-1 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-13.2em] top-[38.6em]" @click="routerHandler('农事活动')">农事活动</div>
              <div class="lb-label-2 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-15em] top-[29.9em]" @click="routerHandler('物侯管理')">物侯管理</div>
              <div class="lb-label-3 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-16.3em] top-[21.2em]" @click="routerHandler('种植管理')">种植管理</div>
              <div class="lb-label-4 w-[15em] h-[4em] flex flex-row-reverse items-center pr-[2em] absolute left-[-17.2em] top-[12.5em]" @click="routerHandler('农事概览')">农事概览</div>

              <div class="rt-label-1 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[88.4em] top-[-13.2em]" @click="routerHandler('基地总览')">基地总览</div>
              <div class="rt-label-2 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[90.2em] top-[-12.6em]" @click="routerHandler('农资管理')">农资管理</div>
              <div class="rt-label-3 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[91.7em] top-[-11.9em]" @click="routerHandler('仓储管理')">仓储管理</div>
              <div class="relative w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[92.6em] top-[-11.2em]"></div>

              <div class="rb-label-1 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[88.5em] top-[7.2em]" @click="routerHandler('特色产品')">特色产品</div>
              <div class="rb-label-2 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[90.4em] top-[-1.5em]" @click="routerHandler('营销管理')">营销管理</div>
              <div class="rb-label-3 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[91.7em] top-[-10.1em]" @click="routerHandler('销售管理')">销售管理</div>
              <div class="rb-label-4 w-[15em] h-[4em] flex items-center pl-[2em] absolute left-[92.6em] top-[-18.8em]" @click="routerHandler('生产管理')">生产管理</div>
            </div>
          </div>
        </div>
      </div>
    </ScaleBox>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import ScaleBox from "vue3-scale-box";

const { wsCache } = useCache()

const curIcon = ref(1)
let timer:any = null
onMounted(() => {
  timer = setInterval(() => {
    if (curIcon.value === 7) curIcon.value = 1
    else curIcon.value++
  }, 3500)
})
onUnmounted(() => {
  timer && clearInterval(timer)
})

const routerHandler = (item:string) => {
  console.log('sssssssss', wsCache.get(CACHE_KEY.BIGSCREEN_PATH));
  
  const routeMap = {
    "可视化驾驶舱": wsCache.get(CACHE_KEY.BIGSCREEN_PATH) || '/homeIndex',

    "GIS一张图": "/internetMonitor/gis",
    "设备巡检": "/internetMonitor/check/checkView",
    "智能预警": "/internetMonitor/warn/agri-warning-record",
    "数字监测": "/internetMonitor/deviceData/info",

    "农事活动": "/farm_work/farmManage/farm-record",
    "种植管理": "/farm_work/crop-base",
    "物侯管理": "/farm_work/ropriate-environmental",
    "农事概览": "/farm_work/farmManage/farm-define",
    
    "基地总览": "/asset/base/parkinfo",
    "农资管理": "/asset/agriculturalResourcesManagement/duck-house-management",
    "仓储管理": "/asset/inventory/stock/warehouse",
    
    "特色产品": "/pcg/production/village-product",
    "营销管理": "/pcg/marketingCenter/marketing-program",
    "销售管理": "/pcg/sale/sales-management",
    "生产管理": "/pcg/product/record",

    "智能感知": "/internetMonitor/deviceData/equipment-smart-count",
    "农业资源": "/asset/base/parkinfo",
    "视频监控": "/internetMonitor/deviceData/monitoring-equipment-data",
    "数字产销": "/pcg/production/village-product",
    "智慧农事": "/farm_work/crop-base"
  }
  console.log("routeMap item", routeMap[item]);
  if (routeMap[item]) window.open(routeMap[item])
  else ElMessage.warning("暂无此菜单权限！")
}
</script>
<style lang="scss" scoped>
.home-bg {
  background-image: url(./assets/new_home/bg.png);
  background-size: 100% 100%;
  font-size: 12px;
}

@media (min-width: 600px) {
  .home-bg {
    font-size: 10px; /* 屏幕宽度至少为600px时的字体大小 */
  }
}

/* 当屏幕宽度至少为900px时 */
@media (min-width: 900px) {
  .home-bg {
    font-size: 12px; /* 屏幕宽度至少为900px时的字体大小 */
  }
}

.header-title {
  background-image: linear-gradient(to top, #6EEBFF, #FFFFFF);
  -webkit-background-clip: text;
  color: transparent;
  font-size: 3em;
  font-family: "ArtFont";
}

@keyframes spin {
  0% { transform: rotate(0deg); } /* 开始时旋转0度 */
  100% { transform: rotate(360deg); } /* 结束时旋转360度，即一圈 */
}
.circle-bg {
  background-image: url(./assets/new_home/circle.png);
  background-size: 100% 100%;
  animation: spin 2s linear infinite;
}

.bottom-bg {
  background-image: url(./assets/new_home/bottomBg.gif);
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center center;
}

.center-bg {
  background-image: url(./assets/new_home/centerBg.png);
  background-size: 100% 100%;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); } /* 动画开始和结束时，元素回到原始位置 */
  50% { transform: translateY(-2em); } /* 动画中间点，元素向上移动20px */
}
.up-down-frame {
  position: relative;
  z-index: 9999;
  animation: bounce 2s ease-in-out infinite alternate;
}

.up-line, .down-line, .left-line, .right-line {
  position: relative;
  background-size: 100% 100%;
  z-index: 999;
}
.up-line {
  background-image: url(./assets/new_home/upLine.png);
  width: 70em;
  height: 8em;
  left: -19em;
  top: 9em;
}

.down-line {
  background-image: url(./assets/new_home/downLine.png);
  width: 10em;
  height: 18em;
  left: 8em;
  top: 4em;
}

.left-line {
  background-image: url(./assets/new_home/leftLine.png);
  width: 15em;
  height: 10em;
  left: -11em;
  top: 19em;
}

.right-line {
  background-image: url(./assets/new_home/rightLine.png);
  width: 14em;
  height: 10em;
  left: 30em;
  top: 10em;
}

.sensor-bg { background-image: url(./assets/new_home/sensor.png); }
.resource-bg { background-image: url(./assets/new_home/resource.png); }
.monitor-bg { background-image: url(./assets/new_home/monitor.png); }
.digital-bg { background-image: url(./assets/new_home/digital.png); }
.agri-bg { background-image: url(./assets/new_home/agri.png); }

.sensor-bg, .resource-bg, .monitor-bg, .digital-bg, .agri-bg {
  width: 16em;
  height: 15em;
  background-size: 100% 100%;
  &:hover {
    transform: scale(1.1);
    transition: all .3s ease;
  }
}

.rect-bg {
  background-image: url(./assets/new_home/rect.png);
  background-size: 100% 100%;
  width: 92.5em;
  aspect-ratio: 2.07;
  position: absolute;
  left: -33em;
  top: 0em;
}

@for $i from 1 through 7 {
  .icon-#{$i} {
    background-image: url(./assets/new_home/icon#{$i}.png);
  }
}

.icon-frame {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% auto;
  width: 15em;
  height: 15em;
  position: relative;
  left: 8em;
  top: 9em;
}

@for $i from 1 through 4 {
  .lt-label-#{$i} {
    background-image: url(./assets/new_home/label#{$i}.png);
    background-size: 100% 100%;
  }
  .lt-label-#{$i}:hover {
    background-image: url(./assets/new_home/slabel#{$i}.png);
    background-size: 100% 100%;
  }

  .lb-label-#{$i} {
    position: relative;
  }
  .lb-label-#{$i}::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/new_home/label#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform:scaleY(-1);
  }
  .lb-label-#{$i}:hover::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/new_home/slabel#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform:scaleY(-1);
  }

  .rt-label-#{$i} {
    position: relative;
  }
  .rt-label-#{$i}::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/new_home/label#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleX(-1);
  }
  .rt-label-#{$i}:hover::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/new_home/slabel#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleX(-1);
  }

  .rb-label-#{$i} {
    position: relative;
  }
  .rb-label-#{$i}::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/new_home/label#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleY(-1) scaleX(-1);
  }
  .rb-label-#{$i}:hover::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/new_home/slabel#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleY(-1) scaleX(-1);
  }
}
</style>
