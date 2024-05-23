<script lang="tsx">
import { defineComponent, ref } from 'vue'
import BigscreenBuilder from '@/components/BigscreenBuilder'
import BigScreenTime from '@/utils/bigscreenTool/currentTime.vue'
import { formatTime } from '@/utils'
import headerBg from './assets/headerBg.png'
import mainBg from './assets/bg.png'

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


export default defineComponent({
    name: 'BigscreenQianJiang',
    setup() {
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
                  )
              }}
            ></BigscreenHeader>
            <BigscreenMain
              v-slots={{
                default: () => (
                  <div>BigscreenMain</div>
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