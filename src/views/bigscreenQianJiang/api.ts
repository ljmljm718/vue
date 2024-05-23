import request from '@/config/axios'

// 左一-产业介绍-产业统计
export const industryStatistics = async () => {
  return await request.get({
    url: '/agriculture/big-screen/industryStatistics'
  })
}