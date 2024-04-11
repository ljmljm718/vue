<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import { ref, onMounted } from 'vue'
import {
  initChartStatic,
  generateBaseOptions
} from '../../utils/bigscreenTool/index'
import {
  industryStatistics,
  baidiParkInfo,
  monitorDeviceByParkId,
  warningRecordInfo,
} from './apis'
import * as echarts from 'echarts'
import { formatTime } from '@/utils/index'

// 获取监控设备 
const getMonitorDeviceByParkId = async (belongPark) => {
  const res = await monitorDeviceByParkId({ belongPark })
  console.log('getMonitorDeviceByParkId', res);
}

const baidiIntroInfo = ref<any>({
  img: '',
  remark: ''
})
const getBaidiParkInfo = async () => {
  const res = await baidiParkInfo()
  console.log('getBaidiParkInfo', res[0]);
  baidiIntroInfo.value = res[0]
}
getBaidiParkInfo()

const getIndustryStatistics = async () => {
  const {
    parkCount = '0',
    parkArea = '0',
    factoryCount = '0',
    factoryArea = '0'
  } = await industryStatistics();
  
  industryList.value = [
    {
      title: '基地数量',
      value: parkCount
    }, {
      title: '种植面积',
      value: parkArea + '亩'
    }, {
      title: '厂区数量',
      value: factoryCount
    },
    {
      title: '厂区面积',
      value: factoryArea + '亩'
    },
  ]
}
getIndustryStatistics()

const industryList = ref([{
  title: '基地数量',
  value: '0'
}, {
  title: '种植面积',
  value: '0亩'
}, {
  title: '厂区数量',
  value: '0'
}, {
  title: '厂区面积',
  value: '0亩'
}])

const initChart1 = () => {
  initChartStatic(
    'chart1',
    generateBaseOptions({
      xAxis: {
        data: [1,2,3,4,5],
        axisLine: {
          show: true,
          lineStyle: {
            color: '#ffffff80'
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
          name: '',
          data: [1,2,3,4,5],
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
            },
          },
          areaStyle: { normal: {} },
        }
      ],
      grid: {
        left: '8%',
        right: '6%',
        top: '16%',
        bottom: '15%'
      }
    })
  )
}

onMounted(() => { initChart1() })

const handleArrowClick = (param) => {
  console.log('params', param)
}

const monitorDeviceList = ref<Array<any>>([
  {
    online: "true",
    title: "这是一个标题",
    img: "/img.png"
  }
])

