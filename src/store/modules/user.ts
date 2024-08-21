import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, getTenantId, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { getInfo, loginOut } from '@/api/login'
// import { getRouteByTenant } from '@/api/system/user'
import {resolvePath} from "@/config/contants/bigScreenPathResolver";

const { wsCache } = useCache()

interface UserVO {
  id: number
  avatar: string
  nickname: string
  deptId: number
}

interface UserInfoVO {
  // USER 缓存
  permissions: string[]
  roles: string[]
  isSetUser: boolean
  user: UserVO
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserInfoVO => ({
    permissions: [],
    roles: [],
    isSetUser: false,
    user: {
      id: 0,
      avatar: '',
      nickname: '',
      deptId: 0
    }
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): string[] {
      return this.roles
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUser(): UserVO {
      return this.user
    }
  },
  actions: {
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      }
      let userInfo = wsCache.get(CACHE_KEY.USER)
      if (!userInfo) userInfo = await getInfo()
      this.permissions = userInfo.permissions
      this.roles = userInfo.roles
      this.user = userInfo.user
      this.isSetUser = true
      wsCache.set(CACHE_KEY.USER, userInfo)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, userInfo.menus)

      // const getBigscreenPathByRole = async ():Promise<string> => {
      //   return new Promise(async (resolve, reject) => {
      //     const tenantName = localStorage.getItem("TENANT_NAME");
      //     // const tenantId = getTenantId()
      //     // const data = await getRouteByTenant({ id: tenantId }).catch(() => {})
      //     // const remoteBigscreenUrl = data?.bigScreen ?? ''
      //     const tenantNamePathMap = new Map([
      //       ['鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen5'],
      //       ['酉阳鲁渝协作示范村数字化赋能', '/bigscreen6'],
      //       ['石柱县王场镇鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen3'],
      //       ['巫山县福田镇鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen2'],
      //       ['开州区鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen'],
      //       ['浪潮', '/bigscreen']
      //     ])
      //     let resPath = tenantName ? tenantNamePathMap.get(tenantName) ?? '' : ''
      //     const localPathMap = new Map<string, string>([
      //       ['wulong', '/bigscreen5'],
      //       ['youyang', '/bigscreen6'],
      //       ['aikou', '/bigscreen9'],
      //       ['wenfeng', '/bigscreenWF'],
      //       ['baibu', '/bigscreenBB'],
      //       ['baidi', '/bigscreen10'],
      //       ['fuling_dashun_mingyue', '/bigscreenMY'],
      //       ['qianjiang', '/bigscreenQJ'],
      //       ['tianyin', '/bigscreenTB'],
      //       ['tianyin_common', '/bigscreenTB'],
      //       ['shuangqiao', '/bigscreenShuangQiao'],
      //     ])
      //
      //     if (Array.isArray(userInfo.roles)) userInfo.roles.forEach(item => {
      //       if (localPathMap.has(item)) resPath = localPathMap.get(item) ?? ''
      //     })
      //     if (!resPath) resPath = '/bigscreen'
      //     return resolve(resPath)
      //   })
      // }
      // wsCache.set(CACHE_KEY.BIGSCREEN_PATH, await getBigscreenPathByRole());
      wsCache.set(CACHE_KEY.BIGSCREEN_PATH, resolvePath(userInfo));
    },
    async setUserAvatarAction(avatar: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.avatar = avatar
      userInfo.user.avatar = avatar
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async setUserNicknameAction(nickname: string) {
      const userInfo = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.user.nickname = nickname
      userInfo.user.nickname = nickname
      wsCache.set(CACHE_KEY.USER, userInfo)
    },
    async loginOut() {
      await loginOut()
      removeToken()
      deleteUserCache() // 删除用户缓存
      this.resetState()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.isSetUser = false
      this.user = {
        id: 0,
        avatar: '',
        nickname: '',
        deptId: 0
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
