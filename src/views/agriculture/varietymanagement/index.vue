<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/* 原页面的js代码复制在下面 */
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { VarietyManagementApi, VarietyManagementVO } from '@/api/agriculture/varietymanagement';
import VarietyManagementForm from './VarietyManagementForm.vue';
import {
  CategoryManagementApi,
  CategoryManagementVO,
  allDataCacheManager
} from '@/api/agriculture/categorymanagement';
import router from '@/router';

/** 品种管理 列表 */
defineOptions({ name: 'VarietyManagement' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<VarietyManagementVO[]>([]); // 列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]); // 品类列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  varietyName: undefined,
  varietyCode: undefined,
  images: undefined,
  categoryId: undefined,
  categorySource: undefined,
  categoryStigma: undefined,
  areaDistribution: undefined,
  briefIntroduction: undefined,
  status: undefined,
  remark2: undefined,
  createTime: []
});
const CategoryManagementQueryParams = reactive({});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
// 列表展示类型
const listType = ref('card');
// 当前查看的数据下标
const currentIdx = ref(-1);

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    //@ts-ignore
    listCategoryManagement.value = await allDataCacheManager.getData(CategoryManagementQueryParams);
    const data = await VarietyManagementApi.getVarietyManagementPage(queryParams);
    list.value = data.list;
    if ('card' === listType.value) {
      currentIdx.value = list.value.length > 0 ? 0 : -1;
    }
    // list.value.forEach(item=>{
    //   listCategoryManagement.value.forEach(itm=>{
    //     if(item.categoryId==itm.id) item.categoryId=itm.categoryName
    //   })
    // })
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};
// 切换列表展示类型
const handleCardChange = async () => {
  queryParams.pageNo = 1;
  await getList();
};
watch(listType, handleCardChange);

