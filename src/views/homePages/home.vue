<template>
  <div class="bg-[#0E1925] w-[100vw] h-[100vh]">
    <scale-box>
      <div class="w-full h-full overflow-hidden home-bg relative">
        <!-- 标题 -->
        <div class="h-[8%]"></div>
        <img
          class="absolute right-[1rem] top-[3.5rem] w-[5rem] cursor-pointer transition-all"
          @click="loginOut"
          :src="exitImg"
        />
        <div class="h-[91%] flex justify-center items-center relative bottom-bg bg-transparent">
          <div class="relative top-[-10em] z-20 w-[32em] h-[32em]">
            <!-- 中心 -->
            <div class="up-down-frame">
              <div class="absolute left-.6em top-.4rem circle-bg w-[32em] h-[32em]"></div>
              <div class="absolute center-bg w-[31em] h-[31em] left-[1em] top-[1em]">
                <!-- <div :class="['icon-frame', 'icon-' + curIcon]"></div> -->
                <div class="icon-frame center-img"></div>
                <div class="light-bg"></div>
                <div class="pedestal1"></div>
                <div class="pedestal2"></div>
                <div class="pedestal3"></div>
                <div class="pedestal4"></div>
              </div>
            </div>
            <!-- 分支 -->
            <div class="up-left-line cursor-pointer">
              <div
                class="sensor-bg relative left-[-11em] top-[-14em]"
                @click="routerHandler('智能感知')"
              ></div>
            </div>
            <div class="up-right-line cursor-pointer">
              <div
                class="resource-bg relative left-[4em] top-[-14em]"
                @click="routerHandler('农业资源')"
              ></div>
            </div>
            <div class="left-line cursor-pointer">
              <div
                class="agri-bg relative left-[-13em] top-[-7em]"
                @click="routerHandler('智慧农事')"
              ></div>
            </div>
            <div class="right-line cursor-pointer">
              <div
                class="digital-bg relative right-[-13em] top-[-7em]"
                @click="routerHandler('数字产销')"
              ></div>
            </div>
            <div class="down-left-line cursor-pointer">
              <div
                class="monitor-bg relative left-[-13em] top-[3em]"
                @click="routerHandler('视频监控')"
              ></div>
            </div>
            <div class="down-right-line cursor-pointer">
              <div
                class="drive-bg relative left-[3em] top-[3em]"
                @click="routerHandler('可视化驾驶舱')"
              ></div>
            </div>
            <!-- <div class="monitor-detect" @click="routerHandler('模型监测')"></div> -->
            <!-- 两侧菜单 -->
            <div class="rect-bg text-[#fff] text-[1.2em] relative cursor-default">
              <div
                class="absolute left-[-14rem] top-0 w-[17rem] h-full flex flex-col justify-between py-[2.5rem] box-border"
              >
                <div class="left-top-wrapper flex flex-col space-y-[.7rem]">
                  <div
                    class="lt-label-1 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] text-[1.4em] relative left-[1.2rem]"
                    @click="routerHandler('GIS一张图')"
                  >
                    GIS一张图
                  </div>
                  <div
                    class="lt-label-2 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[-.2rem] text-[1.4em]"
                    @click="routerHandler('设备概览')"
                  >
                    设备概览
                  </div>
                  <div
                    class="lt-label-3 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[-1.1em] text-[1.4em]"
                    @click="routerHandler('数字监测')"
                  >
                    数字监测
                  </div>
                  <div
                    class="lt-label-4 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[-2.2rem] text-[1.4em]"
                    @click="routerHandler('智能预警')"
                  >
                    智能预警
                  </div>
                </div>
                <div class="left-bottom-wrapper flex flex-col space-y-[.7rem]">
                  <div
                    class="lb-label-4 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[-2.2rem] text-[1.4em]"
                    @click="routerHandler('农事概览')"
                  >
                    农事概览
                  </div>
                  <div
                    class="lb-label-3 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[-1.4rem] text-[1.4em]"
                    @click="routerHandler('农事活动')"
                  >
                    农事活动
                  </div>
                  <div
                    class="lb-label-2 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[-.1rem] text-[1.4em]"
                    @click="routerHandler('种植管理')"
                  >
                    种植管理
                  </div>
                  <div
                    class="lb-label-1 w-[10em] h-[2.4em] flex flex-row-reverse items-center pr-[2em] relative left-[1.5rem] text-[1.4em]"
                    @click="routerHandler('种植溯源')"
                  >
                    种植溯源
                  </div>
                </div>
              </div>
              <div
                class="absolute right-[-14rem] top-0 w-[17rem] h-full flex flex-col justify-between py-[2.5rem] box-border"
              >
                <div class="right-top-wrapper flex flex-col space-y-[.7rem]">
                  <div
                    class="rt-label-1 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[.5em] text-[1.4em]"
                    @click="routerHandler('基地总览')"
                  >
                    基地总览
                  </div>
                  <div
                    class="rt-label-2 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[1.7em] text-[1.4em]"
                    @click="routerHandler('投入品管理')"
                  >
                    投入品管理
                  </div>
                  <div
                    class="rt-label-3 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[2.6em] text-[1.4em]"
                    @click="routerHandler('库存管理')"
                  >
                    库存管理
                  </div>
                  <div
                    class="rt-label-4 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[3.3em] text-[1.4em]"
                    @click="routerHandler('采购管理')"
                  >
                    采购管理
                  </div>
                </div>
                <div class="right-bottom-wrapper flex flex-col space-y-[.7rem]">
                  <div
                    class="rb-label-4 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[3.3em] text-[1.4em]"
                    @click="routerHandler('加工记录')"
                  >
                    加工记录
                  </div>
                  <div
                    class="rb-label-3 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[2.6em] text-[1.4em]"
                    @click="routerHandler('产品流通')"
                  >
                    产品流通
                  </div>
                  <div
                    class="rb-label-2 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[1.7em] text-[1.4em]"
                    @click="routerHandler('营销方案')"
                  >
                    营销方案
                  </div>
                  <div
                    class="rb-label-1 w-[10em] h-[2.4em] flex items-center pl-[2em] relative left-[.5em] text-[1.4em]"
                    @click="routerHandler('特色产品')"
                  >
                    特色产品
                  </div>
                </div>
              </div>
              <!-- 左右圆弧上的翠绿色短弧和箭头 -->
              <div class="left-decorator"></div>
              <div class="left-arrow"></div>
              <div class="right-decorator"></div>
              <div class="right-arrow"></div>
            </div>
          </div>
        </div>
        <div
          class="w-full py-3 justify-center absolute bottom-[50px] space-x-[36px] left-0 flex items-center"
        >
          <div class="flex items-center" @click="routerHandler('模型监测')">
            <div class="w-120px h-106px bottom-icon-1"></div>
            <div class="flex items-center justify-center bottom-label">生长监测</div>
          </div>
          <div class="flex items-center" @click="routerHandler('产品溯源')">
            <div class="w-120px h-106px bottom-icon-2"></div>
            <div class="flex items-center justify-center bottom-label">产品溯源</div>
          </div>
          <div class="flex items-center" @click="routerHandler('病虫监测')">
            <div class="w-120px h-106px bottom-icon-3"></div>
            <div class="flex items-center justify-center bottom-label">病虫监测</div>
          </div>
        </div>
      </div>
    </scale-box>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
