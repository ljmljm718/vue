<script setup lang="ts">
// 水源分布
import CustomSelector from './CustomSelector.vue';
import request from '@/config/axios';
import { DICT_TYPE, getDictLabel } from '@/utils/dict';
import * as turf from '@turf/turf';

// 获得水源分布
const getWaterDistribution = async (params: any) => {
  return await request.get({ url: `/agriculture/water-source/getWaterDistribution`, params });
};

const iconMap = new Map([
  ['河', '/images/waterManage/icon1.png'],
  ['渠', '/images/waterManage/icon2.png'],
  ['湖', '/images/waterManage/icon3.png'],
  ['池', '/images/waterManage/icon4.png'],
  ['井', '/images/waterManage/icon5.png'],
  ['库', '/images/waterManage/icon6.png']
]);

const waterSourceList = ref<any[]>([]);
const getWaterSourceList = async () => {
  const res = await getWaterDistribution({});
  const builtSourceList: any[] = [];
  for (const key in res) {
    console.log('label', getDictLabel(DICT_TYPE.WS_TYPE, key));
    builtSourceList.push({
      id: key,
      name: getDictLabel(DICT_TYPE.WS_TYPE, key),
      children: res[key].map((ele) => ({ ...ele, name: ele.wsName }))
    });
  }
  waterSourceList.value = builtSourceList;
  nextTick(() => {
    const markerList = [];
    builtSourceList.forEach((ele) => {
      if (!Array.isArray(ele.children)) return;
      ele.children.forEach((item) => {
        const nameArr = ele.name.split('');
        let icon = '';
        nameArr.forEach((nameItem) => {
          const _iconItem = iconMap.get(nameItem);
          if (_iconItem) icon = _iconItem;
        });
        markerList.push({ ...item, icon });
      });
    });
    drawMarksToMap(markerList, true);
  });
};
getWaterSourceList();

const handleMenuChange = (item) => {
  console.log('handleMenuChange item', item);
};

const mapIns = ref();
const markersList = ref<any[]>([]);
const drawMarksToMap = (arr: any[], setCenter = false) => {
  console.log(
    'drawMarksToMap',
    arr.map((e) => e.id)
  );
  if (!mapIns.value) return;
  markersList.value = arr;
  const centerPoi = turf.centroid(
    turf.points(
      arr
        .filter((ele) => ele.longitude && ele.latitude)
        .map((ele) => [parseFloat(ele.longitude), parseFloat(ele.latitude)])
    )
  );
  const [centerLng, centerLat] = centerPoi.geometry.coordinates;
  if (setCenter) mapIns.value.setCenterZoom([centerLat, centerLng], 7);
  arr.forEach((ele) => {
    const { longitude, latitude, name, icon, id, selected } = ele;
    mapIns.value.addHTMLMarker(
      `<div class="w-[2px] h-[2px] relative">
        <div class="absolute bottom-0 left-[-50px] w-[100px] flex flex-col items-center space-y-[8px]">
          <div
            class="py-[3px] min-w-[80px] text-center"
            style="background-image: url(${selected ? '/images/waterManage/mask.png' : 'none'});background-size: 100% 100%;color: ${selected ? '#03c5f0' : '#fff'}"
           >${name}</div>
          <img src="${icon}" class="w-50px h-50px object-contain" />
        </div>
        ${selected ? '<img src="/images/waterManage/platform.png" class="absolute w-60px bottom-[-30px] left-[-40px]" />' : ''}

      </div>`,
      [2, 2],
      [parseFloat(longitude), parseFloat(latitude)],
      { id }
    );
  });
};

const handleMarkerClick = (item) => {
  const { id } = item;
  const formattedArr = markersList.value.map((ele) => {
    if (ele.id === id) return { ...ele, selected: true };
    return { ...ele, selected: false };
  });
  console.log('formattedArr', formattedArr);
  mapIns.value.clearHTMLMarker();
  drawMarksToMap(formattedArr);
};
</script>
<template>
  <CustomSelector
    menuTitle="水源列表"
    menuType="default"
    @change="handleMenuChange"
    :menuList="waterSourceList"
  >
    <div class="relative bg-white w-full h-full">
      <map-custom ref="mapIns" :enableEdit="false" @html-marker-click="handleMarkerClick" />
      <div
        class="absolute left-0 top-0 h-60px min-w-20px z-999 flex space-x-[20px] items-center px-20px text-[#fff]"
      >
        <div class="flex items-center space-x-[12px]">
          <img :src="iconMap.get('河')" class="w-24px h-24px object-contain" />
          <div>江河</div>
        </div>
        <div class="flex items-center space-x-[12px]">
          <img :src="iconMap.get('渠')" class="w-24px h-24px object-contain" />
          <div>渠道</div>
        </div>
        <div class="flex items-center space-x-[12px]">
          <img :src="iconMap.get('湖')" class="w-24px h-24px object-contain" />
          <div>湖泊</div>
        </div>
        <div class="flex items-center space-x-[12px]">
          <img :src="iconMap.get('井')" class="w-24px h-24px object-contain" />
          <div>水井</div>
        </div>
        <div class="flex items-center space-x-[12px]">
          <img :src="iconMap.get('库')" class="w-24px h-24px object-contain" />
          <div>水库</div>
        </div>
        <div class="flex items-center space-x-[12px]">
          <img :src="iconMap.get('池')" class="w-24px h-24px object-contain" />
          <div>蓄水池</div>
        </div>
      </div>
    </div>
  </CustomSelector>
</template>
<style scoped lang="scss"></style>
