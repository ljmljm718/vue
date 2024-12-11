export interface PieItem {
  name: string;
  value: number;
}

export const colors = [
  '#EB2E97',
  '#1777FF',
  '#16C2C1',
  '#F5212D',
  '#722ED1',
  '#53C31B',
  '#FADB15',
  '#3054EB',
  '#A0D912',
  '#FA8D15',
  '#EB2E97',
  '#FA541C',
  '#FAAD14'
];
export const rgbColors = [
  '235,46,151',
  '23,119,255',
  '22,194,193',
  '245,33,45',
  '114,46,209',
  '83,195,27',
  '250,219,21',
  '48,84,235',
  '160,217,18',
  '250,141,21',
  '235,46,151',
  '250,84,28',
  '250,173,20'
];

export const makeDeviceStatusOpt = (data: PieItem[]) => {
  return {
    color: colors,
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '90%'],
        data,
        label: {
          show: false
        },
        itemStyle: {
          borderWidth: 5,
          borderColor: '#fff'
        }
      }
    ]
  };
};

export const makeTaskStatisticsOpt = (data: any) => {
  const xData = data.xData;
  const irrigationData = data.irrigationData;
  const fertilizationData = data.fertilizationData;
  // const waterConsumptionData = data.waterConsumptionData;

  return {
    grid: {
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      confine: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '次',
        position: 'left'
      },
      {
        type: 'value',
        name: 'L',
        position: 'right'
      }
    ],
    legend: {},
    series: [
      {
        type: 'line',
        name: '灌溉任务',
        yAxisIndex: 0,
        smooth: true,
        data: irrigationData,
        tooltip: {
          valueFormatter: (value: number) => {
            return value + ' 次';
          }
        }
      },
      {
        type: 'line',
        name: '施肥任务',
        yAxisIndex: 0,
        smooth: true,
        data: fertilizationData,
        tooltip: {
          valueFormatter: (value: number) => {
            return value + ' 次';
          }
        }
      }
      // {
      //   type: 'line',
      //   name: '用水量',
      //   yAxisIndex: 1,
      //   smooth: true,
      //   data: waterConsumptionData,
      //   tooltip: {
      //     valueFormatter: (value: number) => {
      //       return value + ' L';
      //     }
      //   }
      // }
    ]
  };
};
