import request from '@/config/axios'
//农业资源
export const AgriResources = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getAgriResources',
  })
}
//种植分布
export const getCropInfo = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getCropInfo',
  })
}