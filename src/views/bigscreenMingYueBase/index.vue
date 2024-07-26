<script lang="tsx">
import BigscreenBuilder from '@/components/BigscreenBuilder'
import headerBg from './assets/headerBg.png'
// @ts-ignore
import CesiumMap from '@/views/tiandiMap/index.vue'

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
    }, 5000)
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
                  <CesiumMap />
                  <div class="meng-ban z-0"></div>
                </div>
                <div
                  class="z-10 absolute left-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] bg-white transition-all duration-1000"
                  style={{
                    left: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                ></div>
                <div
                  class="z-10 absolute right-[1rem] top-[1rem] w-[22%] h-[calc(100%_-_2rem)] bg-white transition-all duration-1000"
                  style={{
                    right: showSidePanel.value ? '1rem' : '-40rem'
                  }}
                ></div>
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
</style>
