<template>
  <div class="w-full h-[100vh] overflow-auto home-page-bg flex justify-center items-center">
    <div class="grid w-75% h-70% grid-cols-3 grid-rows-3 gap-[1rem]">
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('index')">
        <div class="icon-1 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-80px color-[#50a3fe]' style="font-weight: 700">首页
          </div>
          <div class='color-[#627592] text-sm'>设备信息 | 预警信息</div>
          <div class='color-[#627592] text-sm my-8px'>种养殖监测数据统计信息</div>
          <div class='color-[#627592] text-sm'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="bigscreenRoute && router.push(bigscreenRoute)">
        <div class="icon-2 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-150px color-[#50a3fe]' style="font-weight: 700">
            可视化大屏
          </div>
          <div class='color-[#627592] text-sm'>产业基地 | 智慧种植 | 风险预警</div>
          <div class='color-[#627592] text-sm my-8px'>设备一张图</div>
          <div class='color-[#627592] text-sm'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/internetMonitor/device/overview')">
        <div class="icon-3 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-135px color-[#50a3fe]' style="font-weight: 700">
            智能物联
          </div>
          <div class='color-[#627592] text-sm'>设备在线管理 | 气象环境监测</div>
          <div class='color-[#627592] text-sm my-8px'>土壤墒情 | 水质环境 | 虫情虫害</div>
          <div class='color-[#627592] text-sm'>智能预警 | 智能统计</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/farm_work/crop-base')">
        <div class="icon-4 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-135px color-[#50a3fe]' style="font-weight: 700">
            智慧种植
          </div>
          <div class='color-[#627592] text-sm'>记录农事任务 | 农事活动</div>
          <div class='color-[#627592] text-sm my-8px'>作物生长 | 作物采收 | 产业模型</div>
          <div class='color-[#627592] text-sm'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/asset/base/parkinfo')">
        <div class="icon-5 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-135px color-[#50a3fe]' style="font-weight: 700">
            农业资源
          </div>
          <div class='color-[#627592] text-sm'>农业示范基地 | 产业园区</div>
          <div class='color-[#627592] text-sm my-8px'>农业物资 | 仓库管理</div>
          <div class='color-[#627592] text-sm'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/pcg/production/village-product')">
        <div class="icon-6 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-135px color-[#50a3fe]' style="font-weight: 700">
            智慧销产
          </div>
          <div class='color-[#627592] text-sm'>生产加工 | 营销方案 | 特色产品</div>
          <div class='color-[#627592] text-sm mt-8px'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/knowledge/repository')">
        <div class="icon-7 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-100px color-[#50a3fe]' style="font-weight: 700">
            知识库
          </div>
          <div class='color-[#627592] text-sm'>产业模型 | 专家知识</div>
          <div class='color-[#627592] text-sm my-8px'>种养殖专题 | 虫情害防治</div>
          <div class='color-[#627592] text-sm'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/lifeTrace')">
        <div class="icon-8 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-135px color-[#50a3fe]' style="font-weight: 700">
            溯源管理
          </div>
          <div class='color-[#627592] text-sm'>产品溯源 | 作物农事生命周期溯源</div>
          <div class='color-[#627592] text-sm my-8px'>...</div>
        </div>
      </div>
      <div class="home-item-bg w-100% h-100% flex items-center justify-center"
           @click="router.push('/system/tenant/list')">
        <div class="icon-9 ml-40px"></div>
        <div class="flex-1">
          <div class='item-top-bg text-3xl w-135px  color-[#50a3fe]' style="font-weight: 700">
            系统管理
          </div>
          <div class='color-[#627592] text-sm'>租户管理 | 用户管理 | 角色管理</div>
          <div class='color-[#627592] text-sm my-8px'>权限设置 | 菜单管理 | 日志管理</div>
          <div class='color-[#627592] text-sm'>...</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {getTenantId} from '@/utils/auth'
import {CACHE_KEY, useCache} from '@/hooks/web/useCache'
import {getRouteByTenant} from '@/api/system/user'

const router = useRouter()
const bigscreenRoute = ref('')

onMounted(() => {
  const tenantId = getTenantId()
  const bigscreenRoute = ref('/bigscreen')
  const {wsCache} = useCache()
  const roles = wsCache.get(CACHE_KEY.USER).roles
  const MatchRouteMap = async () => {
    const data = await getRouteByTenant({id: tenantId})
    bigscreenRoute.value = data.bigScreen
    console.log(roles)
    if (roles.indexOf('wulong') !== -1) bigscreenRoute.value = '/bigscreen5'
    if (roles.indexOf('youyang') !== -1) bigscreenRoute.value = '/bigscreen6'
    if (roles.indexOf('aikou') !== -1) bigscreenRoute.value = '/bigscreen9'
    if (roles.indexOf('wenfeng') !== -1) bigscreenRoute.value = '/bigscreenWF'
    if (roles.indexOf('baibu') !== -1) bigscreenRoute.value = '/bigscreenBB'
    if (roles.indexOf('baidi') !== -1) bigscreenRoute.value = '/bigscreen10'
    if (roles.indexOf('fuling_dashun_mingyue') !== -1) bigscreenRoute.value = '/bigscreenMY'
    if (roles.indexOf('qianjiang') !== -1) bigscreenRoute.value = '/bigscreenQJ'
    if (roles.indexOf('tianyin') !== -1) bigscreenRoute.value = '/bigscreenTB'
    if (roles.indexOf('shuangqiao') !== -1) bigscreenRoute.value = '/bigscreenShuangQiao'
  }
  MatchRouteMap()
})
</script>
<style lang="scss" scoped>
@import url(../../utils/bigscreenTool/index.scss);

.home-page-bg {
  background-image: url(./assets/bg.png);
  background-size: 100% 100%;
}

.home-item-bg {
  background-image: url(./assets/itemBg2.png);
  background-size: 100% 100%;
}

.item-top-bg {
  background-image: url(./assets/item-top-bg.png);
  background-size: 100% 100%;
  font-family: 'TitleFont';
}

@for $i from 1 through 9 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% 100%;
    width: 4.5rem;
    height: 4.5rem;
    margin-right: 15px;
  }
}
</style>