import ScaleBox from 'vue3-scale-box';
import { useTagsViewStore } from '@/store/modules/tagsView';
import { useUserStore } from '@/store/modules/user';
import exitImg from './assets/exit.png';

const { wsCache } = useCache();
const router = useRouter();

const buildedRoutes = ref<string[]>([]);
const buildRoleRoutes = (route_arr: any[]): string[] => {
  const res: string[] = [];
  if (!Array.isArray(route_arr)) return res;
  route_arr.forEach((item) => {
    if (item.children && Array.isArray(item.children)) {
      const childBuildedRoutes: string[] = buildRoleRoutes(item.children);
      childBuildedRoutes.forEach((childRoute) => {
        res.push(item.path + '/' + childRoute);
      });
    } else {
      res.push(item.path);
    }
  });
  return res;
};
buildedRoutes.value = [
  ...buildRoleRoutes(wsCache.get(CACHE_KEY.ROLE_ROUTERS)),
  // @ts-ignore
  ...buildRoleRoutes(router.options.routes)
];

const curIcon = ref(1);
let timer: any = null;
onMounted(() => {
  timer = setInterval(() => {
    if (curIcon.value === 7) curIcon.value = 1;
    else curIcon.value++;
  }, 3500);
});
onUnmounted(() => {
  timer && clearInterval(timer);
});

