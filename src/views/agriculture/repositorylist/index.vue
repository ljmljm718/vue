<script setup lang="ts">
import {ref, reactive} from 'vue'
import {Search, Plus, Sort, Edit, Delete} from '@element-plus/icons-vue'
import {RepositoryInfoApi} from '@/api/agriculture/repositoryinfo'
import {RepositoryTypeApi} from '@/api/agriculture/repositorytype'
import {getStrDictOptions, DICT_TYPE} from "@/utils/dict";
import RepositoryInfoForm from '../repositoryinfo/RepositoryInfoForm.vue'
import {useRouter} from 'vue-router'

const router = useRouter()
const typeListAll = ref([])
const getTypeList = async () => {
  const resAll = await RepositoryTypeApi.getAllRepositoryType()
  typeListAll.value = resAll
}
getTypeList()

const loading = ref(false)
const getRandomElementFromArray = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
const getDefaultImg = () => {
  const baseMap = [1, 2, 3, 4].map(item => `/images/repositoryList/img${item}.png`)
  return getRandomElementFromArray(baseMap)
}
const inputVal = ref('')

const repositoryList = ref<Array<any>>([])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  repositoryName: undefined,
  repositoryId: undefined,
  repositoryTitle: undefined,
  createTime: [],
  repositoryContent: undefined,
  attachmentFile: undefined,
  repositoryLabel: '',
  repositoryStatus: '',
  selectFlag: '1'
})

const resetQuery = () => {
  queryParams.pageNo = 1
  queryParams.pageSize = 10
  queryParams.repositoryName = undefined
  queryParams.repositoryId = undefined
  queryParams.repositoryTitle = undefined
  queryParams.createTime = []
  queryParams.repositoryContent = undefined
  queryParams.attachmentFile = undefined
  queryParams.repositoryLabel = ''
  queryParams.repositoryStatus = ''
  checkboxGroup1.value = []
  checkboxGroup2.value = []
  getRepositoryList()
}
const total = ref(0)
const getRepositoryList = async () => {
  loading.value = true
  const {
    list = [],
    total: _total = 0
  } = await RepositoryInfoApi.getRepositoryInfoPage({...queryParams})
  loading.value = false

  repositoryList.value = list.map(item => ({
    ...item,
    img: item.attachmentFile,
    title: item.repositoryTitle,
    intro: item.repositoryContent,
    label: item.repositoryLabel,
    repositoryId: getRep(item)
  }))
  total.value = _total
}
getRepositoryList()

const getRep = (item) => {
  getTypeList()
  let resStr = "";
  typeListAll.value.forEach((itm) => {
    if (item.repositoryId == itm.id) {
      resStr = itm.repositoryName
    }
  })
  return resStr
}

const checkboxGroup1 = ref([])
const options1 = ['知识分类', '故障诊断', '维修保养', '故障识别']
const checkboxGroup2 = ref([])
const options2 = ['机床', '数字生产', '车间管理', '安全操作']

/** 添加/修改操作 */
const repositoryRef = ref()
const openForm = (type: string, id?: number) => {
  repositoryRef.value.open(type, id)
}

/** 删除按钮操作 */
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RepositoryInfoApi.deleteRepositoryInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getRepositoryList()
  } catch {
  }
}

const handleCheckBoxChange1 = (item) => {
  if (Array.isArray(item) && item.length === 0) {
    queryParams.repositoryId = undefined
    getRepositoryList()
  }
  const _item = typeListAll.value.find((ele: any) => {
    return ele.repositoryName === item[0]
  }) as any

  queryParams.repositoryId = _item.id as any
  getRepositoryList()
}

const handleCheckBoxChange2 = (item) => {
  if (Array.isArray(item) && item.length === 0) {
    queryParams.repositoryLabel = ''
    getRepositoryList()
  }
  const _item = getStrDictOptions(DICT_TYPE.MACHINE_REPOSITORY_TALLY).find(ele => {
    return ele.label === item[0]
  }) as any

  queryParams.repositoryLabel = _item.value as any
  getRepositoryList()
}

