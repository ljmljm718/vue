<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/* todo原页面的js代码复制在下面 */
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { MarketingProgramApi, MarketingProgramVO } from '@/api/agriculture/marketingprogram';
import MarketingProgramForm from './MarketingProgramForm.vue';
import { renderAsync } from 'docx-preview';
import axios from 'axios';
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
  marketingType: 'marketing-program',
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
onMounted(() => {
  // 组件已挂载，添加事件监听
  window.addEventListener('resize', handleResize);
});
const windowWidth = ref<any>();
const handleResize = () => {
  console.log(999);
  windowWidth.value = window.innerWidth;
  console.log(windowWidth.value, '屏幕宽度 999');
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
// 列表展示类型
const listType = ref('card');
const tmpIndex = ref(-1);
// 当前查看的数据下标
const currentIdx = ref(-1);
// 切换列表展示类型
const handleCardChange = async () => {
  queryParams.pageNo = 1;
  await getList();
};
watch(listType, handleCardChange);
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await MarketingProgramApi.getMarketingProgramPage(queryParams);
    list.value = data.list;
    total.value = data.total;
    if ('card' === listType.value) {
      currentIdx.value = list.value.length > 0 ? 0 : -1;
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

/** 添加/修改操作 */
const router = useRouter(); // 路由
const formRef = ref();
const openForm = (type: string, id?: number) => {
  // 新增和编辑前 保存当前查看项的下标
  if ('card' === listType.value) {
    tmpIndex.value = list.value.findIndex((ele) => {
      return ele.id === list.value[currentIdx.value].id;
    });
  }
  if (type == 'create') {
    router.push('/pcg/marketingCenter/marketingprogram/CreateOrUpdateMaketingPagram');
  } else {
    router.push(
      '/pcg/marketingCenter/marketingprogram/CreateOrUpdateMaketingPagram?type=' +
        type +
        '&id=' +
        id
    );
  }
  //formRef.value.open(type, id)
};
// 新增和修改成功后调用的函数
const handleUpdateSuccess = async () => {
  await getList();
  if ('card' !== listType.value) return;
  if (-1 !== tmpIndex.value) {
    currentIdx.value = tmpIndex.value;
    tmpIndex.value = -1;
  }
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await MarketingProgramApi.deleteMarketingProgram(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
};

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await MarketingProgramApi.exportMarketingProgram(queryParams);
    download.excel(data, '营销方案.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

onActivated(() => {
  getList();
});
/** 初始化 **/
onMounted(() => {
  getList();
});
/* 原页面的代码复制在上面 */

/**
 * topMenuHeight      顶部菜单和标签页高度
 * contentPadding     页面内容外边距
 */
const topMenuHeight = 85;
const contentPadding = 8;

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
// 展开或收起搜索栏
const showSearch = ref(false);
const handleClickShowSearch = () => {
  showSearch.value = !showSearch.value;
};
</script>

<template>
  <el-scrollbar
    class="w-full bg-white rounded-[6px] text-[#666] text-[14px] p-[16px] box-border"
    :style="{ height: 'calc(100vh - ' + (topMenuHeight + 2 * contentPadding) + 'px)' }"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center">
        <!-- 一级标题名字 todo替换成菜单名称-->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">营销方案</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <!-- todo原新增按钮 -->
        <!-- todo需要包含type="primary"&&不能有plain属性 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:marketing-program:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center">
        <!-- 一级标题这行右侧的按钮写在下面 修改点击事件函数 -->
        <!-- todo复制原页面【搜索、重置、导出】 -->
        <!-- todo【搜索】按钮需要包含type="primary"&&不能有plain属性 -->
        <!-- todo删除导出按钮的type和plain属性 -->
        <el-button @click="handleQuery" type="primary">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:marketing-program:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
        <!-- el-radio-button比el-button高 和button放在一行突兀 所以用el-button实现el-radio-button效果 单独使用时el-radio-button更佳 -->
        <div class="flex">
          <el-button
            @click="listType = 'list'"
            class="!rounded-r-none"
            :class="`${listType === 'list' && 'tab-active'}`"
          >
            <Icon icon="ep:list" />
          </el-button>
          <el-button
            @click="listType = 'card'"
            class="!ml-0 !rounded-l-none"
            :class="`${listType === 'card' && 'tab-active'}`"
          >
            <Icon icon="ep:menu" />
          </el-button>
        </div>
        <div
          class="w-[20px] h-[20px] !ml-[16px] text-center leading-[22px] rounded-full cursor-pointer transition-all"
          :class="showSearch ? 'rotate-0' : 'rotate-180'"
          style="border: 1px solid #e6e6e6"
          @click="showSearch = !showSearch"
        >
          <el-icon :size="14"><ArrowUpBold /></el-icon>
        </div>
      </div>
    </div>

    <!-- 搜索栏 注意 :model 和 ref 的名称 -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <!-- todo复制原来的搜索列表 -->
      <!-- todo 所有的都需要删除class=“!w-240” 这一类的属性 -->
      <el-form-item label="方案名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入方案名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创作人" prop="marketingCreator">
        <el-input
          v-model="queryParams.marketingCreator"
          placeholder="请输入创作人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传时间" prop="marketingUploadTime">
        <el-date-picker
          v-model="queryParams.marketingUploadTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <el-form-item label="分类" prop="marketingCategory">
        <el-input
          v-model="queryParams.marketingCategory"
          placeholder="请输入分类"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标签" prop="marketingTags">
        <el-input
          v-model="queryParams.marketingTags"
          placeholder="请输入标签"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="营销推广类型" prop="marketingType">
        <el-input
          v-model="queryParams.marketingType"
          placeholder="请输入营销推广类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input
          v-model="queryParams.reserveOne"
          placeholder="请输入备用一"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input
          v-model="queryParams.reserveTwo"
          placeholder="请输入备用二"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input
          v-model="queryParams.reserveThree"
          placeholder="请输入备用三"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item> -->
    </el-form>
    <div class="mt-[16px]">
      <el-table v-show="listType === 'list'" :data="list" :show-overflow-tooltip="true">
        <!-- todo复制列表 -->
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="方案名称" align="center" prop="schemeName" />
        <el-table-column label="简介" align="center" prop="briefIntroduction" />
        <el-table-column label="创作人" align="center" prop="marketingCreator" />
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
              lazy
              :src="row.coverImage"
              :preview-src-list="[row.coverImage]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="营销推广类型" align="center" prop="marketingType" />
        <el-table-column label="备用一" align="center" prop="reserveOne" />
        <el-table-column label="备用二" align="center" prop="reserveTwo" />
        <el-table-column label="备用三" align="center" prop="reserveThree" /> -->
        <!-- <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        /> -->
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <!-- todo操作按钮 -->
            <!-- 1.  <template #default="scope"> 中，加入
                <div class="flex items-center justify-center">
                  其中放入编辑，删除"按钮"等，每一个按钮中完成后加入
                    <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                  这段代码的含义是“竖杠”分隔符
                </div>
                2.请注意“方案一”和“方案二”只采用一种，请根据自身按钮数量选择性删除或保留
              -->
            <!-- todo方案一 -->
            <div class="flex items-center justify-center">
              <el-button
                v-if="scope.row.fileManagement"
                link
                type="primary"
                @click="filePreview(scope.row.fileManagement)"
              >
                文件预览
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:marketing-program:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-show="listType === 'card'" v-loading="loading" class="grid grid-cols-2 gap-[16px]">
      <div>
        <div class="sticky top-0 w-full pb-[16px] rounded-b-[4px] shadow-md dark:shadow-[#000]">
          <template v-if="currentIdx !== -1 && list[currentIdx]">
            <div class="w-full pb-[56.25%] relative">
              <el-image
                :src="list[currentIdx].coverImage"
                :alt="list[currentIdx].schemeName"
                :preview-src-list="[list[currentIdx].coverImage]"
                preview-teleported
                fit="cover"
                class="!absolute top-0 left-0 w-full h-full"
              />
              <div
                v-show="list[currentIdx].videoLink"
                @click="openVideo(list[currentIdx].videoLink)"
                class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
              >
                <el-icon size="16px"><VideoCamera /></el-icon>
              </div>
              <div
                class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                @click="openForm('update', list[currentIdx].id)"
              >
                <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
              </div>
              <div
                class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                @click="handleDelete(list[currentIdx].id)"
              >
                <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
              </div>
            </div>
            <div class="text-[8px] 2xl:text-[10px]">
              <div class="p-[1.6em] flex justify-between">
                <span class="font-bold text-[1.4em]">{{ list[currentIdx].schemeName }}</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ timeFormat(list[currentIdx].marketingUploadTime) }}
                </span>
              </div>
              <div style="border-bottom: 1px dashed #e6e6e6" class="mx-[1.6em]"></div>
              <div class="mt-[1.6em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">简介:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].briefIntroduction }}
                </span>
              </div>
              <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">创作人:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].marketingCreator }}
                </span>
              </div>
              <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">分类:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].marketingCategory }}
                </span>
              </div>
              <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">标签:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].marketingTags }}
                </span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="w-full pb-[56.25%] no-data"></div>
          </template>
        </div>
      </div>
      <div>
        <div class="grid grid-cols-2 xl:grid-cols-3 gap-[16px]">
          <div
            class="cursor-pointer shadow-md rounded-[4px] overflow-hidden pb-[16px] dark:bg-[#333] dark:shadow-[#000]"
            v-for="(item, index) in list"
            :key="item.id"
            @click="currentIdx = index"
            :style="`${index === currentIdx && 'border: 1px solid var(--el-color-primary)'}`"
          >
            <div class="w-full pb-[56.25%] relative">
              <el-image
                :src="item.coverImage"
                :alt="item.schemeName"
                fit="cover"
                class="!absolute top-0 left-0 w-full h-full"
              />
            </div>
            <div class="text-[8px] 2xl:text-[10px] px-[1.6em] mt-[1.6em]">
              <div>
                <span class="truncate text-[1.4em]">{{ item.schemeName }}</span>
              </div>
              <div class="mt-[0.8em]">
                <span class="truncate text-[1.4em]">
                  {{ timeFormat(item.marketingUploadTime) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 页码组件 注意绑定的值和事件函数 -->
    <!-- 不用改 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>
  <!-- todo页面组件复制在下面 -->
  <!-- 表单弹窗：添加/修改 -->
  <MarketingProgramForm ref="formRef" @success="getList" />
  <el-dialog v-model="dialogVisible" title="预览" width="70vw" :before-close="handleDialogClose">
    <el-scrollbar height="65vh" class="px-2">
      <div id="filePreview"></div>
    </el-scrollbar>
  </el-dialog>
</template>
<style lang="scss" scoped>
// 原页面样式复制在下面

// 鼠标移在按钮上时显示主题色边框
:deep(.el-button:hover) {
  border-color: var(--el-color-primary);
}

// 去掉表单的边距
:deep(.form > *) {
  margin: 0;
}

// 调整表单标签和输入框之间的距离
:deep(.form .el-form-item__label) {
  padding: 0 4px 0 0;
}

// 收起
.circle-arrow-up {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ebebeb;
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
