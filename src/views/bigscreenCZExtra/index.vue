<script setup lang="ts">
import ScaleBox from 'vue3-scale-box';
import * as echarts from 'echarts';
import { jsonData } from './assets/china';
import { initChartStatic, generateBaseOptions } from '@/utils/bigscreenTool/index';
import {
  productCirculation,
  productCirculationTop,
  productSaleDetail,
  proviceList,
  saleList,
  proviceSaleTrend,
  avgPriceByYear
} from './apis';

const formattedMoney = (num) => {
  if (!num) return 0;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 农产品流通 数据
const activeCity = ref<string>(''),
  activeBrand = ref<string>('');
const getProductCirculationData = async () => {
  const res = await productCirculation();
  console.log('🚀 ~ getProductCirculationData 农产品流通 ~ res:', res);
  const { brand, city } = res;
  activeCity.value = city;
  if (Array.isArray(brand) && brand.length > 0) {
    let index = 0;
    activeBrand.value = brand[index];
    setInterval(() => {
      activeBrand.value = brand[index];
      if (index === brand.length - 1) index = 0;
      else index++;
    }, 2000);
  }
};
getProductCirculationData();

// 农产品销售流向TOP5 数据
const top5Data = ref({
  top1: { totalPrice: '', provinceName: '' },
  top2: { totalPrice: '', provinceName: '' },
  top3: { totalPrice: '', provinceName: '' },
  top4: { totalPrice: '', provinceName: '' },
  top5: { totalPrice: '', provinceName: '' }
});
const getProductCirculationTopData = async () => {
  const res = await productCirculationTop();
  console.log('🚀 ~ getProductCirculationTopData 农产品销售流向TOP5 ~ res:', res);
  if (Array.isArray(res) && res.length === 5) {
    const [data1, data2, data3, data4, data5] = res;
    top5Data.value.top1 = data1;
    top5Data.value.top2 = data2;
    top5Data.value.top3 = data3;
    top5Data.value.top4 = data4;
    top5Data.value.top5 = data5;
  }
};
getProductCirculationTopData();

// 农产品销售详情 数据
const dataList = ref<any[]>([]);
const getProductSaleDetailData = async () => {
  const res = await productSaleDetail();
  console.log('🚀 ~ getProductSaleDetailData 农产品销售详情 ~ res:', res);
  if (!Array.isArray(res)) return;
  dataList.value = res;
};
getProductSaleDetailData();

// 产品销售数量 数据
const getProviceListData = async () => {
  const res = await proviceList();
  console.log('🚀 ~ getProviceListData 产品销售数量 ~ res:', res);
  if (Array.isArray(res)) initChinaMap(res);
};
onMounted(() => getProviceListData());

// 销售数据
const sellData = ref({
  year: { quantity: 0, price: 0 },
  month: { quantity: 0, price: 0 }
});
const getSaleList = async () => {
  const res = await saleList();
  console.log('🚀 ~ getSaleList 销售数据 ~ res:', res);
  if (res) sellData.value = res;
};
getSaleList();

// 农产品销售趋势分析
const getProviceSaleTrend = async () => {
  const res = await proviceSaleTrend();
  console.log('🚀 ~ getProviceSaleTrend 农产品销售趋势分析 ~ res:', res);
  if (!Array.isArray(res)) return;
  initSellDataChart(
    res.map((item) => item.date),
    res.map((item) => item.quantity),
    res.map((item) => item.totalPrice)
  );
};
getProviceSaleTrend();

// 价格趋势分析
const getAvgPriceByYear = async () => {
  const res = await avgPriceByYear();
  console.log('🚀 ~ getAvgPriceByYear 价格趋势分析 ~ res:', res);
  if (!Array.isArray(res)) return;
  initPriceDataChart(
    res.map((item) => item.year),
    res.map((item) => item.avgPrice)
  );
};
getAvgPriceByYear();

let sellChartIns: any = null;
const initSellDataChart = (xAxisData = [], quantityData = [], totalPriceData = []) => {
  sellChartIns = initChartStatic(
    'sellData',
    generateBaseOptions({
      xAxis: {
        data: xAxisData,
        axisLine: { show: true, lineStyle: { color: '#a1a1aa80' } }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#5eade5', '#ffd355'],
      yAxis: [
        {
          name: '斤',
          type: 'value',
          nameTextStyle: { color: '#9b9ba4' },
          axisLabel: { hideOverlap: true, color: '#9b9ba4' },
          axisLine: { show: true, lineStyle: { color: '#a1a1aa80' } },
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
          splitArea: { show: false }
        },
        {
          name: '万',
          type: 'value',
          nameTextStyle: { color: '#9b9ba4' },
          axisLabel: { hideOverlap: true, color: '#9b9ba4' },
          axisLine: { show: true, lineStyle: { color: '#a1a1aa80' } },
          splitLine: {
            //网格线
            show: false, //是否显示
            lineStyle: {
              //网格线样式
              color: '#a1a1aa80', //网格线颜色
              width: 1, //网格线的加粗程度
              type: 'dashed' //网格线类型
            }
          },
          splitArea: { show: false }
        }
      ],
      series: [
        {
          name: '产量',
          data: quantityData,
          type: 'bar',
          barWidth: 20,
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#a1a1aa',
              fontSize: 10
            }
          }
        },
        {
          name: '销售额',
          data: totalPriceData,
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#a1a1aa',
              fontSize: 10
            }
          }
        }
      ],
      grid: {
        left: 30,
        right: 40,
        top: 38,
        bottom: '12%'
      }
    })
  );
};
onMounted(() => {
  initSellDataChart();
});

