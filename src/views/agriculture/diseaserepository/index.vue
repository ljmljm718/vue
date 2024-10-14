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
      <el-form-item label="类别" prop="reservedOne">
        <el-select
          v-model="queryParams.reservedOne"
          placeholder="请选择知识库类别"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in optionsType"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学名" prop="scientificName">
        <el-input
          v-model="queryParams.scientificName"
          placeholder="请输入学名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="作物品类" prop="cropType">
        <el-select
          v-model="queryParams.cropType"
          placeholder="请选择品类"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in listCategoryManagement"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="危害等级" prop="hazardRating">
        <el-select
          v-model="queryParams.hazardRating"
          placeholder="请选择危害等级"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 20px;margin-left: 30px;height: 30px">
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['agriculture:disease-repository:create']"
        >
          <Icon icon="ep:plus" class="mr-5px"/>
          新增
        </el-button>
      </el-form-item>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="主键" align="center" prop="id"/>-->
      <el-table-column label="学名" align="center" prop="scientificName" width="100px"/>
      <el-table-column label="知识库类别" align="center" prop="reservedOne" width="100px"/>
      <el-table-column label="图片" align="center" prop="imgId" width="100px">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            lazy
            :src="row.imgId"
            :preview-src-list="[row.imgId]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <!--      <el-table-column label="品种ID" align="center" prop="breedId"/>-->
      <!--      <el-table-column label="品种名称" align="center" prop="cropName"/>-->
      <el-table-column label="作物品类" align="center" prop="cropType" width="100px">
        <template #default="{ row }">
          {{ row.cropType }}
        </template>
      </el-table-column>
      >
      <!--      <el-table-column label="备注" align="center" prop="remark"/>-->
      <el-table-column label="易发月份" align="center" prop="proneMonth" width="200px"/>
      <el-table-column label="危害等级" align="center" prop="hazardRating" width="100px"/>
      <el-table-column label="简介" align="center" prop="intro"/>
      <!--      <el-table-column label="形态特征" align="center" prop="description"/>-->
      <!--      <el-table-column label="发病条件" align="center" prop="morbidityCondition"/>-->
      <!--      <el-table-column label="发病规律" align="center" prop="morbidityLaw"/>-->
      <!--      <el-table-column label="症状表现" align="center" prop="manifestedIllness"/>-->
      <!--      <el-table-column label="治理方法" align="center" prop="treatmentMethod"/>-->

      <!--      <el-table-column label="预留2" align="center" prop="reservedTwo"/>-->
      <!--      <el-table-column label="预留3" align="center" prop="reservedThree"/>-->
      <!--      <el-table-column label="预留4" align="center" prop="reservedFour"/>-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="详情" align="center" width="150px">
        <template #default="scope">
          <el-button type="primary"
                     @click="drawer = true ;openFormA(scope.row.id)"
                     v-hasPermi="['agriculture:disease-repository:update']">
            防治方案
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agriculture:disease-repository:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:disease-repository:delete']"
          >
            删除
          </el-button>
          <!--          <el-button-->
          <!--            link-->
          <!--            type="danger"-->
          <!--            @click="handleDelete(scope.row.id)"-->
          <!--            v-hasPermi="['agriculture:disease-repository:delete']"-->
          <!--          >-->
          <!--            删除-->
          <!--          </el-button>-->
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
  <el-drawer
    title="详情配置"
    v-model="drawer"
    :direction="direction"
    :before-close="handleClose">
    <el-form
      ref="formRefA"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="形态特征" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入形态特征"
                  maxlength="500" show-word-limit :rows="4"/>
      </el-form-item>
      <el-form-item label="发病条件" prop="morbidityCondition">
        <el-input v-model="formData.morbidityCondition" type="textarea" :rows="4"
                  placeholder="请输入发病条件" maxlength="500" show-word-limit/>
      </el-form-item>
      <el-form-item label="发病规律" prop="morbidityLaw">
        <el-input v-model="formData.morbidityLaw" type="textarea" placeholder="请输入发病规律"
                  maxlength="500" show-word-limit :rows="4"/>
      </el-form-item>

      <el-form-item label="症状表现" prop="manifestedIllness">
        <el-input v-model="formData.manifestedIllness" type="textarea" :rows="6"
                  placeholder="请输入症状表现" maxlength="500" show-word-limit/>
      </el-form-item>
      <el-form-item label="治理方法" prop="treatmentMethod">
        <el-input v-model="formData.treatmentMethod" type="textarea" placeholder="请输入治理方法"
                  maxlength="500" show-word-limit :rows="6"/>
      </el-form-item>
      <!--      <el-form-item label="预留2" prop="reservedTwo">-->
      <!--        <el-input v-model="formData.reservedTwo" placeholder="请输入预留2"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留3" prop="reservedThree">-->
      <!--        <el-input v-model="formData.reservedThree" placeholder="请输入预留3"/>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="预留4" prop="reservedFour">-->
      <!--        <el-input v-model="formData.reservedFour" placeholder="请输入预留4"/>-->
      <!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="drawer = false">取 消</el-button>
      <el-button @click="submitForm" type="primary">完 成</el-button>
    </template>
  </el-drawer>
  <!-- 表单弹窗：添加/修改 -->
  <DiseaseRepositoryForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
