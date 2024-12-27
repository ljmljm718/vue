<template>
  <!-- demo8.1.3 删掉ContentWrap 页面内容用下面的el-card包裹 -->
  <el-card body-style="padding: 16px; display: flex; flex-direction: column;" shadow="never">
    <!-- demo8.1.3 新增标题行部分 所有操作按钮移动到这一行 -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-[16px]">
        <h1 class="m-0 text-[18px] pr-[16px]" style="border-right: 1px solid #e6e6e6">
          溯源模板管理
        </h1>
        <el-button
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['agriculture:trace-template:create']"
        >
          <Icon icon="ep:plus" />
          <span>新增</span>
        </el-button>
      </div>
      <div class="flex items-center space-x-[8px]">
        <!-- demo8.1.3 注意 @click 函数 -->
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" />
          <span>搜索</span>
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />
          <span>重置</span>
        </el-button>
        <!-- demo8.1.3 按钮要注意 v-hasPermi -->
        <el-button
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:trace-template:export']"
        >
          <Icon icon="ep:download" />
          <span>导出</span>
        </el-button>
        <!--
          demo8.1.3 卡片列表切换按钮 注意 @click 和 :class 的条件 替换成自己的判断逻辑
          上面的是显示列表的逻辑 下面的是显示卡片的逻辑
          在最下面 style 标签里复制 tab-active 类
        -->
        <div class="flex">
          <el-button
            @click="showType = 'list'"
            class="!rounded-r-none"
            :class="`${showType === 'list' && 'tab-active'}`"
          >
            <Icon icon="ep:list" />
            <span>列表</span>
          </el-button>
          <el-button
            @click="showType = 'card'"
            class="!ml-0 !rounded-l-none"
            :class="`${showType === 'card' && 'tab-active'}`"
          >
            <Icon icon="ep:menu" />
            <span>卡片</span>
          </el-button>
        </div>
        <!-- demo8.1.3 script标签内新增 const showSearch = ref(true); -->
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
    <!-- demo8.1.3 搜索栏将 custom-form 改成 el-form 注意 :model 和 ref -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-[8px] mt-[16px] form overflow-hidden"
      :style="`${!showSearch && 'height: 0'}`"
      label-width="95px"
      :inline="true"
    >
      <!-- demo8.1.3 所有输入删掉 !w-220px 和 !w-240px 等定宽的class -->
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入模板名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产商" prop="mfrsId">
        <el-select v-model="queryParams.mfrsId" placeholder="请选择生产商" clearable>
          <el-option
            v-for="item in producerEntryList"
            :key="item.id"
            :label="item.companyName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="适用品牌" prop="brandName">
        <el-input
          v-model="queryParams.brandName"
          placeholder="请输入适用品牌"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
    </el-form>
    <!-- demo8.1.3 删除原功能按钮和卡片列表切换按钮的代码 移至标题行 -->
    <!-- demo8.1.3 新增mt-[16px] -->
    <div v-if="showType === 'list'" class="mt-[16px]">
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="模板名称" align="center" prop="templateName" />
        <el-table-column label="生产商" align="center" prop="companyName" />
        <el-table-column label="产地" align="center" prop="origin" />
        <el-table-column label="适用品牌" align="center" prop="brandName" />
        <el-table-column label="头部宣传图" align="center" prop="headerImg">
          <template #default="{ row }">
            <el-image
              class="h-50px w-50px"
              :src="row.headerImg"
              :preview-src-list="[row.headerImg]"
              preview-teleported
              fit="cover"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="二维码" align="center" prop="qrImg" width="100px">
          <template #default="scope">
            <el-image
              :src="scope.row.img"
              style="object-fit: cover; width: 2rem; height: 2rem"
              preview-teleported
              :preview-src-list="[scope.row.img]"
            />
          </template>
        </el-table-column> -->
        <!--      <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="备注1" align="center" prop="remark1" />-->
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="openForm('detail', scope.row.id)">
              详情
            </el-button>
            <el-button
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
              v-hasPermi="['agriculture:trace-template:update']"
            >
              编辑
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
              v-hasPermi="['agriculture:trace-template:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- demo8.1.3 class 新增 mt-[16px] -->
    <div v-else class="flex justify-center mt-[16px]">
      <!-- demo8.1.3 gap-[16px] -->
      <div
        class="grid gap-[16px] grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 container"
      >
        <!-- demo8.1.3 卡片样式修改 -->
        <div
          v-for="item in list"
          :key="item.id"
          class="rounded shadow-md shadow-[#000]/30 dark:bg-[#333] dark:shadow-[#000] overflow-hidden"
        >
          <!-- demo8.1.3 图片部分要改写 要求16:9 -->
          <div class="w-full pb-[56.25%] relative">
            <el-image
              v-if="item.headerImg"
              :src="item.headerImg"
              :alt="溯源模板图片"
              fit="cover"
              class="!absolute top-0 left-0 w-full h-full rounded"
              :preview-src-list="[item.headerImg]"
              preview-teleported
            />
            <div
              v-else
              class="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-#00000010"
            >
              暂无数据
            </div>
          </div>
          <!-- demo8.1.3 剩下内容 -->
          <div class="p-[16px]">
            <div class="font-bold">{{ item.templateName }}</div>
            <div class="flex justify-end items-center mt-[16px]">
              <el-button
                type="primary"
                @click="openForm('update', item.id)"
                v-hasPermi="['agriculture:trace-template:update']"
              >
                编辑
              </el-button>
              <el-button
                @click="handleDelete(item.id)"
                v-hasPermi="['agriculture:trace-template:delete']"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- demo8.1.3 页码样式调整 -->
    <Pagination
      style="align-self: end; margin-bottom: 0; margin-top: 16px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-card>

  <!-- 表单弹窗：添加/修改 -->
  <TraceTemplateForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { TraceTemplateApi, TraceTemplateVO } from '@/api/agriculture/tracetemplate';