let priceChartIns: any = null;
const initPriceDataChart = (xAxisData = [], avgPriceData = []) => {
  priceChartIns = initChartStatic(
    'priceData',
    generateBaseOptions({
      xAxis: {
        data: xAxisData,
        axisLine: { show: true, lineStyle: { color: '#a1a1aa80' } }
      },
      legend: {
        show: false,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15
      },
      color: ['#08d7ec', '#5eade5'],
      yAxis: {
        name: '单位: 元/斤',
        type: 'value',
        axisLine: { show: true, lineStyle: { color: '#a1a1aa80' } },
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
        splitArea: { show: false }
      },
      series: [
        {
          name: '数据详情',
          data: avgPriceData,
          type: 'line',
          smooth: true,
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#a1a1aa',
              fontSize: 10
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: '#08d7ec00' },
                { offset: 0, color: '#08d7eca0' }
              ])
            }
          },
          areaStyle: { normal: {} }
        }
      ],
      grid: {
        left: 50,
        right: 30,
        top: 38,
        bottom: '12%'
      }
    })
  );
};
onMounted(() => {
  initPriceDataChart();
});

const enableMap = true;
const initChinaMap = (saleNumList = []) => {
  console.log('🚀 ~ initChinaMap ~ saleNumList:', saleNumList);
  if (!enableMap) return;
  echarts.registerMap('china', jsonData as any);
  const { features } = jsonData;
  const centerMap = {};
  if (Array.isArray(features))
    features.forEach((item) => {
      const { name, center } = item.properties;
      if (name) centerMap[name] = center;
    });
  const chongqingCenter = centerMap['重庆市'];
  const chartDom = document.getElementById('mainMap');
  const myChart = echarts.init(chartDom);
  myChart.setOption(
    {
      baseOption: {
        geo: {
          aspectScale: 0.8, //长宽比
          map: 'china',
          roam: false,
          itemStyle: {
            borderColor: '#1877cd40',
            borderWidth: 2,
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: '#000000' // 0% 处的颜色// 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#0335b5' // 100% 处的颜色 // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            },
            shadowColor: '#ffffff40',
            shadowOffsetX: -3,
            shadowOffsetY: -3,
            shadowBlur: 19,
            emphasis: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: '#fff' // 0% 处的颜色// 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色 // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              borderWidth: 2,
              borderColor: '#fff'
            }
          }
        },
        tooltip: {
          show: false
        },
        series: [
          {
            show: false,
            type: 'map',
            map: 'china',
            zoom: 1,
            aspectScale: 0.8,
            itemStyle: {
              borderColor: '#05d6f8',
              borderWidth: 2,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: '#012188' // 0% 处的颜色// 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0335b5' // 100% 处的颜色 // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: '#0938b6',
              shadowOffsetX: -10,
              shadowOffsetY: -10,
              shadowBlur: 19,
              emphasis: {
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#0335b5' // 0% 处的颜色// 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#fba509' // 100% 处的颜色 // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                borderWidth: 2,
                borderColor: '#fda809'
              }
            },
            label: {
              show: true,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '11',
              emphasis: {
                color: '#ffffff'
              }
            },
            tooltip: {
              show: false
            }
          },
          {
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 5, //箭头指向速度，值越小速度越快
              trailLength: 0, //特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'arrow', //箭头图标
              symbolSize: 5, //图标大小
              color: '#fff' // 图标颜色
            },
            lineStyle: {
              normal: {
                show: true,
                width: 1, //尾迹线条宽度
                opacity: 1, //尾迹线条透明度
                curveness: 0.3, //尾迹线条曲直度
                color: '#ddd' // 飞线颜色 - 细线
              }
            },
            data: convertData(
              saleNumList.map((item) => item.province),
              centerMap,
              1,
              chongqingCenter
            )
          },
          {
            type: 'effectScatter',
            radius: '100%',
            coordinateSystem: 'geo',
            zlevel: 15,
            rippleEffect: {
              period: 4,
              brushType: 'stroke',
              scale: 4,
              color: '#FFD246'
            },
            label: {
              normal: {
                show: false,
                position: 'right',
                color: '#FFD246',
                formatter: '{b}',
                textStyle: {
                  color: '#FFD246'
                }
              },
              emphasis: {
                show: false,
                color: '#FFD246'
              }
            },
            symbol: 'circle',
            symbolSize: 5,
            itemStyle: {
              color: '#FFD246'
            },
            data: saleNumList
              .filter((ele) => Array.isArray(centerMap[ele.province]))
              .map((ele) => ({
                name: ele.province,
                value: centerMap[ele.province].concat([10, ele.price])
              })),
            tooltip: {
              show: true,
              triggerOn: 'click',
              // item 图形触发， axis 坐标轴触发， none 不触发
              trigger: 'item',
              backgroundColor: '#0a6e82d0',
              padding: [4, 8, 4, 8],
              formatter: (params) => {
                console.log('params', params);
                const { name, value } = params;
                const [_, __, ___, saleVal] = value;
                return `
                  <div class="text-#eee text-12px">
                    <div class="font-bold text-[14px]">
                      ${name}
                    </div>
                    <div class="flex space-x-2">
                      <div>销售额:</div>
                      <div>${saleVal}万元</div>
                    </div>
                  </div>
                `;
              }
            }
          }
        ]
      }
    },
    true
  );
  window.addEventListener('resize', () => {
    myChart.resize();
  });
};

