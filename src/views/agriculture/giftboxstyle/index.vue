<template>
  <div
    class="w-full bg-[#ECEFF7] rounded-[6px] text-[#666] text-[14px]"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <!-- 标题 -->
    <div class="w-full p-[16px] box-border flex justify-between items-center">
      <h1 class="m-0 text-[#333] font-bold text-[18px]">礼盒样式</h1>
      <div>
        <button
          class="primary-btn"
          @click="openForm('create')"
          v-hasPermi="['agriculture:marketing-program:create']"
        >
          新增
        </button>
        <button
          class="secondary-btn ml-[8px]"
          @click="handleExport"
          v-hasPermi="['agriculture:marketing-program:export']"
        >
          导出
        </button>
      </div>
    </div>

    <div
      class="w-full bg-white rounded-[6px] px-[16px] pt-[8px] box-border flex flex-col min-h-[570px]"
      :style="{ height: 'calc(100% - ' + (btnHeight + 2 * modulePadding) + 'px)' }"
    >
      <!-- 操作按钮 -->
      <div class="flex justify-end items-center">
        <button class="primary-btn flex items-center" @click="handleQuery">
          <Icon :size="14" icon="ep:search" class="mr-[8px]" />
          查询
        </button>
        <button class="secondary-btn ml-[8px] flex items-center" @click="resetQuery">
          <Icon :size="14" icon="ep:refresh" class="mr-[8px]" />
          重置
        </button>

        <el-radio-group v-model="listType" class="ml-[8px] card-list" @change="handleCardChange">
          <el-radio-button label="list" value="list">
            <Icon :size="14" icon="ep:list" />
          </el-radio-button>
          <el-radio-button label="card" value="card">
            <Icon :size="14" icon="ep:menu" />
          </el-radio-button>
        </el-radio-group>

        <button
          class="circle-arrow-up ml-[16px]"
          :class="showSearch ? 'rotate180andthemeBg' : 'rotate180andwhiteBg'"
          @click="handleClickShowSearch"
        >
          <Icon :size="14" icon="ep:arrow-up" />
        </button>
      </div>

      <!-- 搜索栏 -->
      <el-form
        class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[8px] mt-[8px] transition-all duration-500"
        :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
        :model="queryParams"
        ref="queryFormRef"
        label-width="88px"
        :inline="true"
        id="formDom"
      >
        <el-form-item label="产品名称" prop="schemeName" class="!m-0">
          <el-input
            v-model="queryParams.schemeName"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设计人" prop="marketingCreator" class="!m-0">
          <el-input
            v-model="queryParams.marketingCreator"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="分类" prop="marketingCategory" class="!m-0">
          <el-input
            v-model="queryParams.marketingCategory"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标签" prop="marketingTags" class="!m-0">
          <el-input
            v-model="queryParams.marketingTags"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="上传时间" prop="marketingUploadTime" class="!m-0">
          <el-date-picker
            v-model="queryParams.marketingUploadTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          />
        </el-form-item>
      </el-form>

      <!-- 内容 卡片形式 -->
      <div
        v-if="list.length > 0 && listType === 'card'"
        v-loading="loading"
        class="w-full mt-[16px] grid grid-cols-2 gap-[16px] transition-all duration-500"
        :style="{ height: mainHeight }"
      >
        <el-scrollbar
          style="height: 100%; border: 1px solid var(--el-color-primary)"
          class="rounded-[6px]"
        >
          <div :class="`rounded-[6px] bg-white pb-[16px]`">
            <div class="w-full pb-[56.25%] relative">
              <img
                :src="currentItem.coverImage"
                :alt="currentItem.schemeName"
                class="w-full h-full object-contain absolute top-0 left-0 rounded-t-[6px]"
              />
              <div
                v-show="currentItem.fileManagement"
                class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[210px] rounded text-center leading-[40px] cursor-pointer"
              >
                <a :href="currentItem.fileManagement">
                  <el-icon color="#FFFFFF" size="16px" class="p-[10px]">
                    <Download />
                  </el-icon>
                </a>
              </div>
              <div
                v-show="currentItem.fileManagement"
                @click="filePreview(currentItem.fileManagement)"
                class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[160px] rounded text-center leading-[40px] cursor-pointer"
              >
                <el-icon color="#FFFFFF" size="16px"><View /></el-icon>
              </div>
              <div
                class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded text-center leading-[40px] cursor-pointer"
                @click="openDetailForm('view', currentItem.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                <el-icon color="#FFFFFF" size="16px"><More /></el-icon>
              </div>
              <div
                class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded text-center leading-[40px] cursor-pointer"
                @click="openForm('update', currentItem.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
              </div>
              <div
                class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded text-center leading-[40px] cursor-pointer"
                @click="handleDelete(currentItem.id)"
                v-hasPermi="['agriculture:marketing-program:delete']"
              >
                <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
              </div>
            </div>

            <div class="mt-[16px] px-[16px] text-[16px] font-bold">
              {{ currentItem.schemeName }}
            </div>
            <div class="m-[16px] border-t border-t-dashed border-[#E6E6E6]"></div>
            <div class="px-[16px]">{{ currentItem.briefIntroduction }}</div>
          </div>
        </el-scrollbar>

        <el-scrollbar style="height: 100%">
          <div class="w-full grid grid-cols-2 xl:grid-cols-3 gap-[16px]">
            <div
              :class="`
                cursor-pointer shadow-md rounded-[6px] pb-[10px] bg-white
              `"
              v-for="item in list"
              :key="item.id"
              @click="changCurrentItem(item)"
            >
              <div class="w-full pb-[56.25%] overflow-hidden relative">
                <img
                  :src="item.coverImage"
                  :alt="item.schemeName"
                  class="absolute top-0 left-0 w-full h-full object-cover rounded-t-[6px]"
                />
              </div>
              <div class="mt-[16px] px-[16px]">
                {{ item.schemeName }}
              </div>
              <div class="mt-[8px] px-[16px] truncate">
                {{ item.briefIntroduction }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div v-else-if="listType === 'card'" class="text-center tracking-widest">暂无数据</div>

      <!-- 内容 列表形式 -->
      <div
        v-else
        class="w-full mt-[16px] transition-all duration-500"
        :style="{ height: mainHeight }"
      >
        <el-table
          style="height: 100%"
          :data="list"
          v-loading="loading"
          :show-overflow-tooltip="true"
        >
          <el-table-column label="产品名称" align="center" prop="schemeName" />
          <el-table-column label="简介" align="center" prop="briefIntroduction" />
          <el-table-column label="设计人" align="center" prop="marketingCreator" />
          <el-table-column
            label="上传时间"
            align="center"
            prop="marketingUploadTime"
            :formatter="dateFormatter"
            width="180px"
          />
          <el-table-column label="分类" align="center" prop="marketingCategory" />
          <el-table-column label="标签" align="center" prop="marketingTags" />
          <el-table-column label="文件管理" align="center" prop="fileManagement">
            <template #default="scope">
              <el-button type="primary" round v-if="scope.row.fileManagement">
                <a :href="scope.row.fileManagement" style="color: aliceblue; text-decoration: none">
                  点击下载
                </a>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="封面图片" align="center" prop="coverImage">
            <template #default="{ row }">
              <el-image
                class="h-60px w-60px"
                :src="row.coverImage"
                :preview-src-list="[row.coverImage]"
                preview-teleported
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="200px">
            <template #default="scope">
              <el-button
                v-if="scope.row.fileManagement"
                link
                type="primary"
                @click="filePreview(scope.row.fileManagement)"
              >
                文件预览
              </el-button>
              <el-button
                link
                type="primary"
                @click="openDetailForm('view', scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                详情
              </el-button>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:delete']"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <Pagination
        style="margin-bottom: 0; margin-top: 8px"
        class="self-end"
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList()"
      />
    </div>
  </div>

  <!-- 表单弹窗：添加/修改 -->
  <MarketingProgramForm ref="formRef" @success="getList" />

  <!-- 文件预览 -->
  <el-dialog v-model="dialogVisible" title="预览" width="70vw" :before-close="handleDialogClose">
    <el-scrollbar height="65vh" class="px-2">
      <div id="filePreview"></div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { MarketingProgramApi, MarketingProgramVO } from '@/api/agriculture/marketingprogram';
import MarketingProgramForm from './MarketingProgramForm.vue';
//文件预览引入
import { renderAsync } from 'docx-preview';
import axios from 'axios';
import { useAppStore } from '@/store/modules/app';
import { watch } from 'vue';

/** 营销方案 列表 */
defineOptions({ name: 'MarketingProgram' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<MarketingProgramVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  schemeName: undefined,
  briefIntroduction: undefined,
  marketingCreator: undefined,
  marketingUploadTime: [],
  marketingCategory: undefined,
  marketingTags: undefined,
  fileManagement: undefined,
  coverImage: undefined,
  marketingType: 'giftboxstyle',
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

//文件预览
let dialogVisible = ref(false);
let fileUrl = ref();
const filePreview = (url: any) => {
  dialogVisible.value = true;
  console.log('preview url', url);

  if (url.endsWith('docx')) renderDocx(url);
  else if (url.endsWith('pdf')) renderPDF(url);
  else renderError();
};

const renderError = () => {
  const _p = document.createElement('p');
  _p.innerHTML = '格式暂不支持！';
  setTimeout(() => {
    const _dom = document.getElementById('filePreview') as HTMLElement;
    if (_dom) _dom.appendChild(_p);
  }, 200);
};

const handleDialogClose = () => {
  const _dom = document.getElementById('filePreview') as HTMLElement;
  if (_dom) _dom.innerHTML = '';
  dialogVisible.value = false;
};
// 渲染docx
const renderDocx = (url: string) => {
  if (!url.endsWith('docx')) return;
  axios.get(url, { responseType: 'blob' }).then(({ data }) => {
    const _dom = document.getElementById('filePreview') as HTMLElement;
    renderAsync(data, _dom);
  });
};

const renderPDF = (url: string) => {
  const _iframe = document.createElement('iframe');
  _iframe.src = url;
  _iframe.width = '100%';
  _iframe.height = '600px';
  setTimeout(() => {
    const _dom = document.getElementById('filePreview') as HTMLElement;
    console.log('dom', _dom);

    if (_dom) _dom.appendChild(_iframe);
  }, 200);
};
//--------结束文件预览

/** 查询列表 */
const getList = async () => {
  if (sessionStorage.getItem('latestListType')) {
    listType.value = sessionStorage.getItem('latestListType');
  }
  sessionStorage.removeItem('latestListType');
  loading.value = true;
  try {
    const data = await MarketingProgramApi.getMarketingProgramPage(queryParams);
    list.value = data.list;
    total.value = data.total;
    if ('card' === listType.value) {
      currentItem.value = list.value[0];
    }
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

// 列表展示形式 card list
const listType = ref('card');

// 预览区展示项
const currentItem = ref({
  id: undefined,
  schemeName: undefined,
  briefIntroduction: undefined,
  marketingCreator: undefined,
  marketingUploadTime: undefined,
  marketingCategory: undefined,
  marketingTags: undefined,
  fileManagement: undefined,
  coverImage: undefined,
  marketingType: undefined,
  reserveOne: null,
  reserveTwo: null,
  reserveThree: null,
  createTime: undefined
});

// 切换预览区展示项
const changCurrentItem = (item: any) => {
  currentItem.value = item;
};

// listType切换list或card
const handleCardChange = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 添加/修改操作 */
const router = useRouter(); // 路由
const formRef = ref();
const openForm = (type: string, id?: number) => {
  sessionStorage.setItem('latestListType', listType.value);

  // 执行新增、编辑、详情操作 保存搜索栏数据和页码
  sessionStorage.removeItem('giftboxStyleQueryParams');
  let data: any = {
    pageNo: queryParams.pageNo,
    schemeName: queryParams.schemeName,
    marketingCreator: queryParams.marketingCreator,
    marketingCategory: queryParams.marketingCategory,
    marketingTags: queryParams.marketingTags,
    marketingUploadTime: queryParams.marketingUploadTime
  };
  if ('card' === listType.value) {
    const idx = list.value.findIndex((ele) => ele.id === currentItem.value.id);
    data = { ...data, id: idx };
  }
  sessionStorage.setItem('giftboxStyleQueryParams', JSON.stringify(data));

  if (type == 'create') {
    router.push('/pcg/marketingCenter/giftBoxStyle/CreateOrUpdateMaketingPagram');
  } else {
    router.push(
      '/pcg/marketingCenter/giftBoxStyle/CreateOrUpdateMaketingPagram?type=' + type + '&id=' + id
    );
  }
};

/**
 * 详情按钮操作
 * @param type
 * @param id
 */
const openDetailForm = (type: string, id?: number) => {
  sessionStorage.setItem('latestListType', listType.value);

  // 执行新增、编辑、详情操作 保存搜索栏数据和页码 和 当前选择项
  sessionStorage.removeItem('giftboxStyleQueryParams');
  let data: any = {
    pageNo: queryParams.pageNo,
    schemeName: queryParams.schemeName,
    marketingCreator: queryParams.marketingCreator,
    marketingCategory: queryParams.marketingCategory,
    marketingTags: queryParams.marketingTags,
    marketingUploadTime: queryParams.marketingUploadTime
  };
  if ('card' === listType.value) {
    const idx = list.value.findIndex((ele) => ele.id === currentItem.value.id);
    data = { ...data, id: idx };
  }
  sessionStorage.setItem('giftboxStyleQueryParams', JSON.stringify(data));

  router.push('/pcg/marketingCenter/giftBoxStyle/boxStyleDetail?type=' + type + '&id=' + id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  // 删除之前 记录下currentItem的下标 列表刷新后直接显示记录下标的项
  const idx = list.value.findIndex((ele) => ele.id === currentItem.value.id);

  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await MarketingProgramApi.deleteMarketingProgram(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}

  // 删除后 设置curItem
  if (idx >= list.value.length) {
    currentItem.value = list.value[list.value.length - 1];
  } else {
    currentItem.value = list.value[idx];
  }
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await MarketingProgramApi.exportMarketingProgram(queryParams);
    download.excel(data, '礼盒样式.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(async () => {
  // 如果执行新增、编辑、详情操作 会事先保存搜索栏数据和页码 读取这些数据查询List
  const sessionParams = sessionStorage.getItem('giftboxStyleQueryParams');
  let idx: number = -1;
  if (sessionParams) {
    const data = JSON.parse(sessionParams);
    queryParams.pageNo = data.pageNo;
    queryParams.schemeName = data.schemeName;
    queryParams.marketingCreator = data.marketingCreator;
    queryParams.marketingCategory = data.marketingCategory;
    queryParams.marketingTags = data.marketingTags;
    queryParams.marketingUploadTime = data.marketingUploadTime;
    idx = data.id;
  }
  sessionStorage.removeItem('giftboxStyleQueryParams');

  await getList();

  if (-1 !== idx) {
    currentItem.value = list.value[idx];
  }

  // 获取当前是否是深色主题
  themeIsDark.value = appStore.getIsDark;
});

const appStore = useAppStore();
const themeIsDark = ref(false);

// 监听主题模式变化
watch(
  () => appStore.isDark,
  (newVal, oldVal) => {
    console.log('isDark', newVal, oldVal);
    themeIsDark.value = newVal;
  }
);

// 时间戳转换成 YYYY-MM-DD HH:MM:SS
const timeFormat = (dataString: string) => {
  //dataString是整数，否则要parseInt转换
  var time = new Date(dataString);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    '-' +
    (day < 10 ? '0' + day : day) +
    ' ' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    ':' +
    (second < 10 ? '0' + second : second)
  );
};

/**
 * 以下为布局需要的各类元素的高度
 * 需要修改的是 searchAreaHeight 搜索栏区域的高度
 * 以及 pagnitionHeight 页码组件的高度 这个需要包括margin
 * 运行页面用控制台查看一下
 *
 * topMenuHeight      顶部菜单和标签页高度
 * contentPadding     页面内容外边距
 * modulePadding      模块内边距
 * btnHeight          按钮高度
 * searchAreaHeight   搜索栏区域高度
 * pagnitionHeight    页码组件高度 需要包括margin
 *
 * mainHeight 是 本页 列表内容的高度 用白色区域的高度 - 操作按钮 - 搜索栏 - 页码 - 所有垂直方向上的边距
 */
const topMenuHeight = 85;
const contentPadding = 8;
const modulePadding = 16;
const btnHeight = 32;
// const searchAreaHeight = 56;
const pagnitionHeight = 24 + 8;
const mainHeight = ref();

// 计算列表内容的高度
const calcMainHeight = () => {
  let dom = document.querySelector('#formDom');
  if (!dom) return;
  mainHeight.value =
    'calc(100% - ' +
    (2 * contentPadding + modulePadding + btnHeight + dom.clientHeight + pagnitionHeight) +
    'px)';
  dom = null;
};

onMounted(() => {
  calcMainHeight();
  window.addEventListener('resize', calcMainHeight);
});

// 展开或收起搜索栏
const showSearch = ref(true);
const handleClickShowSearch = async () => {
  showSearch.value = !showSearch.value;
  await nextTick();
  calcMainHeight();
};
</script>

<style scoped lang="scss">
// 主按钮
.primary-btn {
  padding-left: 16px;
  padding-right: 16px;
  height: 32px;
  font-size: 14px;
  color: white;
  border-width: 0;
  border-radius: 6px;
  background-color: var(--el-color-primary);

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

// 次按钮
.secondary-btn {
  padding-left: 16px;
  padding-right: 16px;
  height: 32px;
  font-size: 14px;
  color: #333;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  background-color: white;

  &:hover {
    cursor: pointer;
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}

// 收起
.circle-arrow-up {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
  color: #333;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    color: white;
    border-width: 0;
    background-color: var(--el-color-primary);
  }
}

// el-radio-button 的内边距
:deep(.card-list .el-radio-button__inner) {
  padding: 8px 16px;
  border-color: #e6e6e6;
}

// 第一个 el-radio-button 的左圆角 和 hover时样式
:deep(.card-list .el-radio-button:first-child .el-radio-button__inner) {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;

  &:hover {
    border-color: var(--el-color-primary);
  }
}

// 最后一个 el-radio-button 的左圆角 和 hover时样式
:deep(.card-list .el-radio-button:last-child .el-radio-button__inner) {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-left: 1px solid #e6e6e6;

  &:hover {
    border-color: var(--el-color-primary);
  }
}

// radio 激活时的样式
:deep(.card-list .el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: white;
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  box-shadow: none;
}

// 向上箭头展开收起的动画
@keyframes rotate180andwhiteBg {
  from {
    transform: rotate(0deg);
    color: #333;
    background-color: white;
  }
  to {
    transform: rotate(180deg);
    color: white;
    background-color: var(--el-color-primary);
  }
}

.rotate180andwhiteBg {
  animation-duration: 0.5s;
  animation-name: rotate180andwhiteBg;
  animation-fill-mode: forwards;
}

@keyframes rotate180andthemeBg {
  from {
    transform: rotate(180deg);
    color: white;
    background-color: var(--el-color-primary);
  }
  to {
    transform: rotate(360deg);
    color: #333;
    background-color: white;
  }
}

.rotate180andthemeBg {
  animation-duration: 0.5s;
  animation-name: rotate180andthemeBg;
  animation-fill-mode: forwards;
}
</style>