const routerHandler = (item: string) => {
  const userInfo = wsCache.get(CACHE_KEY.USER);
  let isErDuUser = false;
  if (Array.isArray(userInfo.roles)) {
    userInfo.roles.forEach((item) => {
      if (item === 'erdu') isErDuUser = true;
    });
  }
  const routeMap = {
    可视化驾驶舱: wsCache.get(CACHE_KEY.BIGSCREEN_PATH) || '/homeIndex',

    GIS一张图: '/internetMonitor/gis',
    设备巡检: '/internetMonitor/check/checkView',
    设备概览: '/internetMonitor/device/overview',
    智能预警: '/internetMonitor/warn/agri-warning-record',
    数字监测: '/internetMonitor/deviceData/equipment-data-three',

    农事活动: '/farm_work/farmManage/farm-record',
    种植管理: '/farm_work/crop-base',
    种植溯源: isErDuUser ? '/trace/trace-visual' : '/trace/plant-trace',
    监测模型: '/growth_monitor/modelMonitor',
    农事概览: '/farm_work/agriOverview',

    基地总览: '/asset/tianyin',
    投入品管理: '/asset/agriculturalResourcesManagement/duck-house-management',
    库存管理: '/asset/inventory/stock/warehouse',
    采购管理: '/farm_work/harvest-management',

    特色产品: '/pcg/production/village-product',
    营销方案: '/pcg/marketingCenter/marketing-program',
    产品流通: '/pcg/sale/village-product-circulation',
    加工记录: '/pcg/product/record',

    智能感知: '/internetMonitor/deviceData/equipment-smart-count',
    农业资源: '/asset/base/parkinfo',
    视频监控: '/internetMonitor/deviceData/info',
    数字产销: '/pcg/production/village-product',
    智慧农事: '/farm_work/crop-base',
    // '模型监测': '/growth_monitor/modelMonitor',
    模型监测: '/growthMonitoringModelDataCenter',

    产品溯源: '/trace/trace-visual',
    病虫监测: '/disease_pest_surveillance/pestWarn'
  };

  if (routeMap[item]) {
    if (buildedRoutes.value.indexOf(routeMap[item]) === -1) {
      return ElMessage.warning('暂未开放该功能');
    } else window.open(routeMap[item]);
  } else {
    return ElMessage.warning('暂无此菜单权限！');
  }
};

const userStore = useUserStore();
const tagsViewStore = useTagsViewStore();
const { t } = useI18n();
const { replace } = useRouter();
const loginOut = async () => {
  try {
    await ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    });
    await userStore.loginOut();
    tagsViewStore.delAllViews();
    replace('/login?redirect=/index');
  } catch {}
};
</script>
<style lang="scss" scoped>
.center-img {
  background-image: url(./assets/homeV2/centerImg.png);
  background-size: 100% 100%;
}

.home-bg {
  background-image: url(./assets/homeV2/bg.png);
  background-size: 100% 100%;
  font-size: 12px;
}

