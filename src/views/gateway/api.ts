import request from '@/config/axios'

//基础数据
export const distinct = async (params) => {
  return await request.get({
    url: '/agri/user-table/select-distinct',
    params
  })
}
//基础数据
export const page = async (params) => {
  return await request.get({
    url: '/agri/user-table/page',
    params
  })
}
//地图弹出框
export const selectMap = async (params) => {
  return await request.get({
    url: '/agri/user-table/select-Map',
    params
  })
}