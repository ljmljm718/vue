<script lang="tsx">
import { defineComponent } from 'vue'

interface BigscreenFooterProps {
    height?: string
}
export default defineComponent({
    name: 'BigscreenFooter',
    props: ["height"],
    setup(props:BigscreenFooterProps, { slots }) {
        const { height = '60px' } = props
        return () => (
            <div class="bigscreen-footer-wrapper" style={`height: ${height};`}>
                { slots.default?.() }
            </div>
        )
    },
})
</script>
<style scoped>
.bigscreen-footer-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5em;
}
</style>