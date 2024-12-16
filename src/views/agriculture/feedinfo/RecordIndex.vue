<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { colorOpt } from '@/config/colorTheme/colorConfig';
import { setCssVar } from '@/utils';

/* todo原页面的js代码复制在下面 */
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime';
import download from '@/utils/download';
import { FeedInfoApi, FeedInfoVO } from '@/api/agriculture/feedinfo';
import FeedInfoFormRecord from './FeedInfoFormRecord.vue';
import { FarmDefineApi } from '@/api/agriculture/farmdefine';

/** 投喂记录 列表 */
defineOptions({ name: 'FeedInfo' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref<FeedInfoVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  crabNum: undefined,
  feedType: undefined,
  feedNum: undefined,
  feedOne: undefined,
  feedTime: [],
  farmingStage: undefined,
  createTime: [],
  standard: undefined
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中
let farmDefineOptions = ref([]); // 设备分类选项
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await FeedInfoApi.getFeedInfoPage(queryParams);
    //把品类数据的name拼接到列表中
    data.list.forEach((item) => {
      item.farmingStage = item.farmingStage ? parseInt(item.farmingStage) : '';
      farmDefineOptions.value.forEach((itm) => {
        if (item.farmingStage == itm.id) item.farmingStage = itm.defineName;
      });
    });
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
    await FeedInfoApi.deleteFeedInfo(id);
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
    const data = await FeedInfoApi.exportFeedInfo(queryParams);
    download.excel(data, '投喂记录.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

/** 初始化 **/
onMounted(async () => {
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({ parentId: 0, status: 1 });
  await getList();
});
onActivated(async () => {
  await getList();
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
        <!-- 一级标题名字 todo替换成菜单名称-->
        <h1 class="m-0 text-[#333] font-bold text-[18px]">投入品消耗记录</h1>
        <Icon icon="ep:question-filled" :size="14" class="ml-[8px] cursor-pointer text-[#F08000]" />
        <div class="w-[1px] h-[32px] mx-[16px] bg-[#ebebeb]"></div>
        <!-- 一级标题旁边的按钮 -->
        <!-- todo原新增按钮 -->
        <!-- todo需要包含type="primary"&&不能有plain属性 -->
        <!-- 原页面也是注释状态 -->
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          @click="openForm('create')"-->
        <!--          v-hasPermi="['agriculture:feed-info:create']"-->
        <!--        >-->
        <!--          <Icon icon="ep:plus" class="mr-5px"/>-->
        <!--          新增-->
        <!--        </el-button>-->
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
          v-hasPermi="['agriculture:feed-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" />
          导出
        </el-button>
        <button
          class="circle-arrow-up ml-[16px]"
          :class="showSearch ? 'rotate180andthemeBg' : 'rotate180andwhiteBg'"
          @click="handleClickShowSearch"
        >
          <Icon :size="14" icon="ep:arrow-up" />
        </button>
      </div>
    </div>

    <!-- 搜索栏 注意 :model 和 ref 的名称 -->
    <el-form
      :model="queryParams"
      ref="queryFormRef"
      class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[8px] mt-[8px] w-full overflow-hidden form"
      :class="showSearch ? 'opacity-100' : 'h-0 opacity-0'"
      label-width="95px"
      :inline="true"
    >
      <!-- 原来的表单里的内容复制过来 不要操作按钮 -->
      <!-- todo复制原来的搜索列表 -->
      <!-- todo 所有的都需要删除class=“!w-240” 这一类的属性 -->
      <!--      <el-form-item label="所属基地" prop="belongPark">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.belongPark"-->
      <!--          placeholder="请输入所属基地"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="基地名称" prop="parkName">
        <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="所属地块" prop="belongPlot">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.belongPlot"-->
      <!--          placeholder="请输入所属地块"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="plotName">
        <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="农事阶段" prop="farmingStage">
        <!--            <el-input v-model="formData.farmDefineType" placeholder="请输入农事阶段" />-->
        <el-select v-model="queryParams.farmingStage" placeholder="请选择农事阶段">
          <el-option
            v-for="dict in farmDefineOptions"
            :key="dict.id"
            :label="dict.defineName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="螃蟹数量" prop="crabNum">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.crabNum"-->
      <!--          placeholder="请输入螃蟹数量"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="饲料种类" prop="feedType">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.feedType"-->
      <!--          placeholder="请选择饲料种类"-->
      <!--          clearable-->
      <!--          -->
      <!--        >-->
      <!--          <el-option label="请选择字典生成" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="投喂数量" prop="feedNum">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.feedNum"-->
      <!--          placeholder="请输入投喂数量"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="备用字段" prop="feedOne">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.feedOne"-->
      <!--          placeholder="请输入备用字段"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="操作时间" prop="feedTime">
        <el-date-picker
          v-model="queryParams.feedTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
        />
      </el-form-item>
      <!--      <el-form-item label="创建时间" prop="createTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.createTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          -->
      <!--        />-->
      <!--      </el-form-item>-->
    </el-form>

    <div class="w-full mt-[8px]">
      <!-- 原来的表格复制过来 操作按钮按照 el-table操作按钮.md 里的例子 -->
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <!-- todo复制列表 -->
        <!--      <el-table-column label="ID" align="center" prop="id"/>-->
        <!--      <el-table-column label="所属基地" align="center" prop="belongPark"/>-->
        <el-table-column label="基地名称" align="center" prop="parkName" />
        <!--      <el-table-column label="所属地块" align="center" prop="belongPlot"/>-->
        <el-table-column label="地块名称" align="center" prop="plotName" />
        <!--      <el-table-column label="螃蟹数量" align="center" prop="crabNum"/>-->
        <el-table-column label="农事阶段" align="center" prop="farmingStage" width="120">
          <template #default="scope">
            <el-select v-model="scope.row.farmingStage" disabled>
              <el-option
                v-for="dict in farmDefineOptions"
                :key="dict.id"
                :label="dict.defineName"
                :value="dict.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="投入品名称" align="center" prop="productName" />
        <el-table-column label="投入品分类名称" align="center" prop="categoryName" width="120" />
        <el-table-column
          label="生产日期"
          align="center"
          prop="produceDate"
          :formatter="dateFormatter2"
          width="140"
        />
        <el-table-column
          label="有效日期"
          align="center"
          prop="effectiveTime"
          :formatter="dateFormatter2"
          width="140"
        />
        <el-table-column label="消耗量" align="center" prop="consumeNum" width="60" />
        <el-table-column label="消耗量单位" align="center" prop="consumeUnit" width="120" />
        <el-table-column label="规格" align="center" prop="standard" width="120" />
        <!-- <el-table-column label="投喂量" align="center" prop="feedNum" width="60"/>
      <el-table-column label="投喂量单位" align="center" prop="feedOne" width="120"/> -->
        <el-table-column
          label="操作时间"
          align="center"
          prop="feedTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="投入品费用/元" align="center" prop="feedCost" width="120" />
        <el-table-column label="操作人" align="center" prop="feedPerson" />
        <!--      <el-table-column-->
        <!--        label="创建时间"-->
        <!--        align="center"-->
        <!--        prop="createTime"-->
        <!--        :formatter="dateFormatter"-->
        <!--        width="180px"-->
        <!--      />-->
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
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['agriculture:feed-info:update']"
              >
                编辑
              </el-button>
              <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['agriculture:feed-info:delete']"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
  <FeedInfoFormRecord ref="formRef" @success="getList" />
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
