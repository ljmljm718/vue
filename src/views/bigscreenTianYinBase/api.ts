import request from '@/config/axios'

//获取基地列表
export const getParkList = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiParkInfo'
  })
}

//获取地块列表
export const getLeftListInfo = async (params) => {
  return await request.get({
    url: '/agri/land-display/park-list',
    params
  })
}
//获取地块id

// export const baidiParkDetailList = async (params) => {
//   return await request.get({
//     url: '/agri/land-display/park-detail-list',
//     params
//   })
// }

// 基地地块选择框
export const getParkBaseInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getParkBaseInfo',
    params
  })
}