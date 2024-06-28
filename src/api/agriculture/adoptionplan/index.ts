import request from '@/config/axios'
import {list} from "postcss";

// 认养计划 VO
export interface AdoptionPlanVO {
  id: string // 主键id
  serialNumber: string // 流水号
  planName: string // 计划名称
  planYear: string // 计划年度
  adoptionKind: string // 认养品种
  presaleStart: Date // 预售开始时间
  presaleEnd: Date // 预售结束时间
  receivingStart: Date // 预计收货开始时间
  receivingEnd: Date // 预计收货结束时间
  planDescribe: string // 计划描述
  startTime: Date // 计划开始时间
  endTime: Date // 计划结束时间
}
// 计划蟹塘中间表数据
export interface PlanParkPlot {
  planId: string // 计划id
  parkId: string // 基地id
  plotId: string // 地块id（蟹塘）
}

// 认养计划 API
export const AdoptionPlanApi = {
  // 查询认养计划分页
  getAdoptionPlanPage: async (params: any) => {
    return await request.get({ url: `/agriculture/adoption-plan/page`, params })
  },

  // 查询认养计划详情
  getAdoptionPlan: async (id: number) => {
    return await request.get({ url: `/agriculture/adoption-plan/get?id=` + id })
  },

  // 新增认养计划
  createAdoptionPlan: async (data: AdoptionPlanVO) => {
    return await request.post({ url: `/agriculture/adoption-plan/create`, data })
  },

  // 修改认养计划
  updateAdoptionPlan: async (data: AdoptionPlanVO) => {
    return await request.put({ url: `/agriculture/adoption-plan/update`, data })
  },

  // 删除认养计划
  deleteAdoptionPlan: async (id: number) => {
    return await request.delete({ url: `/agriculture/adoption-plan/delete?id=` + id })
  },

  // 导出认养计划 Excel
  exportAdoptionPlan: async (params) => {
    return await request.download({ url: `/agriculture/adoption-plan/export-excel`, params })
  },

  // 获取初始流水号
  getInitNumber: async () => {
    return await request.get({ url: `/agriculture/adoption-plan/getInitNumber` })
  },
  // ==================== 子表（认养计划附件） ====================

  // 获得认养计划附件列表
  getAdoptionPlanProfileListBySerialNumber: async (serialNumber) => {
    return await request.get({ url: `/agriculture/adoption-plan/adoption-plan-profile/list-by-serial-number?serialNumber=` + serialNumber })
  },

  // 更新计划蟹塘中间表
  updatePlanParkPlot: async (data:any, planId: string) => {
    return await request.post({ url: `/agriculture/adoption-plan/updatePlanParkPlot?planId=` + planId, data })
  },

  // 查询认养计划蟹塘中间表数据
  getPlanParkPlot: async (planId: string) => {
    return await request.get({ url: `/agriculture/adoption-plan/getPlanParkPlot?planId=` + planId })
  },
}