import {dateFormatter} from '@/utils/formatTime'
import download from '@/utils/download'
import {DiseaseRepositoryApi, DiseaseRepositoryVO} from '@/api/agriculture/diseaserepository'
import DiseaseRepositoryForm from './DiseaseRepositoryForm.vue'
import {allDataCacheManager, CategoryManagementVO} from "@/api/agriculture/categorymanagement";
import {checkPermi} from "@/utils/permission";

/** 病虫害知识库 列表 */
defineOptions({name: 'DiseaseRepository'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DiseaseRepositoryVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  scientificName: undefined,
  imgId: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: undefined,
  remark: undefined,
  proneMonth: undefined,
  hazardRating: undefined,
  intro: undefined,
  description: undefined,
  morbidityCondition: undefined,
  morbidityLaw: undefined,
  manifestedIllness: undefined,
  treatmentMethod: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
//危害等级
const options = ref([{
  value: '低',
  label: '低'
}, {
  value: '中',
  label: '中'
}, {
  value: '高',
  label: '高'
}])
//知识库类别
const optionsType = ref([{
  value: '病害',
  label: '病害'
}, {
  value: '虫害',
  label: '虫害'
}])
const drawer = ref(false)
const direction = ref('rtl')
const formData = ref({
  id: undefined,
  scientificName: undefined,
  imgId: undefined,
  breedId: undefined,
  cropName: undefined,
  cropType: undefined,
  remark: undefined,
  proneMonth: undefined,
  hazardRating: undefined,
  intro: undefined,
  description: undefined,
  morbidityCondition: undefined,
  morbidityLaw: undefined,
  manifestedIllness: undefined,
  treatmentMethod: undefined,
  reservedOne: undefined,
  reservedTwo: undefined,
  reservedThree: undefined,
  reservedFour: undefined
})
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

const getType = async () => {
  listCategoryManagement.value = await allDataCacheManager.getData({})
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DiseaseRepositoryApi.getDiseaseRepositoryPage(queryParams)
    list.value = data.list
    //把品类数据的namep拼接到列表中
    list.value.forEach(item => {
      listCategoryManagement.value.forEach(itm => {
        if (item.cropType == itm.id)
          item.cropType = itm.categoryName
      })
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getType()
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const openFormA = async (id) => {
  formData.value = await DiseaseRepositoryApi.getDiseaseRepository(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DiseaseRepositoryApi.deleteDiseaseRepository(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}

const handleClose = () => {
  drawer.value = false
}

const formRules = reactive({
  treatmentMethod: [{required: true, message: '治理方法不能为空', trigger: 'blur'}],
  manifestedIllness: [{required: true, message: '症状表现不能为空', trigger: 'blur'}]
})
const formRefA = ref()
/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRefA.value.validate()
  try {
    const data = formData.value as unknown as DiseaseRepositoryVO
    await DiseaseRepositoryApi.updateDiseaseRepository(data)
    message.success("配置成功")
  } finally {
    drawer.value = false;
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await DiseaseRepositoryApi.exportDiseaseRepository(queryParams)
    download.excel(data, '病虫害知识库.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getType()
  getList()
})
</script>
<style lang="scss" scoped>
.el-table .cell.el-tooltip {
  display: flex !important;
  justify-content: center !important;
}
</style>