const convertData = (data, coordData, flyDirection, centerPointValue) => {
  if (!data) {
    return;
  } //判空
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let dataItem = data[i];
    let fromCoord = coordData[dataItem];
    let toCoord = centerPointValue; //中心点地理坐标
    if (fromCoord && toCoord) {
      let coordArr = [
        {
          coord: fromCoord, // 飞线去往哪里
          value: dataItem[0].value
        },
        {
          coord: toCoord // 飞线从哪里出发
        }
      ];
      res.push(flyDirection === 0 ? coordArr : coordArr.reverse()); // 通过 flyDirection 控制飞线方向
    }
  }
  console.log('SSSSSS', res);
  return res;
};
</script>
<template>
  <div class="w-100vw h-100vw overflow-hidden outer-frame">
    <ScaleBox>
      <div class="bg-frame">
        <div
          class="header-frame text-white art-font flex justify-center pt-12px box-border text-42px"
        >
          农产品销售可视化分析
        </div>
        <div class="bottom-frame"></div>
        <div class="absolute left-0 top-92px w-1920px flex justify-between px-16px box-border">
          <div>
            <div class="title-frame">农产品流通</div>
            <div class="w-386px h-70px ml-15px mt-23px relative icon-1-bg">
              <div class="flex justify-center items-center relative z-10">
                <div class="icon-1 w-36px h-36px"></div>
                <div class="flex flex-col items-center w-160px px-28px">
                  <div class="text-#9edbf1 text-25px">{{ activeBrand }}</div>
                  <div class="text-14px text-white mt-6px">流通品牌</div>
                </div>
              </div>
            </div>
            <div class="w-386px h-70px ml-12px mt-23px relative icon-2-bg">
              <div class="flex justify-center items-center relative z-10">
                <div class="icon-1 w-36px h-36px"></div>
                <div class="flex flex-col items-center w-160px px-28px">
                  <div class="text-#9edbf1 text-25px">{{ activeCity }}</div>
                  <div class="text-14px text-white mt-6px">流通城市</div>
                </div>
              </div>
            </div>
            <div class="bar-frame mt-24px"></div>
            <div class="title-frame mt-23px">农产品销售流向TOP5</div>
            <div class="h-247px my-10px relative text-#ffffffd0">
              <div class="absolute circle-bg w-120px h-120px top-10px left-78px">
                <div>{{ top5Data.top1.provinceName }}</div>
                <div class="mt-2 text-16px art-font">
                  {{ formattedMoney(top5Data.top1.totalPrice) }}
                </div>
              </div>
              <div class="absolute circle-bg w-110px h-110px top-36px left-231px">
                <div>{{ top5Data.top2.provinceName }}</div>
                <div class="mt-2 text-16px art-font">
                  {{ formattedMoney(top5Data.top2.totalPrice) }}
                </div>
              </div>
              <div class="absolute sub-circle-bg w-100px h-100px top-138px left-15px">
                <div>{{ top5Data.top3.provinceName }}</div>
                <div class="mt-1 text-13px art-font">
                  {{ formattedMoney(top5Data.top3.totalPrice) }}
                </div>
              </div>
              <div class="absolute sub-circle-bg w-90px h-90px top-144px left-165px">
                <div>{{ top5Data.top4.provinceName }}</div>
                <div class="mt-1 text-13px art-font">
                  {{ formattedMoney(top5Data.top4.totalPrice) }}
                </div>
              </div>
              <div class="absolute sub-circle-bg w-80px h-80px top-158px left-321px">
                <div>{{ top5Data.top5.provinceName }}</div>
                <div class="mt-1 text-13px art-font">
                  {{ formattedMoney(top5Data.top5.totalPrice) }}
                </div>
              </div>
            </div>
            <div class="bar-frame"></div>
            <div class="title-frame mt-23px">农产品销售详情</div>
            <div class="h-246px mt-16px mb-10px">
              <el-table
                :data="dataList"
                :header-cell-style="{
                  color: '#369ae6',
                  backgroundColor: '#33629B30',
                  fontSize: '14px'
                }"
                style="width: 418px; border: 1px solid #66666686"
                height="246px"
              >
                <el-table-column prop="date" label="年份" align="center" />
                <el-table-column prop="quantity" label="销量" align="center" />
                <el-table-column prop="unitPrice" label="单价" align="center" />
                <el-table-column prop="totalPrice" label="销售额" align="center" />
              </el-table>
            </div>
            <div class="bar-frame"></div>
          </div>
          <div class="flex flex-col items-center w-1048px">
            <div class="map-bg" id="mainMap"></div>
            <div
              class="bottom-card-bg flex items-center justify-center text-#d4e7ff text-30px art-font"
            >
              产品销售去向
            </div>
          </div>
          <div class="text-#e1e1e1 text-14px">
            <div class="title-frame">销售数据</div>
            <div class="w-400px h-90px mt-21px ml-10px flex">
              <div class="sell-title text-center text-white">本月</div>
              <div class="sell-content flex flex-col justify-center space-y-14px">
                <div class="flex space-x-16px items-center">
                  <div class="text-right w-100px">产品销售额</div>
                  <div class="w-170px h-10px bg-#03325B rounded-5 relative overflow-hidden">
                    <div
                      class="h-full absolute left-0 top-0 w-100px linear-blue rounded-5"
                      :style="`width: ${sellData.month.price / 300}%;`"
                    ></div>
                  </div>
                  <div class="text-#04D4F5">{{ formattedMoney(sellData.month.price || 0) }}</div>
                </div>
                <div class="flex space-x-16px items-center">
                  <div class="text-right w-100px">订单数量</div>
                  <div class="w-170px h-10px bg-#03325B rounded-5 relative overflow-hidden">
                    <div
                      class="h-full absolute left-0 top-0 w-100px linear-orange rounded-5"
                      :style="`width: ${sellData.month.quantity}%;`"
                    ></div>
                  </div>
                  <div class="text-#FEA50D">{{ formattedMoney(sellData.month.quantity) }}</div>
                </div>
              </div>
            </div>
            <div class="w-400px h-90px mt-12px ml-10px flex">
              <div class="sell-title text-center text-white">本年</div>
              <div class="sell-content flex flex-col justify-center space-y-14px">
                <div class="flex space-x-16px items-center">
                  <div class="text-right w-100px">产品销售额</div>
                  <div class="w-170px h-10px bg-#03325B rounded-5 relative overflow-hidden">
                    <div
                      class="h-full absolute left-0 top-0 w-100px linear-blue rounded-5"
                      :style="`width: ${sellData.year.price / 300}%;`"
                    ></div>
                  </div>
                  <div class="text-#04D4F5">{{ formattedMoney(sellData.year.price) }}</div>
                </div>
                <div class="flex space-x-16px items-center">
                  <div class="text-right w-100px">订单数量</div>
                  <div class="w-170px h-10px bg-#03325B rounded-5 relative overflow-hidden">
                    <div
                      class="h-full absolute left-0 top-0 w-100px linear-orange rounded-5"
                      :style="`width: ${sellData.year.quantity}%;`"
                    ></div>
                  </div>
                  <div class="text-#FEA50D">{{ formattedMoney(sellData.year.quantity) }}</div>
                </div>
              </div>
            </div>
            <div class="bar-frame mt-22px"></div>
            <div class="title-frame mt-23px">农产品销售趋势</div>
            <div class="h-238px my-10px" id="sellData"></div>
            <div class="bar-frame"></div>
            <div class="title-frame mt-23px">价格趋势分析</div>
            <div class="h-234px my-10px" id="priceData"></div>
            <div class="bar-frame"></div>
          </div>
        </div>
      </div>
    </ScaleBox>
  </div>
