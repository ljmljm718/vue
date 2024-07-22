import { toRaw } from 'vue'
import { mainEventBus } from './eventBus';
export default class CacheManager {
  constructor() {
    mainEventBus.on('LOGIN', () => {
      this.clearCache()
    })
  }

  private cacheDataMap:Map<string, Array<any>> = new Map()

  private cacheFunc:Function | null = null
  public setFunc(func:Function) {
    this.cacheFunc = func;
  }

  public async getData(params:any) {
    const paramsString:string = JSON.stringify(toRaw(params)) || 'default'

    return new Promise(async (resolve, reject) => {
      if (this.cacheDataMap.get(paramsString)) {
        return resolve(this.cacheDataMap.get(paramsString))
      }
      if (!this.cacheFunc) {
        return reject(new Error('请求函数未定义，请先调用 setFunc 方法'))
      }
      const res = await this.cacheFunc(params)
      if (Array.isArray(res)) {
        this.cacheDataMap.set(paramsString, res)
        return resolve(res)
      } else {
        const { data, list } = res;
        if (data && Array.isArray(data)) {
          this.cacheDataMap.set(paramsString, data)
          return resolve(data)
        } else if (list && Array.isArray(list)) {
          this.cacheDataMap.set(paramsString, list)
          return resolve(list)
        } else {
          return reject(new Error('返回数据未发现数组，请检查请求！'))
        }
      }
    })
  }

  public clearCache() {
    this.cacheDataMap.clear()
  }
}
