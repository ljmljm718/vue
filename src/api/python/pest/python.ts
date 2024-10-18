import request from '@/config/axios'

// python模型服务API
export const PythonServiceApi = {
  // 请求识别害虫类别
  predict: async (params: any) => {
    return await request.get({ url: `/python-api/predict`, params })
  },

}
