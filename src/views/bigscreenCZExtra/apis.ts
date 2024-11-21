import request from '@/config/axios';

// 左一-农产品流通
export const productCirculation = () => {
  return request.get({ url: '/digital/village-product-circulation/product-circulation' });
};

// 左二-农产品销售流向top5
export const productCirculationTop = () => {
  return request.get({ url: '/digital/village-product-circulation/product-circulation-top' });
};

// 左三-农产品销售详情
export const productSaleDetail = () => {
  return request.get({ url: '/digital/village-product-circulation/product-sale-detail' });
};

// 中间—产品销售数量
export const proviceList = () => {
  return request.get({ url: '/digital/village-product-circulation/province-list' });
};

// 右一—销售数据
export const saleList = () => {
  return request.get({ url: '/digital/village-product-circulation/sale-list' });
};

// 右二-农产品销售趋势分析
export const proviceSaleTrend = () => {
  return request.get({ url: '/digital/village-product-circulation/product-sale-trend' });
};

// 右三-价格趋势分析
export const avgPriceByYear = () => {
  return request.get({ url: '/digital/village-product-circulation/avg-price-by-year' });
};