@for $i from 1 through 3 {
  .bottom-icon-#{$i} {
    background-image: url(./assets/homeV2/bottomIcon#{$i}.png);
    background-size: 100% 100%;
  }
}

.bottom-label {
  width: 150px;
  height: 50px;
  font-size: 24px;
  color: #d5f1e3;
  background-image: url(./assets/homeV2/bottomLabel.png);
  background-size: 100% 100%;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  } /* 开始时旋转0度 */
  100% {
    transform: rotate(360deg);
  } /* 结束时旋转360度，即一圈 */
}
.circle-bg {
  background-image: url(./assets/homeV2/circle.png);
  background-size: 100% 100%;
  animation: spin 2s linear infinite;
}
.light-bg {
  background-image: url(./assets/homeV2/light-bg.png);
  background-size: 100% 100%;
  position: absolute;
  top: 14em;
  left: 5.6em;
  width: 20em;
  height: 10em;
  z-index: 5;
}
.pedestal1 {
  background-image: url(./assets/homeV2/pedestal1.png);
  background-size: 100% 100%;
  position: absolute;
  top: 21.5em;
  left: 12.3em;
  width: 6.7em;
  height: 1.7em;
  z-index: 4;
}
.pedestal2 {
  background-image: url(./assets/homeV2/pedestal2.png);
  background-size: 100% 100%;
  position: absolute;
  top: 20.8em;
  left: 9.4em;
  width: 12.4em;
  height: 3.4em;
  z-index: 3;
}
.pedestal3 {
  background-image: url(./assets/homeV2/pedestal3.png);
  background-size: 100% 100%;
  position: absolute;
  top: 22.5em;
  left: 9.4em;
  width: 12.4em;
  height: 2.5em;
  z-index: 2;
}
.pedestal4 {
  background-image: url(./assets/homeV2/pedestal4.png);
  background-size: 100% 100%;
  position: absolute;
  top: 22em;
  left: 6.5em;
  width: 18em;
  height: 4.6em;
  z-index: 1;
}

.bottom-bg {
  background-color: transparent;
}

.center-bg {
  background-image: url(./assets/homeV2/centerBg2.png);
  background-size: 100% 100%;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  } /* 动画开始和结束时，元素回到原始位置 */
  50% {
    transform: translateY(-2em);
  } /* 动画中间点，元素向上移动20px */
}
.up-down-frame {
  position: relative;
  z-index: 9999;
  animation: bounce 2s ease-in-out infinite alternate;
}

.up-left-line,
.up-right-line,
.down-left-line,
.down-right-line,
.left-line,
.right-line {
  position: relative;
  background-size: 100% 100%;
  z-index: 999;
}
.up-left-line {
  background-image: url(./assets/homeV2/up-left-line.png);
  width: 9em;
  height: 8em;
  left: -7em;
  top: 12em;
}
.up-right-line {
  background-image: url(./assets/homeV2/up-right-line.png);
  width: 9em;
  height: 8em;
  left: 30em;
  top: 4em;
}

.down-left-line {
  background-image: url(./assets/homeV2/down-left-line.png);
  width: 6em;
  height: 11em;
  left: 0em;
  top: 6em;
}

.down-right-line {
  background-image: url(./assets/homeV2/down-right-line.png);
  width: 6em;
  height: 11em;
  left: 25em;
  top: -4em;
}

.left-line {
  background-image: url(./assets/homeV2/left-line.png);
  width: 16em;
  height: 3em;
  left: -13em;
  top: 8em;
}

.right-line {
  background-image: url(./assets/homeV2/right-line.png);
  width: 16em;
  height: 3em;
  left: 30em;
  top: 5em;
}

.sensor-bg {
  background-image: url(./assets/homeV2/sensor.png);
}
.resource-bg {
  background-image: url(./assets/homeV2/resource.png);
}
.monitor-bg {
  background-image: url(./assets/homeV2/monitor.png);
}
.digital-bg {
  background-image: url(./assets/homeV2/digital.png);
}
.agri-bg {
  background-image: url(./assets/homeV2/agri.png);
}
.drive-bg {
  background-image: url(./assets/homeV2/drive.png);
}

