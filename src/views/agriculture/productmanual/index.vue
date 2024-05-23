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
      <el-form-item label="方案名称" prop="schemeName">
        <el-input
          v-model="queryParams.schemeName"
          placeholder="请输入方案名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创作人" prop="marketingCreator">
        <el-input
          v-model="queryParams.marketingCreator"
          placeholder="请输入创作人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分类" prop="marketingCategory">
        <el-input
          v-model="queryParams.marketingCategory"
          placeholder="请输入分类"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="标签" prop="marketingTags">
        <el-input
          v-model="queryParams.marketingTags"
          placeholder="请输入标签"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="营销推广类型" prop="marketingType">
        <el-input
          v-model="queryParams.marketingType"
          placeholder="请输入营销推广类型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <!-- <el-form-item label="备用一" prop="reserveOne">
        <el-input
          v-model="queryParams.reserveOne"
          placeholder="请输入备用一"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用二" prop="reserveTwo">
        <el-input
          v-model="queryParams.reserveTwo"
          placeholder="请输入备用二"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="备用三" prop="reserveThree">
        <el-input
          v-model="queryParams.reserveThree"
          placeholder="请输入备用三"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
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
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:marketing-program:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['agriculture:marketing-program:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
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
      <el-table-column label="文件管理" align="center" prop="fileManagement" >
        <template #default="scope">
          <el-button type="primary" round v-if="scope.row.fileManagement">
            <a :href="scope.row.fileManagement" style="color:aliceblue; text-decoration: none;">点击下载</a>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="封面图片" align="center" prop="coverImage" >
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
      <el-table-column label="操作" align="center">
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
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MarketingProgramForm ref="formRef" @success="getList" />

   <!-- 文件预览 -->
  
   <el-dialog
    v-model="dialogVisible"
    title="预览"
    width="70vw"
    :before-close="handleDialogClose"
  >
    <el-scrollbar height="65vh" class="px-2">
      <div id="filePreview"></div>
    </el-scrollbar>
  </el-dialog>

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MarketingProgramApi, MarketingProgramVO } from '@/api/agriculture/marketingprogram'
import MarketingProgramForm from './MarketingProgramForm.vue'
//文件预览引入
import { renderAsync } from 'docx-preview'
import axios from 'axios'

/** 营销方案 列表 */
defineOptions({ name: 'MarketingProgram' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MarketingProgramVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
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
  marketingType: 'productmanual',
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中


//文件预览
let dialogVisible=ref(false)
let fileUrl=ref()
const filePreview=(url:any)=>{
  dialogVisible.value = true
  console.log("preview url", url);
  
  if (url.endsWith('docx')) renderDocx(url)
  else if (url.endsWith('pdf')) renderPDF(url)
  else renderError()
}

const renderError = () => {
  const _p = document.createElement("p")
  _p.innerHTML = '格式暂不支持！'
  setTimeout(() => {
    const _dom = document.getElementById("filePreview") as HTMLElement
    if (_dom) _dom.appendChild(_p)
  }, 200)
}

const handleDialogClose = () => {
  const _dom = document.getElementById("filePreview") as HTMLElement
  if (_dom) _dom.innerHTML = ''
  dialogVisible.value = false
}
// 渲染docx
const renderDocx = (url:string) => {
  if (!url.endsWith('docx')) return;
  axios.get(url, { responseType: 'blob' }).then(({ data }) => {
    const _dom = document.getElementById("filePreview") as HTMLElement
    renderAsync(data, _dom)
  })
}

const renderPDF = (url:string) => {
  const _iframe = document.createElement("iframe")
  _iframe.src = url
  _iframe.width = '100%'
  _iframe.height = '600px'
  setTimeout(() => {
    const _dom = document.getElementById("filePreview") as HTMLElement
    console.log("dom", _dom);
    
    if (_dom) _dom.appendChild(_iframe)
  }, 200)
}
//--------结束文件预览

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MarketingProgramApi.getMarketingProgramPage(queryParams)
    list.value = data.list
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
const router = useRouter() // 路由
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if(type=='create'){
    router.push('/pcg/marketingCenter/productManual/CreateMarketingProgram')
  }else {
    router.push('/pcg/marketingCenter/productManual/CreateMarketingProgram?type='+type+"&id="+id)
  }
  //formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MarketingProgramApi.deleteMarketingProgram(id)
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
    const data = await MarketingProgramApi.exportMarketingProgram(queryParams)
    download.excel(data, '营销方案.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>