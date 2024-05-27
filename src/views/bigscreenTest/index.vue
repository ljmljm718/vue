<script lang="tsx">
import { defineComponent, ref } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import headerBg from './assets/headerBg.png'
import mainBg from './assets/bg.png'
import { formatTime } from '@/utils'
import {
    getParkTree,
    getEquipmentPhotographAndVideo,
    monitoringEquNoticePage,

    getPondCountFrySum,
    // getLineChar,
    // selectHarvest,
    // getEquipmentCountSum,
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
            const res = await getEquipmentPhotographAndVideo({ baseId, plotId }).catch(() => {
                monitorDeviceLoading.value = false
            })
            console.log("获取监控设备列表", res);
            monitorDeviceLoading.value = false
            deviceVideoList.value = res.map(item => ({
                deviceName: item.deviceName,
                videoSrc: item.url,
                baseName: item?.monitoringEquipmentDataDO?.monitoringBaseName,
                online: true
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
        // const getGrowthLineChartData = async () => {
        //     const { xValue = [], yValue = [], measureUnit = []} = await getLineChar({})

        // }
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
                                class="h-[400px]"
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
                                    )
                                }}
                            />
                        </div>
                        <div class="grow flex flex-col space-y-3">
                            <div class="grow inner-border"></div>
                            <BigscreenCard
                                class="h-[300px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">打造特色产品</div>
                                    )
                                }}
                            />
                        </div>
                        <div class="w-[25%] flex flex-col space-y-3">
                            <BigscreenCard
                                class="h-[300px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">物联网设备</div>
                                    )
                                }}
                            />
                            <BigscreenCard
                                class="grow"
                                v-slots={{
                                    title: () => (
                                        <div class="flex justify-between w-full">
                                            <div class="art-font text-lg">实时监测</div>
                                            <BigscreenSelector
                                                v-model={runtimeBase.value}
                                                options={[
                                                    { key: 'test', label: 'test' },
                                                    { key: 'test1', label: 'test1' }
                                                ]}
                                            />
                                        </div>
                                    ),
                                    default: () => (
                                        <div>test</div>
                                        
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        const riskTabPage = () => {
            return (
                <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="inner-border w-full h-full p-3 flex flex-col space-y-3 box-border">
                        <div class="h-[50%] flex space-x-3">
                            <div class="inner-border w-[50%]"></div>
                            <div class="inner-border w-[50%]"></div>
                        </div>
                        <div class="h-[50%] flex space-x-3">
                            <div class="inner-border w-[30%]"></div>
                            <div class="inner-border w-[30%]"></div>
                            <div class="inner-border w-[40%]"></div>
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
<style scoped>
.inner-border {
    border: 1px solid #449ce9;
}
</style>
