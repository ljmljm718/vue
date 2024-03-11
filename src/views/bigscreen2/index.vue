<template>
  <div class="bigscreen2-wrappper bigscreen-main-wrapper">
    <div class="header-main-wrapper">
      <div class="header-left-part-wrapper">
        <BigScreenTime />
      </div>
      <div class="linear-font-title header-title-wrapper">巫山县福田镇鲁渝协作乡村振兴示范村数字化赋能</div>
      <div class="header-right-part-wrapper"></div>
    </div>
    <div class="content-main-wrapper">
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">农业资源</span>
          </div>
          <div class="content-main" style="padding: 14px;">
            <div class="panel-1-wrapper">
              <div class="panel-1-item">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">园区数量</div>
                  <div class="panel-1-value">
                    <span>{{ baseCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">个</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">地块数量</div>
                  <div class="panel-1-value">
                    <span>{{ teaCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">个</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">种植面积</div>
                  <div class="panel-1-value">
                    <span>{{ areaCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">亩</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">种植品种</div>
                  <div class="panel-1-value">
                    <span>{{ 0 }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">种</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">种植计划</div>
                  <div class="panel-1-value">
                    <span>{{ 0 }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">个</span>
                  </div>
                </div>
              </div>
              <div class="panel-1-item">
                <div class="panel-1-item-inner">
                  <div class="panel-1-title">农资类别</div>
                  <div class="panel-1-value">
                    <span>{{ suppliesCount }}</span>
                    <span style="padding-left: 4px;font-size: .8rem;">种</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item" style="grid-row: span 4;z-index: 2;">
        <div class="center-wrapper">
          <div class="top-items-wrapper">
            <div class="top-items-item">
              <div class="top-items-item-text">设备总数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.sum }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item">
              <div class="top-items-item-text">在线数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.online }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item">
              <div class="top-items-item-text">离线数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.offline }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item">
              <div class="top-items-item-text">故障数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ centerDeviceCount.fault }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
            <div class="top-items-item">
              <div class="top-items-item-text">预警数量</div>
              <div class="top-items-item-text" style="padding-bottom: 50px;">
                <span>{{ preWarnCount }}</span>
                <span style="font-size: .8rem;padding-left: 4px;">台</span>
              </div>
            </div>
          </div>
        </div>
        <div id="mainBg">
          <div class="main-tip-dialog" style="left: calc(500px - 120px); bottom: 200px;">
            <div class="main-tip-inner">
              V0435-0093传感器
            </div>
            <img src="/images/blue.png" alt="" />
          </div>
        </div>
        <div class="tool-tips-wrapper">
          <div class="tool-tips-item">
            <img src="/images/blue.png" alt="" />
            <span>摄像头</span>
          </div>
          <div class="tool-tips-item">
            <img src="/images/green.png" alt="" />
            <span>摄像头</span>
          </div>
          <div class="tool-tips-item">
            <img src="/images/red.png" alt="" />
            <span>摄像头</span>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">环境监测</span>
          </div>
          <div class="content-main panel-2-wrapper">
            <div class="panel-2-item" v-for="item in 6" :key="item">
              <div class="panel-2-icon icon-1"></div>
              <div class="panel-text-wrapper">
                <div class="panel-text-inner" style="font-size: .8rem;">二氧化碳浓度</div>
                <div class="panel-text-inner">
                  <span style="font-size: 1.2rem;font-family: 'TitleFont';">32</span>
                  ℃
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">种植品种分布</span>
          </div>
          <div class="content-main plant-layout-wrapper">
            <div
              class="plant-layout-item"
              v-for="item in leftPlantLayout"
              :key="item.cropType"
            >
              <div class="plant-layout-label">{{ item.cropType }}</div>
              <div class="plant-layout-progress">
                <div class="plant-layout-progress-bar" :style="`width: ${item.proportion};`">
                  <div class="plant-layout-progress-val">{{ item.proportion }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">土壤监测</span>
          </div>
          <div class="content-main panel-4-wrapper">
            <div :class="['panel-4-item', 'scan-' + item]" v-for="item in 3" :key="item">
              <div style="font-family: 'TitleFont';font-size: 1.3rem;">22℃</div>
              <div>温度</div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">采购成本</span>
          </div>
          <div class="content-main" id="chart2"></div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">预警信息</span>
          </div>
          <div class="content-main table-wrapper">
            <table cellspacing="0" border="0" cellpadding="0">
              <thead>
                <tr>
                  <th>地块名称</th>
                  <th>设备</th>
                  <th>预警信息</th>
                  <th>时间</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in preWarnList" :key="index">
                  <td>{{ item.parkName }}</td>
                  <td>{{ item.deviceName }}</td>
                  <td>{{ item.warnInfo }}</td>
                  <td>{{ item.warnTime }}</td>
                  <td>{{ item.warnStatus == '0' ? '未处理' : '已处理' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">茶园产量与收入统计</span>
          </div>
          <div class="content-main" id="chart3"></div>
        </div>
      </div>
      <div class="content-main-item">
        <div class="content-main-inner item-bg-wrapper">
          <div class="content-title">
            <span class="linear-font-title">设备在线率分析</span>
          </div>
          <div class="content-main" id="chart4"></div>
        </div>
      </div>
    </div>
    <div class="footer-main-wrapper"></div>
  </div>
</template>
<script setup lang="ts">
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import {
  dictDataPage,
  getBigLeftTopPin,
  getBigLeftTopPlantWu,
  productSumPrice,
  getSumOrderByDate,
  selectOfCustom,
  getCountSum,
  deviceBaseList,
  largeScreenGetWarningNum,
  largeScreenGetWarning,
  getBigLeftCentrePlantWu
} from '@/api/wushan/bigscreen/index'
import { onMounted, ref } from 'vue'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'

// 获取左边中间种植品种分布
const leftPlantLayout = ref<Array<any>>([])
const getGetBigLeftCentrePlantWu = async () => {
  const res = await getBigLeftCentrePlantWu()
  console.log('res', res);
  leftPlantLayout.value = res
  leftPlantLayout.value = [{
    "proportion": "57.98%",
    "cropType": "绿茶"
  },
  {
    "proportion": "21.57%",
    "cropType": "红茶"
  },
  {
    "proportion": "20.45%",
    "cropType": "白茶"
  }]
}
getGetBigLeftCentrePlantWu()

// 农资类别统计
const suppliesCount = ref(0)
const getdictDataPage = async () => {
  const { total = 0 } = await dictDataPage({
    pageNo: 1,
    pageSize: 10
  })
  suppliesCount.value = total;
}
getdictDataPage()

// 大屏中上方获取预警记录未处理数量
const preWarnCount = ref(0)
const getLargeScreenGetWarningNum = async () => {
  const { warningNum = '0' } = await largeScreenGetWarningNum()
  preWarnCount.value = warningNum;
}
getLargeScreenGetWarningNum()

// 右侧预警信息列表
const preWarnList = ref([])
const getlargeScreenGetWarning = async () => {
  const res = await largeScreenGetWarning({ pageSize: 3 })
  preWarnList.value = res;
}
getlargeScreenGetWarning()

// 园区、地块、面积统计个数
const baseCount = ref(0), teaCount = ref(0), areaCount = ref(0)
const getGetCountSum = async () => {
  const list = await getCountSum()
  if (Array.isArray(list)) list.forEach(item => {
    if (item.type === 'massif_base') {
      // 地块
      teaCount.value = item.nameCount
    }
    if (item.type === 'park_citrus') {
      // 基地
      baseCount.value = item.nameCount
      areaCount.value = item.area || 0
    }
  })
}
getGetCountSum()

// 大屏中央设备数量统计
const centerDeviceCount = ref({
  camera: "0",
  fault: "0",
  offline: "0",
  online: "0",
  produc: "0",
  sensor: "1",
  sum: "0"
})
const getDeviceBaseList = async () => {
  const res = await deviceBaseList();
  if (Array.isArray(res) && res.length === 1) {
    centerDeviceCount.value = res[0]
  }
}
getDeviceBaseList()

const cropNumRef = ref(0) // 种植品种数量
const getGetBigLeftTopPin = async () => {
  const { cropNum = 0 } = await getBigLeftTopPin()
  cropNumRef.value = cropNum
}
getGetBigLeftTopPin()

const plantNumRef = ref(0) // 种植计划数量
const getGetBigLeftTopPlantWu = async () => {
  const { plantNum = 0 } = await getBigLeftTopPlantWu()
  plantNumRef.value = plantNum
}
getGetBigLeftTopPlantWu()

// Chart2
const getProductSumPrice = async () => {
  const ResList = await productSumPrice()
  const data = ResList.map((item: any) => ({
    name: item.name,
    value: item.purchasePrice
  }))
  initChartStatic(
    'chart2',
    generatePieOptions({
      legend: {
        show: true,
        top: 'center',
        left: 'right',
        orient: 'horizontal',
        itemWidth: 12,
        itemHeight: 12
      },
      color: ['#00b4ff', '#00f496', '#3b72ad'],
      series: [
        {
          nam: '种植资源',
          type: 'pie',
          radius: ['30%', '50%'],
          center: 'center',
          data: data,
          label: {
            // formatter: "{c|{c}},{d|{d}%}",
            formatter: '\n{c}\n {d}%',
            rich: {
              c: {
                color: '#c1c1c1',
                fontSize: 10
              },
              d: {
                color: '#c1c1c1',
                fontSize: 10
              }
            }
          }
        }
      ]
    })
  )
}
onMounted(() => { getProductSumPrice() })

// 茶园产量与收入统计
const getGetSumOrderByDate = async () => {
  let data = await getSumOrderByDate();
  if (!data || data.length === 0) data = [
    {
      "month": "2023-12",
      "wushan_output": 63.3,
      "wushan_income": 1892.67
    },
    {
      "month": "2024-01",
      "wushan_output": 26.3,
      "wushan_income": 2051.4
    },
    {
      "month": "2024-02",
      "wushan_output": 134.6,
      "wushan_income": 54867.5
    },
    {
      "month": "2024-03",
      "wushan_output": 7.97,
      "wushan_income": 3166.71
    }
  ]

  const axis = data.map(item => (item.month))
  const list1 = data.map(item => (item.wushan_output))
  const list2 = data.map(item => (item.wushan_income))

  initChartStatic(
    "chart3",
    generateBaseOptions({
      xAxis: {
        data: axis,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#fff",
          },
        },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        x: 'center',
        itemWidth: 15,
        itemHeight: 15,
      },
      color: ["#30c3ef", "#36e1d9"],
      yAxis: [{
        name: 'kg',
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff60",
          },
        },
        axisLabel: {
          // 刻度标签的样式
          hideOverlap: true, // 隐藏重叠的标签
          color: "#9b9ba4",
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: "#ffffff40", //网格线颜色
            width: 1, //网格线的加粗程度
            type: "dashed", //网格线类型
          },
        },
        splitArea: {
          //网格区域
          show: false, //是否显示
        },
      }, {
        name: '万',
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff60",
          },
        },
        axisLabel: {
          // 刻度标签的样式
          hideOverlap: true, // 隐藏重叠的标签
          color: "#9b9ba4",
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: "#ffffff40", //网格线颜色
            width: 1, //网格线的加粗程度
            type: "dashed", //网格线类型
          },
        },
        splitArea: {
          //网格区域
          show: false, //是否显示
        },
      }],
      series: [
        {
          name: '公斤数',
          data: list1,
          yAxisIndex: 0,
          type: "bar",
          barWidth: "20",
          smooth: false,
          barGap: '70%',
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
        {
          name: '价格',
          data: list2,
          yAxisIndex: 1,
          type: "line",
          smooth: true,
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
      ],
      grid: {
        left: "9%",
        right: "12%",
        top: "20%",
        bottom: "17%",
      },
    })
  );
}
onMounted(() => { getGetSumOrderByDate() })

// 右下角在线率
const getSelectOfCustom = async () => {
  let data = await selectOfCustom({
    startDate: '2023-03-05',
    endDate: '2024-03-05'
  })
  if (!data || data.length === 0) {
    data = [
      {
        "createDate": "2024-02-04",
        "sum": "0"
      },
      {
        "createDate": "2024-02-03",
        "sum": "0"
      },
      {
        "createDate": "2024-02-02",
        "sum": "0"
      },
      {
        "createDate": "2024-02-01",
        "sum": "0"
      },
      {
        "createDate": "2024-01-31",
        "sum": "0"
      },
      {
        "createDate": "2024-01-30",
        "sum": "0"
      },
      {
        "createDate": "2024-01-29",
        "sum": "0"
      }
    ]
  }

  const axis = data.map(item => (item.createDate))
  const list = data.map(item => (item.sum))

  initChartStatic(
    "chart4",
    generateBaseOptions({
      xAxis: {
        data: axis,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff60",
          },
        },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        itemWidth: 15,
        itemHeight: 15,
      },
      color: ["#30c3ef", "#36e1d9"],
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff20",
          },
        },
        splitLine: {
          //网格线
          show: true, //是否显示
          lineStyle: {
            //网格线样式
            color: "#ffffff60", //网格线颜色
            width: 1, //网格线的加粗程度
            type: "dashed", //网格线类型
          },
        },
        splitArea: {
          //网格区域
          show: false, //是否显示
        },
      },
      series: [
        {
          name: '数量',
          data: list,
          type: "bar",
          barWidth: "20",
          smooth: false,
          barGap: '70%',
          label: {
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              color: "#eee",
              fontSize: 10,
            },
          },
        },
      ],
      grid: {
        left: "10%",
        right: "6%",
        top: "17%",
        bottom: "17%",
      },
    })
  );
}

