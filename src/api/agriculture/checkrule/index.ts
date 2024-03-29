import request from '@/config/axios'

// 巡检规则 VO
export interface CheckRuleVO {
  id: number // 规则编号
  name: string // 规则名称
  status: number // 规则状态
  handlerName: string // 处理器的名字
  handlerParam: string // 处理器的参数
  cronExpression: string // CRON 表达式
  retryCount: number // 重试次数
  retryInterval: number // 重试间隔
  monitorTimeout: number // 监控超时时间
  remark: string // 备注
  deptId: number // 部门id
  userId: number // 用户id
}

// 巡检规则 API
export const CheckRuleApi = {
  // 查询巡检规则分页
  getCheckRulePage: async (params: any) => {
    return await request.get({ url: `/agriculture/check-rule/page`, params })
  },

  // 查询巡检规则详情
  getCheckRule: async (id: number) => {
    return await request.get({ url: `/agriculture/check-rule/get?id=` + id })
  },

  // 新增巡检规则
  createCheckRule: async (data: CheckRuleVO) => {
    return await request.post({ url: `/agriculture/check-rule/create`, data })
  },

  // 修改巡检规则
  updateCheckRule: async (data: CheckRuleVO) => {
    return await request.put({ url: `/agriculture/check-rule/update`, data })
  },

  // 巡检规则绑定设备信息
  checkRuleBindDeviceInfo: async (data: CheckRuleVO) => {
    return await request.put({url: `/agriculture/check-rule/bind`, data})
  },

  // 删除巡检规则
  deleteCheckRule: async (id: number) => {
    return await request.delete({ url: `/agriculture/check-rule/delete?id=` + id })
  },

  // 导出巡检规则 Excel
  exportCheckRule: async (params) => {
    return await request.download({ url: `/agriculture/check-rule/export-excel`, params })
  },

  updateCheckRuleStatus: async (id: number, status: number) => {
    const params = {
      id,
      status
    }
    return request.put({url: '/agriculture/check-rule/update-status', params})
  },

  // 定时任务立即执行一次
  runJob: async (id: number) => {
    return request.put({url: '/agriculture/check-rule/trigger?id=' + id})
  }
}
