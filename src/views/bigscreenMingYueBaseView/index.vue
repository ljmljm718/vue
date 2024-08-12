<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import titleLeft from './assets/titleLeft.png'
import CesiumMap from '@/views/tiandiMap/index.vue'
import { getParkListApi, getBaseInfoApi, getDuckHouseApi } from './apis'
import { Select } from '@element-plus/icons-vue/dist/types'
import icon from './assets/icon.png'
import { ChildProcess } from 'child_process'
import { ParkInfoApi } from '@/api/agriculture/parkinfo/index'

import * as turf from '@turf/turf'

const { BigscreenContainer, BigscreenMain, BigscreenAdapter } = BigscreenBuilder

export default defineComponent({
  name: 'BigscreenMingYueBaseView',
  setup() {
    const showSidePanel = ref<boolean>(false)
    setTimeout(() => {
      showSidePanel.value = true
    }, 100)
    // ---------画地图-----------
    const cesiumIns = ref()
    const getParkData = async () => {
      const { list } = await ParkInfoApi.getParkInfoPage({})
      if (Array.isArray(list) && list.length > 0) {
        const _arr = list.map(item => (JSON.parse(item.geofencing)))
        _arr.forEach(item => {
          if (Array.isArray(item) && item.length > 0) {
            // const polyArr = item[0].map(ele => ([ele.lng, ele.lat]))
            // if (cesiumIns.value) cesiumIns.value.createPolygon(undefined, polyArr)
          }
        })

        if (Array.isArray(_arr) && _arr.length > 0) {
          const features = turf.points([
            ..._arr[0][0].map(item => ([item.lng, item.lat]))
          ]);

          const _POS_ = turf.center(features);
          const { geometry } = _POS_;
          const { coordinates } = geometry
          cesiumIns.value.flyTo(
            undefined,
            [...coordinates, 1400]
          )
        }
      }
    }
    //-------------获取基地信息-----------------
    const baseList = ref<any[]>([])
    const getBaseList = async () => {
      const res = await getBaseInfoApi()
      console.log('getBaseInfoApi res =>', res)
      if (Array.isArray(res)) {
        baseList.value = res
        console.log("RES", res);
        options.value = res.map(item => ({
          ...item, label: item.name, value: item.id
        }))
        const _id = res[0].id
        if (_id) {
          selectedPlot.value = _id
          getPlotDataList(_id)
          getDuckHouse(_id)
        }
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
            title: '地块面积',
            value: item.area + '亩' || ''
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
      if (Array.isArray(res)) duckHouseList.value = res
    }

    //------------------------------------------
    const TitleValue = ({ title = '', value = '' }) => {
      return (
        <div class="space-y-2">
          <div class="flex items-center">
            {/* <img src={icon} class="w-1rem h-.6rem mr-.4rem" /> */}
            <div style="font-size:12px">{title}</div>
          </div>
          <div class="pl-[1.2rem]" style="font-size:12px">{value}</div>
        </div>
      )
    }

    onMounted(() => {
      setTimeout(() => {
        getParkData()
      }, 2000)

    })
    const showOptions = ref<boolean>(false)

    window.addEventListener('click', () => {
      showOptions.value = false
    })

    const selectedPlot = ref<string>('')
    const options = ref<any[]>([])
    const getLabelByValue = (val) => {
      let res = '------'
      if (Array.isArray(options.value)) {
        options.value.forEach(item => {
          if (item.value === val) res = item.label
        })
      }
      return res
    }
    // ----------------------------------
    return () => (
      <div class="w-full aspect-[1.8] bg-[#0d1724]">
        <BigscreenContainer width="100%" height="auto" extraClass="aspect-[1]">
          {/* <BigscreenHeader backgroundImage={headerBg} height="100px" /> */}
          <BigscreenMain>
            <div class="bg-[#0d1724] w-full h-full relative overflow-hidden">
              <div class="absolute z-2 w-full h-full">
                <CesiumMap ref={e => cesiumIns.value = e} />
                <div class="meng-ban z-0"></div>
              </div>
              <div
                class="z-10 absolute   w-[24%] h-[calc(100%)] transition-all duration-1000 p-2 space-y-1"
                style={{
                  left: showSidePanel.value ? '1rem' : '-40rem'
                }}
              >
                <div class="left-title w-full aspect-[6]"></div>
                <div style="height: calc(100% - 6rem) ; padding-bottom: 10rem" class="w-full overflow-auto space-y-3 hidden-scrollbar" >
                  {
                    dataList.value.map(item => (
                      item.name.includes('鱼塘') ?
                        <div class="item-wrapper w-full min-h-[1rem]">
                          <div class=' w-full h-[45px] relative flex items-center'>
                            <div class="absolute left-1/2 transform -translate-x-1/2  flex justify-center items-center text-[#11F47F] py-2 text-[18px]">{item.name}</div>
                            <div class='useState w-[80px] h-[30px] ml-auto mb-auto flex justify-center items-center' >
                              {
                                Array.isArray(item.child) && item.child.length > 0 ? (
                                  <div class='flex justify-center items-center'>
                                    <div class='w-[7px] h-[7px] bg-[#11F47F] rounded-full shadow-[0px_0px_6px_0px_#11F47F]'></div>
                                    <div class='text-[14px] text-[#C0DDDE]  ml-[7px]'>使用中</div>
                                  </div>


                                ) : (
                                  <div class='flex justify-center items-center'>
                                    <div class='w-[7px] h-[7px] bg-[#C0DDDE] rounded-full shadow-[0px_0px_6px_0px_#FFFFFF]'></div>
                                    <div class='text-[14px] text-[#C0DDDE]  ml-[7px]'>空闲中</div>
                                  </div>
                                )

                              }
                            </div>
                          </div>
                          <div class="split-bar w-full h-[3px]"></div>
                          <div class="grid grid-cols-2 gap-3 p-2">
                          
                          {
                            Array.isArray(item.child) && item.child.length > 0 ? (
                              <div class="grid grid-cols-1 gap-2 col-span-2 text-[16px]">
                                {
                                  item.child.map(_ele => (
                                    <div>
                                      <div class="gap-2 grid grid-cols-2">
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>品种：</div>
                                          <div class='w-3/5' style='color:#11F47F'>{_ele.cropName}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>面积：</div>
                                          <div class='w-3/5' >{item.area + '亩'}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>物候期：</div>
                                          <div class='w-3/5' >{_ele.growth}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>规模：</div>
                                          <div class='w-3/5' >{_ele.amount}只</div>
                                        </div>

                                      </div>
                                      <div class='flex ml-4 mt-4 mb-4.5 grid grid-cols-1 gap-2'>
                                        <div class='w-2/10 ' style='color:#11EAC9'>时间：</div>
                                        <div class='w-full flex ' >{_ele.startTime.replace(/-/g, '.')} - {_ele.endTime.replace(/-/g, '.')}</div>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            ) : (
                              <div class='flex w-fll flex-col'>
                                <div class=' flex ml-5 mt-2 mb-3 w-full'>
                                  <div style='color:#11EAC9'>面积：</div>
                                  <div >{item.area + '亩'}</div>
                                </div>
                                <div class='flex justify-center items-center w-full  flex-col'>
                                  <div class="noVariety w-full " >
                                    <div class='flex justify-center  text-[#577D7E]  text-[14px] mt-15 mb-5' >地块暂无品种</div>
                                  </div>
                                </div>
                              </div>
                            )


                          }
                        </div>
                        </div> : null
                    ))
                  }
                </div>

              </div>
              <div class="center-title">
                <div class="relative h-[1.4rem] w-[18rem]">
                  <div class="h-full text-center cursor-pointer" onClick={(e) => {
                    e.stopPropagation()
                    showOptions.value = true
                  }}>{getLabelByValue(selectedPlot.value)}</div>
                  {
                    showOptions.value ? <div class="absolute left-0 top-[1.8rem] z-1000 w-full max-h-[8rem] overflow-auto">
                      {
                        Array.isArray(options.value) ? options.value.map(item => (
                          <div
                            class="py-3 text-center w-full bg-[#0d1724]"
                            onClick={() => {
                              selectedPlot.value = item.value
                              getPlotDataList(item.value)
                              getDuckHouse(item.value)
                            }}
                          >{item.label}</div>
                        )) : null
                      }
                    </div> : null
                  }
                </div>
                <select
                  class="bg=[#ffffff00] !hidden"
                  style="
                          -webkit-text-fill-color: transparent;
                          background-clip: text;
                          text-fill-color: transparent;                  
                          font-family: AlibabaPuHuiTi;
                          font-size: 14px;
                          text-align: center;
                          letter-spacing: 0px;
                          border:none;"
                  onChange={(e) => { getPlotDataList(e.target.value); getDuckHouse(e.target.value); }}
                  defaultValue={baseList.value[0]?.id}
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

              <div
                class="z-10 absolute right-[1rem]  w-[24%] h-[calc(100%)]  transition-all duration-1000 p-2 space-y-1"
                
                style={{
                  right: showSidePanel.value ? '1rem' : '-40rem'
                }}
              >
                <div class="right-title w-full aspect-[6]"></div>
                <div style="height calc(100% - 6rem) " class="w-full overflow-auto space-y-3 hidden-scrollbar" >
                 
                  {
                    duckHouseList.value.map((item) => (
                      <div class="item-wrapper w-full min-h-[1rem]">
                        <div class=' w-full h-[45px] relative flex items-center'>
                            <div class="absolute left-1/2 transform -translate-x-1/2  flex justify-center items-center text-[#11F47F] py-2 text-[18px]">{item.name}</div>
                            <div class='useState w-[80px] h-[30px] ml-auto mb-auto flex justify-center items-center' >
                              {
                                Array.isArray(item.child) && item.child.length > 0 ? (
                                  <div class='flex justify-center items-center'>
                                    <div class='w-[7px] h-[7px] bg-[#11F47F] rounded-full shadow-[0px_0px_6px_0px_#11F47F]'></div>
                                    <div class='text-[14px] text-[#C0DDDE]  ml-[7px]'>使用中</div>
                                  </div>


                                ) : (
                                  <div class='flex justify-center items-center'>
                                    <div class='w-[7px] h-[7px] bg-[#C0DDDE] rounded-full shadow-[0px_0px_6px_0px_#FFFFFF]'></div>
                                    <div class='text-[14px] text-[#C0DDDE]  ml-[7px]'>空闲中</div>
                                  </div>
                                )

                              }
                            </div>
                          </div>
                        <div class="split-bar w-full h-[3px]"></div>
                        <div class="grid grid-cols-2 gap-3 p-2">
                          {
                            Array.isArray(item.child) && item.child.length > 0 ? (
                              <div class="grid grid-cols-1 gap-2 col-span-2 text-[16px]">
                                {
                                  item.child.map(_ele => (
                                    <div>
                                      <div class="gap-2 grid grid-cols-2">
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>品种：</div>
                                          <div class='w-3/5' style='color:#11F47F'>{_ele.cropName}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>面积：</div>
                                          <div class='w-3/5' >{item.area + '亩'}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>物候期：</div>
                                          <div class='w-3/5' >{_ele.growth}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>规模：</div>
                                          <div class='w-3/5' >{_ele.amount}只</div>
                                        </div>

                                      </div>
                                      <div class='flex ml-4 mt-4 mb-4.5 grid grid-cols-1 gap-2'>
                                        <div class='w-2/10 ' style='color:#11EAC9'>时间：</div>
                                        <div class='w-full flex ' >{_ele.startTime.replace(/-/g, '.')} - {_ele.endTime.replace(/-/g, '.')}</div>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            ) : (
                              <div class='flex w-fll flex-col'>
                                <div class=' flex ml-5 mt-2 mb-3 w-full'>
                                  <div style='color:#11EAC9'>面积：</div>
                                  <div >{item.area + '亩'}</div>
                                </div>
                                <div class='flex justify-center items-center w-full  flex-col'>
                                  <div class="noVariety w-full " >
                                    <div class='flex justify-center  text-[#577D7E]  text-[14px] mt-15 mb-5' >地块暂无品种</div>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        </div>

                        
                      </div>
                    ))
                  }
                </div>
                <div class="left-title w-full aspect-[6]"></div>
                <div style="height: calc(100% - 22rem) ; padding-bottom: 10rem" class="w-full overflow-auto space-y-3 hidden-scrollbar" >
                  {
                    dataList.value.map(item => (
                      item.name.includes('稻田') ?
                        <div class="item-wrapper w-full min-h-[1rem]">
                          <div class=' w-full h-[45px] relative flex items-center'>
                            <div class="absolute left-1/2 transform -translate-x-1/2  flex justify-center items-center text-[#11F47F] py-2 text-[18px]">{item.name}</div>
                            <div class='useState w-[80px] h-[30px] ml-auto mb-auto flex justify-center items-center' >
                              {
                                Array.isArray(item.child) && item.child.length > 0 ? (
                                  <div class='flex justify-center items-center'>
                                    <div class='w-[7px] h-[7px] bg-[#11F47F] rounded-full shadow-[0px_0px_6px_0px_#11F47F]'></div>
                                    <div class='text-[14px] text-[#C0DDDE]  ml-[7px]'>使用中</div>
                                  </div>


                                ) : (
                                  <div class='flex justify-center items-center'>
                                    <div class='w-[7px] h-[7px] bg-[#C0DDDE] rounded-full shadow-[0px_0px_6px_0px_#FFFFFF]'></div>
                                    <div class='text-[14px] text-[#C0DDDE]  ml-[7px]'>空闲中</div>
                                  </div>
                                )

                              }
                            </div>
                          </div>
                          <div class="split-bar w-full h-[3px]"></div>
                          <div class="grid grid-cols-2 gap-3 p-2">
                          {
                            Array.isArray(item.child) && item.child.length > 0 ? (
                              <div class="grid grid-cols-1 gap-2 col-span-2 text-[16px]">
                                {
                                  item.child.map(_ele => (
                                    <div>
                                      <div class="gap-2 grid grid-cols-2">
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>品种：</div>
                                          <div class='w-3/5' style='color:#11F47F'>{_ele.cropName}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>面积：</div>
                                          <div class='w-3/5' >{item.area + '亩'}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>物候期：</div>
                                          <div class='w-3/5' >{_ele.growth}</div>
                                        </div>
                                        <div class='flex ml-4 mt-2'>
                                          <div class='w-2/5' style='color:#11EAC9'>规模：</div>
                                          <div class='w-3/5' >{item.area + '亩'}</div>
                                        </div>

                                      </div>
                                      <div class='flex ml-4 mt-4 mb-4.5 grid grid-cols-1 gap-2'>
                                        <div class='w-2/10 ' style='color:#11EAC9'>时间：</div>
                                        <div class='w-full flex ' >{_ele.startTime.replace(/-/g, '.')} - {_ele.endTime.replace(/-/g, '.')}</div>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            ) : (
                              <div class='flex w-fll flex-col'>
                                <div class=' flex ml-5 mt-2 mb-3 w-full'>
                                  <div style='color:#11EAC9'>面积：</div>
                                  <div >{item.area + '亩'}</div>
                                </div>
                                <div class='flex justify-center items-center w-full  flex-col'>
                                  <div class="noVariety w-full " >
                                    <div class='flex justify-center  text-[#577D7E]  text-[14px] mt-15 mb-5' >地块暂无品种</div>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                        </div>
                        </div> : null
                    ))
                  }
                </div>
              </div>
            </div>
          </BigscreenMain>
        </BigscreenContainer>

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
  background-image: url(./assets/wrapper.png);
  background-size: 100% 100%;
}

.noVariety {
  background-image: url(./assets/noVariety.png);
  background-size: 40% auto;
  background-repeat: no-repeat;
  background-position: center center;
}

.useState {
  border-radius: 0px 6px 0px 12px;
  background: linear-gradient(180deg, rgba(17, 244, 127, 0.5) 0%, rgba(17, 244, 127, 0.06) 50%)
}

.item-wrapper:hover {
  background-image: url(./assets/wrapperHover.png);
  background-size: 100% 100%;
}

.hidden-scrollbar::-webkit-scrollbar {
  width: 0;
}

.circleNoUse {
  background: #C0DDDE;

  box-shadow: 0px 0px 6px 0px #FFFFFF;
}

.split-bar {
  background-image: url(./assets/splitBar2.png);
  background-size: 95% 65%;
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
  width: 300px;
  height: 40px;
  top: 1rem;
  z-index: 999;
}
</style>
