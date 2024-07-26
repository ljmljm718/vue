<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import headerBg from './assets/headerBg.png'
import titleLeft from './assets/titleLeft.png'
import CesiumMap from '@/views/tiandiMap/index.vue'
import { getParkListApi, getBaseInfoApi, getDuckHouseApi } from './apis'
import { Select } from '@element-plus/icons-vue/dist/types'
import icon from './assets/icon.png'
import { ChildProcess } from 'child_process'

const { BigscreenAdapter, BigscreenContainer, BigscreenHeader, BigscreenMain } = BigscreenBuilder

export default defineComponent({
  name: 'BigscreenMingYueZQ',
  setup() {
    const showSidePanel = ref<boolean>(false)
    setTimeout(() => {
      showSidePanel.value = true
    }, 100)

    const baseList = ref<any[]>([])
    //-------------获取基地信息-----------------
    const getBaseList = async () => {
      const res = await getBaseInfoApi()
      console.log('getBaseInfoApi res =>', res)
      if (Array.isArray(res)) {
        baseList.value = res
        if (res[0].id) getPlotDataList(res[0].id)
        if (res[0].id) getDuckHouse(res[0].id)
      }
    }
    getBaseList()

    // //-------------获取地块信息-----------------
    const dataList = ref<any[]>([])
    const getPlotDataList = async (param) => {
      console.log('param', param)
      const res = await getParkListApi({ parkId: param })
      console.log('getPlotDataList res=>', res)

      if (Array.isArray(res)) dataList.value = res.map(item => ({
        ...item, children: [
          {
            title: '地块编号',
            value: item.code || ''
          },
          {
            title: '地块面积',
            value: item.area || ''
          }
        ]
      }))
    }
    // ------------获取鸭舍信息---------
    const duckHouseList = ref<any[]>([])
    const duckHouseChild = ref<any[]>([])
    const getDuckHouse = async (param) => {

      const res = await getDuckHouseApi({ parkId: param })
      console.log('hello duck', res)
      if (Array.isArray(res)) duckHouseList.value = res.map(item => ({

        ...item, children: [
          {
            title: '面积',
            value: item.area || ''
          },
          {
            title: '面积',
            value: item.area || ''
          },
        ]
      }))

    }





    //------------------------------------------
    const TitleValue = ({ title = '', value = '' }) => {
      return (
        <div class="space-y-2">
          <div class="flex items-center">
            <img src={icon} class="w-.8rem h-.8rem mr-.4rem" />
            <div>{title}</div>
          </div>
          <div class="pl-[1.2rem]">{value}</div>
        </div>
      )
    }


    // ----------------------------------
    return () => (
      <div class="w-[100vw] h-[100vh] bg-[#0d1724]">
        <BigscreenAdapter>
          <BigscreenContainer>
            <BigscreenHeader backgroundImage={headerBg} height="100px" />
            <BigscreenMain>
              <div class="bg-[#0d1724] w-full h-full relative overflow-hidden">
                <div class="absolute z-2 w-full h-full">
                  { /* <CesiumMap /> */}
                  <div class="meng-ban z-0"></div>
                </div>
                <div
                  class="z-10 absolute left-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-1000 p-2 space-y-2"
                  style={{
                    left: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="left-title w-full h-[3.2rem]"></div>
                  <div class="w-full overflow-auto space-y-3 hidden-scrollbar" style="height: calc(100% - 3.8rem)">
                    {
                      dataList.value.map(item => (
                        <div class="item-wrapper w-full min-h-[3rem]">
                          <div class="w-full flex justify-center items-center text-[#11efa6] py-3 text-[18px]">{item.name}</div>
                          <div class="split-bar w-full h-[3px]"></div>
                          <div class="grid grid-cols-2 gap-3 p-2">
                            {
                              Array.isArray(item.children) ? item.children.map(ele => (
                                <div class="inner-rect p-2 px-3 space-y-2">
                                  <TitleValue title={ele.title} value={ele.value} />
                                </div>
                              )) : null
                            }
                          </div>
                          {
                            Array.isArray(item.child) ? (
                              <div class="grid grid-cols-2 gap-3 p-2">
                                {
                                  item.child.map(_ele => (
                                    <div class="inner-rect p-2 px-3 space-y-3">
                                      <TitleValue title="种植作物" value={_ele.cropName} />
                                      <TitleValue title="种植开始时间" value={_ele.startTime} />
                                      <TitleValue title="预计收获时间" value={_ele.endTime} />
                                    </div>
                                  ))
                                }
                              </div>
                            ) : null
                          }
                        </div>
                      ))
                    }
                  </div>

                </div>
                <div class="center-title">
                  <select
                    class="bg=[#ffffff00]"
                    style="
                          -webkit-text-fill-color: transparent;
                          background-clip: text;
                          text-fill-color: transparent;                  
                          font-family: AlibabaPuHuiTi;
                          font-size: 18px;
                          font-weight: normal;
                          line-height: normal;
                          text-align: center;
                          letter-spacing: 0px;
                          border:none;"
                    onChange={(e) => { getPlotDataList(e.target.value); getDuckHouse(e.target.value); }

                    }
                  >
                    {
                      baseList.value.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div class="z-10 absolute left-[60rem] top-[1rem] w-[22%] hidden">
                  这里是下拉列表
                  <select onChange={(e) => { getPlotDataList(e.target.value); getDuckHouse(e.target.value); }}>
                    <option value="">请选择基地</option>
                    {
                      baseList.value.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div
                  class="z-10 absolute right-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)]  transition-all duration-1000 p-2"
                  style={{
                    right: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="right-title w-full h-[4.5rem]"></div>
                  <div class="w-full overflow-auto hidden-scrollbar space-y-3" style="height calc(100% - 4.5rem) ">
                    {
                      duckHouseList.value.map((item) => (
                        <div class="item-wrapper w-full min-h-[3rem]">
                          <div class="w-full flex justify-center items-center text-[#11efa6] py-3 text-[18px]">{item.name}</div>
                          <div class="split-bar w-full h-[3px]"></div>
                          <div class="grid grid-cols-2 gap-3 p-2">
                            {
                              Array.isArray(item.children) ? item.children.map(ele => (
                                <div class="inner-rect p-2 px-3 space-y-2">
                                  <TitleValue title={ele.title} value={ele.value} />
                                </div>
                              )) : null
                            }

                            {
                              Array.isArray(item.child) ? (
                                <div class="grid grid-cols-1 gap-2 col-span-2">
                                  {
                                    item.child.map(_ele => (
                                      <div class="gap-1 grid grid-cols-2">
                                        <div class="inner-rect p-2 px-3">
                                          <TitleValue title="养殖品种" value={_ele.cropName} />
                                        </div>
                                        <div class="inner-rect p-2 px-3">
                                          <TitleValue title="开始养殖时间时间" value={_ele.startTime} />
                                        </div>
                                        <div class="inner-rect p-2 px-3">
                                          <TitleValue title="预计收货时间" value={_ele.endTime} />
                                        </div>
                                        <div class="inner-rect p-2 px-3">
                                          <TitleValue title="物候期" value={_ele.growth} />
                                        </div>



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
  background-image: url(./assets/titleLeft.png);
  background-size: 100% 100%;
}

.right-title {
  background-image: url(./assets/titleRight.png);
  background-size: 100% 100%;
}

.item-wrapper {
  background-image: url(./assets/itemWrapper.png);
  background-size: 100% 100%;
}

.hidden-scrollbar::-webkit-scrollbar {
  width: 0;
}

.split-bar {
  background-image: url(./assets/splitBar.png);
  background-size: 90% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}

.extra-icon {
  background-image: url(./assets/icon.png);
  background-size: 100% 100%;
}

.inner-rect {
  background-image: url(./assets/innerRect.png);
  background-size: 100% 100%;
}

.center-title {
  background-image: url(./assets/centerTitle.png);
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #fff;
  position: absolute;
  left: calc(50% - 163px);
  width: 326px;
  height: 60px;
  top: 3rem;
  z-index: 999;
}
</style>
