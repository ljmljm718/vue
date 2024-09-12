import request from '@/config/axios'

export const exam = async () => {
  return request.get({ url: '/exam'})
}