onMounted(() => { getSelectOfCustom() })
</script>
<style lang='scss' scoped>
@import url(../../utils/bigscreenTool/index.scss);

.bigscreen2-wrappper {
  width: 100vw;
  height: 100vh;
  background-image: url(./assets/bg.png);
  background-size: 100% 100%;

  .content-main-wrapper {
    display: grid;
    grid-template-columns: 25% 50% 25%;
    grid-template-rows: repeat(4, 25%);

    .content-main-item {
      padding: 10px;
      position: relative;
      z-index: 9;

      .content-main-inner {
        height: 100%;

        .content-title {
          height: 18%;
          padding-left: 8%;
          display: flex;
          align-items: center;
          font-family: 'TitleFont';
        }

        .content-main {
          height: 82%;
        }
      }

      .item-bg-wrapper {
        background-image: url(./assets/itemBg.png);
        background-size: 100% 100%;
      }
    }
  }
}

.panel-1-wrapper {
  width: 100%;
  height: calc(100% - 28px);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;

  .panel-1-item {
    .panel-1-item-inner {
      width: 100%;
      height: 100%;
      background-image: url(./assets/panel1.png);
      background-size: auto 70%;
      background-position: center center;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .panel-1-title {
        color: white;
        margin-bottom: 8px;
        font-size: 0.8rem;
      }

      .panel-1-value {
        color: #00fecb;
        margin-bottom: 20px;
        font-family: 'TitleFont';
      }
    }
  }
}

