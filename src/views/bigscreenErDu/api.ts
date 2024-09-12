import request from '@/config/axios'

export const exam = async () => {
  return request.get({ url: '/exam'})
}

// 二渡 大屏智慧农事 农业资源
export const getQianjiangAgriResource = () => {
  return request.get({ url: '/agriculture/big-screen/getQianjiangAgriResource' })
}

// 二渡 大屏智慧农事 品种分布
export const getBreedCategory = () => {
  return request.get({ url: '/agri/farm-overview/get-breedCategory' })
}