// 报警信息
const warningList = ref<Array<any>>([])
const getwarningRecordInfo = async () => {
  const res = await warningRecordInfo();
  console.log('报警信息列表', res);
  warningList.value = res
}
getwarningRecordInfo()
</script>
<template>
  <div class="bigscreen-main-wrapper">
    <div class="header-main-wrapper header-bg">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="header-title-wrapper">巫溪文风三宝村桂花产业数字化赋能</div>
      <div class="header-right-part-wrapper"></div>
    </div>
    <div class="content-main-wrapper grid-container">
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title title-bg">
            <div>产业介绍</div>
          </div>
          <div class="main-item-container flex flex-col">
            <div class="w-full flex justify-center h-[4.6rem]">
              <div v-for="(item, index) in industryList" :key="index"
                class="flex flex-col items-center industry-bg h-full w-[28%] mx-1">
                <div style="font-size: 1.2rem;font-family: 'TitleFont';">{{ item.value }}</div>
                <div style="font-size: .9rem;color: #00d4ff;">{{ item.title }}</div>
              </div>
            </div>
            <div style="height: calc(100% - 19.5rem);padding: 1rem;">
              <img :src="baidiIntroInfo.img" align="left" width="160" style="margin: .3rem 1rem 1rem .3rem;" />
              <span>{{ baidiIntroInfo.remark }}</span>
            </div>
            <div
              class="sub-title-bg h-[2rem]"
              style="margin-left: .7rem;width: calc(100% - .7rem);margin-bottom: .9rem;"
            >长势分析</div>
            <div id="chart1" style="height: 12rem;"></div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper" style="grid-column: span 2;">
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">智慧种植</div>
          <div class="main-item-container flex flex-col">
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-[length:100%_100%] card-width-bg flex justify-between p-3 col-span-2">
                <span>物联网设备</span>
                <span>
                  <span>总数</span>
                  <span style="color: #00ff96;font-family: 'TitleFont';">104</span>
                  <span>台</span>
                </span>
              </div>
              <div
                class="bg-[length:100%_100%] card-thin-bg p-2 px-3"
                v-for="item in 6"
                :key="item"
                style="font-size: .8rem;"
              >
                <div class="flex justify-between">
                  <span>生长监控</span>
                  <span>65</span>
                </div>
                <div class="flex justify-between">
                  <span>在线60</span>
                  <span>离线5</span>
                </div>
              </div>
            </div>
            <div class="sub-title-bg w-full h-[2rem]">环境数据</div>
            <div class="grid grid-cols-4 gap-1 p-1">
              <div class="bg-[length:100%_100%] card-bg p-2 flex flex-col items-center justify-center" style="font-size: .8rem;">
                <div class="bg-[length:100%_100%] temp-icon"></div>
                <div style="font-family: 'TitleFont';" class="pt-1">11.14℃</div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
            </div>
            <div class="sub-title-bg w-full h-[2rem]">土壤数据</div>
            <div class="grid grid-cols-4 gap-1 p-1">
              <div class="bg-[length:100%_100%] card-bg p-2 flex flex-col items-center justify-center" style="font-size: .8rem;">
                <div class="bg-[length:100%_100%] temp-icon"></div>
                <div style="font-family: 'TitleFont';" class="pt-1">11.14℃</div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
              <div class="bg-[length:100%_100%] card-bg px-1" style="font-size: .8rem;">
                <div class="flex justify-between p-2" style="border-bottom: 1px solid #5fabd980;">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
                <div class="flex justify-between p-2">
                  <span>湿度</span>
                  <span style="color: #68fffe;">98.19%</span>
                </div>
              </div>
            </div>
            <div class="sub-title-bg w-full h-[2rem]">虫情监测</div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">烘干炉实时数据</div>
          <div class="main-item-container"></div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">品牌打造</div>
          <div class="main-item-container"></div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">报警信息</div>
          <div class="main-item-container">
            <div
              class="flex"
              v-for="(item, index) in warningList"
              :key="index"
            >
              <div :class="['w-[7rem]']">{{ item.warnTitle }}</div>
              <div class="w-calc(100% - 16rem)">{{ item.warnInfo }}</div>
              <div class="w-[9rem]">{{ formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="gird-item-wrapper">
        <div class="grid-main-item">
          <div class="main-item-title">监控设备</div>
          <div
            class="main-item-container !grid"
            style="grid-template-columns: 5% repeat(3, 30%) 5%;"
          >
            <div class="left-arrow-bg h-full" @click="handleArrowClick(-1)"></div>
            <div
              v-for="(item, index) in monitorDeviceList"
              :key="index"
              class="flex flex-col px-1"
            >
              <img :src="item.img" alt="" style="width: 100%;aspect-ratio: 1.3;object-fit: contain;" />
              <div>{{ item.title }}</div>
              <div :style="`color: ${item.online ? '#0fc87c' : '#ff0000'};`">{{ item.online ? '在线' : '离线' }}</div>
            </div>
            <div
              class="right-arrow-bg h-full"
              v-show="monitorDeviceList.length === 3"
              @click="handleArrowClick(1)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url(../../utils/bigscreenTool/index.scss);
.header-bg {
  background-image: url(./assets/headerBg.png);
}

.industry-bg {
  background-image: url(./assets/industryBg.png);
  background-size: 100% 100%;
}

.card-width-bg {
  background-image: url(./assets/cardWidthBg.png);
  background-size: 100% 100%;
}

.card-thin-bg {
  background-image: url(./assets/cardThinBg.png);
  background-size: 100% 100%;
}

.card-bg {
  background-image: url(./assets/cardBg.png);
  background-size: 100% 100%;
}

.temp-icon {
  background-image: url(./assets/tempIcon.png);
  background-size: 100% 100%;
  width: 1.6rem;
  height: 1.6rem;
}

.left-arrow-bg {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 90% auto;
  background-image: url(./assets/leftArrowBg.png);
}

.right-arrow-bg {
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 90% auto;
  background-image: url(./assets/rightArrowBg.png);
}

.sub-title-bg {
  background-image: url(./assets/subTitleBg.png);
  background-size: 100% 100%;
  font-family: 'TitleFont';
  display: flex;
  align-items: center;
  padding-left: .5rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-template-rows: 70% 30%;
  color: aliceblue;

  .gird-item-wrapper {
    padding: 0.5rem;
    position: relative;
    z-index: 20;

    .grid-main-item {
      height: 100%;
      display: flex;
      flex-direction: column;
      .main-item-title {
        height: 2.4rem;
        padding: 0 2rem;
        padding-left: 2.3rem;
        background-size: 100% 100%;
        font-family: 'TitleFont';
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-image: url(./assets/titleBg.png);
      }

      .main-item-container {
        height: calc(100% - 2.4rem);
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center bottom;
        padding: 1rem;
        display: flex;
        flex-direction: column;

        .sub-title-wrapper {
          height: 1rem;
          display: flex;
          margin: 0.7rem 0;
          align-items: center;
        }

        .chart-wrapper {
          height: 100%;
        }
      }
    }
  }
}
</style>