const goGrowthCycle = (id: number) => {
  console.log('id', id);
  router.push({ path: '/growthCycle', query: { cropId: id, tag: 'variety' } });
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
const formRef = ref();
const tmpIndex = ref(-1);
const openForm = (type: string, id?: number) => {
  // 新增和编辑前 保存当前查看项的下标
  if ('card' === listType.value) {
    tmpIndex.value = list.value.findIndex((ele) => {
      return ele.id === list.value[currentIdx.value].id;
    });
  }
  formRef.value.open(type, id);
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
    await VarietyManagementApi.deleteVarietyManagement(id);
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
    const data = await VarietyManagementApi.exportVarietyManagement(queryParams);
    download.excel(data, '品种管理.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

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
        <!-- 一级标题名字 -->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">品种管理</h1>

        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>

        <!-- 一级标题旁边的按钮 -->
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:variety-management:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" />
          新增
        </el-button>
      </div>

      <div class="flex items-center space-x-[8px]">
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" />
          <span>搜索</span>
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />
          <span>重置</span>
        </el-button>
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agri:monitoring-equipment-data:export']"
        >
          <Icon icon="ep:download" />
          <span>导出</span>
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

    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full overflow-hidden form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <!-- <el-form-item label="设备" prop="deviceId">
        <el-input v-model="queryParams.deviceName" placeholder="请选择设备" readonly>
          <template #append>
            <el-button @click="openSelectDeviceInfo()">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="deviceStatus">
        <el-select v-model="queryParams.deviceStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="品种名称" prop="varietyName">
        <el-input
          v-model="queryParams.varietyName"
          placeholder="请输入品种名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品种编码" prop="varietyCode">
        <el-input
          v-model="queryParams.varietyCode"
          placeholder="请输入品种编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="品类名称" prop="categoryId">
        <el-select v-model="queryParams.categoryId" clearable placeholder="请选择品类">
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="品种来源" prop="categorySource">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.categorySource"-->
      <!--          placeholder="请输入品种来源"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="品种特征" prop="categoryStigma">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.categoryStigma"-->
      <!--          placeholder="请输入品种特征"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="分布地区" prop="areaDistribution">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.areaDistribution"-->
      <!--          placeholder="请输入分布地区"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="简介" prop="briefIntroduction">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.briefIntroduction"-->
      <!--          placeholder="请输入简介"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="是否启用" prop="status">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.status"-->
      <!--          placeholder="请选择启用停用"-->
      <!--          clearable-->
      <!--          -->
      <!--        >-->
      <!--          <el-option label="请选择字典生成" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
    </el-form>

    <!-- main content -->
    <div class="mt-[16px]">
      <!-- <div class="w-full mt-[8px]"> -->
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table
        v-show="listType === 'list'"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <!-- v-loading="loading" -->
        <!--      <el-table-column label="主键" align="center" prop="id"/>-->
        <el-table-column label="品种名称" align="center" prop="varietyName" />
        <!--      <el-table-column label="品类ID" align="center" prop="categoryId"/>-->
        <el-table-column label="品类名称" align="center" prop="categoryName" />
        <el-table-column label="品种编码" align="center" prop="varietyCode" />
        <el-table-column label="图片" align="center" prop="images">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              lazy
              :src="row.images"
              :preview-src-list="[row.images]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="品种来源" align="center" prop="categorySource" />
        <el-table-column label="品种特征" align="center" prop="categoryStigma" />
        <el-table-column label="分布地区" align="center" prop="areaDistribution" />
        <el-table-column label="简介" align="center" prop="briefIntroduction" />
        <el-table-column label="启用停用" align="center" prop="status" width="70px">
          <template #default="{ row }">
            <span v-if="row.status == '1'">启用</span>
            <span v-if="row.status == '2'">停用</span>
          </template>
        </el-table-column>
        <!--      <el-table-column label="备注1" align="center" prop="remark2" />-->
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="150px"
        />
        <el-table-column label="操作" align="center" fixed="right" min-width="154px">
          <template #default="scope">
            <div class="flex items-center justify-center">
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:variety-management:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="primary"
                @click="goGrowthCycle(scope.row.id)"
                v-hasPermi="['agriculture:variety-management:update']"
              >
                生长周期
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:variety-management:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- card -->
    <div v-show="listType === 'card'" v-loading="loading" class="grid grid-cols-2 gap-[16px]">
      <div>
        <div class="sticky top-0 w-full pb-[16px] rounded-b-[4px] shadow-md dark:shadow-[#000]">
          <template v-if="currentIdx !== -1 && list[currentIdx]">
            <div class="w-full pb-[56.25%] relative">
              <el-image
                :src="list[currentIdx].images"
                :alt="list[currentIdx].varietyName"
                :preview-src-list="[list[currentIdx].images]"
                preview-teleported
                fit="cover"
                class="!absolute top-0 left-0 w-full h-full"
              />
              <!-- todo没有适配图标 -->
              <div
                @click="goGrowthCycle(list[currentIdx].id)"
                class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
              >
                <el-icon size="16px"><More /></el-icon>
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
                <span class="font-bold text-[1.4em]">{{ list[currentIdx].categoryName }}</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ timeFormat(list[currentIdx].createTime) }}
                </span>
              </div>
              <div style="border-bottom: 1px dashed #e6e6e6" class="mx-[1.6em]"></div>
              <div class="mt-[1.6em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">品种名称:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].varietyName }}
                </span>
              </div>
              <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">品种编码:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].varietyCode }}
                </span>
              </div>
              <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">启用状态:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].status == 1 ? '启用' : '停用' }}
                </span>
              </div>
              <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                <span class="text-[#999] text-[1.4em]">品种来源:</span>
                <span class="text-[#999] text-[1.4em]">
                  {{ list[currentIdx].categorySource ? list[currentIdx].categorySource : '无' }}
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
                :src="item.images"
                :alt="item.varietyName"
                fit="cover"
                class="!absolute top-0 left-0 w-full h-full"
              />
            </div>
            <div class="text-[8px] 2xl:text-[10px] px-[1.6em] mt-[1.6em]">
              <div>
                <span class="truncate text-[1.4em]">{{ item.varietyName }}</span>
              </div>
              <div class="mt-[0.8em]">
                <span class="truncate text-[1.4em]">{{ timeFormat(item.createTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页码组件 注意绑定的值和事件函数 -->
    <Pagination
      style="margin-bottom: 0; margin-top: 8px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-scrollbar>
  <!-- 表单弹窗：添加/修改 -->
  <VarietyManagementForm ref="formRef" @success="getList" />
</template>
<style lang="scss" scoped>
// 原页面样式复制在下面

// 原页面样式复制在上面

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
