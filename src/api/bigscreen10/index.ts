import request from '@/config/axios'
//产品介绍
export const Statistics = async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiQuantityStatistics',
  })
}
//左上第二部分
export const  baidiParkInfo= async () => {
  return await request.get({
    url: '/agriculture/big-screen/baidiParkInfo',
  })
}
//左上第三部分
export const  page= async (params) => {
  return await request.get({
    url: '/agriculture/crop-base/page?',
    params
  })
}
//预警信息
export const  warningRecordInfo= async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/warningRecordInfo',
  })
}
//中下右文旅销售额
export const  SmartTour= async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenSmartTour',
  })
}
//中下右旅客流量
export const  People= async () => {
  return await request.get({
    url: '/agriculture/warning-record-big-screen/bigScreenSmartTourPeople',
  })
}