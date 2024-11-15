<script setup lang="ts">
import { uniqueId } from 'lodash-es';
import {
  initChartStatic,
  generatePieOptions,
  generateBaseOptions
} from '@/utils/bigscreenTool/index';
import { layoutGeneratorBus } from '../eventBus';

const props = defineProps({
  type: {
    type: String,
    default: () => ''
  },
  options: {
    type: Object,
    default: () => {}
  }
});

const getOptions = () => {
  console.log('EEEEERRRRROROORO');
  console.log('getOptions props', props.options);
  return props.type === 'pie'
    ? generatePieOptions({
        ...props.options
      })
    : generateBaseOptions({
        ...props.options,
        xAxis: {
          data: ['10月', '11月', '12月', '1月', '2月'],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ffffff80'
            }
          }
        },
        legend: {
          show: true,
          orient: 'horizontal',
          itemWidth: 15,
          itemHeight: 15
        },
        color: ['#ffa773', '#36e1d9'],
        yAxis: {
          name: '万元',
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ffffff80'
            }
          },
          splitLine: {
            //网格线
            show: true, //是否显示
            lineStyle: {
              //网格线样式
              color: '#ffffff80', //网格线颜色
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
            name: '喜力',
            data: [32, 128, 198, 188, 76],
            type: 'line',
            smooth: true
          },
          {
            name: '红满园',
            data: [312, 18, 98, 18, 96],
            type: 'line',
            smooth: true
          },
          {
            name: '樱桃番茄',
            data: [321, 12, 98, 128, 76],
            type: 'line',
            smooth: true
          },
          {
            name: '金红九',
            data: [312, 128, 18, 188, 176],
            type: 'line',
            smooth: true
          },
          {
            name: '格雷',
            data: [32, 28, 198, 188, 76],
            type: 'line',
            smooth: true
          }
        ],
        grid: {
          left: '8%',
          right: '6%',
          top: '13%',
          bottom: '15%'
        }
      });
};

const chartId = `layoutChart_${uniqueId()}`;
let chartIns: any = null;
const initChart = () => {
  const dom = document.getElementById(chartId);
  chartIns = initChartStatic(chartId, getOptions());
};

layoutGeneratorBus.on('itemResized', () => {
  chartIns?.resize();
});
onMounted(() => {
  initChart();
});
</script>
<template>
  <div class="w-full h-full" :id="chartId"></div>
</template>
<style scoped lang="scss"></style>
