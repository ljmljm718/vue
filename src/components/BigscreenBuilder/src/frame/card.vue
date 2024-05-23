<script lang="tsx">
import { defineComponent } from 'vue'
import titleBg from '../assets/title.png'
import cardBg from '../assets/cardBg.png'

export default defineComponent({
  name: 'BigscreenCard',
  setup(props, { slots }) {
    console.log(props)
    const { title } = slots
    return () => (
      <div class="flex flex-col relative">
        <img src={cardBg} class="w-full h-full absolute left-0 top-0 z-0" />
        <div class="h-[40px] relative z-20">
          <img src={titleBg} class="w-full h-full absolute left-0 top-0 z-0" />
          <div
            class="h-full absolute left-0 top-0 z-20 flex items-center"
            style="width: calc(100% - 40px);margin-left: 33px;"
          >{title?.()}</div>
        </div>
        <div class="grow relative z-10">{ slots.default?.() }</div>
      </div>
    )
  }
})
</script>