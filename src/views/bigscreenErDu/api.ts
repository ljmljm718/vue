import request from '@/config/axios'

export const exam = async () => {
  return request.get({ url: '/exam'})
}
export const cropBase = async ( params) => {
  return request.get({ 
    url: '/agriculture/crop-base/page',
    params
  })
}
export const warnRecordInfo = async() =>{
  return request.get({
    url:'/agriculture/warning-record-big-screen/qianjiangWarnRecordInfo'
  })
}
