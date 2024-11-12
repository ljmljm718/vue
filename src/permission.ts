import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { isRelogin } from '@/config/axios/service'
import { getAccessToken } from '@/utils/auth'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const parseURL = (
  url: string | null | undefined
): { basePath: string; paramsObject: { [key: string]: string } } => {
  // 如果输入为 null 或 undefined，返回空字符串和空对象
  if (url == null) {
    return { basePath: '', paramsObject: {} }
  }

  // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数 
  const questionMarkIndex = url.indexOf('?')
  let basePath = url
  const paramsObject: { [key: string]: string } = {}

  // 如果找到了问号，说明有查询参数
  if (questionMarkIndex !== -1) {
    // 获取 basePath
    basePath = url.substring(0, questionMarkIndex)

    // 从 URL 中获取查询字符串部分
    const queryString = url.substring(questionMarkIndex + 1)

    // 使用 URLSearchParams 遍历参数
    const searchParams = new URLSearchParams(queryString)
    searchParams.forEach((value, key) => {
      // 封装进 paramsObject 对象
      paramsObject[key] = value
    })
  }

  // 返回 basePath 和 paramsObject
  return { basePath, paramsObject }
}

// 路由不重定向白名单
const whiteList = [
  "/tiandiMap",
  '/login',
  ...[
    '/mingyue',
    '/shuangqiao',
    '/erdu',
    '/tianyin',
    '/taiyuan'
  ].map(item => `${item}/login`),
  '/social-login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/oauthLogin/gitee',
  '/QRCode',
  '/tiandi',
  '/home',
  '/gateway',
  '/page',
  '/mobile-trace'
]

const favicon = document.querySelector('link[rel="icon"]') as any;
interface TitleIcon {
  href: string
  title: string
}
const pathTitleIcoMap = new Map<string, TitleIcon>([
  ['/page', { href: '/logo.png', title: '工业安全生产数字化产品平台' }],
  ['/inspurHome', { href: '', title: '装备智能制造产品云控中台' }],
])

// 路由加载前
router.beforeEach(async (to, from, next) => {
  localStorage.setItem("PREV_PATH", from.path)
  if (pathTitleIcoMap.has(to.path)) {
    const titleIconObj = pathTitleIcoMap.get(to.path);
    if (!titleIconObj) return;
    document.title = titleIconObj.title;
    if (favicon) favicon.href = titleIconObj.href
  } else {
    if (favicon && favicon.href !== '/favicon1.ico') favicon.href = '/favicon1.ico'
  }
  start()
  loadStart()
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 获取所有字典
      const dictStore = useDictStoreWithOut()
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()
      if (!dictStore.getIsSetDict) {
        await dictStore.setDictMap()
      }
      if (!userStore.getIsSetUser) {
        isRelogin.show = true
        await userStore.setUserInfoAction()
        isRelogin.show = false
        // 后端过滤菜单
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        // 修复跳转时不带参数的问题
        const redirect = decodeURIComponent(redirectPath as string)
        const { basePath, paramsObject: query } = parseURL(redirect)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query }
        next(nextData)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  if (pathTitleIcoMap.has(to.path)) {
    const titleIconObj = pathTitleIcoMap.get(to.path);
    if (!titleIconObj) return;
    document.title = titleIconObj.title;
  } else useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
