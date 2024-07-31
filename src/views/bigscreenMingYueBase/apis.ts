import request from '@/config/axios'

// 左上当季种养殖-品类
export const getBreedCategory = async () => {
  return await request.get({
    url: '/agri/farm-overview/get-breedCategory'
  })
}

// 左上当季种养殖-品种
export const getBreedVariety = async (params) => {
  return await request.get({
    url: '/agri/farm-overview/get-breedVariety',
    params
  })
}

// 左二-作业排期
export const farmPlanSchedule = async (params) => {
  return await request.get({
    url: '/agri/farm-plan/farmPlanSchedule',
    params
  })
}

// 右上-天气
export const getWeather = async (params) => {
  return await request.get({
    url: '/agri/farm-overview/get-weather',
    params
  })
}

// 右二任务统计
export const getPlan = async (params) => {
  return await request.get({
    url: '/agri/farm-overview/get-plan',
    params
  })
}

// 左二-基地地块选择框
export const getParkBaseInfo = async (params) => {
  return await request.get({
    url: '/agriculture/big-screen/getParkBaseInfo',
    params
  })
}

