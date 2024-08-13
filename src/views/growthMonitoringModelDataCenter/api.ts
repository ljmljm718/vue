import request from "@/config/axios"

/** 生长监测模型数据中心页面 请求 */

/**
 * 查询所有基地列表
 * @returns "{data: [{id, name, img}, ...]}"
 */
export const getBase = async () => {
  return await request.get({
    url: "/agriculture/park-info/getAll"
  })
}

/**
 * 查询某个基地的品种数和模型数
 * @param params "{parkId}"
 * @returns "{data: {品种数, 模型数}}"
 */
export const getNum = async (params) => {
  return await request.get({
    url: "/agriculture/crop-base/get-model-number",
    params
  })
}

/**
 * 查询模型列表
 * @param params {parkId}
 * @returns "{data: [{modelId, modelName, varietyName, growth}, ...]}"
 */
export const getModel = async (params) => {
  return await request.get({
    url: "/agriculture/model-management/getModelByParkId",
    params
  })
}

/**
 * 查询地块监控
 * @param params {parkId}
 * @returns "[{modelId, modelName, modelImg, varietyName, varietyId, growth, growthId, cycle, startTime, endTime, parkId, plotId}, ...]"
 */
export const getPlot = async (params) => {
  return await request.get({
    url: "/agriculture/model-management/getPlotMonitorByParkId",
    params
  })
}

/**
 * 查询周期事项
 * @param params {modelId}
 * @returns "[{model, curPeriod}, {growth, cycle, child2:[{cropCode, itemName, itemContent}, ...]}, ...]"
 */
export const getCycle = async (params) => {
  return await request.get({
    url: "/agri/crop-growth-new/get-modelInfo",
    params
  })
}

/**
 * 查询指标
 * @param params {modelId, growthId}
 * @returns "{data: [{indicatorName, modelIndicatorElementCardVOList: [{elementName, value, indicatorDescription}, ...]}, ...]}"
 */
export const getIndicator = async (params) => {
  return await request.get({
    url: "/agriculture/model-monitor-indicator/getMonitorIndicatorWithDetail",
    params
  })
}

/**
 * 根据模型ID和地块ID查询地块信息
 * @param params {modelId, beLongPlot}
 * @returns "[{plotName, ...}, ...]"
 */
export const getPlotInfo = async (params) => {
  return await request.get({
    url: "/agriculture/model-management/getCropPlotByModelId",
    params
  })
}