.panel-2-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;

  .panel-2-item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .panel-2-icon {
      width: 2.5rem;
      height: 2.5rem;
      background-size: 100% 100%;
    }

    .panel-text-wrapper {
      width: calc(100% - 4rem);
      display: flex;
      flex-direction: column;
      justify-content: center;

      .panel-text-inner {
        padding: 2px 10px;
      }
    }
  }
}

.panel-4-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100%;

  .panel-4-item {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: auto 60%;
    padding: 20px 0 16px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
}

.linear-font-title {
  background-image: linear-gradient(to top, #5bdcc2, white) !important;
  -webkit-background-clip: text;
  color: transparent;
}

.center-wrapper {
  position: relative;

  .top-items-wrapper {
    position: absolute;
    left: 10%;
    top: 1rem;
    width: 80%;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(5, 1fr);

    .top-items-item {
      aspect-ratio: 1;
      background-image: url(./assets/TopBg.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 80% auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .top-items-item-text {
        font-family: 'TitleFont';
        padding: 4px 0;
      }
    }
  }
}

#mainBg {
  width: 1600px;
  height: 800px;
  background-image: url(./assets/image.png);
  background-size: 100% 100%;
  position: relative;
  left: calc(50% - 800px);
  top: calc(50% - 400px);
  .main-tip-dialog {
    width: 240px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    .main-tip-inner {
      border: 2px solid red;
      padding: .6rem 1rem;
      background-color: #0a2019b3;
      width: 100%;
      height: 100px;
    }
  }
}

.tool-tips-wrapper {
  position: fixed;
  left: 35vw;
  width: 30vw;
  bottom: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .tool-tips-item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 1rem;
  }
}

