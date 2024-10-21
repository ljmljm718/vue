<script setup lang="ts">
import { getNumberByLandBlockId } from './apis'
import { ParkInfoApi, ParkInfoVO } from '@/api/agriculture/parkinfo'

const defaultProps = { children: 'child', label: 'name' }
/** 搜索节点过滤 */
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}
const categoryTree = ref<ParkInfoVO[]>([]) // 列表的数据
const treeLoading = ref<boolean>(false)
/** 查询基地地块列表 */
const getCategoryList = async () => {
  treeLoading.value = true
  const data = await ParkInfoApi.getParkTree({}).catch(() => {
    treeLoading.value = false
  })
  console.log("🚀 ~ getCategoryList ~ data:", data)
  if (!Array.isArray(data)) return;
  categoryTree.value = data
}
getCategoryList()
const handleCurrentCategoryChange = (currNodeData) => {
  console.log("🚀 ~ handleCurrentCategoryChange ~ currNodeData:", currNodeData)
  if (currNodeData.child) {
    // 这是基地
  } else {
    // 这是地块
  }
}

const topDataList = ref<any[]>([])
const getTopDataList = async (landBlockId:string) => {
  const res = await getNumberByLandBlockId({ landBlockId })
  console.log("🚀 ~ getTopDataList ~ res:", res)
  if (!Array.isArray(res)) return;
  const tempArr = [];
  res.forEach(item => {
    const { sum = 0, number = 0, category } = item;
    tempArr.push({ title: category + '总数', value: sum });
    tempArr.push({ title: category + '种类', value: number });
  })
  topDataList.value = tempArr;
  console.log("🚀 ~ getTopDataList ~ tempArr:", tempArr)
}
getTopDataList('1838062866524188672')

// 今日抓拍
const snapShotDevice = ref<string>('');
const snapShotTime = ref<string>('');
const snapShotDeviceOptions = ref<any[]>([])
const getSnapShotDeviceOptions = async () => {

}
getSnapShotDeviceOptions()

// 抓拍图片列表
const snapPictureList = ref<any[]>([1,2,3,4]);
const getSnapPictureList = async () => {}
getSnapPictureList()

// 预警信息列表
const preWarnList = ref<any[]>([])
const getPreWarnList = async () => {
  preWarnList.value = [
    { id: '1', title: 'A0001虫情测报仪监测到楿飞型数量(72)超过预警线', time: '2024.10.12 12:11:12' },
    { id: '2', title: 'A0001虫情测报仪监测到楿飞型数量(72)超过预警线', time: '2024.10.12 12:11:12' },
    { id: '3', title: 'A0001虫情测报仪监测到楿飞型数量(72)超过预警线', time: '2024.10.12 12:11:12' },
    { id: '4', title: 'A0001虫情测报仪监测到楿飞型数量(72)超过预警线', time: '2024.10.12 12:11:12' },
  ]
}
getPreWarnList()

// 病虫害排行日月年
const bugTime = ref<string>('当日')
const bugTimeRange = ref<any[]>([])

// 病害趋势分析
const sickTraceRadio = ref<string>('按天')
const sickTraceTimeRange = ref<any[]>([]);

// 虫害趋势分析
const bugTraceRadio = ref<string>('按天')
const bugTraceTimeRange = ref<any[]>([]);

const 虫害排行列表 = ref<any[]>([
  { id: '1', title: '一个BUG', value: 10 },
  { id: '11', title: '一个BUG', value: 10 },
  { id: '111', title: '一个BUG', value: 10 },
  { id: '1111', title: '一个孢子', value: 10 },
  { id: '12', title: '一个BUG', value: 10 },
  { id: '122', title: '一个孢子', value: 10 },
  { id: '1222', title: '一个BUG', value: 10 },
  { id: '13', title: '一个BUG', value: 10 },
  { id: '133', title: '一个孢子', value: 10 },
  { id: '1333', title: '一个孢子', value: 10 }
]);
const 获取虫害排行列表 = async () => {}
获取虫害排行列表()

