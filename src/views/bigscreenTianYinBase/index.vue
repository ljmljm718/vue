<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import headerBg from './assets/headerBg.png'
import CesiumMap from '@/views/tiandiMap/index.vue'
import {
  getParkList,
  getLeftListInfo
} from './api'

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
    const selectorBases = ref<string>('枳壳树种植基地')
    const selectedBase = ref<any>('')
    const parkDataList = ref<any[]>([])
    const getParkData = async () => {
      const res = await getParkList()
      if (Array.isArray(res)) {
        parkDataList.value = res
        console.log('res', res);

        selectedBase.value = res.length > 0 ? res[0].name : ''
        console.log('sssssssssss', selectedBase.value)
        if (res.length > 0) {
          getMainDataList(res[0].id)

        }
      }
    }
    getParkData()

    // 获取除标题外的外层数据
    const getMainDataList = async (parkId) => {
      const res = await getLeftListInfo({ parkId })
      if (Array.isArray(res)) {
        const _res = res.map(item => ({
          ...item, children: [
            // {
            //   title: '地块编号',
            //   value: item.code
            // },
            {
              title: '地块面积',
              value: item.area + ' 亩'
            },
          ],
        }))
        const num = _res.length / 2
        leftDataList.value = _res.slice(0, num)
        rightDataList.value = _res.slice(num)
      }
    }

    const leftDataList = ref<any[]>([])
    const rightDataList = ref<any[]>([])

    return () => (
      <div class="w-[100%] bg-[#0d1724]">
        <BigscreenContainer width="100%" extraClass="aspect-[2]">
          <BigscreenMain>
            <div class="bg-[#0d1724] w-full h-full relative overflow-hidden">
              <div class="absolute z-2 w-full h-full">
                <CesiumMap />
                <div class="meng-ban z-0"></div>
              </div>
              <div
                class="z-10 absolute   w-[24%] h-[calc(100%)] transition-all duration-1000 p-2 space-y-1"
                style={{
                  left: showSidePanel.value ? '1rem' : '-40rem'
                }}
              >
                <div class="left-title w-full aspect-[6.8]"></div>
                <div style="height: calc(100% - 6rem) ; padding-bottom: 10rem" class="w-full overflow-auto space-y-3 hidden-scrollbar" >
                  {
                    leftDataList.value.map(item => (
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
                        <div class="line-bar w-full h-[3px]"></div>
                        <div class="grid  gap-3 p-2">

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
                                          <div class='w-3/5' >{_ele.amount} {_ele.unit}</div>
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
              </div>
              {/* 右侧 */}
              <div
                class="z-10 absolute  right-[1rem] w-[24%] h-[calc(100%)] transition-all duration-1000 p-2 space-y-1"
                style={{
                  right: showSidePanel.value ? '1rem' : '-40rem'
                }}
              >
                <div class="right-title w-full aspect-[6.8]"></div>
                <div style="height: calc(100% - 6rem) ; padding-bottom: 10rem" class="w-full overflow-auto space-y-3 hidden-scrollbar" >
                  {
                    rightDataList.value.map(item => (
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
                        <div class="line-bar w-full h-[3px]"></div>
                        <div class="grid  gap-3 p-2">
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
              </div>
            </div>
            <div class="absolute z-10 w-[326px] h-[60px] top-8 center-title flex justify-center items-center text-[2rem]" style="left: calc(50% - 163px);">
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
              >
                {
                  <option >
                    {selectedBase.value}
                  </option>
                }
              </select>
            </div>
          </BigscreenMain >
        </BigscreenContainer >
      </div >
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

.center-title {
  background-image: url(./assets/centerTitle.png);
  background-size: 100% 100%;
}

.useState {
  border-radius: 0px 6px 0px 12px;
  background: linear-gradient(180deg, rgba(17, 244, 127, 0.5) 0%, rgba(17, 244, 127, 0.06) 50%)
}

.noVariety {
  background-image: url(./assets/noVariety.png);
  background-size: 40% auto;
  background-repeat: no-repeat;
  background-position: center center;
}
.item-wrapper:hover {
  background-image: url(./assets/itemWrapperHover.png);
  background-size: 100% 100%;
}
</style>
