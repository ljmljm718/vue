import request from '@/config/axios';

// 控制台前端
export const getConsoleFrontDeviceData = () => {
  return request.get({ url: `/agriculture/wfi-console/getConsoleFrontDeviceData` });
};

// 施肥控制
export const getFertilizerControl = () => {
  return request.get({ url: `/agriculture/wfi-console/getFertilizerControl` });
};

// 灌区控制
export const getIrrigationControl = () => {
  return request.get({ url: `/agriculture/wfi-console/getIrrigationControl` });
};

// 土壤数据
export const getSoilDeviceData = () => {
  return request.get({ url: `/agriculture/wfi-console/getSoilDeviceData` });
};

// 状态监控
export const getDeviceStatusControl = () => {
  return request.get({ url: `/agriculture/wfi-console/getDeviceStatusControl` });
};

// 获取灌溉任务设置
export const getWfiTaskIrrigationPage = (params: any) => {
  return request.get({ url: `/agriculture/wfi-task-irrigation/page`, params });
};

// 启用某个灌溉任务
export const getWfiTaskIrrigationEnable = (params: any) => {
  return request.get({ url: `/agriculture/wfi-task-irrigation/enable`, params });
};

// 停用某个灌溉任务
export const getWfiTaskIrrigationStop = (params: any) => {
  return request.get({ url: `/agriculture/wfi-task-irrigation/stop`, params });
};

// 新增灌溉任务配置
export const postWfiTaskIrrigationCreate = (data: any) => {
  return request.post({ url: `/agriculture/wfi-task-irrigation/create`, data });
};

// 获取灌溉配置-通过ID获取
export const getWfiTaskIrrigationGet = (params: any) => {
  return request.get({ url: `/agriculture/wfi-task-irrigation/get`, params });
};

// 获取历史任务-灌溉任务
export const getTaskExecLogPage = (params: any) => {
  return request.get({ url: `/agriculture/task-exec-log/page`, params });
};

// 获取灌区列表
export const getIrrigationAreaPage = (params: any) => {
  return request.get({ url: `/agriculture/irrigation-area/page`, params });
};

// 根据开始、结束时间、间隔周期、周期天数计算灌溉日
export const getWfiTaskIrrigationCalculateDays = (params: any) => {
  return request.get({ url: `/agriculture/wfi-task-irrigation/calculate/days`, params });
};

// 施肥程式-获取最新数据(不传参) & 施肥设置(传ID)
export const getTaskFertilizationLatestData = (params: any) => {
  return request.get({ url: `/agriculture/task-fertilization/latest-data`, params });
};

// 创建施肥任务以及明细情况
export const getTaskFertilizationCreateDetailList = (data: any) => {
  return request.post({ url: `/agriculture/task-fertilization/create-detail-list`, data });
};

// 更新施肥任务以及明细情况
export const getTaskFertilizationUpdateDetailList = (data: any) => {
  return request.put({ url: `/agriculture/task-fertilization/update-detail-list`, data });
};

// 更新施肥状态并记录执行任务表
export const getTaskFertilizationUpdateStatus = (data: any) => {
  return request.put({ url: `/agriculture/task-fertilization/update-status`, data });
};
