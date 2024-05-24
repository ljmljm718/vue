<script lang="tsx">
import { defineComponent, ref } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import headerBg from './assets/headerBg.png'
import mainBg from './assets/bg.png'
import { formatTime } from '@/utils'

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
        const activeTab = ref('base')
        const deviceVideoList = ref<Array<DeviceVideoListItemType>>([
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
            {
                deviceName: '设备1',
                videoSrc: 'string',
                baseName: 'string',
                online: true
            },
        ])

        const noticeList = ref<Array<NoticeItemType>>([
            {
				"captured": "http://117.73.12.97:9000/inspur/b4099f3c8fb37fdb8ac15b99415e8548b5816ecec398480f08926b24bc9095d6.jpg",
				"noticeEvent": "经过",
				"recordTime": 1716429787000
			},
			{
				"captured": "http://117.73.12.97:9000/inspur/a694bbf5ededec23c1fe004245456620c51f2ee124fcd155c49afdc17a253c75.jpg",
				"noticeEvent": "逗留",
				"recordTime": 1716343126000
			},
			{
				"captured": "http://117.73.12.97:9000/inspur/f1a9833cf93d493154194ad6352d12757da85670d6f5aa8cbff5ca8b6bc57b61.jpg",
				"noticeEvent": "非法入侵非法入侵非法入侵非法入侵非法入侵非法入侵非法入侵非法入侵非法入侵",
				"recordTime": 1716340773000,
			},
			{
				"captured": "http://117.73.12.97:9000/inspur/de9ef56cdae79ce75ab78eb07d6f1e13c51a81e9177c3d50dd84427f560ba491.jpg",
				"noticeEvent": "经过",
				"recordTime": 1716340410000
			},
        ])
        const baseTabPage = () => {
            return (
                <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="inner-border w-full h-full p-3 flex space-x-3 box-border">
                        <div class="inner-border w-[10rem] p-3">{activeTab.value}</div>
                        <div class="inner-border grow p-3 grid grid-cols-3 grid-rows-3 gap-3">
                            {
                                deviceVideoList.value.map((item:DeviceVideoListItemType) => (
                                    <div class="p-3 flex flex-col bg-gray-900 inner-border">
                                        <div class="art-font h-[1.4rem] tracking-wide">{ item.deviceName }</div>
                                        <video class="w-full h-[13rem]" controls autoplay src={ item.videoSrc } />
                                        <div class="flex items-center justify-between pt-2">
                                            <div>{ item.deviceName }</div>
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
                            <div class="h-[53rem]">
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
        const plantTabPage = () => {
            return (
                <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="w-full h-full p-3 flex space-x-3 box-border">
                        <div class="w-[25%] flex flex-col space-y-3">
                            <BigscreenCard
                                class="h-[300px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">基础设施</div>
                                    )
                                }}
                            />
                            <BigscreenCard
                                class="h-[400px]"
                                v-slots={{
                                    title: () => (
                                        <div class="art-font text-lg">生长分析</div>
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
