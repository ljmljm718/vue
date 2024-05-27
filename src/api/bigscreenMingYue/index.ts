import request from '@/config/axios'

export const getParkTree = async () => {
  return await request.get({
    url: '/agriculture/big-screen/getParkTree',
  })
}

export const EquipmentPhotographAndVideo = async (params) => {
  return await request.get({
    url: '/agriculture/device-info/getEquipmentPhotographAndVideo',
    params
  })
}
export const getPage = async (params) => {
  return await request.get({
    url: '/agriculture/monitoring-equipment-notice/page',
    params
  })
}
