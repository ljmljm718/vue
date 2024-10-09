// bigScreenPathResolver.ts
import {UserInfo} from "@/layout/components/UserInfo";

export const resolvePath = (userInfo: UserInfo): string => {
  const tenantName = localStorage.getItem("TENANT_NAME");

  const tenantNamePathMap = new Map<string, string>([
    ['鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen5'],
    ['酉阳鲁渝协作示范村数字化赋能', '/bigscreen6'],
    ['石柱县王场镇鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen3'],
    ['巫山县福田镇鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen2'],
    ['开州区鲁渝协作乡村振兴示范村数字化赋能', '/bigscreen'],
    ['浪潮', '/bigscreen'],
    ['太原乡村振兴数字化赋能 ', '/bigscreenTY']
  ]);

  let resPath = tenantName ? tenantNamePathMap.get(tenantName) ?? '' : '';

  const localPathMap = new Map<string, string>([
    ['wulong', '/bigscreen5'],
    ['youyang', '/bigscreen6'],
    ['aikou', '/bigscreen9'],
    ['wenfeng', '/bigscreenWF'],
    ['baibu', '/bigscreenBB'],
    ['baidi', '/bigscreen10'],
    ['fuling_dashun_mingyue', '/bigscreenMY'],
    ['qianjiang', '/bigscreenQJ'],
    ['tianyin', '/bigscreenTB'],
    ['tianyin_common', '/bigscreenTB'],
    ['shuangqiao', '/bigscreenShuangQiao'],
    ['erdu', '/bigscreenED'],
    ['taiyuan', '/bigscreenTY']
  ]);

  if (Array.isArray(userInfo.roles)) {
    userInfo.roles.forEach(item => {
      if (localPathMap.has(item)) {
        resPath = localPathMap.get(item) ?? '';
      }
    });
  }

  if (!resPath) resPath = '/bigscreen';

  return resPath;
};
