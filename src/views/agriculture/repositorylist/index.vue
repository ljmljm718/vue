<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Plus, Sort, Edit, Delete } from '@element-plus/icons-vue'
import { RepositoryInfoApi } from '@/api/agriculture/repositoryinfo'
import { RepositoryTypeApi } from '@/api/agriculture/repositorytype'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import RepositoryInfoForm from '../repositoryinfo/RepositoryInfoForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const typeListAll = ref<any[]>([])
const getTypeList = async () => {
  const resAll = await RepositoryTypeApi.getAllRepositoryType()
  if (Array.isArray(resAll)) typeListAll.value = resAll
  getRepositoryList()
}
getTypeList()

const loading = ref(false)
const getRandomElementFromArray = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}
const getDefaultImg = () => {
  const baseMap = [1, 2, 3, 4].map((item) => `/images/repositoryList/img${item}.png`)
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

  selectedLabel.value = ''
  selectedType.value = ''
  getRepositoryList()
}
const total = ref(0)
const getRepositoryList = async () => {
  loading.value = true
  const { list = [], total: _total = 0 } = await RepositoryInfoApi.getRepositoryInfoPage({
    ...queryParams
  })
  loading.value = false

  repositoryList.value = list.map((item) => ({
    ...item,
    img: item.attachmentImg,
    title: item.repositoryTitle,
    intro: item.repositoryContent,
    label: item.repositoryLabel,
    repositoryId: getRep(item)
  }))
  total.value = _total
}


