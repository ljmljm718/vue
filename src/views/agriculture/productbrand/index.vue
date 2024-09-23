<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="品牌名" prop="productBrand">
        <el-input
          v-model="queryParams.productBrand"
          placeholder="请输入品牌名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>


      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex justify-between p-2.5">
      <div>
         <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:product-brand:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:product-brand:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </div>
      <div class="w-37 flex  rounded-md cursor-pointer select-none">
        <div
          :class= "[selectType === 'card' ? 'tab-btn-select' : 'tab-btn']"
          @click="selectType = 'card'"
          style="border-radius: 5px 0px 0px 5px; ">
          <el-icon> <Menu /></el-icon>
          <div class="pl-1 text-[13px]">卡片</div>
        </div>
        <div
          :class="[selectType === 'list' ? 'tab-btn-select' : 'tab-btn']"
          @click="selectType = 'list'"
          style="border-radius: 0px 5px 5px 0px; ">
          <el-icon> <List /></el-icon>
          <div class="pl-1 text-[13px]">列表</div>
        </div>
      </div>
    </div>
    <el-table v-if="selectType === 'list'" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" class="pt-4">
      <el-table-column label="品牌名" align="center" prop="productBrand" />
      <el-table-column label="品类" align="center" prop="belongCategory" width="120"/>
      <el-table-column label="品种" align="center" prop="belongVariety" width="120"/>
      <el-table-column label="品牌logo" align="center" prop="brandLogo">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            :src="row.brandLogo"
            :preview-src-list="[row.brandLogo]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="品牌介绍" align="center" prop="brandDetail" />
      <el-table-column label="使用状态" align="center" prop="usedStatus" width="120">
        <template #default="scope">
          <el-switch v-model="scope.row.usedStatus" :active-value="0" :inactive-value="1"
                     @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
<!--      <el-table-column label="备注" align="center" prop="remark" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:product-brand:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:product-brand:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="selectType === 'card' && list.length<1" class="flex w-full justify-center items-center text-[13px] pt-2"> 暂无数据</div>
    <div v-if="selectType === 'card'"  class="mt-3 mb-3 grid grid-cols-3 gap-3 changecols">
      <div v-for="item in list" :key="item.id" class="bg-[#f5f5f5] p-2">
        <div class="flex justify-between h-[150px] p-2" >
          <div class="p-2 w-full">
            <img
            :src = "item.brandLogo"
            class=" w-full h-full object-contain"
             />
          </div>
          <div class = "p-2 w-full">
            <div class="text-18px p-1.5">{{ item.productBrand}}</div>
            <div class="text-14px p-1.5"> {{ item.belongCategory }}</div>
            <div class="pt-4">
              <span class="text-14px p-1.5">{{item.usedStatus === 0 ?'已启用':'已禁用'}}</span>
              <el-switch
                v-model="item.usedStatus"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange1(item)" /> <!--这个地方改一下-->
            </div>
            <div style="display: flex; margin-left: auto; justify-content: flex-end;" class="p-2 pb-3">
              <el-button
                type="primary"
                @click="openForm('update', item.id)"
                v-hasPermi="['agriculture:product-brand:update']"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                @click="handleDelete(item.id)"
                v-hasPermi="['agriculture:product-brand:delete']"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProductBrandForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductBrandApi, ProductBrandVO } from '@/api/agriculture/productbrand'
import ProductBrandForm from './ProductBrandForm.vue'
import { CommonStatusEnum } from "@/utils/constants";
import {allDataCacheManager, VarietyManagementVO} from "@/api/agriculture/varietymanagement";
import {CategoryManagementApi, CategoryManagementVO} from "@/api/agriculture/categorymanagement";

/** 产品品牌 列表 */
defineOptions({ name: 'ProductBrand' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const selectType = ref('card') //列表卡片切换
const loading = ref(true) // 列表的加载中
const list = ref<ProductBrandVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productBrand: undefined,
  belongCategoryId: undefined,
  belongCategory: undefined,
  belongVarietyId: undefined,
  belongVariety: undefined,
  brandLogo: undefined,
  brandDetail: undefined,
  usedStatus: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const listVarietyManagement = ref<VarietyManagementVO[]>([]) // 品种列表的数据
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据
const getTypeData = async () => {
  const res = await allDataCacheManager.getData({})
  if (Array.isArray(res)) listVarietyManagement.value = res
  const res1 = await CategoryManagementApi.getAllCategoryManagement({})
  if (Array.isArray(res1)) listCategoryManagement.value = res1
}

/** 查询列表 */

const getList = async () => {
  loading.value = true
  try {
    const data = await ProductBrandApi.getProductBrandPage(queryParams)
    list.value = data.list.map(item => {
      const element = listVarietyManagement.value.find(ele => (ele.id === item.belongVarietyId))
      if (!element) return item;
      return {
        ...item,
        belongVariety: element.varietyName,
        belongCategory: element.categoryName
      }
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}


/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: any) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: any) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProductBrandApi.deleteProductBrand(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ProductBrandApi.exportProductBrand(queryParams)
    download.excel(data, '产品品牌.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 修改使用状态 */
const handleStatusChange = async (row: ProductBrandApi.ProductBrandVO) => {
  try {
    // 修改状态的二次确认
    const text = row.usedStatus === CommonStatusEnum.ENABLE ? '启用' : '禁用'
    await message.confirm('确认要' + text + '当前产品品牌吗?')
    // 发起修改状态
    await ProductBrandApi.updateProductBrandStatus(row.id, row.usedStatus)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.usedStatus =
      row.usedStatus === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}

const init = async () => {
  await getTypeData()
  await getList()
}
const handleStatusChange1 = async (item) => {
  try {
    // 修改状态的二次确认
    const text = item.usedStatus === CommonStatusEnum.ENABLE ? '启用' : '禁用'
    await message.confirm('确认要' + text + '当前产品品牌吗?')
    // 发起修改状态
    await ProductBrandApi.updateProductBrandStatus(item.id, item.usedStatus)
    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    item.usedStatus =
    item.usedStatus === CommonStatusEnum.ENABLE ? CommonStatusEnum.DISABLE : CommonStatusEnum.ENABLE
  }
}
/** 初始化 **/
onMounted(() => {
  init()
})
</script>
<style scoped lang="scss">
.tab-btn-select,
.tab-btn{
  display : flex;
  align-content: center;
  justify-content: center;
  flex-direction: row;
  width: 6rem;
  height: 1.5rem;
  align-items: center;
}
.tab-btn{
  border: 1px solid #e6e6e6;
  color: #666666;
  background-color: #FFFFFF;
}
.tab-btn-select{
  border: 1px solid var(--el-color-primary);
  background-color: #e5f4f3;
  color: var(--el-color-primary);
}
@for $i from 1 through 10 {
  @media screen and (min-width: calc(400px + calc(#{$i} * 300px))) {
    .changecols {
      grid-template-columns: repeat(#{$i}, 1fr);
    }
  }
}
</style>
