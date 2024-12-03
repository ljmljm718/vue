import request from '@/config/axios';

// 灌溉任务 VO
export interface WfiTaskIrrigationVO {
  id: string; // 主键id
  tiName: string; // 任务名称
  irrigationType: string; // 灌溉类型
  tiBeginTime: Date; // 开始时间
  tiEndTime: Date; // 结束时间
  tiExecCron: string; // 灌溉周期
  tiExecBeginTime: string; // 任务执行时间
  waterPumpStatus: string; // 水泵控制
  concurrentTaskNumber: number; // 并发任务执行数量
  amountTimeNumber: number; // 施肥时长/量（分钟/L）
  iaCodeList: string; // 任务执行灌区
  status: string; // 状态，停用、启用、未启用
  tiTaskInfo: string; // 灌溉日
}

// 灌溉任务 API
export const WfiTaskIrrigationApi = {
  // 查询灌溉任务分页
  getWfiTaskIrrigationPage: async (params: any) => {
    return await request.get({ url: `/agriculture/wfi-task-irrigation/page`, params });
  },

  // 查询灌溉任务详情
  getWfiTaskIrrigation: async (id: number) => {
    return await request.get({ url: `/agriculture/wfi-task-irrigation/get?id=` + id });
  },

  // 新增灌溉任务
  createWfiTaskIrrigation: async (data: WfiTaskIrrigationVO) => {
    return await request.post({ url: `/agriculture/wfi-task-irrigation/create`, data });
  },

  // 修改灌溉任务
  updateWfiTaskIrrigation: async (data: WfiTaskIrrigationVO) => {
    return await request.put({ url: `/agriculture/wfi-task-irrigation/update`, data });
  },

  // 删除灌溉任务
  deleteWfiTaskIrrigation: async (id: number) => {
    return await request.delete({ url: `/agriculture/wfi-task-irrigation/delete?id=` + id });
  },

  // 导出灌溉任务 Excel
  exportWfiTaskIrrigation: async (params) => {
    return await request.download({ url: `/agriculture/wfi-task-irrigation/export-excel`, params });
  }
};
