<script lang="tsx">
import {computed, defineComponent} from 'vue'
import {Message} from '@/layout/components//Message'
import {Collapse} from '@/layout/components/Collapse'
import {UserInfo} from '@/layout/components/UserInfo'
import {Screenfull} from '@/layout/components/Screenfull'
import {Breadcrumb} from '@/layout/components/Breadcrumb'
import {SizeDropdown} from '@/layout/components/SizeDropdown'
import {LocaleDropdown} from '@/layout/components/LocaleDropdown'
import RouterSearch from '@/components/RouterSearch/index.vue'
import {useAppStore} from '@/store/modules/app'
import {useDesign} from '@/hooks/web/useDesign'
import {getTenantId} from '@/utils/auth'
import {getRouteByTenant} from '@/api/system/user'
import {CACHE_KEY, useCache} from '@/hooks/web/useCache'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 搜索图片
const search = computed(() => appStore.search)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

// 消息图标
const message = computed(() => appStore.getMessage)

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    const tenantId = getTenantId()
    const bigscreenRoute = ref('/bigscreen')
    const { wsCache } = useCache()
    const roles = wsCache.get(CACHE_KEY.USER).roles
    const MatchRouteMap = async () => {
      const data = await getRouteByTenant({ id: tenantId })
      bigscreenRoute.value = data.bigScreen
      if (roles.indexOf('wulong') !== -1) bigscreenRoute.value = '/bigscreen5'
      if (roles.indexOf('youyang') !== -1) bigscreenRoute.value = '/bigscreen6'
      if (roles.indexOf('aikou') !== -1) bigscreenRoute.value = '/bigscreen9'
      if (roles.indexOf('wenfeng') !== -1) bigscreenRoute.value = '/bigscreenWF'
      if (roles.indexOf('baibu') !== -1) bigscreenRoute.value = '/bigscreenBB'
      if (roles.indexOf('baidi') !== -1) bigscreenRoute.value = '/bigscreen10'
    }
    setTimeout(() => {
      MatchRouteMap()
    },2000)
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="lt-md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          <div
            class="custom-hover"
            color="var(--top-header-text-color)"
          >
            <div
              href={bigscreenRoute.value}
            >
              <el-icon><Monitor/></el-icon>
            </div>
          </div>
          <div class="custom-hover"
               color="var(--top-header-text-color)"
               onClick={() => {
                 appStore.setAiAssistant(!appStore.getAiAssistant)
               }}>
            <el-icon><Orange/></el-icon>
          </div>
          {screenfull.value ? (
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {search.value ? <RouterSearch isModal={false}/> : undefined}
          {size.value ? (
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined}
          {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined}
          {message.value ? (
            <Message class="custom-hover" color="var(--top-header-text-color)"></Message>
          ) : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}

a {
  color:black;
  font-size: 25px;
  margin-top: 8px;
}
.bigscreen-frame {
  width: 20px;
  height: 20px;
  transform: scale(1.5);
  margin: 0 6px 0 6px;
  position: relative;
  z-index: 999;
}
</style>
