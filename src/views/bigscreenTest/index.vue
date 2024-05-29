<script lang="tsx">
import { defineComponent, ref, nextTick } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import headerBg from './assets/headerBg.png'
import mainBg from './assets/bg.png'
import { formatTime } from '@/utils'
import * as echarts from 'echarts'
import {
  initChartStatic,
  generateBaseOptions,
  generatePieOptions
} from '../../utils/bigscreenTool/index'
import {
    getParkTree,
    getEquipmentPhotographAndVideo,
    monitoringEquNoticePage,

    getPondCountFrySum,
    getLineChar,
    selectHarvest,
    getEquipmentCountSum,

    getEquipmentCountSumOrderByType,
    villageProductPage,
    environmentalDataHomePageA,
    environmentalDataHomePageB,
    environmentalDataHomePageC,
    waterQualityData,

    fulingWarningInfo,
    fulingWarningDistr,
    getPestLevelChart,
    warningNum,
    agriWarningRecordPage,
} from './api'

const {
    BigscreenAdapter,
    BigscreenContainer,
    BigscreenHeader,
    BigscreenFooter,
    BigscreenMain,
    BigscreenCard,

    BigscreenTab,
    BigscreenSelector,
    BigscreenTable,
} = BigscreenBuilder

// 设备列表项
interface DeviceVideoListItemType {
    deviceName: string,
    videoSrc: string,
    baseName: string,
    online: boolean
}

// 通知事件列表项
interface NoticeItemType {
    noticeEvent: string,
    recordTime: number,
    captured: string
}

