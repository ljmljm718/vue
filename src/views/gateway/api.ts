import request from '@/config/axios'

//基础数据
export const agResources = async () => {
  return await request.get({
    url: '/shizhu/big-screen/agResources',
  })
}