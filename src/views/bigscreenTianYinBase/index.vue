<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import headerBg from './assets/headerBg.png'
import CesiumMap from '@/views/tiandiMap/index.vue'
import {
  getParkList,
  getLeftListInfo
} from './api'
import titleBar from './assets/titleBar.png'
import { log } from 'console'

const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenMain,
} = BigscreenBuilder


export default defineComponent({
  name: 'BigscreenTianYinBase',
  setup() {
    const showSidePanel = ref<boolean>(false)
    setTimeout(() => {
      showSidePanel.value = true
    }, 100)

    // 中间部分选择基地
    const selectedBase = ref<string>('枳壳树种植基地')
    const parkDataList = ref<any[]>([])
    const getParkData = async () => {
      const res = await getParkList()
      if (Array.isArray(res)) {
        parkDataList.value = res
        if (res.length > 0) {
          getMainDataList(res[0].id)

        }
      }
    }
    getParkData()

    // 获取除标题外的外层数据
    const getMainDataList = async (parkId) => {
      const res = await getLeftListInfo({ parkId })
      console.log("getMainDataList", res);
      if (Array.isArray(res)) {
        const _res = res.map(item => ({
          ...item, children: [
            {
              title: '地块编号',
              value: item.code
            },
            {
              title: '地块面积',
              value: item.area + ' 亩'
            },
          ],
        }))
        const num = _res.length / 2
        leftDataList.value = _res.slice(0, num)
        rightDataList.value = _res.slice(num)   
        console.log('leftDataList.value',leftDataList.value);
        console.log('leftDataList.value',leftDataList.value[0]);
      }
    }

    const leftDataList = ref<any[]>([])
    const rightDataList = ref<any[]>([])

    const TitleValue = ({ title, value }) => {
      return (
        <div class="inner-rect p-3">
          <div class="flex items-center">
            <img src={titleBar} class="w-.6rem h-.6rem mr-2" />
            <div>{title}</div>
          </div>
          <div class="pl-1rem text-[#daf5fa]">{value}</div>
        </div>
      )
    }

    return () => (
      <div class="w-[100vw] h-[100vh] bg-[#0d1724]">
        <BigscreenAdapter>
          <BigscreenContainer >
            <BigscreenHeader
              backgroundImage={headerBg}
              height="100px"
            />
            <BigscreenMain>
              <div class="bg-[#0d1724] w-full h-full relative overflow-hidden">
                <div class="absolute z-2 w-full h-full">
                  <CesiumMap />
                  {/* <CesiumMap /> */}
                  <div class="meng-ban z-0"></div>
                </div>
                <div
                  class="z-10 absolute left-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-100"
                  style={{
                    left: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="left-title w-full h-[4rem]"></div>
                  <div class="hidden-scrollbar p-2 space-y-2 overflow-auto" style="height: calc(100% - 4rem);">
                    {
                      leftDataList.value.map(item => (
                        <div class="item-wrapper w-full min-h-[4rem]">
                          <div class="text-[#11eeaf] w-full text-center py-2 text-[18px]">{item.name}</div>
                          <div class="line-bar w-full h-[3px]"></div>
                          <div class="grid grid-cols-2 gap-2 p-2">
                            {
                              Array.isArray(item.children) ? item.children.map(ele => (
                                <div class="inner-rect p-2 px-3 space-y-1">
                                  <div class="flex items-center">
                                    <div class="title-bar w-.6rem h-.6rem mr-2"></div>
                                    <div>{ele.title}</div>
                                  </div>
                                  <div class="pl-1rem text-[#daf5fa]">{ele.value}</div>
                                </div>
                              )) : null
                            }
                            {
                              Array.isArray(item.child) ? (
                                <div class="col-span-2">
                                  {
                                    item.child.map(item => (
                                      <div class="grid grid-cols-2 gap-2">
                                        <TitleValue title="种植作物" value={item.cropName}/>
                                        <TitleValue title="物候期" value={item.growth} />
                                        <TitleValue title="开始种植时间" value={item.startTime} />
                                        <TitleValue title="预计收获时间" value={item.endTime} />
                                      </div>
                                    ))
                                  }
                                </div>
                              ) : null
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                {/* 右侧 */}
                <div
                  class="z-10 absolute right-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-100"
                  style={{
                    right: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="right-title w-full h-[4rem]"></div>
                  <div class="hidden-scrollbar p-2 space-y-2 overflow-auto" style="height: calc(100% - 4rem);">
                    {
                      rightDataList.value.map(item => (
                        <div class="item-wrapper w-full min-h-[4rem]">
                          <div class="text-[#11eeaf] w-full text-center py-2 text-[18px]">{item.name}</div>
                          <div class="line-bar w-full h-[3px]"></div>
                          <div class="grid grid-cols-2 gap-2 p-2">
                            {
                              Array.isArray(item.children) ? item.children.map(ele => (
                                <div class="inner-rect p-2 px-3 space-y-1">
                                  <div class="flex items-center">
                                    <div class="title-bar w-.6rem h-.6rem mr-2"></div>
                                    <div>{ele.title}</div>
                                  </div>
                                  <div class="pl-1rem text-[#daf5fa]">{ele.value}</div>
                                </div>
                              )) : null
                            }
                            {
                              Array.isArray(item.child) ? (
                                <div class="col-span-2">
                                  {
                                    item.child.map(item => (
                                      <div class="grid grid-cols-2 gap-2">
                                        <TitleValue title="种植作物" value={item.cropName} />
                                        <TitleValue title="物候期" value={item.growth} />
                                        <TitleValue title="开始种植时间" value={item.startTime} />
                                        <TitleValue title="预计收获时间" value={item.endTime} />
                                      </div>
                                    ))
                                  }
                                </div>
                              ) : null
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div class="absolute z-10 w-[326px] h-[60px] top-8 center-title flex justify-center items-center text-[1.1rem]" style="left: calc(50% - 163px);">
                  {selectedBase.value}
                </div>
              </div>
            </BigscreenMain>
          </BigscreenContainer>
        </BigscreenAdapter>
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
.meng-ban {
  width: 100%;
  height: 100%;
  background-image: url(./assets/mb.png);
  background-size: 100% 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
}

.left-title {
  background-image: url(./assets/leftTitle.png);
  background-size: 100% 100%;
}

.right-title {
  background-image: url(./assets/rightTitle.png);
  background-size: 100% 100%;
}

.item-wrapper {
  background-image: url(./assets/itemWrapper.png);
  background-size: 100% 100%;
}

.hidden-scrollbar::-webkit-scrollbar {
  width: 0px;
}

.line-bar {
  background-image: url(./assets/line.png);
  background-size: 98% 100%;
  background-position: center center;
  background-repeat: no-repeat;
}

.inner-rect {
  background-image: url(./assets/innerRect.png);
  background-size: 100% 100%;
}

.title-bar {
  background-image: url(./assets/titleBar.png);
  background-size: 100% 100%;
}

.center-title {
  background-image: url(./assets/centerTitle.png);
  background-size: 100% 100%;
}
</style>