#chart1,
#chart2,
#chart3,
#chart4 {
  border: 1px solid #ff000000;
}

.plant-layout-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  .plant-layout-item {
    width: 90%;
    margin-left: 5%;
    padding: .4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .plant-layout-label {
      font-size: .9rem;
    }
    .plant-layout-progress {
      width: 95%;
      margin-top: .2rem;
      height: .6rem;
      background-color: #065148;
      border-radius: 3px;
      .plant-layout-progress-bar {
        background-color: #00fbc9;
        height: 100%;
        position: relative;
        .plant-layout-progress-val {
          position: absolute;
          right: -4.3rem;
          top: -6px;
          font-family: 'TitleFont';
        }
      }
    }
  }
}

.table-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.table-wrapper {
  background-color: #5bdcc228;
  width: calc(100% - 1.8rem);
  height: calc(100% - 3.2rem) !important;
  overflow: auto;
  padding: 0 .6rem .3rem .6rem;
  font-size: .8rem;
  tr {
    background-image: url(./assets/rect.png);
    background-size: 100% 100%;
  }

  td, th {
    /* border-right: 1px solid gray;
    border-bottom: 1px solid gray; */
    width: 100px;
    height: 30px;
    box-sizing: border-box;
  }
  td {
    height: 35px !important;
  }

  th {
    background-color: #0a2019;
  }


  table {
    border-collapse: separate;
    table-layout: fixed;
    width: 100%;
  }

  /* td:first-child, th:first-child {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: lightpink;
  } */

  thead tr th {
    position: sticky;
    top: 0;
    /* 第一列最上 */
  }

  /* th:first-child {
    z-index: 2;
    background-color: lightblue;
  } */
}

@for $i from 1 through 6 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
  }
}

@for $i from 1 through 3 {
  .scan-#{$i} {
    background-image: url(./assets/scan#{$i}.png);
  }
}
</style>