const 病害排行列表 = ref<any[]>([
  { id: '1', title: '一个孢子', value: 10 },
  { id: '11', title: '一个孢子', value: 10 },
  { id: '111', title: '一个孢子', value: 10 },
  { id: '1111', title: '一个孢子', value: 10 },
  { id: '12', title: '一个孢子', value: 10 },
  { id: '122', title: '一个孢子', value: 10 },
  { id: '1222', title: '一个孢子', value: 10 },
  { id: '13', title: '一个孢子', value: 10 },
  { id: '133', title: '一个孢子', value: 10 },
  { id: '1333', title: '一个孢子', value: 10 }
])
const 获取病害排行列表 = async () => {}
获取病害排行列表()
</script>
<template>
  <div
    class="flex space-x-[.5rem]"
    style="height: calc(100vh - 125px);"
  >
    <el-card class="w-12rem h-full">
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        class="filter-tree"
        :data="categoryTree"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        @current-change="handleCurrentCategoryChange"
      />
    </el-card>
    <div
      class="grow space-y-[1rem] flex flex-col pl-.5rem box-border"
      style="max-width: calc(100% - 38rem);"
    >
      <el-card class="h-[7rem] mr-.5rem">
        <div class="flex justify-center space-x-1rem items-center h-3.5rem">
          <div
            v-for="item, index in topDataList"
            :key="index"
            class="flex space-x-3 items-center px-1.3rem py-2 rounded-2"
            style="border: 1px solid #99999980;"
          >
            <div class="bg-blue w-2.5rem h-2.5rem">icon</div>
            <div>
              <div>{{ item.title }}</div>
              <div class="art-font text-[1.4rem]">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </el-card>
      <el-scrollbar class="space-y-[1rem] grow">
        <div class="space-y-[1rem] pr-.5rem pb-.5rem">
          <el-card class="h-[21rem]">
            <div class="title-frame">病虫害排行</div>
            <div class="flex space-x-3 py-2">
              <el-radio-group v-model="bugTime">
                <el-radio-button label="当日" value="当日" />
                <el-radio-button label="本周" value="本周" />
                <el-radio-button label="本月" value="本月" />
              </el-radio-group>
              <div>
                <el-date-picker
                  v-model="bugTimeRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="grow" style="border: 1px solid #d1d1d1;">
                  <div
                    class="h-2rem flex items-center px-1rem"
                    style="border-bottom: 1px solid #d1d1d1;"
                  >虫害</div>
                  <el-scrollbar height="12rem">
                    <div
                      class="py-4 flex justify-center space-x-3 items-center"
                      style="border-bottom: 1px solid #99999929;"
                      v-for="item in 虫害排行列表"
                      :key="item.id"
                    >
                      <div class="w-6rem text-right mr-1rem">{{ item.title }}</div>
                      <div class="relative bg-[#e1e1e1] h-.5rem grow">
                        <div class="absolute left-0 top-0 w-40% h-full bg-#009688"></div>
                      </div>
                      <div class="w-3rem text-left ml-1rem">{{ item.value }}</div>
                    </div>
                    <div
                      class="h-12rem w-full flex items-center justify-center"
                      v-if="虫害排行列表.length === 0"
                    >暂无数据</div>
                  </el-scrollbar>
                </div>
                <div class="grow" style="border: 1px solid #d1d1d1;">
                  <div
                    class="h-2rem flex items-center px-1rem"
                    style="border-bottom: 1px solid #d1d1d1;"
                  >病害</div>
                  <el-scrollbar height="12rem">
                    <div
                      class="py-4 flex justify-center space-x-3 items-center"
                      style="border-bottom: 1px solid #99999929;"
                      v-for="item in 病害排行列表"
                      :key="item.id"
                    >
                      <div class="w-6rem text-right mr-1rem">{{ item.title }}</div>
                      <div class="relative bg-[#e1e1e1] h-.5rem grow">
                        <div class="absolute left-0 top-0 w-40% h-full bg-#009688"></div>
                      </div>
                      <div class="w-3rem text-left ml-1rem">{{ item.value }}</div>
                    </div>
                    <div
                      class="h-12rem w-full flex items-center justify-center"
                      v-if="病害排行列表.length === 0"
                    >暂无数据</div>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="h-[21rem]">
            <div class="flex justify-between items-center">
              <div class="title-frame">病害趋势分析</div>
              <div class="flex items-center space-x-3">
                <el-radio-group v-model="sickTraceRadio">
                  <el-radio-button label="按天" value="按天" />
                  <el-radio-button label="按月" value="按月" />
                </el-radio-group>
                <div>
                  <el-date-picker
                    v-model="sickTraceTimeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </div>
                <el-button type="primary">查询</el-button>
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>孢子数量分析</div>
                  </div>
                  <div class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>孢子种类分析</div>
                  </div>
                  <div class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
              </div>
            </div>
          </el-card>
          <el-card class="h-[21rem]">
            <div class="flex justify-between items-center">
              <div class="title-frame">虫害趋势分析</div>
              <div class="flex items-center space-x-3">
                <el-radio-group v-model="bugTraceRadio">
                  <el-radio-button label="按天" value="按天" />
                  <el-radio-button label="按月" value="按月" />
                </el-radio-group>
                <div>
                  <el-date-picker
                    v-model="bugTraceTimeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </div>
                <el-button type="primary">查询</el-button>
              </div>
            </div>
            <div class="flex space-x-1rem justify-center">
              <div class="max-w-70rem flex space-x-1rem grow py-3">
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>虫量趋势分析</div>
                  </div>
                  <div class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
                <div class="grow">
                  <div class="flex space-x-.6rem items-center">
                    <div class="w-5px h-1rem bg-#009688"></div>
                    <div>虫类趋势分析</div>
                  </div>
                  <div class="h-14.5rem bg-red mt-.6rem"></div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
    <el-scrollbar class="w-24rem h-full">
      <div class="flex flex-col space-y-[1rem] h-full">
        <el-card>
          <el-scrollbar height="calc(100vh - 440px)">
            <div class="title-frame">今日抓拍</div>
            <div class="flex justify-between space-x-2 py-2">
              <el-select v-model="snapShotDevice">
                <el-option
                  v-for="item in snapShotDeviceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="snapShotTime"
                type="date"
                placeholder="选择日期"
              />
            </div>
            <div class="rounded-1 h-10rem bg-#666"></div>
            <div class="grid grid-cols-4 gap-1 py-2">
              <div
                v-for="item in snapPictureList"
                :key="item"
                class="rounded-1 bg-#666 aspect-square"
              >{{item}}</div>
            </div>
            <div class="title-frame">设备信息</div>
            <div class="rounded-1 flex justify-evenly items-center bg-#00968810 p-2 my-2">
              asdasda
            </div>
            <div class="title-frame">抓拍信息</div>
          </el-scrollbar>
          
        </el-card>
        <el-card class="h-250px">
          <div class="title-frame mb-2">预警信息</div>
          <el-scrollbar height="190px">
            <div class="p-3 box-border">
              <div
                class="py-1rem"
                style="border-top: 1px solid #99999980;"
                v-for="item in preWarnList"
                :key="item.id"
              >
                <div
                  class="line-clamp-1 mb-2 cursor-pointer font-bold text-[.9rem]"
                  :title="item.title"
                >{{ item.title }}</div>
                <div class="flex space-x-3 items-center text-[.7rem]">
                  <div class="rounded-1 bg-#fdefef px-2 py-1">严重虫情</div>
                  <div class="text-[.8rem]">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>
<style scoped lang="scss">
.title-frame {
  font-weight: bold;
}
</style>