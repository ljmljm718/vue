<script lang="tsx">
import { defineComponent } from 'vue'

interface BigscreenHeaderProps {
    height?: string,
    backgroundImage: any
}
export default defineComponent({
    name: 'BigscreenHeader',
    props: ['height', 'backgroundImage'],
    setup(props:BigscreenHeaderProps, { slots }) {
        const { height = '90px', backgroundImage } = props
        console.log("backgroundImage", backgroundImage);
        const { left, right } = slots
        return () => (
            <div
                class="bigscreen-header-wrapper"
                style={{ height }}
            >
                {
                    backgroundImage ?  <img class="bigscreen-header-bg w-full h-full absolute left-0 top-0 z-0" src={backgroundImage} /> : null
                }
                <div class="relative z-10 w-25%">{left?.()}</div>
                <div class="relative z-20 w-50% text-center" style={`font-size: 2.5em;`}>{ slots.default?.() }</div>
                <div class="relative z-10 w-25% flex flex-row-reverse">{right?.()}</div>
            </div>
        )
    },
})
</script>
<style scoped>
.bigscreen-header-wrapper {
    background-color: #001b42;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5em;
    background-size: 100% 100%;
    position: relative;
    z-index: 999;
}
</style>