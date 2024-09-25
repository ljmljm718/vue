import request from '@/config/axios'
//溯源统计、溯源码
export const traceStatistics = async() => {
  return await request.get({
    url:'/agriculture/trace-template/trace-statistics'
  })
}

//扫码统计
export const recordStatistics = async( params: string) => {
  return await request.get({
    url:'/agriculture/trace-record/record-statistics',
    params:{type: params}
  })
}