</template>
<style scoped lang="scss">
.linear-blue {
  background: linear-gradient(to right, #033965, #04d5f6);
}

.linear-orange {
  background: linear-gradient(to right, #5e3b00, #ffa60d);
}

.outer-frame {
  background: linear-gradient(to right, #012455, #011e41);
}
.bg-frame {
  background-image: url(./assets/bg.png);
  background-size: 100% 100%;
  width: 1920px;
  height: 1080px;
  position: relative;
}
.header-frame {
  background-image: url(./assets/headerBg.png);
  background-size: 100% 100%;
  width: 1920px;
  height: 201px;
}
.bottom-frame {
  background-image: url(./assets/bottomBg.png);
  background-size: 100% 100%;
  width: 1920px;
  height: 45px;
  position: absolute;
  bottom: 0;
  left: 0;
}

.icon-1-bg {
  background-image: url(./assets/icon1.png);
  background-size: 100% 100%;
}

.icon-2-bg {
  background-image: url(./assets/icon2.png);
  background-size: 100% 100%;
}

.title-frame {
  background-image: url(./assets/titleBg.png);
  background-size: 100% 100%;
  width: 420px;
  height: 48px;
  box-sizing: border-box;
  padding: 11px 0 0 47px;
  color: white;
  font-family: 'ArtFont';
  font-size: 18px;
}

.stage-frame {
  width: 386px;
  height: 33px;
  background: linear-gradient(180deg, rgba(0, 144, 255, 0) 0%, #0090ff 100%);
}

.bar-frame {
  background-image: url(./assets/bar.png);
  background-size: 100% 100%;
  width: 420px;
  height: 7px;
}

.map-bg {
  position: relative;
  top: 130px;
  background-size: 100% 100%;
  width: 1100px;
  height: 875px;
  transform: scaleY(1.4) scaleX(1.4);
}

.bottom-card-bg {
  background-image: url(./assets/bottomCardBg.png);
  background-size: 100% 100%;
  width: 401px;
  height: 62px;
}

.sell-title {
  width: 30px;
  height: 90px;
  line-height: 25px;
  letter-spacing: 6px;
  padding-top: 6px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #0b70ba 0%, #03355f 100%);
  box-shadow: 0px 0px 10px 0px rgba(8, 104, 178, 0.3);
  writing-mode: vertical-lr;
}

.sell-content {
  width: 400px;
  height: 90px;
  background: linear-gradient(90deg, rgba(3, 61, 110, 0.12) 0%, rgba(11, 109, 182, 0.2) 100%);
}

.circle-bg,
.sub-circle-bg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle-bg {
  background-image: url(./assets/circleBg.png);
  background-size: 140% 140%;
  background-position: center center;
}

.sub-circle-bg {
  background-image: url(./assets/subCircleBg.png);
  background-size: 140% 140%;
  background-position: center center;
  font-size: 14px;
}

::v-deep .el-table {
  --el-table-row-hover-bg-color: #ffffff20 !important;
  --el-table-bg-color: none !important;
  --el-table-text-color: #fff !important;
}
.el-table {
  --el-table-border-color: none !important;
  --el-table-border: none !important;
  --el-table-text-color: white;
  --el-table-header-text-color: white;
  --el-table-row-hover-bg-color: transparent;
  --el-table-current-row-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-expanded-cell-bg-color: transparent;
  @media (prefers-color-scheme: light) {
    --el-table-text-color: #213547;
    --el-table-header-text-color: #213547;
  }
}
::v-deep .el-table__row:nth-child(even) {
  background: #ffffff10 !important;
}
::v-deep .el-table .el-table__body {
  background-color: transparent !important;
}
</style>
