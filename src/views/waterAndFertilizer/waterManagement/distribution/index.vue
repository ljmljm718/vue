<script setup lang="ts">
// 水源分布
import CustomSelector from './CustomSelector.vue';
import request from '@/config/axios';
import { DICT_TYPE, getDictLabel } from '@/utils/dict';
import * as turf from '@turf/turf';
import { initChartStatic, generateBaseOptions } from '@/utils/bigscreenTool/index';
import * as echarts from 'echarts';

// 获得水源分布
const getWaterDistribution = async (params: any) => {
  return await request.get({ url: `/agriculture/water-source/getWaterDistribution`, params });
};

// 获得水位监测折线图数据
const getWaterLevelMonitor = async (params: any) => {
  return await request.get({ url: `/agriculture/water-source/getWaterLevelMonitor`, params });
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

const handleMenuChange = (id) => {
  handleMarkerClick({ id });
  const selectedItem = markersList.value.find((ele) => ele.id === id);
  const { longitude, latitude } = selectedItem;
  mapIns.value.setCenterZoom([parseFloat(latitude), parseFloat(longitude)], 14);
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
  activeShow.value = true;
  nextTick(() => initChart(id));
  const formattedArr = markersList.value.map((ele) => {
    if (ele.id === id) return { ...ele, selected: true };
    return { ...ele, selected: false };
  });
  console.log('formattedArr', formattedArr);
  mapIns.value.clearHTMLMarker();
  drawMarksToMap(formattedArr);
};

const activeShow = ref<boolean>(false);
const showTab = computed(() => {
  const existActiveIndex = markersList.value.findIndex((item) => item.selected);
  if (existActiveIndex !== -1 && activeShow.value) return true;
  return false;
});
let chartIns: any = null;
const initChart = async (wsId: string) => {
  const res = await getWaterLevelMonitor({ wsId });
  console.log('initChart res', res);
  if (!Array.isArray(res)) return;
  const xValue = res.map((item) => item.collectionTime),
    yValue = res.map((item) => item.avgLevel);
  console.log('xValue', xValue);
  console.log('yValue', yValue);
  chartIns = initChartStatic(
    'chartContainer',
    generateBaseOptions({
      xAxis: {
        data: xValue,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#a1a1aa80',
            fontSize: 12
          }
        }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#ffa773', '#36e1d9'],
      yAxis: {
        name: '米',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#a1a1aa80'
          }
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: '#a1a1aa80', //网格线颜色
            width: 1, //网格线的加粗程度
            type: 'dashed' //网格线类型
          }
        },
        splitArea: {
          //网格区域
          show: false //是否显示
        }
      },
      series: [
        {
          name: '',
          data: yValue,
          barWidth: 30,
          type: 'line',
          smooth: true,
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#eee',
              fontSize: 10
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: '#1bcad600' },
                { offset: 0, color: '#1bcad6' }
              ])
            }
          },
          areaStyle: { normal: {} }
        }
      ],
      grid: {
        left: '32',
        right: '26',
        top: '32',
        bottom: '24'
      }
    })
  );
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
      <div
        class="absolute z-9999 right-0 top-0 w-[270px] h-full bg-white box-border p-3 transition-opacity"
        :style="`right: ${showTab ? '0px' : '-270px'};`"
      >
        <div class="flex items-center justify-between">
          <div>水位监测</div>
          <div
            class="box-border hover:bg-[#e81123] hover:text-white transition rounded-1"
            style="padding: 5px 5px 1px 5px"
            @click="activeShow = false"
          >
            <el-icon><Close /></el-icon>
          </div>
        </div>
        <div
          id="chartContainer"
          class="w-full h-160px flex items-center justify-center mt-2"
          style="border: 1px solid #e1e1e1"
        >
          暂无数据
        </div>
      </div>
    </div>
  </CustomSelector>
</template>
<style scoped lang="scss"></style>
