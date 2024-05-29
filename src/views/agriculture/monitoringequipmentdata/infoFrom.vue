<script lang="tsx">
import {defineComponent, ref} from 'vue'
import {
  getParkTree,
  getEquipmentPhotographAndVideo,
  monitoringEquNoticePage
} from './api'
import {useAppStore} from "@/store/modules/app";
import InfoDetail from './infoDetail.vue'

const appStore = useAppStore()

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
      const res = await getEquipmentPhotographAndVideo({baseId, plotId}).catch(() => {
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

    // 监控通知事件
    const monitorNoticeLoading = ref<boolean>(false)
    const getMonitorNoticeList = async () => {
      monitorNoticeLoading.value = true
      const {list = []} = await monitoringEquNoticePage({}).catch(() => {
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
    const layoutSelected = ref()
    const currentLayout = ref<string>('grid-cols-3')
    const changeLayout = (item) => {
      currentLayout.value = item
    }
    // 基地导览页面部分
    const baseTabPage = () => {
      return (
        <>
          <div class="flex flex-row-reverse">
            <el-select v-model={layoutSelected.value} placeholder="Select" style="width: 240px" onChange={changeLayout}>
              <el-option key="grid-cols-2" label="2" value="grid-cols-2" />
              <el-option key="grid-cols-3" label="3" value="grid-cols-3" />
              <el-option key="grid-cols-4" label="4" value="grid-cols-4" />
            </el-select>
          </div>
          <div class="w-full h-full box-border">
            <div class=" w-full h-full p-3 flex space-x-3 box-border">
              <div class="inner-border w-[10rem] p-3">
                <el-menu
                  active-text-color={appStore.getIsDark ? "#ffd04b" : '#000'}
                  background-color={appStore.getIsDark ? "#1b2a58" : '#fff'}
                  class="el-menu-vertical-demo"
                  default-active={activeBasePark.value}
                  text-color={appStore.getIsDark ? "#fff" : '#000'}
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
              <div class="inner-border grow p-3">
                <InfoDetail />
              </div>
            </div>
          </div>
        </>
      )
    }

    // 智慧种植部分
    return () => (
      baseTabPage()
    )
  },
})

</script>
<style scoped>
.inner-border {
  border: 1px solid #449ce9;
}
</style>
