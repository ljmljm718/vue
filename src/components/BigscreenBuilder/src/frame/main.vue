<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'BigscreenMain',
    setup(props, { slots }) {
        console.log('props', props);
        return () => (
            <div class="bigscreen-main-wrapper">
                { slots.default?.() }
            </div>
        )
    },
})
</script>
<style scoped>
.bigscreen-main-wrapper {
    flex-grow: 1;
    box-sizing: content-box;
}
</style>