import TraceTemplateForm from './TraceTemplateForm.vue';
import { ProducerEntryApi, ProducerEntryVO } from '@/api/agriculture/producerentry';
// import QRCode from 'qrcode'

/** 溯源模板 列表 */
defineOptions({ name: 'TraceTemplate' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const showSearch = ref(true);
const showType = ref<string>('card');
const loading = ref(true); // 列表的加载中
const list = ref<TraceTemplateVO[]>([]); // 列表的数据
const producerEntryList = ref<ProducerEntryVO[]>([]); // 生产商的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  templateName: undefined,
  mfrsId: undefined,
  origin: undefined,
  brandId: undefined,
  headerImg: undefined,
  productImg: undefined,
  remark: undefined,
  remark1: undefined,
  brandName: undefined,
  createTime: []
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询生产商列表 */
const getProducerEntryList = async () => {
  const data = await ProducerEntryApi.getProducerEntryAll({ approvalStatus: 1 });
  producerEntryList.value = data;
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await TraceTemplateApi.getTraceTemplatePage(queryParams);
    console.log('🚀 ~ getList ~ data:', data.list);
    list.value = data.list;
    total.value = data.total;
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
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await TraceTemplateApi.deleteTraceTemplate(id);
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
    const data = await TraceTemplateApi.exportTraceTemplate(queryParams);
    download.excel(data, '溯源模板.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(() => {
  getProducerEntryList();
  getList();
});
</script>
<style scoped lang="scss">
.tab-btn,
.tab-btn-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 1.5rem;
}

.tab-btn {
  border: 1px solid #e6e6e6;
  color: #666666;
}

.tab-btn-selected {
  border: 1px solid #009688;
  background-color: #e5f4f3;
  color: #009688;
}

.tab-active {
  color: white;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

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
</style>
