import { CACHE_KEY, useCache } from '@/hooks/web/useCache';
const { wsCache } = useCache();
import { updateFile } from '@/api/infra/file';
import Recorder from 'js-audio-recorder';
import request from '@/config/axios';

/*
  获取菜单列表 
*/

// 获取菜单列表树
const getMenuList = () => {
  const menuList = wsCache.get(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[];
  if (Array.isArray(menuList)) {
    console.log('列表树: ', menuList);
    return menuList;
  } else {
    console.log('Menu list is not Array. Result is: ', menuList);
    return [];
  }
};

// 深度遍历 从树中获取路由列表
let bottomLayerRoutes: any[] = [];
let ancestorRoutes: string[] = [];

const dfs = (index: number, list: any[]) => {
  const item = list[index];
  ancestorRoutes.push(item.path);
  if (item.children === null) {
    bottomLayerRoutes.push({
      name: item.name,
      route: ancestorRoutes.join('/')
    });
    ancestorRoutes.splice(ancestorRoutes.length - 1, 1);
  } else {
    const tmpList = item.children;
    for (let i = 0; i < tmpList.length; ++i) {
      dfs(i, tmpList);
    }
    ancestorRoutes.splice(ancestorRoutes.length - 1, 1);
  }
};

const getBottomLayerRoute = (tree: any[]) => {
  for (let i = 0; i < tree.length; ++i) {
    if (tree[i].visible) {
      dfs(i, tree);
    }
  }
  console.log('处理结果: ', bottomLayerRoutes);
};

/*
  用户语音输入转文本
*/

// 开始录音
let recorder: any = null;
let recordTime: any = null;
export const record_start = (
  callback: Function = (params: any) => {
    console.log('nextData: ', params);
  }
) => {
  if (recorder) return ElMessage.warning('正在录音中');
  recorder = new Recorder({
    sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1, // 声道，支持 1 或 2， 默认是1
    compiling: true
  });

  recorder
    .start()
    .then(() => {
      console.log('开始录音');
      recordTime = setInterval(() => {
        const nextData = recorder.getNextData();
        callback(nextData);
      }, 2000);
    })
    .catch((e) => {
      console.error(e);
      ElMessage.warning('录音失败');
    });
};

// 结束录音
export const record_upload = async () => {
  if (!recorder) return;
  if (recordTime) {
    clearTimeout(recordTime);
    recordTime = null;
  }
  const fileForm = new FormData();
  const blob = recorder.getWAVBlob();
  const fileName = `record_${new Date().getTime()}.wav`;
  fileForm.append('file', new File([blob], fileName));
  fileForm.append('path', fileName);
  recorder.destroy().then(() => {
    recorder = null;
  });
  const { data } = await updateFile(fileForm).catch(() => {
    ElMessage.warning('录音上传失败');
  }); // 上传文件
  return data;
};

// 语音识别
export const asr = async (params: any) => {
  return await request.get({ url: `/agriculture/asr/asr`, params });
};

/*
  文字匹配菜单
*/

// 计算两个字符串之间的编辑距离
function levenshteinDistance(s1: string, s2: string): number {
  const lenS1 = s1.length;
  const lenS2 = s2.length;

  // 创建一个二维数组来保存中间结果
  const dp: number[][] = Array.from({ length: lenS1 + 1 }, () => Array(lenS2 + 1).fill(0));

  // 初始化第一行和第一列
  for (let i = 0; i <= lenS1; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= lenS2; j++) {
    dp[0][j] = j;
  }

  // 填充二维数组
  for (let i = 1; i <= lenS1; i++) {
    for (let j = 1; j <= lenS2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // 删除
        dp[i][j - 1] + 1, // 插入
        dp[i - 1][j - 1] + cost // 替换
      );
    }
  }

  // 返回编辑距离
  return dp[lenS1][lenS2];
}

// 匹配的点击事件
export const matchMenu = (input: string) => {
  const tree = getMenuList();
  if (tree.length <= 0) {
    return [];
  }
  getBottomLayerRoute(tree);

  // 遍历路由列表 每项根据名称计算编辑距离 取最小的五个作为结果
  const tmp = bottomLayerRoutes.map((ele) => {
    return { ...ele, similarity: 99999 };
  });
  for (let j = 0; j < tmp.length; ++j) {
    const tmpSimilarity = levenshteinDistance(input, tmp[j].name);
    tmp[j].similarity = tmpSimilarity;
  }
  tmp.sort((a, b) => {
    return a.similarity - b.similarity;
  });
  console.log('匹配结果: ', tmp);
  const resList: any[] = [];
  for (let i = 0; i < 5; ++i) {
    resList.push(tmp[i]);
  }

  // 重置数组
  bottomLayerRoutes = [];
  ancestorRoutes = [];
  return resList;
};

function generateMarkdownTree(tree, indentLevel = 0) {
  return tree.reduce((markdown, node) => {
    // 给当前节点添加适当缩进
    markdown += `${'  '.repeat(indentLevel)}- ${node.name}\n`;
    // 节点存在子节点时，递归处理
    if (node.children && node.children.length > 0) {
      markdown += generateMarkdownTree(node.children, indentLevel + 1);
    }
    return markdown;
  }, '');
}

export const generateMatchPrompt = (question) => {
  const menuList = getMenuList();
  return `
# Role: 菜单回复机器人
## Profile
Version: 1.0
## Workflow
1.根据给定的菜单目录和输入的问题，给出符合要求的末级目录名称
2.不要返回除了菜单目录名称以外的任何内容
## Initialization
以下是菜单目录结构:
${generateMarkdownTree([{ name: '用户信息' }])}

以下是用户提问:
${question}
  `;
};

export const requestMatchMenu = async (question) => {
  const MODEL = 'Doubao-lite-32k';
  const defaultThemeId = localStorage.getItem('MATCH_MENU_THEME_ID');
  const themeId =
    defaultThemeId ??
    (await request.post({
      url: '/agriculture/chat-theme/create',
      data: {
        collectionId: '',
        model: MODEL,
        theme: '',
        type: 'text'
      }
    }));
  if (typeof themeId === 'string') localStorage.setItem('MATCH_MENU_THEME_ID', themeId);
  else return ElMessage.error('获取主题ID失败');

  const res = await request.post({
    url: `/agriculture/context/context-search`,
    data: {
      collectionId: '',
      query: generateMatchPrompt(question),
      stream: false,
      model: MODEL,
      maxNewTokens: 200,
      themeId: themeId,
      extraPrompt: ''
    }
  });
  console.log('res ==>', res);
};
