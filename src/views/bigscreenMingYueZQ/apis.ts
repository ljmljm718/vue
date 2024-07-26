import request from '@/config/axios'


//地块列表
export const getParkListApi = async (params) =>{
  return await request.get({
    url:'/agri/land-display/park-list',
    params
  })
}
//获取基地信息
export const getBaseInfoApi = async () =>{
  return await request.get({
    url:'/agriculture/big-screen/baidiParkInfo',
    
  })
}

export const getDuckHouseApi = async (params)=>{
  return await request.get({
    url:'/agri/land-display/duck-list',
    params
  })

}