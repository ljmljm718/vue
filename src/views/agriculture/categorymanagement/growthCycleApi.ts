import request from '@/config/axios'

// 获取品类的列表
export const getGrowthCycleListApi = async (params) =>{
  return await request.get({
    url:'/agri/crop-growth-new/list-by-cropId',
    params
  })
}
// 获取品种的列表
export const getVarietyGrowthList = async (params) =>{
  return await request.get({
    url:'/agri/crop-growth-new/list-by-cropCode',
    params
  })
}
//获取事件列表
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
//删除事项1
export const deleteEventApi = async (id: number) => {
  return await request.delete({ url: `/agriculture/crop-growth-sub/delete?id=` + id })
}
//导出文件
export const CropGrowthNew = async (params) => {
  return await request.download({ url: `/agri/crop-growth-new/export-excel`, params })
}