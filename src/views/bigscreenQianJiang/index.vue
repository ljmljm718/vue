<script lang="tsx">
import { defineComponent, ref } from 'vue'
import BigscreenBuilder, { KeyLabelObject } from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import headerBg from './assets/headerBg.png'
import mainBg from './assets/bg.png'
import img1 from './assets/img1.png'
import img2 from './assets/img2.png'
import {
  getParkBaseInfo,
  qianjiangMonitor,
  qjDeviceStatistics,
  getQianjiangAgriResource,
  qianjiangWarnRecordInfo,
  qjDeviceInfo,
} from './api'
import { formatTime } from '@/utils'

const {
    BigscreenAdapter,
    BigscreenContainer,
    BigscreenHeader,
    BigscreenFooter,
    BigscreenMain,
    BigscreenCard,

    BigscreenSelector,
    BigscreenTable,
} = BigscreenBuilder

interface LabelValItem {
  label: string,
  value: string
}

interface BaseItemType extends LabelValItem {
  unit: string,
  icon: any
}

interface SoilItemType extends BaseItemType {}
interface WeatherItemType extends BaseItemType {}
interface BugItemType extends LabelValItem {
  unit: string,
  open: boolean
}

interface AgricultureItemType extends BaseItemType {}

export default defineComponent({
    name: 'BigscreenQianJiang',
    setup() {
      const selectedBase = ref(), selectedPlot = ref()
      const baseOptions = ref<Array<KeyLabelObject>>([]), plotOptions = ref<Array<KeyLabelObject>>([])
      const getBasePlotOptions = async (parentId = 0) => {
        const res = await getParkBaseInfo({ parentId })
        if (!Array.isArray(res)) return
        if (parentId === 0) {
          // 查询基地列表
          baseOptions.value = res.map(item => ({
            key: item.id,
            label: item.name
          }))
          if (res.length > 0) {
            selectedBase.value = res[0].id
            if (res[0].id !== 0) getBasePlotOptions(res[0].id)
          }
        } else {
          // 查询地块列表
          plotOptions.value = res.map(item => ({
            key: item.id,
            label: item.name
          }))
          if (res.length > 0) {
            selectedPlot.value = res[0].id
            refreshAllData()
          }
        }
      }
      getBasePlotOptions()

      const refreshAllData = () => {
        getWeatherList()
        getSoilList()
        getBugList()
        getAgricultureResourceList()
        getPreWarnList()
        getDeviceInfoList()
        getTopCardDataList()
      }
      
      // 气象站
      const weatherLoading = ref<boolean>(false)
      const weatherList = ref<Array<WeatherItemType>>([])
      const getWeatherList = async () => {
        weatherLoading.value = true
        const res = await qianjiangMonitor({ type: '气象站' }).catch(() => {
          weatherLoading.value = false
        })
        weatherLoading.value = false
        if(!Array.isArray(res)) return
        weatherList.value = res.map(item => ({
          icon: getIconClass(item.monitoringType),
          label: item.monitoringType || '--',
          value: item.dataValue || '--',
          unit: item.unit || ''
        })).slice(0, 8)
      }
      getWeatherList()

      // 气象站
      const soilLoading = ref<boolean>(false)
      const soilList = ref<Array<SoilItemType>>([])
      const getSoilList = async () => {
        soilLoading.value = true
        const res = await qianjiangMonitor({ type: '土壤墒情' }).catch(() => {
          soilLoading.value = false
        })
        soilLoading.value = false
        if(!Array.isArray(res)) return
        soilList.value = res.map(item => ({
          icon: getIconClass(item.monitoringType),
          label: item.monitoringType || '--',
          value: item.dataValue || '--',
          unit: item.unit || ''
        })).slice(0, 8)
      }
      getSoilList()

      // 虫情监测
      const bugLoading = ref<boolean>(false)
      const bugList = ref<Array<BugItemType>>([])
      const getBugList = async () => {
        bugLoading.value = true
        const res = await qianjiangMonitor({ type: '虫情监测' }).catch(() => {
          bugLoading.value = false
        })
        bugLoading.value = false
        if(!Array.isArray(res)) return
        bugList.value = res.map(item => ({
          label: item.monitoringType || '--',
          value: item.dataValue || '--',
          unit: item.unit || '',
          open: item.dataValue === '1'
        })).slice(0, 8)
      }
      getBugList()


      // 中央顶部卡片数据
      const topCardDataList = ref<Array<LabelValItem>>([])
      const getTopCardDataList = async () => {
        const res = await qjDeviceStatistics({
          belongPark: selectedBase.value,
          belongPlot: selectedPlot.value
        })
        console.log('中央顶部卡片数据', res);
        if (!res) return
        topCardDataList.value = [
          {
            label: '设备总数',
            value: res.total || '0'
          },
          {
            label: '在线设备',
            value: res.online || '0'
          },
          {
            label: '离线设备',
            value: res.offline || '0'
          },
          {
            label: '设备预警',
            value: res.warningDevice || '0'
          },
        ]
      }


      // 农业资源
      const agricultureLoading = ref<boolean>(false)
      const agricultureResourceList = ref<Array<AgricultureItemType>>([])
      const getAgricultureResourceList = async () => {
        agricultureLoading.value = true
        const res = await getQianjiangAgriResource({}).catch(() => {
          agricultureLoading.value = false
        })
        agricultureLoading.value = false
        if (!res) return
        agricultureResourceList.value = [
          {
            label: '大棚数量',
            value: res.shelterAmount.toString() || '0',
            icon: getIconClass('大棚数量'),
            unit: '个'
          },
          {
            label: '盆栽数量',
            value: res.pottingAmount.toString() || '0',
            icon: getIconClass('盆栽数量'),
            unit: '个'
          },
          {
            label: '种植面积',
            value: res.plantArea.toString() || '0',
            icon: getIconClass('种植面积'),
            unit: '亩'
          },
          {
            label: '种植农户',
            value: res.plantFarmer.toString() || '0',
            icon: getIconClass('种植农户'),
            unit: '户'
          },
        ]
      }
      getAgricultureResourceList()

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


      // 预警信息
      const preWarnLoading = ref<boolean>(false)
      const preWarnList = ref<Array<any>>([])
      const getPreWarnList = async () => {
        preWarnLoading.value = true
        const res = await qianjiangWarnRecordInfo({}).catch(() => {
          preWarnLoading.value = false
        })
        console.log("预警信息", res);
        preWarnLoading.value = false
        if (!Array.isArray(res)) return
        preWarnList.value = res.map(item => ({
          ...item,
          warnTime: formatTime(item.warnTime, 'yyyy-MM-dd HH:mm:ss'),
          warnStatus: item.warnStatus === '0' ? '未处理' : '已处理'
        }))
      }
      getPreWarnList()

      // 设备信息
      const deviceInfoLoading = ref<boolean>(false)
      const deviceInfoList = ref<Array<any>>([])
      const deviceInfoTotal = ref(0)
      const getDeviceInfoList = async () => {
        deviceInfoTotal.value = 0
        deviceInfoLoading.value = true
        const res = await qjDeviceInfo({
          belongPark: selectedBase.value || '',
          belongPlot: selectedPlot.value || ''
        }).catch(() => {
          deviceInfoLoading.value = false
        })
        deviceInfoLoading.value = false
        if (!Array.isArray(res)) return
        const getRateByData = (_item) => {
          return parseInt(_item.online) / parseInt(_item.total) * 100
        }
        deviceInfoList.value = res.map(item => ({ ...item, rate: getRateByData(item) }))
        res.forEach(item => { deviceInfoTotal.value += parseInt(item.total) })
      }
      getDeviceInfoList()
      return () => (
        <BigscreenAdapter>
          <BigscreenContainer backgroundImage={mainBg}>
            <BigscreenHeader
              backgroundImage={headerBg}
              v-slots={{
                  right: () => (
                      <BigScreenTime />
                  ),
                  default: () => (
                      <div class="art-font tracking-wide">黔江县中元村珠兰花盆栽可视化大屏</div>
                  ),
                  left: () => (
                    <div class="flex space-x-2">
                      <BigscreenSelector width={'10rem'} options={baseOptions.value} v-model={selectedBase.value} onChange={(key) => getBasePlotOptions(key)} />
                      <BigscreenSelector width={'12rem'} options={plotOptions.value} v-model={selectedPlot.value} onChange={() => refreshAllData()} />
                    </div>
                  )
              }}
            ></BigscreenHeader>
            <BigscreenMain
              v-slots={{
                default: () => (
                  <div class="w-full h-full box-border pb-1 px-5 py-3">
                    <div class="w-full h-full p-3 flex space-x-3 box-border">
                      <div class="w-[25%] flex flex-col space-y-3">
                        <BigscreenCard
                          class="h-[340px]"
                          v-slots={{
                            title: () => (
                                <div class="art-font text-lg">气象监测</div>
                            ),
                            default: () => (
                              <div class="grid grid-cols-2 grid-rows-4 gap-3 p-4 h-[17rem]" v-loading={weatherLoading.value}>
                                {
                                  weatherList.value.map((item: WeatherItemType) => (
                                    <div class="inner-border flex justify-between px-4 items-center">
                                      <div class={['icon-' + item.icon]}></div>
                                      <div class="flex flex-col items-end">
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
                            )
                          }}
                        />
                        <BigscreenCard
                          class="h-[340px]"
                          v-slots={{
                            title: () => (
                                <div class="art-font text-lg">土壤检测</div>
                            ),
                            default: () => (
                              <div class="grid grid-cols-2 grid-rows-4 gap-3 p-4 h-[17rem]" v-loading={soilLoading.value}>
                                {
                                  soilList.value.map((item: SoilItemType) => (
                                    <div class="inner-border flex justify-between px-4 items-center">
                                      <div class={['icon-' + item.icon]}></div>
                                      <div class="flex flex-col items-end">
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
                            )
                          }}
                        />
                        <BigscreenCard
                          class="grow"
                          v-slots={{
                            title: () => (
                                <div class="art-font text-lg">虫害监测</div>
                            ),
                            default: () =>(
                              <div class="grid grid-cols-2 grid-rows-4 gap-3 p-4 h-[10rem]" v-loading={soilLoading.value}>
                                {
                                  bugList.value.map((item: BugItemType) => (
                                    <div class="inner-border flex justify-between px-4 items-center">
                                      <div>{item.label}</div>
                                      <div>
                                        {
                                          item.unit ? (
                                            <>
                                              <span class="art-font">{item.value}</span>
                                              <span class="pl-1">{item.unit || ''}</span>
                                            </>
                                          ) : (
                                            <el-switch
                                              v-model={item.open}
                                              class="ml-2"
                                              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                            />
                                          )
                                        }
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            )
                          }}
                        />
                      </div>
                      <div class="grow flex flex-col space-y-3 relative">
                        <div class="absolute top-0 left-0 w-full flex justify-center py-2 space-x-3">
                          {
                            topCardDataList.value.map((item:LabelValItem) => (
                              <div class="inner-border py-2 px-4 flex flex-col items-center">
                                <div class="text-lg">{item.label}</div>
                                <div class="art-font text-lg">{item.value}</div>
                              </div>
                            ))
                          }
                        </div>
                        <img src={img1} class="absolute top-[15rem] w-[54rem] left-[1.3rem] z-20" />
                        <img src={img2} class="absolute top-[19rem] w-[40rem] left-[8.6rem] z-10" />
                      </div>
                      <div class="w-[25%] flex flex-col space-y-3">
                        <BigscreenCard
                          class="h-[13rem]"
                          v-slots={{
                            title: () => (
                                <div class="art-font text-lg">农业资源</div>
                            ),
                            default: () => (
                              <div class="grid grid-cols-2 grid-rows-2 gap-3 p-4 h-[8rem]" v-loading={soilLoading.value}>
                                {
                                  agricultureResourceList.value.map((item: AgricultureItemType) => (
                                    <div class="inner-border flex justify-between px-4 items-center">
                                      <div class={['icon-' + item.icon]}></div>
                                      <div class="flex flex-col items-end">
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
                            )
                          }}
                        />
                        <BigscreenCard
                          class="grow"
                          v-slots={{
                            title: () => (
                                <div class="art-font text-lg">设备信息</div>
                            ),
                            default: () => (
                              <div class="p-4" v-loading={deviceInfoLoading.value}>
                                <div class="flex justify-between inner-border p-3">
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
                          class="h-[18rem]"
                          v-slots={{
                            title: () => (
                                <div class="art-font text-lg">预警信息</div>
                            ),
                            default: () => (
                              <div class="p-4">
                                <BigscreenTable
                                  columns={[
                                    {
                                      key: 'warnInfo',
                                      label: '预警信息',
                                      width: '14rem'
                                    },
                                    {
                                      key: 'warnTime',
                                      label: '报警时间',
                                      width: '7rem'
                                    },
                                    {
                                      key: 'warnStatus',
                                      label: '状态',
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
                    </div>
                  </div>
                )
              }}
            />
            <BigscreenFooter height="30px" />
          </BigscreenContainer>
        </BigscreenAdapter>
      )
    }
})
</script>
<style scoped lang="scss">
.inner-border {
    border: 1px solid #449ce9;
}

@for $i from 1 through 18 {
  .icon-#{$i} {
    background-image: url(./assets/icon#{$i}.png);
    background-size: 100% auto;
    width: 2rem;
    height: 2rem;
  }
}
</style>