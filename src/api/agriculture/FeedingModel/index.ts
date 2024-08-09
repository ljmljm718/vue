import request from '@/config/axios'
// 周期数量下拉框
export const feedingList = async () => {
  return await request.get({
    url: '/agriculture/feeding-rule/list',
  })
}
//周期数量初始状态
export const infoByBasePlot = async (params) => {
  return await request.get({
    url: '/agriculture/feeding-rule/get-fishpond-cultivate-info-by-base-plot',
    params
  })
}
//投喂策略
export const PeriodStrategy = async (params) => {
  return await request.get({
    url: '/agriculture/feeding-strategy/get-period-strategy',
    params
  })
}
//第一行饲料投喂模型
export const  periodStrategyAll=async ()=>{
  return await request.get({
    url:'/agriculture/feeding-strategy/get-period-strategy-all'
})
}
//喂养量影响因子
export const factorPage = async () => {
  return await request.get({
    url: '/agri/influence-factor/page',
  })
}
//喂养量趋势图
export const FeedInfoChart = async (params) => {
  return await request.get({
    url: '/agriculture/feed-info/getFeedInfoChart',
    params
  })
}
//喂养日志
export const FeedInfoPage = async (params) => {
  return await request.get({
    url: '/agriculture/feed-info/getFeedInfoPage',
    params
  })
}
//气象站水质检测
export const realData = async () => {
  return await request.get({
    url: '/yyang/equipment-data/feed/factor/real/data',
    
  })
}
//获取基地 
export const  BaseList= async () => {
  return await request.get({
    url: '/agriculture/park-info/page',
    
  })
}
//获取地块
export const  plotList= async (params) => {
  return await request.get({
    url: '/agriculture/park-detail/page',
    params
  })
}
//投喂量
export const  byGrowthPeriod= async (params) => {
  return await request.get({
    url: '/agriculture/feeding-rule/get-daily-feeding-rate-by-growth-period',
    params
  })
}
//获取不同的养殖规格和投喂建议
export const  feedingGet= async (params) => {
  return await request.get({
    url: '/agriculture/feeding-rule/get',
    params
  })
}