export default defineComponent({
    name: 'BigscreenTest',
    setup() {
        const getIconClass = (text:string) => {
            const iconMap = {
                '温度': '1',
                '湿度': '2',
                'PH': '3',
                'EC': '4',
                '光': '5',
                '雨': '6',
                '二氧化碳': '7',
                '气压': '8',
                '虫': '9',
                '类': '10',
                'default': '1',
                "磷": '11',
                "氮": '12',
                "钾": '13',
                "深度": '14',
                "种植面积": '18',
                "农户": '17',
                "大棚": '15',
                "盆栽": '16'
            }
            const iconLabel = Object.keys(iconMap);
            let key = 'default'
            iconLabel.forEach(item => {
                if (text.indexOf(item) !== -1) key = item
            })
            return iconMap[key]
        }

        // tab修改事件
        const TabChangeMap = new Map<string, Array<Function>>()
        const addTabChangeMap = (key:string, func: Function) => {
            const existMap: any = TabChangeMap.get(key) ? TabChangeMap.get(key) : []
            TabChangeMap.set(key, [
                ...existMap,
                func
            ])
        }
        const handleTabChange = (key:string) => {
            const existMap: any = TabChangeMap.get(key) ? TabChangeMap.get(key) : []
            existMap.forEach(func => { func() })
        }

        const activeBasePark = ref()
        const handleMenuActive = (key: string, keyPath: string[]) => {
            console.log(key, keyPath)
            activeBasePark.value = key
            if (keyPath.length === 2) getMonitorDeviceList(keyPath[0], keyPath[1])
        }
        const baseParkTreeList = ref<Array<any>>([]);
        const getBaseParkTreeList = async () => {
            const res = await getParkTree();
            console.log('基地导览大屏基地树', res);
            if (!Array.isArray(res)) return
            baseParkTreeList.value = res
        }
        getBaseParkTreeList()

        // 获取监控设备列表
        const monitorDeviceLoading = ref<boolean>(false)
        const deviceVideoList = ref<Array<DeviceVideoListItemType>>([])
        const getMonitorDeviceList = async (baseId = '', plotId = '') => {
            deviceVideoList.value = []
            monitorDeviceLoading.value = true
            const res = await getEquipmentPhotographAndVideo(plotId ? {baseId, plotId} : {}).catch(() => {
                monitorDeviceLoading.value = false
            })
            console.log("获取监控设备列表", res);
            monitorDeviceLoading.value = false
            deviceVideoList.value = res.map(item => ({
                deviceName: item.deviceName,
                videoSrc: item.url,
                baseName: item?.monitoringEquipmentDataDO?.monitoringBaseName,
                online: item.deviceStatus === 'online'
            })).slice(0, 9)
        }
        getMonitorDeviceList()
        const activeTab = ref('base')


        // 监控通知事件
        const monitorNoticeLoading = ref<boolean>(false)
        const getMonitorNoticeList = async () => {
            monitorNoticeLoading.value = true
            const { list = [] } = await monitoringEquNoticePage({}).catch(() => {
                monitorNoticeLoading.value = false
            })
            monitorNoticeLoading.value = false
            if (!Array.isArray(list)) return
            noticeList.value = list.map(item => ({
                captured: item.captured,
                noticeEvent: item.noticeEvent,
                recordTime: item.recordTime
            }))
        }
        getMonitorNoticeList()

        const noticeList = ref<Array<NoticeItemType>>([])
        // 基地导览页面部分
        const baseTabPage = () => {
            return (
                <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="inner-border w-full h-full p-3 flex space-x-3 box-border">
                        <div class="inner-border w-[10rem] p-3">
                            <el-menu
                                active-text-color="#ffd04b"
                                background-color="#1b2a58"
                                class="el-menu-vertical-demo"
                                default-active={activeBasePark.value}
                                text-color="#fff"
                                onSelect={handleMenuActive}
                            >
                                {
                                    baseParkTreeList.value.map(item => {
                                        if (item.child) return (
                                            <el-sub-menu index={item.id} v-slots={{
                                                title: () => (
                                                    <span>{item.name}</span>
                                                )
                                            }}>
                                                {
                                                    Array.isArray(item.child) ? item.child.map(ele => (
                                                        <el-menu-item index={ele.id}>
                                                            {ele.name}
                                                        </el-menu-item>
                                                    )) : null
                                                }
                                            </el-sub-menu>
                                        )
                                        return (
                                            <el-menu-item index={item.id}>
                                                {item.name}
                                            </el-menu-item>
                                        )
                                    })
                                }
                            </el-menu>
                        </div>
                        <div class="inner-border grow p-3 grid grid-cols-3 grid-rows-3 gap-3" v-loading={monitorDeviceLoading.value}>
                            {
                                deviceVideoList.value.map((item:DeviceVideoListItemType) => (
                                    <div class="p-3 flex flex-col bg-gray-900 inner-border">
                                        <div class="art-font h-[1.4rem] tracking-wide">{ item.deviceName }</div>
                                        <video class="w-full h-[13rem]" controls autoplay src={ item.videoSrc } />
                                        <div class="flex items-center justify-between pt-2">
                                            <div>{ item.baseName }</div>
                                            <div style={
                                                item.online ? 'color: #48ad91;' : 'color: #db2153;'
                                            }>{ item.online ? '在线' : '离线' }</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div class="inner-border w-[18rem] p-3">
                            <div class="art-font">通知事件</div>
                            <div class="h-[53rem]" v-loading={monitorNoticeLoading.value}>
                                {
                                    noticeList.value.map((item: NoticeItemType) => (
                                        <div class="flex items-center px-2 my-4 py-1 justify-between inner-border rounded-md">
                                            <div class="flex flex-col justify-between h-[4rem]">
                                                <div class="mt-1 line-clamp-2 h-[2rem]">
                                                    <el-tooltip
                                                        class="box-item"
                                                        effect="dark"
                                                        content={item.noticeEvent}
                                                        placement="bottom"
                                                    >
                                                        {item.noticeEvent}
                                                    </el-tooltip>
                                                </div>
                                                <div>{ formatTime(item.recordTime, 'yyyy-MM-dd HH:mm:ss')}</div>
                                            </div>
                                            <img src={item.captured} class="w-[6rem] h-[4rem]" />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        const runtimeBase = ref('')
        // 智慧种植部分
        // 基础设施
        const baseEquipmentLoading = ref<boolean>(false)
        const baseEquipmentList = ref<Array<any>>([])
        const getBaseEquipmentList = async () => {
            baseEquipmentLoading.value = true
            const res = await getPondCountFrySum().catch(() => {
                baseEquipmentLoading.value = false
            })
            baseEquipmentList.value = [
                { label: '池塘', value: res['池塘'] },
                { label: '鱼苗', value: res['鱼苗'] }
            ]
            baseEquipmentLoading.value = false
        }
        getBaseEquipmentList()

        // 生长分析折线图
        const getGrowthLineChartData = async () => {
            const { xValue = [], yValue = [], measureUnit = []} = await getLineChar({})
            console.log("xValue", xValue);
            console.log("yValue", yValue);
            console.log("measureUnit", measureUnit);
            initChartStatic(
                'growthChart',
                generateBaseOptions({
                    xAxis: {
                        data: xValue,
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
                        name: measureUnit[0],
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
                                },
                            },
                            areaStyle: { normal: {} },
                        }
                    ],
                    grid: {
                        left: '10%',
                        right: '8%',
                        top: '16%',
                        bottom: '15%'
                    }
                })
            )
        }
        // 产量分析
        const getHarvestChartData = async () => {
            const res = await selectHarvest()
            console.log("产量分析", res);
            let xAxis = res.map(item => (item.time))
            xAxis = [...new Set([...xAxis])].sort().reverse()
            console.log("xAxis", xAxis);
            let types = res.map(item => (item.variety))
            types = [...new Set([...types])]
            const findValByTimeAndvariety = (item) => {
                let _res = '0'
                res.forEach(ele => {
                    if (
                        item.time === ele.time
                        &&
                        item.variety === ele.variety
                    ) _res = parseFloat(ele.harvest).toFixed(2)
                })
                return _res
            }
            const series = types.map(item => {
                const nameMap = {
                    "duck": '稻田鸭',
                    "fish": '稻田鱼',
                    "rice": "稻谷"
                }
                return {
                    name: nameMap[item],
                    data: xAxis.map(x => {
                        return findValByTimeAndvariety({
                            time: x,
                            variety: item
                        })
                    }),
                    type: "bar",
                    smooth: false,
                    label: {
                        show: true, //开启显示
                        position: 'top', //在上方显示
                        textStyle: {
                            //数值样式
                            color: '#eee',
                            fontSize: 10
                        }
                    },
                }
            })
            initChartStatic(
                "harvestChart",
                generateBaseOptions({
                    xAxis: {
                        data: xAxis,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#ffffff80",
                            },
                        },
                    },
                    legend: {
                        show: true,
                        orient:'horizontal',
                        itemWidth: 15,
                        itemHeight: 15,
                    },
                    color: ["#ed7d31","#a9d18e","#d9d9d9"],
                    yAxis: [
                        {
                            type: "value",
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: "#ffffff80",
                                },
                            },
                            axisLabel: {
                                color: '#ffffff80'
                            },
                            splitLine: {
                                //网格线
                                show: true, //是否显示
                                lineStyle: {
                                    //网格线样式
                                    color: "#ffffff80", //网格线颜色
                                    width: 1, //网格线的加粗程度
                                    type: "dashed", //网格线类型
                                },
                            },
                            splitArea: {
                                //网格区域
                                show: false, //是否显示
                            },
                        },
                    ],
                    series,
                    grid: {
                        left: "12%",
                        right: "8%",
                        top: "17%",
                        bottom: "15%",
                    },
                })
            );
        }
        addTabChangeMap('plant', () => {
            nextTick(() => {
                getGrowthLineChartData()
                getHarvestChartData()
            })
        })

        // 设备信息
        const deviceInfoLoading = ref<boolean>(false)
        const deviceInfoList = ref<Array<any>>([])
        const deviceInfoTotal = ref(0)
        const getDeviceInfoList = async () => {
            deviceInfoTotal.value = 0
            deviceInfoLoading.value = true
            const res = await getEquipmentCountSumOrderByType().catch(() => {
                deviceInfoLoading.value = false
            })
            const buildArr:Array<any> = []
            for (let key in res) {
                buildArr.push({
                    deviceKind: key,
                    total: res[key]['总数'],
                    online: res[key]['在线'],
                    offline: res[key]['离线']
                })
            }
            deviceInfoLoading.value = false
            const getRateByData = (_item) => {
                return parseInt(_item.online) / parseInt(_item.total) * 100
            }
            deviceInfoList.value = buildArr.map(item => ({ ...item, rate: getRateByData(item) }))
            buildArr.forEach(item => { deviceInfoTotal.value += parseInt(item.total) })
        }
        getDeviceInfoList()

        // 特色产品
        const villageProductPageLoading = ref<boolean>(false)
        const villageProductPageList = ref<Array<any>>([])
        const getvillageProductPage = async () => {
            villageProductPageLoading.value = true
            const { list = [] } = await villageProductPage().catch(() => {
                villageProductPageLoading.value = false
            })
            villageProductPageLoading.value = false
            console.log("特色产品", list);
            if (!Array.isArray(list)) return
            villageProductPageList.value = list.slice(0, 2)
        }
        getvillageProductPage()

        // 气象站
        const weatherLoading = ref<boolean>(false)
        const weatherList = ref<Array<any>>([])
        const getWeatherList = async () => {
            weatherLoading.value = true
            const res = await environmentalDataHomePageA({}).catch(() => {
                weatherLoading.value = false
            })
            weatherLoading.value = false
            console.log("气象站", res);
            if(!Array.isArray(res)) return
            weatherList.value = res.map(item => ({
                icon: getIconClass(item.monitoringType),
                label: item.monitoringType || '--',
                value: item.dataValue || '--',
                unit: item.yyUnit || ''
            })).slice(0, 8)
        }
        getWeatherList()

        // 土壤墒情
        const soilLoading = ref<boolean>(false)
        const soilList = ref<Array<any>>([])
        const getsoilList = async () => {
            soilLoading.value = true
            const res = await environmentalDataHomePageC({}).catch(() => {
                soilLoading.value = false
            })
            soilLoading.value = false
            console.log("土壤墒情", res);
            if(!Array.isArray(res)) return
            soilList.value = res.map(item => ({
                icon: getIconClass(item.monitoringType),
                label: item.monitoringType || '--',
                value: item.dataValue || '--',
                unit: item.yyUnit || ''
            })).slice(0, 8)
        }
        getsoilList()

        // 水质
        const waterLoading = ref<boolean>(false)
        const waterList = ref<Array<any>>([])
        const getWaterList = async () => {
            waterLoading.value = true
            const res = await waterQualityData({}).catch(() => {
                waterLoading.value = false
            })
            waterLoading.value = false
            console.log("水质", res);
            if(!Array.isArray(res)) return
            waterList.value = res.map(item => ({
                icon: getIconClass(item.monitoringType),
                label: item.monitoringType || '--',
                value: item.dataValue || '--',
                unit: item.yyUnit || ''
            })).slice(0, 8)
        }
        getWaterList()

        // 中间顶部
        const plantCenterTopCardList = ref<Array<any>>([])
        const getPlantCenterTopCardList = async () => {
            const res = await getEquipmentCountSum()
            console.log("中间顶部", res);
            plantCenterTopCardList.value = [
                {
                    label: '设备总数',
                    value: res['设备总数']
                },
                {
                    label: '在线设备',
                    value: res['在线设备']
                },
                {
                    label: '离线设备',
                    value: res['离线设备']
                },
                {
                    label: '报警设备',
                    value: res['报警设备']
                },
            ]
        }
        getPlantCenterTopCardList()
        const plantTabPage = () => {
            return (
                <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="w-full h-full p-3 flex space-x-3 box-border">
                        <div class="w-[25%] flex flex-col space-y-3">
                            <BigscreenCard
                                class="h-[100px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">基础设施</div>
                                    ),
                                    default: () => (
                                        <div class="grid grid-cols-2 gap-2 p-3" v-loading={baseEquipmentLoading.value}>
                                            {
                                                baseEquipmentList.value.map(item => (
                                                    <div class="flex justify-between p-2 inner-border">
                                                        <div>{item.label}</div>
                                                        <div class="art-font">{item.value}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }}
                            />
                            <BigscreenCard
                                class="grow"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">生长分析</div>
                                    ),
                                    default: () => (
                                        <div id="growthChart"></div>
                                    )
                                }}
                            />
                            <BigscreenCard
                                class="grow"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">产量分析</div>
                                    ),
                                    default: () => (
                                        <div id="harvestChart" class="mt-2"></div>
                                    )
                                }}
                            />
                        </div>
                        <div class="grow flex flex-col space-y-3">
                            <div class="grow inner-border smart-plant-center relative">
                                <div class="absolute left-0 top-2 w-full flex justify-center space-x-2">
                                    {
                                        plantCenterTopCardList.value.map(item => (
                                            <div class="inner-border px-4 py-2 flex flex-col items-center" style="background:#001b4290;">
                                                <div>{item.label}</div>
                                                <div class="art-font">{item.value}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <BigscreenCard
                                class="h-[300px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">打造特色产品</div>
                                    ),
                                    default: () => (
                                        <div class="grid grid-cols-2 gap-2 p-3" v-loading={villageProductPageLoading.value}>
                                            {
                                                villageProductPageList.value.map(item => (
                                                    <div class="inner-border flex p-3">
                                                        <img
                                                            src={item.photo}
                                                            class="w-[230px] h-[200px]"
                                                        />
                                                        <div class="w-35% pl-3 grow">
                                                            <div class="flex justify-between p-2 inner-border">
                                                                <span>农场名称:</span>
                                                                <span>{item.park}</span>
                                                            </div>
                                                            <div class="flex justify-between p-2 inner-border">
                                                                <span>农场详情:</span>
                                                                <span>{item.parkDetail}</span>
                                                            </div>
                                                            <div class="flex justify-between p-2 inner-border">
                                                                <span>产品名称:</span>
                                                                <span>{item.product}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        <div class="w-[25%] flex flex-col space-y-3">
                            <BigscreenCard
                                class="h-[240px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">物联网设备</div>
                                    ),
                                    default: () => (
                                        <div class="p-4" v-loading={deviceInfoLoading.value}>
                                            <div class="flex justify-between inner-border p-1 px-2">
                                                <div class="art-font">物联网设备</div>
                                                <div class="text-sm">共<span class="art-font px-1">{deviceInfoTotal.value}</span>台</div>
                                            </div>
                                            <div class="grid grid-cols-2 gap-3 mt-3">
                                                {
                                                    deviceInfoList.value.map(item => (
                                                    <div class="inner-border p-2">
                                                        <div class="flex justify-between">
                                                        <div>{item.deviceKind}</div>
                                                        <div>共计:<span class="art-font px-1">{item.total}</span>台</div>
                                                        </div>
                                                        <div
                                                        class="h-[1.2rem] mt-2 relative flex justify-between items-center px-1"
                                                        style="background-color: #343b45"
                                                        >
                                                        <div
                                                            class="absolute top-0 left-0 h-full"
                                                            style={`width: ${item.rate}%;background-color:#397f43;`}
                                                        ></div>
                                                        <div class="relative z-10" style="font-size: 12px;">在线: {item.online}</div>
                                                        <div class="relative z-10" style="font-size: 12px;">离线: {item.offline}</div>
                                                        </div>
                                                    </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                            <BigscreenCard
                                class="grow"
                                v-slots={{
                                    title: () => (
                                        <div class="flex justify-between w-full">
                                            <div class="art-font text-lg">实时监测</div>
                                            {
                                                // <BigscreenSelector
                                                //     v-model={runtimeBase.value}
                                                //     options={[
                                                //         { key: 'test', label: 'test' },
                                                //         { key: 'test1', label: 'test1' }
                                                //     ]}
                                                // />
                                            }
                                        </div>
                                    ),
                                    default: () => (
                                        <>
                                            <div class="art-font px-3 py-1 pt-2">气象监测</div>
                                            <div class="grid grid-cols-2 gap-2 px-3 min-h-[80px]" v-loading={weatherLoading.value}>
                                                {
                                                    weatherList.value.map((item) => (
                                                        <div class="inner-border flex justify-between px-4 items-center">
                                                            <div class={['icon-' + item.icon]}></div>
                                                            <div class="flex space-x-2 items-end py-2">
                                                                <div>{item.label}</div>
                                                                <div>
                                                                    <span class="art-font">{item.value}</span>
                                                                    <span class="pl-1">{item.unit || ''}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div class="art-font px-3 py-1 pt-2">土壤墒情</div>
                                            <div class="grid grid-cols-2 gap-2 px-3 min-h-[80px]" v-loading={soilLoading.value}>
                                                {
                                                    soilList.value.map((item) => (
                                                        <div class="inner-border flex justify-between px-4 items-center">
                                                            <div class={['icon-' + item.icon]}></div>
                                                            <div class="flex space-x-2 items-end py-2">
                                                                <div>{item.label}</div>
                                                                <div>
                                                                    <span class="art-font">{item.value}</span>
                                                                    <span class="pl-1">{item.unit || ''}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            <div class="art-font px-3 py-1 pt-2">水质监测</div>
                                            <div class="grid grid-cols-2 gap-2 px-3 min-h-[80px]" v-loading={waterLoading.value}>
                                                {
                                                    waterList.value.map((item) => (
                                                        <div class="inner-border flex justify-between px-4 items-center">
                                                            <div class={['icon-' + item.icon]}></div>
                                                            <div class="flex space-x-2 items-end py-2">
                                                                <div>{item.label}</div>
                                                                <div>
                                                                    <span class="art-font">{item.value}</span>
                                                                    <span class="pl-1">{item.unit || ''}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        // 预警列表
        const preWarnLoading = ref<boolean>(false)
        const preWarnList = ref<Array<any>>([])
        const getPreWarnList = async () => {
            preWarnLoading.value = true
            const res = await fulingWarningInfo({
                parkId: '',
                plotId: ''
            }).catch(() => {
                preWarnLoading.value = false
            })
            if (!Array.isArray(res)) return
            preWarnLoading.value = false
            console.log("预警列表", res);
            preWarnList.value = res.map(item => ({
                ...item,
                warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss'),
                warnStatus: item.warnStatus === '0' ? '未处理' : '已处理'
            }))
        }
        getPreWarnList()

        // 预警分布Echarts
        const initChartWarnLayout = async () => {
            const res = await fulingWarningDistr({})
            if (!Array.isArray(res)) return
            initChartStatic(
                "preWarnLayoutChart",
                generatePieOptions({
                    legend: {
                        show: true,
                        top: "90%",
                        left: "center",
                        orient:'horizontal',
                    },
                    color: ["#5b9bd5", "#ed7d31", "#a5a5a5", '#ffc000','#4472c4'],
                    series: [
                        {
                            nam: "预警分布",
                            type: "pie",
                            radius: ["30%", "50%"],
                            center: "center",
                            data: res.map(item => ({
                                name: item.warnType,
                                value: item.warnRatio
                            })),
                            label: {
                                formatter: "{c},{d}%",
                                rich: {
                                    c: {
                                        color: "#c1c1c1",
                                        fontSize: 10,
                                    },
                                    d: {
                                        color: "#c1c1c1",
                                        fontSize: 10,
                                    },
                                },
                            },
                        },
                    ],
                })
            );
        }

        // 虫害数量
        const initBugCountChart = async () => {
            const {
                abscissaList = [],
                eList = [],
                sumList = [],
                jinList = [],
                xiList = []
            } = await getPestLevelChart({})
            console.log("虫害数量 总数", sumList);
            initChartStatic(
                'bugCountChart',
                generateBaseOptions({
                    xAxis: {
                        data: abscissaList,
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
                        name: '',
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
                            name: '总数',
                            data: sumList,
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
                        },
                        {
                            name: '金蝉子数量',
                            data: jinList,
                            type: 'bar',
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
                        },
                        {
                            name: '蛾对应数量',
                            data: eList,
                            type: 'bar',
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
                        },
                        {
                            name: '蟋蟀数量',
                            data: xiList,
                            type: 'bar',
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
                        },
                    ],
                    grid: {
                        left: '12%',
                        right: '10%',
                        top: '16%',
                        bottom: '15%'
                    }
                })
            )
        }
        addTabChangeMap('risk', () => {
            nextTick(() => {
                initChartWarnLayout()
                initBugCountChart()
            })
        })

        // 报警信息处理情况
        const warnHandleInfo = ref<Array<any>>([])
        const getWarnHandleInfoList = async () => {
            const res = await warningNum({})
            console.log('报警信息处理情况左侧统计', res);
            if (!Array.isArray(res)) return
            warnHandleInfo.value = res.map(item => ({
                label: item.warnStatus === '0'
                    ? '未处理'
                    : item.warnStatus === '1'
                    ? '已处理'
                    : '已忽略',
                value: item.num
            }))
        }
        getWarnHandleInfoList()

        // 报警信息处理情况列表
        const warnInfoHandleLoading = ref<boolean>(false)
        const warnInfoHandleList = ref<Array<any>>([])
        const getWarnInfoHandleList = async () => {
            warnInfoHandleLoading.value = true
            const { list = [] } = await agriWarningRecordPage({ warnStatus: '0' }).catch(() => {
                warnInfoHandleLoading.value = false
            })
            warnInfoHandleLoading.value = false
            if (!Array.isArray(list)) return
            warnInfoHandleList.value = list.map(item => {
                return {
                    ...item,
                    warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss')
                }
            })
        }
        getWarnInfoHandleList()

        // 指挥调度
        const commandLoading = ref<boolean>(false)
        const commandInfoList = ref<Array<any>>([])
        const getCommandInfoList = () => {
            commandLoading.value = true
            // const res = await  这个接口好像还没有
            commandLoading.value = false
            commandInfoList.value = []
        }
        getCommandInfoList()
        const riskTabPage = () => {
            return (
                <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="inner-border w-full h-full p-3 flex flex-col space-y-3 box-border">
                        <div class="h-[50%] flex space-x-3">
                            <div class="inner-border w-[50%]">
                                <BigscreenCard
                                    class="h-full"
                                    v-slots={{
                                        title: () => (
                                            <div class="art-font text-lg">预警信息</div>
                                        ),
                                        default: () => (
                                            <div class="p-3 h-[380px]">
                                                <BigscreenTable
                                                    columns={[
                                                        {
                                                            key: 'warnInfo',
                                                            label: '预警信息',
                                                            width: '14rem'
                                                        },
                                                        {
                                                            key: 'warnLocation',
                                                            label: '预警地点',
                                                            width: '14rem'
                                                        },
                                                        {
                                                            key: 'warnTime',
                                                            label: '预警时间',
                                                            width: '7rem'
                                                        },
                                                        {
                                                            key: 'warnType',
                                                            label: '预警类型',
                                                            width: '9rem'
                                                        },
                                                        {
                                                            key: 'warnStatus',
                                                            label: '预警状态',
                                                            width: '4rem'
                                                        },
                                                    ]}
                                                    dataList={preWarnList.value}
                                                    loading={preWarnLoading.value}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                            <div class="inner-border w-[50%]">
                                <BigscreenCard
                                    class="h-full"
                                    v-slots={{
                                        title: () => (
                                            <div class="art-font text-lg">报警信息处理情况</div>
                                        ),
                                        default: () => (
                                            <div class="p-3 h-[380px] flex space-x-3">
                                                <div class="w-[140px]">
                                                    {
                                                        warnHandleInfo.value.map(item => (
                                                            <div class="flex justify-between p-2 inner-border">
                                                                <span>{item.label}</span>
                                                                <span>{item.value}</span>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <BigscreenTable
                                                    columns={[
                                                        {
                                                            key: 'warnInfo',
                                                            label: '预警信息',
                                                            width: '23rem'
                                                        },
                                                        {
                                                            key: 'warnTime',
                                                            label: '预警时间',
                                                            width: '9rem'
                                                        },
                                                        {
                                                            key: 'operate',
                                                            label: '操作',
                                                            width: '11rem'
                                                        },
                                                    ]}
                                                    dataList={warnInfoHandleList.value}
                                                    loading={warnInfoHandleLoading.value}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div class="h-[50%] flex space-x-3">
                            <div class="inner-border w-[30%]">
                                <BigscreenCard
                                    class="h-full"
                                    v-slots={{
                                        title: () => (
                                            <div class="art-font text-lg">预警分布</div>
                                        ),
                                        default: () => (
                                            <div id="preWarnLayoutChart"></div>
                                        )
                                    }}
                                />
                            </div>
                            <div class="inner-border w-[30%]">
                                <BigscreenCard
                                    class="h-full"
                                    v-slots={{
                                        title: () => (
                                            <div class="art-font text-lg">虫害数量</div>
                                        ),
                                        default: () => (
                                            <div id="bugCountChart"></div>
                                        )
                                    }}
                                />
                            </div>
                            <div class="inner-border w-[40%]">
                                <BigscreenCard
                                    class="h-full"
                                    v-slots={{
                                        title: () => (
                                            <div class="art-font text-lg">指挥调度</div>
                                        ),
                                        default: () => (
                                            <div class="p-3">
                                                <BigscreenTable
                                                    columns={[
                                                        {
                                                            key: 'warnInfo',
                                                            label: '基地',
                                                        },
                                                        {
                                                            key: 'warnTime',
                                                            label: '地块',
                                                        },
                                                        {
                                                            key: 'operate',
                                                            label: '上次施肥时间',
                                                            width: '8rem'
                                                        },
                                                        {
                                                            key: 'operate',
                                                            label: '施肥预警',
                                                            width: '5rem'
                                                        },
                                                        {
                                                            key: 'operate',
                                                            label: '操作',
                                                            width: '4rem'
                                                        },
                                                    ]}
                                                    dataList={commandInfoList.value}
                                                    loading={commandLoading.value}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return () => (
            <BigscreenAdapter>
                <BigscreenContainer backgroundImage={mainBg}>
                    <BigscreenHeader
                        backgroundImage={headerBg}
                        v-slots={{
                            left: () => (
                                <BigscreenTab
                                    v-model={activeTab.value}
                                    options={[
                                        { key: 'base', label: '基地导览' },
                                        { key: 'plant', label: '智慧种植' },
                                        { key: 'risk', label: '风险预警' }
                                    ]}
                                    onChange={handleTabChange}
                                />
                            ),
                            right: () => (
                                <BigScreenTime />
                            ),
                            default: () => (
                                <div class="art-font tracking-wide">稻鱼鸭产业可视化数字驾驶舱</div>
                            )
                        }}
                    ></BigscreenHeader>
                    <BigscreenMain
                        v-slots={{
                            default: () => {
                                if (activeTab.value === 'base') return baseTabPage()
                                if (activeTab.value === 'plant') return plantTabPage()
                                if (activeTab.value === 'risk') return riskTabPage()
                            }
                        }}
                    />
                    <BigscreenFooter height="30px" />
                </BigscreenContainer>
            </BigscreenAdapter>
        )
    },
})

</script>
<style scoped lang="scss">
.inner-border {
    border: 1px solid #449ce9;
}

#growthChart, #harvestChart {
    height: 340px;
}

#preWarnLayoutChart, #bugCountChart {
    height: 400px;
}

.smart-plant-center {
    background-image: url(./assets/smartCenter.png);
    background-size: contain;
}

@for $i from 1 through 18 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% auto;
    width: 1.2rem;
    height: 1.2rem;
  }
}
</style>
