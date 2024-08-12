<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="产品名称" prop="product">
        <el-input
          v-model="queryParams.product"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="所属基地" prop="park">
        <el-input v-model="queryParams.park" placeholder="请选择所属基地" readonly
                  class="!w-240px">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="所属地块" prop="parkDetail">
        <el-input v-model="queryParams.parkDetail" placeholder="请选择所属地块" readonly
                  class="!w-240px">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.parkId)">
              <Icon icon="ep:search"/>
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="产品年份" prop="years">
        <el-input
          v-model="queryParams.years"
          placeholder="请输入"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="" size="normal">
        <div class="w-2px h-40px bg-[#e6e6e6]"></div>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery" class='!bg-[#009688] !color-[#fff]'>
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </el-form>

  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex items-center justify-between mb-15px">
      <div style="margin-top: 20px;margin-left: 30px;height: 30px">
        <el-form-item>
          <el-button
            class='!bg-[#009688] !color-[#fff]'
            plain
            @click="openForm('create')"
            v-hasPermi="['digital:village-product:create']"
          >
            <Icon icon="ep:plus" class="mr-5px"/>
            新增
          </el-button>
          <el-button
            plain
            @click="handleExport"
            :loading="exportLoading"
            v-hasPermi="['digital:village-product:export']"
          >
            <Icon icon="ep:download" class="mr-5px"/>
            导出
          </el-button>
        </el-form-item>
      </div>
      <div class="flex">
        <div @click="cardList=false" class="py-3px px-15px rounded-l"
             :style="`background-color: ${cardList?'':'#e5f4f3'}; border:1.5px solid ${cardList?'#e6e6e6':'#36a99e'}; color:${cardList?'':'#36a99e'}`">
          <img :src="cardList?card2:card" class="w-10px h-10px" alt=""/>
          卡片
        </div>
        <div @click="cardList=true" class="py-3px px-15px rounded-r"
             :style="`border:1.5px solid ${cardList?'#36a99e':'#e6e6e6'};background-color: ${cardList?'#e5f4f3':''}; color:${cardList?'#36a99e':''}`">
          <img :src="cardList?listImg:listImg2" class="w-10px h-10px" alt=""/>
          列表
        </div>
      </div>
    </div>
    <div v-if="!cardList" v-loading="loading" class="grid grid-cols-5 grid-rows-2 gap-15px">
      <div v-for="item,index in list" :key="index" class="rounded bg-[#f5f5f5]"
           style="overflow: hidden;">
        <img :src="item.photo" class="w-100% h-150px rounded" alt=""/>
        <div class="py-[15px] px-[15px] box-border w-100% bg-[#f5f5f5] ">
          <div class="text-17px" style="font-weight:600">{{ item.years }}{{ item.product }}
            {{ item.specifications }}Kg
          </div>
          <div class="text-15px mt-10px mb-10px color-[#878787] " style="word-break:break-all">
            {{ item.park }}-{{ item.parkDetail }}-{{ item.batchCode }}
          </div>
          <div class="flex justify-end">
            <div class="color-[#898989] text-sm">数量：{{ item.inventory }}</div>
          </div>
        </div>

      </div>
    </div>
    <el-table v-if="cardList" v-loading="loading" :data="list" :stripe="true"
              :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="产品名称" align="center" prop="product"/>
      <!--      <el-table-column label="所属基地id" align="center" prop="parkId" />-->
      <el-table-column label="所属基地" align="center" prop="park"/>
      <!--      <el-table-column label="所属地块id" align="center" prop="parkDetailId"/>-->
      <el-table-column label="所属地块" align="center" prop="parkDetail"/>
      <el-table-column label="图片" align="center" prop="photo">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.photo"
            :preview-src-list="[row.photo]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column label="产品年份" align="center" prop="years"/>
      <el-table-column label="产品数量(袋)" align="center" prop="inventory"/>
      <el-table-column label="产品规格(Kg)" align="center" prop="specifications"/>
      <el-table-column label="批次号" align="center" prop="batchCode"/>
      <!--      <el-table-column label="采收编号" align="center" prop="recoveryNum" />-->
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <!--      <el-table-column-->
      <!--        label="创建时间"-->
      <!--        align="center"-->
      <!--        prop="createTime"-->
      <!--        :formatter="dateFormatter"-->
      <!--        width="180px"-->
      <!--      />-->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('show', scope.row.id)"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['digital:village-product:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['digital:village-product:delete']"
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
  <VillageProductForm ref="formRef" @success="getList"/>

  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange"/>
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {VillageProductApi, VillageProductVO} from '@/api/digital/villageproduct'
import VillageProductForm from './VillageProductForm.vue'
import {useRoute} from "vue-router";
import card from '../../../assets/imgs/card-active.png'
import card2 from '../../../assets/imgs/card-actived.png'
import listImg from '../../../assets/imgs/list-active.png'
import listImg2 from '../../../assets/imgs/list-actived.png'
import ParkInfoPopup from "@/views/agriculture/parkinfo/components/ParkInfoPopup.vue";
import ParkDetailPopup from "@/views/agriculture/parkdetail/components/ParkDetailPopup.vue";
import {ParkInfoVO} from "@/api/agriculture/parkinfo";
import {ParkDetailVO} from "@/api/agriculture/parkdetail";

/** 特色产品 列表 */
defineOptions({name: 'VillageProduct'})
const router = useRouter() // 路由
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const cardList = ref(false)
const loading = ref(true) // 列表的加载中
const list = ref<VillageProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  product: undefined,
  parkId: undefined,
  park: undefined,
  parkDetailId: undefined,
  parkDetail: undefined,
  photo: undefined,
  years: undefined,
  inventory: undefined,
  specifications: undefined,
  remark: undefined,
  createTime: [],
  batchCode: undefined,
  recoveryNum: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id;
  if (openType.value === undefined || openType.value === "") {
    message.error("请选择基地")
  } else parkPopupRef.value.open(id)
}
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.parkId = String(order[0].code)
    queryParams.park = String(order[0].name)
  } else queryParams.parkDetailId = String(order[0].id)
}

//地块的选择
const plotPopupRef = ref()
const openType1 = ref('')
const openPlotPopup = (id: string) => {
  openType1.value = id;
  if (!openType1.value) {
    message.error("请选择基地")
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  console.log("--->>查看选择的地块信息：", order[0])
  queryParams.parkDetailId = String(order[0].parkId)
  queryParams.parkDetailId = String(order[0].id)
  queryParams.parkDetail = String(order[0].name)
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await VillageProductApi.getVillageProductPage(queryParams)
    console.log(data.list, '数据')
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
//新增或修改跳转列表后，自动刷新列表
onActivated(() => {
  resetQuery()
})
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.parkId=undefined
  queryParams.parkDetailId=undefined
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  // formRef.value.open(type, id)
  router.push({path: '/pcg/production/villageproduct', query: {id: id, type: type}})
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await VillageProductApi.deleteVillageProduct(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await VillageProductApi.exportVillageProduct(queryParams)
    download.excel(data, '特色产品.xls')
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
