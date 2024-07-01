import request from '@/config/axios'

//基础数据
export const distinct = async (params) => {
  return await request.get({
    url: 'agri/user-table/select-distinct',
    params
  })
}