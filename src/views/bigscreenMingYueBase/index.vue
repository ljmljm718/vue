<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import headerBg from './assets/headerBg.png'
// @ts-ignore
import CesiumMap from '@/views/tiandiMap/index.vue'
import { ParkInfoApi } from '@/api/agriculture/parkinfo/index'
import * as turf from '@turf/turf'

const {
  BigscreenAdapter,
  BigscreenContainer,
  BigscreenHeader,
  BigscreenMain,
} = BigscreenBuilder


export default defineComponent({
  name: 'BigscreenMingYueBase',
  setup() {
    const showSidePanel = ref<boolean>(false)
    setTimeout(() => {
      showSidePanel.value = true
    }, 100)

    const cesiumIns = ref()
    const getParkData = async () => {
      const { list } = await ParkInfoApi.getParkInfoPage({})
      if (Array.isArray(list) && list.length > 0) {
        const _arr = list.map(item => (JSON.parse(item.geofencing)))
        _arr.forEach(item => {
          if (Array.isArray(item) && item.length > 0) {
            const polyArr = item[0].map(ele => ([ele.lng, ele.lat]))
            cesiumIns.value.createPolygon(undefined, polyArr)
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
    
    onMounted(() => {
      setTimeout(() => {
        getParkData()
      }, 2000)
    })
    return () => (
      <div class="w-[100vw] h-[100vh] bg-[#0d1724]">
        <BigscreenAdapter>
          <BigscreenContainer>
            <BigscreenHeader
              backgroundImage={headerBg}
              height="100px"
            />
            <BigscreenMain>
              <div class="bg-[#0d1724] w-full h-full relative overflow-hidden">
                <div class="absolute z-2 w-full h-full">
                  { /* <CesiumMap ref={e => cesiumIns.value = e} /> */ }
                  <div class="meng-ban z-0"></div>
                </div>
                <div
                  class="z-10 absolute left-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-100"
                  style={{
                    left: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="title-1 w-full h-[4rem]"></div>
                  <div class="item-bg w-full">
                    <div class="flex"></div>
                  </div>
                  <div class="title-2 w-full h-[4rem]"></div>
                </div>
                <div
                  class="z-10 absolute right-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] transition-all duration-100"
                  style={{
                    right: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                >
                  <div class="title-3 w-full h-[4rem]"></div>
                  <div class="title-4 w-full h-[4rem]"></div>
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

@for $i from 1 through 4 {
  .title-#{$i} {
    background-image: url(./assets/title#{$i}.png);
    background-size: 100% 100%;
  }
}

.item-bg {
  background-size: 100% 100%;
  background-image: url(./assets/itemBg.png);
}
</style>