const getRep = (item) => {
  let resStr = ''
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
const { t } = useI18n() // 国际化
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RepositoryInfoApi.deleteRepositoryInfo(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getRepositoryList()
  } catch {}
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
  console.log('item', item)

  if (Array.isArray(item) && item.length === 0) {
    queryParams.repositoryLabel = ''
    getRepositoryList()
  }
  const _item = getStrDictOptions(DICT_TYPE.AGRI_REPOSITORYINFO_LABEL).find((ele) => {
    return ele.label === item[0]
  }) as any

  if(_item.label=='全部'){
    queryParams.repositoryLabel = ''
    getRepositoryList()
    return
  }
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

const selectedType = ref<string>('')
const handleTypeClick = (item) => {
  selectedType.value = item.repositoryName
  // TODO: 组装参数，发送请求
  handleCheckBoxChange1([selectedType.value])
}

const selectedLabel = ref<string>('')
const handleLabelClick = (item) => {
  selectedLabel.value = item.label
  // TODO: 组装参数，发送请求
  if (selectedLabel.value) handleCheckBoxChange2([selectedLabel.value])
}
</script>
<template>
  <div>
    <el-card class="flex justify-center items-center mb-3">
      <div class="flex justify-center items-center h-8 space-x-2">
        <img src="./repository.png" alt="repository" width="50px" height="23px" class="mt-1 mr-2" />
        <el-input
          placeholder="请输入标题搜索"
          prefix-icon="Search"
          v-model="queryParams.repositoryTitle"
          @keyup.enter="getRepositoryList()"
          style="width: 300px"
        />
        <el-button @click="getRepositoryList()" style="color: val" type="primary">搜索 </el-button>
      </div>
    </el-card>
    <el-card class="mb-2">
      <div>
        <div class="flex items-center mb-2">
          <div class="px-2" style="font-size: 14px; padding-top: 1px;">分类:</div>
          <div class="flex space-x-1 items-center">
            <div
              v-for="item in typeListAll"
              :key="item.id"
              :class="[selectedType !== item.repositoryName ? 'sub-btn' : 'sub-btn-selected']"
              @click="handleTypeClick(item)"

              >{{ item.repositoryName }}</div
            >
          </div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div class="flex justify-content">
            <span class="px-2" style="font-size: 14px; padding-top: 3px;">标签:</span>
            <div class="flex space-x-1 items-center">
              <div
                v-for="item in getStrDictOptions(DICT_TYPE.AGRI_REPOSITORYINFO_LABEL)"
                :key="item.value"
                :class="[selectedLabel !== item.label ? 'sub-btn' : 'sub-btn-selected']"
                @click="handleLabelClick(item)"
                >{{ item.label }}</div
              >
            </div>
          </div>
          <div>
            <el-button @click="resetQuery()" class="flex-end"> 重置 </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <el-button type="primary" :icon="Plus" @click="openForm('create')">新增</el-button>
        <el-radio-group v-model="radioVal" @change="handleRadioChange">
          <el-radio-button label="时间正序" value="时间正序" />
          <el-radio-button label="时间倒序" value="时间倒序" />
        </el-radio-group>
      </div>
    </el-card>
    <el-card v-loading="loading">
      <div class="grid gap-3 lg:grid-cols-1 xl:grid-cols-1">
        <div
          class="flex rounded-lg overflow-hidden p-2 items-start"
          v-for="(item, index) in repositoryList"
          :key="index"
          style="border-width: 0 0 1px 0; border-style: dashed; border-color: #cccccc"
          @click="router.push(`/farm_work/knowledge/repositoryInfoDetail?id=${item.id}`)"
        >
          <div class="w-[16rem] aspect-video relative">
            <div class="title"> {{ item.title }}</div>
            <!-- <div class="absolute top-8 left-4 art-font" style="color: white">{{ item.title }}</div> -->
            <img
              :src="item.img ? item.img : getDefaultImg()"
              alt=""
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </div>
          <div style="width: calc(100% - 16rem)" class="px-4 pr-2 flex flex-col space-y-2 mt-4">
            <div class="flex justify-between">
              <!-- <span class="art-font">{{ item.title }}</span> -->
              <div class="flex space-x-2" @click="(e) => e.stopPropagation()" style="display: none">
                <el-button
                  type="primary"
                  :icon="Edit"
                  size="small"
                  circle
                  @click="openForm('update', item.id)"
                />
                <el-button
                  type="danger"
                  :icon="Delete"
                  size="small"
                  circle
                  @click="handleDelete(item.id)"
                />
              </div>
            </div>
            <div class="line-clamp-3 flex" style="margin-bottom: 45px">
              <!-- <span>简介:</span> -->
              <el-popover placement="bottom-start" title="" :width="800" trigger="hover">
                <template #reference>
                  <span class="pl-3 mt-20" style="font-size: 14px; color: #666666">{{
                    item.intro.replace(/<[^>]+>/g, '')
                  }}</span>
                </template>
                <div v-html="item.intro" class="h-[14rem] overflow-auto p-4"></div>
              </el-popover>
            </div>
            <div class="flex justify-between">
              <div class="flex space-x-3 items-center">
                <!-- <span>标签:</span> -->
                <div v-for="ele in item.label" :key="ele">
                  <dict-tag
                    :type="DICT_TYPE.AGRI_REPOSITORYINFO_LABEL"
                    :value="ele"
                    style="
                      width: 100px;
                      height: 30px;
                      border-radius: 4px;
                      opacity: 1;
                      font-family: AlibabaPuHuiTi;
                      font-size: 14px;
                      font-weight: normal;
                      line-height: normal;
                      letter-spacing: 0px;

                      color: #009688;
                      background: #e5f4f3;
                    "
                  />
                </div>

                <span class="tag1">{{ item.repositoryId }}</span>
              </div>
              <div class="flex justify-center items-center">
                <el-icon class="pr-1" style="color: #999999"><View /></el-icon>
                <span style="font-size: 14px; color: #999999">浏览量:</span>
                <span class="pl-1" style="font-size: 14px; color: #999999">{{
                  item.browseNum
                }}</span>
              </div>
            </div>
          </div>
          <!-- </div> -->
        </div>
        <div
          v-show="repositoryList.length === 0"
          class="w-full flex flex-col py-5 items-center col-span-2"
        >
          <!--          <img src="/nodata.png" alt="" class="w-[6rem]"/>-->
          暂无数据
        </div>
      </div>
      <!-- <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getRepositoryList"
      /> -->
    </el-card>
    <!-- 表单弹窗：添加/修改 -->
    <RepositoryInfoForm ref="repositoryRef" @success="getRepositoryList()" />
  </div>
</template>
<style lang="scss" scoped>
.el-checkbox-button {
  display: inline;
  width: 3.13%;
  height: 2.78%;
  border-radius: 4px;
  opacity: 1;

  background: #f5f5f5;
}
.title {
  //   position: absolute;
  // left: 0px;
  // top: 0px;
  width: 738px;
  height: 22px;
  opacity: 1;
  margin-top: 0;
  margin-bottom: 5px;
  font-family: AlibabaPuHuiTi;
  font-size: 18px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;

  color: #333333;
}
.tag {
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;
}
.tag1 {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center;
  width: 100px;
  height: 30px;
  border-radius: 4px;
  opacity: 1;
  font-family: AlibabaPuHuiTi;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0px;
  padding-left: 7px;
  padding-right: 7px;
  color: #009688;
  background: #e5f4f3;
}

.sub-btn,
.sub-btn-selected {
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;

  opacity: 1;
  border-style: none;
  font-size: 14px;
  padding-left: 13px;
  padding-right: 13px;
  padding-top: 3px;
  padding-bottom: 3px;

}

.sub-btn {
  color: #666666;
  background: #F5F5F5;
}

.sub-btn-selected {
  background: #E5F4F3;
  color: #009688;
}
</style>
