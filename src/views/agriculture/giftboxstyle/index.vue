<template>
  <el-scrollbar height="79vh" @scroll="scroll">
    <!-- 搜索栏 -->
    <ContentWrap>
      <custom-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        label-width="68px"
        :inline="true"
      >
        <!-- 表单内容 -->
        <el-form-item label="产品名称" prop="schemeName">
          <el-input
            class="!w-240px"
            v-model="queryParams.schemeName"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设计人" prop="marketingCreator">
          <el-input
            class="!w-240px"
            v-model="queryParams.marketingCreator"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="分类" prop="marketingCategory">
          <el-input
            class="!w-240px"
            v-model="queryParams.marketingCategory"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标签" prop="marketingTags">
          <el-input
            class="!w-240px"
            v-model="queryParams.marketingTags"
            placeholder="请输入"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="上传时间" prop="marketingUploadTime">
          <el-date-picker
            class="!w-220px"
            v-model="queryParams.marketingUploadTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          />
        </el-form-item>
        <!-- 表单按钮 -->
        <el-form-item>
          <el-button @click="handleQuery" type="primary">
            <Icon icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" />
            重置
          </el-button>
        </el-form-item>
      </custom-form>
    </ContentWrap>
    <!-- 数据列表 -->
    <ContentWrap>
      <!-- 第一行功能按钮 -->
      <div class="flex justify-between">
        <div class="flex flex-wrap content-center">
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['agriculture:marketing-program:create']"
          >
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['agriculture:marketing-program:export']"
          >
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </div>
        <div class="flex flex-wrap content-center">
          <el-radio-group v-model="listType" size="small" @change="handleCardChange">
            <el-radio-button label="card" value="card">
              <el-icon><Menu /></el-icon>
              卡片
            </el-radio-button>
            <el-radio-button label="list" value="list">
              <el-icon><List /></el-icon>
              列表
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 第二行列表数据 -->
      <div class="mt-[20px]">
        <!-- 卡片形式 -->
        <div
          v-if="list.length && currentItem && listType === 'card'"
          class="grid grid-cols-8 lg:grid-cols-3 2xl:grid-cols-2 gap-3 text-[12px] 2xl:text-[14px] text-[#999999]"
        >
          <!-- 预览区 -->
          <div
            :class="`col-span-7 lg:col-span-2 2xl:col-span-1 rounded-md ${themeIsDark ? 'bg-[#343A46]': 'bg-[#F5F5F5]'} shadow-md previewContainer`"
          >
            <div class="previewArea">
              <div class="relative">
                <el-image
                  :src="currentItem.coverImage"
                  :preview-src-list="[currentItem.coverImage]"
                  preview-teleported
                  fit="contain"
                  class="w-full h-[60vh]"
                />
                <div
                  v-show="currentItem.fileManagement"
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[210px] rounded text-center leading-[40px] hover:cursor-pointer"
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
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[160px] rounded text-center leading-[40px] hover:cursor-pointer"
                >
                  <el-icon color="#FFFFFF" size="16px"><View /></el-icon>
                </div>
                <div
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded text-center leading-[40px] hover:cursor-pointer"
                  @click="openDetailForm('view', currentItem.id)"
                  v-hasPermi="['agriculture:marketing-program:update']"
                >
                  <el-icon color="#FFFFFF" size="16px"><More /></el-icon>
                </div>
                <div
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded text-center leading-[40px] hover:cursor-pointer"
                  @click="openForm('update', currentItem.id)"
                  v-hasPermi="['agriculture:marketing-program:update']"
                >
                  <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
                </div>
                <div
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded text-center leading-[40px] hover:cursor-pointer"
                  @click="handleDelete(currentItem.id)"
                  v-hasPermi="['agriculture:marketing-program:delete']"
                >
                  <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-1 my-10px px-3">
                <div>
                  <span :class="`${themeIsDark ? 'text-[#fff]' : 'text-[#666666]'} text-[18px]`">{{ currentItem.schemeName }}</span>
                </div>
                <div>
                  <span class="text-[14px]">{{ currentItem.briefIntroduction }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 卡片列表区 -->
          <div class="col-span-1 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 rounded">
            <div
              :class="`${themeIsDark ? 'bg-[#343A46]' : 'bg-[#F5F5F5]'} cursor-pointer shadow-md rounded-md h-[33vh] overflow-hidden`"
              v-for="item in list"
              :key="item.id"
              @click="changCurrentItem(item)"
            >
              <el-image
                :src="item.coverImage"
                preview-teleported
                fit="contain"
                class="w-full h-[17vh] mt-[1vh]"
              />
              <div
                class="grid grid-cols-1 2xl:gap-1 2xl:mt-[10px] text-[4px] lg:text-[8px] xl:text-[10px] 2xl:text-[14px] ml-2px mb-2px px-3"
              >
                <div>
                  <span :class="`${themeIsDark ? 'text-[#fff]' : 'text-[#666666]'} text-[6px] lg:text-[10px] xl:text-[12px] 2xl:text-[16px]`">{{ item.schemeName }}</span>
                </div>
                <div class="h-[5vh] truncate">
                  {{ item.briefIntroduction }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="listType === 'card'" class="text-center tracking-widest">
          暂无数据
        </div>
        <!-- 列表形式 -->
        <div v-show="listType === 'list'">
          <el-table :data="list" v-loading="loading" :show-overflow-tooltip="true">
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
                  <a
                    :href="scope.row.fileManagement"
                    style="color: aliceblue; text-decoration: none"
                  >
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
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList()"
        />
      </div>
    </ContentWrap>
  </el-scrollbar>

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
  marketingType: 'giftboxstyle',
  reserveOne: undefined,
  reserveTwo: undefined,
  reserveThree: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

//文件预览
let dialogVisible = ref(false)
let fileUrl = ref()
const filePreview = (url: any) => {
  dialogVisible.value = true
  console.log('preview url', url)

  if (url.endsWith('docx')) renderDocx(url)
  else if (url.endsWith('pdf')) renderPDF(url)
  else renderError()
}

const renderError = () => {
  const _p = document.createElement('p')
  _p.innerHTML = '格式暂不支持！'
  setTimeout(() => {
    const _dom = document.getElementById('filePreview') as HTMLElement
    if (_dom) _dom.appendChild(_p)
  }, 200)
}

const handleDialogClose = () => {
  const _dom = document.getElementById('filePreview') as HTMLElement
  if (_dom) _dom.innerHTML = ''
  dialogVisible.value = false
}
// 渲染docx
const renderDocx = (url: string) => {
  if (!url.endsWith('docx')) return
  axios.get(url, { responseType: 'blob' }).then(({ data }) => {
    const _dom = document.getElementById('filePreview') as HTMLElement
    renderAsync(data, _dom)
  })
}

const renderPDF = (url: string) => {
  const _iframe = document.createElement('iframe')
  _iframe.src = url
  _iframe.width = '100%'
  _iframe.height = '600px'
  setTimeout(() => {
    const _dom = document.getElementById('filePreview') as HTMLElement
    console.log('dom', _dom)

    if (_dom) _dom.appendChild(_iframe)
  }, 200)
}
//--------结束文件预览

/** 查询列表 */
const getList = async () => {
  if (sessionStorage.getItem('latestListType')) {
    listType.value = sessionStorage.getItem('latestListType')
  }
  sessionStorage.removeItem('latestListType')
  loading.value = true
  try {
    const data = await MarketingProgramApi.getMarketingProgramPage(queryParams)
    list.value = data.list
    total.value = data.total
    if ("card" === listType.value) {
      currentItem.value = list.value[0]
    }
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

// 列表展示形式 card list
const listType = ref('card')

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
})

// 切换预览区展示项
const changCurrentItem = (item: any) => {
  currentItem.value = item
}

// listType切换list或card
const handleCardChange = () => {
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const router = useRouter() // 路由
const formRef = ref()
const openForm = (type: string, id?: number) => {
  sessionStorage.setItem("latestListType", listType.value)
  if (type == 'create') {
    router.push('/pcg/marketingCenter/giftBoxStyle/CreateOrUpdateMaketingPagram')
  } else {
    router.push(
      '/pcg/marketingCenter/giftBoxStyle/CreateOrUpdateMaketingPagram?type=' + type + '&id=' + id
    )
  }
}

/**
 * 详情按钮操作
 * @param type
 * @param id
 */
const openDetailForm = (type: string, id?: number) => {
  sessionStorage.setItem("latestListType", listType.value)
  router.push('/pcg/marketingCenter/giftBoxStyle/boxStyleDetail?type=' + type + '&id=' + id)
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
    download.excel(data, '礼盒样式.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()

  // 获取当前是否是深色主题
  themeIsDark.value = appStore.getIsDark
})

import { useAppStore } from '@/store/modules/app'
import { watch } from "vue"

const appStore = useAppStore()
const themeIsDark = ref(false)

// 监听主题模式变化
watch(() => appStore.isDark, (newVal, oldVal) => {
  console.log("isDark", newVal, oldVal)
  themeIsDark.value = newVal
})

// 时间戳转换成 YYYY-MM-DD HH:MM:SS
const timeFormat = (dataString: string) => {
  //dataString是整数，否则要parseInt转换
  var time = new Date(dataString)
  var year = time.getFullYear()
  var month = time.getMonth() + 1
  var day = time.getDate()
  var hour = time.getHours()
  var minute = time.getMinutes()
  var second = time.getSeconds()
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
  )
}

// 设置预览区始终显示在视口范围内
const scroll = ({ scrollTop }) => {
  let dom = document.querySelector('.previewArea')
  let domContainer = document.querySelector('.previewContainer')
  if (scrollTop >= dom?.offsetTop) {
    dom?.setAttribute('style', `position: fixed;width: ${domContainer?.clientWidth}px;top: 105px;`)
  } else {
    dom?.setAttribute('style', 'position: relative;width: auto;top: 0;')
  }
}
</script>

<style scoped lang="scss">
/* 消除element部分组件的部分样式 */
//.el-tabs__nav-wrap::after {
//  display: none;
//}
//.el-form-item {
//  margin-bottom: 0;
//}
//.el-form-item--small {
//  margin-bottom: 0;
//}
//.el-form--inline .el-form-item {
//  margin-right: 0;
//}
//.el-range-editor.el-input__wrapper {
//  padding: 0;
//}
//.el-button + .el-button {
//  margin-left: 10px;
//}
</style>

