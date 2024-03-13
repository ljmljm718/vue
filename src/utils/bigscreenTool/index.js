import { merge } from 'lodash'
import * as echarts from 'echarts'

/**
 * 初始化Echarts图表
 * @param {string} id DOM元素的ID
 * @param {object} option Echarts配置项
 * @returns 
 */
export const initChartStatic = (id = '', option = {}, type = 'default') => {
    if (!id) return;
    const chart = document.getElementById(id);
    const chartInstance = echarts.init(chart, 'default');
    chartInstance.setOption(option, true, true);
    window.addEventListener("resize", () => {
        setTimeout(() => {
            chartInstance && chartInstance.resize();
        }, 10)
    })
}

/**
 * 为柱状图和折线图创建options
 * @param {object} Options 
 * @returns 
 */
export const generateBaseOptions = (Options = {}, dark = true) => {
    return merge({
        title: {
            text: "",
            textStyle: {
                fontSize: 16
            },
        },
        textStyle: {
            color: dark ? '#fff' : '#000'
        },
        color: [
            '#306fff',
            '#30c9c9',
            '#f7ad08',
            '#93beff'
        ],
        tooltip: {
            show: true,
            trigger: 'axis'
        },
        xAxis: {
            show: true,
            name: "",
            nameLocation: "end", // 坐标轴名称及显示位置，可以时start和middle
            nameTextStyle: {
                // 坐标轴名称的样式
                color: "#9b9ba4",
            },
            nameGap: 15, // 坐标轴名称与轴线的距离
            inverse: false, // 是否反向坐标轴
            axisLabel: {
                // 刻度标签的样式
                hideOverlap: true, // 隐藏重叠的标签
                color: "#9b9ba4",
            },
            axisLine: {
                show: false,
            },
            position: "bottom",
            offset: 0, // 相对正常位置的偏移
            type: "category", // 类目轴，也可以是time， value， 对数轴log
            data: [],
        },
        yAxis: {
            name: "",
            nameTextStyle: {
                // 坐标轴名称的样式
                color: "#9b9ba4",
            },
            axisLabel: {
                // 刻度标签的样式
                hideOverlap: true, // 隐藏重叠的标签
                color: "#9b9ba4",
            },
            axisLine: {
                show: false,
            },
            minorTick: {
                // 坐标轴刻度线相关配置
                show: false,
            },
            splitLine: {
                // 坐标轴在grid区域中的分割线
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: dark ? '#ffffff66' : '#00000026'
                }
            },
        },
        series: [
            {
                name: '',
                data: [],
                type: 'line',
                smooth: true,
            }
        ],
        // 图例相关配置
        legend: {
            show: true,
            // 图例配置
            orient: "horizontal", // horizontal水平布局， vertical垂直布局
            x: "right", // 水平安放位置
            y: "top", // 垂直安放位置
            // backgroundColor: "#000000",
            // borderColor: "#ccc",
            // borderWidth: 0,
            padding: 5,
            itemGap: 10, // 各个item之间的距离
            itemWidth: 10, // 图例图形宽度
            itemHeight: 10, // 图例图形高度
            borderRadius: 10,
            textStyle: {
                color: dark ? '#d7d8db' : '#00000026',
                fontSize: 9,
            },
            lineStyle: {
                type: 'dotted',
                opacity: 0
            }
        },
        // 距离四周的距离
        grid: {
            left: '6%',
            top: '19%',
            right: '2%',
            bottom: '13%'
        }
    }, Options);
}

/**
 * 为饼图创建options
 * @param {object} Option 
 * @returns 
 */
export const generatePieOptions = (Option = {}) => {
    return merge({
        tooltip: {
            trigger: 'item'
        },
        color: [
            '#ffc600',
            '#23e69b',
            '#c8c9c9',
            '#ff9f7f',
            '#fb7293',
            '#E062AE',
            '#32C5E9',
            '#67E0E3',
            '#E690D1',
            '#e7bcf3',
            '#9d96f5',
            '#8378EA',
            '#96BFFF'
        ],
        legend: {
            // 图例配置
            orient: "vertical",
            right: 50,
            itemGap: 10,
            top: 'center',
            textStyle: {
                color: '#fff'
            },
        },
        series: [
            {
                name: "数据详情",
                type: "pie",
                radius: ["36%", "60%"],
                center: ["37%", "50%"],
                data: [
                    {
                        name: '',
                        value: ''
                    },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
                label: {
                    formatter: "{c|{c}} , {per|{d}%}",
                    rich: {
                        c: {
                            color: "#fff",
                            fontSize: 12,
                            lineHeight: 33,
                        },
                        per: {
                            color: "#fff",
                            fontSize: 12,
                            lineHeight: 33,
                        },
                    },
                },
            },
        ],
        grid: {
            x: 20,
            x2: 80,
            y: 60,
            y2: 60,
            // 网格
            backgroundColor: "rgba(0,0,0,0)",
            borderWidth: 2,
            borderColor: "#fff232",
        },
        polor: {
            center: ["30%", "50%"],
        },
    }, Option)
}