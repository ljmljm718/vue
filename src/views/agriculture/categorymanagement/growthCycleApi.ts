import request from '@/config/axios'

export const getGrowthCycleListApi = async (params) =>{
  return await request.get({
    url:'/agri/crop-growth-new/list-by-cropId',
    params
  })
}
export const getEventListApi = async (params) =>{
  return await request.get({
    url:'/agriculture/crop-growth-sub/page',
    params
  })
}
  // 删除作物生长周期
export const deleteCropGrowthNewApi = async (id: number) => {
    return await request.delete({ url: `/agri/crop-growth-new/delete?id=` + id })
}
//删除事项
export const deleteEventApi = async (id: number) => {
  return await request.delete({ url: `/agriculture/crop-growth-sub/delete?id=` + id })
}