import request from '@/config/axios'

//农业资源
export const agResources = async () => {
  return await request.get({
    url: '/shizhu/big-screen/agResources',
  })
}
//种植园区
export const planParks = async () => {
  return await request.get({
    url: '/shizhu/big-screen/planParks',
  })
}
//产品介绍
export const page = async () => {
  return await request.get({
    url: '/kaizhou/crop-base/page',
  })
}