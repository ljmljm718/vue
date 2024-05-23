<script lang="tsx">
import { defineComponent } from 'vue'
import ScaleBox from "vue3-scale-box";

export default defineComponent({
    name: 'BigscreenAdapter',
    setup(props, { slots }) {
        console.log(props);
        return () => (
            <ScaleBox>
                { slots.default?.() }
            </ScaleBox>
        )
    },
})

</script>
<style scoped>
#_adapter_basic_ {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: antiquewhite;
}
</style>
