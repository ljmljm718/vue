<script lang="tsx">
import { defineComponent } from 'vue'

interface BigscreenContainerProps {
    width?: string,
    height?: string,
    backgroundImage: any,
    extraClass?: string
}
export default defineComponent({
    name: 'BigscreenContainer',
    props: ['width', 'height', 'backgroundImage', 'extraClass'],
    setup(props:BigscreenContainerProps, { slots }) {
        const { width = '1920px', height = '1080px', backgroundImage, extraClass = '' } = props;
        return () => (
            <div
                style={`width: ${width};height: ${height};`}
                class={["bigscreen-container-wrapper", extraClass]}
            >
                {
                    backgroundImage ?  <img class="w-full h-full absolute left-0 top-0 z-0" src={backgroundImage} /> : null
                }
                <div class="relative z-10 w-full h-full flex flex-col">{ slots.default?.() }</div>
            </div>
        )
    },
})
</script>
<style scoped>
.bigscreen-container-wrapper {
    background-color: #001b42;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    color: #f0f0f0;
}
</style>