.sensor-bg,
.resource-bg,
.monitor-bg,
.digital-bg,
.agri-bg,
.drive-bg {
  width: 16em;
  height: 17em;
  background-size: 100% 100%;
  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease;
  }
}

.monitor-detect {
  background-image: url(./assets/homeV2/monitorDetect.png);
  background-size: 100% 100%;
  width: 12rem;
  aspect-ratio: 0.73;
  position: absolute;
  left: 5.6rem;
  top: 24rem;
  z-index: 99;
  transition: all 0.3s ease;
}

.monitor-detect:hover {
  transform: scale(1.1);
}

.rect-bg {
  background-image: url(./assets/homeV2/rect.png);
  background-size: 100% 100%;
  width: 92.5em;
  height: 46em;
  aspect-ratio: 2.07;
  position: absolute;
  left: -33em;
  top: 0em;
}

.left-decorator {
  background-image: url(./assets/homeV2/left-decorator.png);
  background-size: 100% 100%;
  width: 0.8em;
  height: 10em;
  position: absolute;
  top: 18em;
  left: -1.3em;
}

.left-arrow {
  background-image: url(./assets/homeV2/left-arrow.png);
  background-size: 100% 100%;
  width: 0.8em;
  height: 1.6em;
  position: absolute;
  top: 22em;
  left: -2.6em;
}

.right-decorator {
  background-image: url(./assets/homeV2/right-decorator.png);
  background-size: 100% 100%;
  width: 0.8em;
  height: 10em;
  position: absolute;
  top: 18em;
  right: -1.3em;
}

.right-arrow {
  background-image: url(./assets/homeV2/right-arrow.png);
  background-size: 100% 100%;
  width: 0.8em;
  height: 1.6em;
  position: absolute;
  top: 22em;
  right: -2.6em;
}

@for $i from 1 through 7 {
  .icon-#{$i} {
    background-image: url(./assets/homeV2/icon#{$i}.png);
  }
}

.icon-frame {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% auto;
  width: 31em;
  height: 31em;
  position: relative;
  left: 0em;
  top: 0em;
  z-index: 6;
}

// lb-label-1的背景图是lt-label-4的上下翻转，依次类推
$j: 4;
@for $i from 1 through 4 {
  .lt-label-#{$i} {
    background-image: url(./assets/homeV2/label#{$i}.png);
    background-size: 100% 100%;
  }
  .lt-label-#{$i}:hover {
    background-image: url(./assets/homeV2/slabel#{$i}.png);
    background-size: 100% 100%;
    color: #11f47f;
  }

  .lb-label-#{$i} {
    position: relative;
  }
  .lb-label-#{$i}::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/homeV2/label#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleY(-1);
  }
  .lb-label-#{$i}:hover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/homeV2/slabel#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleY(-1);
  }
  .lb-label-#{$i}:hover {
    color: #11f47f;
  }

  .rt-label-#{$i} {
    position: relative;
  }
  .rt-label-#{$i}::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/homeV2/label#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleX(-1);
  }
  .rt-label-#{$i}:hover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/homeV2/slabel#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleX(-1);
  }
  .rt-label-#{$i}:hover {
    color: #11f47f;
  }

  .rb-label-#{$i} {
    position: relative;
  }
  .rb-label-#{$i}::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/homeV2/label#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleY(-1) scaleX(-1);
  }
  .rb-label-#{$i}:hover::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    background: url(./assets/homeV2/slabel#{$i}.png) no-repeat center center;
    background-size: 100% 100%;
    transform: scaleY(-1) scaleX(-1);
  }
  .rb-label-#{$i}:hover {
    color: #11f47f;
  }
}
</style>
