import request from '@/config/axios'

// 在线 离线
export const page = async (params) => {
  return await request.get({
    url: '/erp/product/page',
    params
  })
}
//跳过和下一步
export const carryOutUpdate = async (data) => {
  return await request.post({
    url: '/agri/farm-plan/carry-out-update',
    data
  })
}
//状态计划进行中进行校验
//跳过和下一步
export const isFarmPlan = async (params) => {
  return await request.get({
    url: '/agri/farm-plan/is-farm-plan',
    params
  })
}