const radioVal = ref('时间正序')
const handleRadioChange = (item) => {
  if (item === '时间正序') {
    queryParams.selectFlag = '1'
    getRepositoryList()
  } else {
    queryParams.selectFlag = '0'
    getRepositoryList()
  }
}
</script>
<template>
  <div>
    <el-card>
      <div class="flex justify-between">
        <el-input
          placeholder="请输入标题"
          v-model="queryParams.repositoryTitle"
          style="width: 25rem;"
          @keyup.enter="getRepositoryList"
        >
          <template #append>
            <el-button :icon="Search" @click="getRepositoryList"/>
          </template>
        </el-input>
        <div class="flex space-x-2">
          <el-button type="primary" :icon="Plus" @click="openForm('create')">新增</el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px"/>
            重置
          </el-button>
          <el-radio-group v-model="radioVal" @change="handleRadioChange">
            <el-radio-button label="时间正序" value="时间正序"/>
            <el-radio-button label="时间倒序" value="时间倒序"/>
          </el-radio-group>
          <el-button-group style="display: none;">
            <el-button type="primary" :icon="Sort">按匹配度</el-button>
            <el-button type="primary" :icon="Sort">按时间</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="flex flex-col py-2 space-y-2">
        <div class="flex items-center">
          <div class="px-2">分类:</div>
          <el-checkbox-group
            v-model="checkboxGroup1"
            @change="handleCheckBoxChange1"
            :min="0"
            :max="1"
          >
            <el-checkbox-button
              v-for="item in typeListAll"
              :label="item.repositoryName"
              :value="item.id"
              :key="item.id"
            />
          </el-checkbox-group>
        </div>
        <div class="flex items-center">
          <div class="px-2">标签:</div>
          <el-checkbox-group
            v-model="checkboxGroup2"
            @change="handleCheckBoxChange2"
            :min="0"
            :max="1"
          >
            <el-checkbox-button
              v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_REPOSITORYINFO_LABEL)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-checkbox-group>
        </div>
      </div>
    </el-card>
    <el-card class="mt-4" v-loading="loading">
      <div class="grid gap-3 lg:grid-cols-1 xl:grid-cols-2">
        <div
          class="flex rounded-lg overflow-hidden p-2 items-start"
          v-for="item, index in repositoryList"
          :key="index"
          style="border: 1px solid #838383;"
          @click="router.push(`/pcg/repositoryInfoDetail?id=${item.id}`)"
        >
          <div class="w-[16rem] aspect-video relative">
            <div class="absolute top-8 left-4 art-font" style="color:white;">{{ item.title }}</div>
            <img :src="item.img ? item.img : getDefaultImg()" alt=""
                 style="width: 100%;height:100%;object-fit: cover;"/>
          </div>
          <div style="width: calc(100% - 16rem);" class="px-4 pr-2 flex flex-col space-y-2">
            <div class="flex justify-between">
              <span class="art-font">{{ item.title }}</span>
              <div class="flex space-x-2" @click="(e) => e.stopPropagation()">
                <el-button type="primary" :icon="Edit" size="small" circle
                           @click="openForm('update', item.id)"/>
                <el-button type="danger" :icon="Delete" size="small" circle
                           @click="handleDelete(item.id)"/>
              </div>
            </div>
            <div class="line-clamp-2 flex">
              <span>简介:</span>
              <el-popover
                placement="bottom-start"
                title=""
                :width="800"
                trigger="hover"
              >
                <template #reference>
                  <span class="pl-2">{{ item.intro.replace(/<[^>]+>/g, "") }}</span>
                </template>
                <div v-html="item.intro" class="h-[14rem] overflow-auto p-4"></div>
              </el-popover>

            </div>
            <div class="flex space-x-3">
              <span>标签:</span>
              <div
                v-for="ele in item.label"
                :key="ele"
              >
                <dict-tag :type="DICT_TYPE.AGRI_REPOSITORYINFO_LABEL" :value="ele" />
              </div>
            </div>
            <div class="flex space-x-5">
              <div>
                <span>分类:</span>
                <span class="pl-3">{{ item.repositoryId }}</span>
              </div>
              <div>
                <span>浏览量:</span>
                <span class="pl-3" style="color: #409eff;">{{ item.browseNum }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-show="repositoryList.length === 0"
          class="w-full flex flex-col py-5 items-center col-span-2"
        >
<!--          <img src="/nodata.png" alt="" class="w-[6rem]"/>-->
          暂无数据
        </div>
      </div>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getRepositoryList"
      />
    </el-card>
    <!-- 表单弹窗：添加/修改 -->
    <RepositoryInfoForm
      ref="repositoryRef"
      @success="getRepositoryList"
    />
  </div>
</template>
<style lang="scss" scoped>
</style>
