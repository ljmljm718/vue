<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="组织名称" prop="title">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入组织名称"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="组织状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择组织状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="openForm('create')"
            v-hasPermi="['system:dept:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </el-button>
          <el-button type="danger" plain @click="toggleExpandAll">
            <Icon icon="ep:sort" class="mr-5px" />
            展开/折叠
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
    >
      <el-table-column prop="name" label="组织名称" />
      <el-table-column prop="leader" label="负责人">
        <template #default="scope">
          {{ userList.find((user) => user.id === scope.row.leaderUserId)?.nickname }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['system:dept:update']"
          >
            修改
          </el-button>
          <el-button link type="warning" @click="handleDraw(scope.row)">绘制围栏</el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:dept:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <fence-dialog
      v-model="showDrawDialog"
      title="绘制围栏"
      width="80vw"
      draggable
      append-to-body
      destroy-on-close
    >
      <div class="w-full h-full">
        <map-custom ref="tiandiIns" :enableEdit="true" />
      </div>
      <template #footer>
        <el-button size="small" @click="handleCancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
      </template>
    </fence-dialog>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <DeptForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import { handleTree } from '@/utils/tree';
import * as DeptApi from '@/api/system/dept';
import DeptForm from './DeptForm.vue';
import * as UserApi from '@/api/system/user';
import { ElMessage } from 'element-plus';
import FenceDialog from '@/views/agriculture/parkinfo/components/fenceDialog.vue';
import { CropGrowthNewApi } from '@/api/agri/cropgrowthnew';

defineOptions({ name: 'SystemDept' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

const loading = ref(true); // 列表的加载中
const list = ref(); // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 100,
  name: undefined,
  status: undefined
});
const queryFormRef = ref(); // 搜索的表单
const isExpandAll = ref(true); // 是否展开，默认全部展开
const refreshTable = ref(true); // 重新渲染表格状态
const userList = ref<UserApi.UserVO[]>([]); // 用户列表

/** 查询组织列表 */
const getList = async () => {
  loading.value = true;
  try {
    const data = await DeptApi.getDeptPage(queryParams);
    list.value = handleTree(data);
  } finally {
    loading.value = false;
  }
};

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
};

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.pageNo = 1;
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
    await DeptApi.deleteDept(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
};

/** 初始化 **/
onMounted(async () => {
  await getList();
  // 获取用户列表
  userList.value = await UserApi.getSimpleUserList();
});

// 绘制地理围栏
const selectedDrawId = ref('');
const showDrawDialog = ref<boolean>(false);
const tiandiIns = ref();
const handleDraw = (item) => {
  const { id, geofencing } = item;
  if (!id) {
    ElMessage.error('当前数据ID不存在');
    return;
  }
  selectedDrawId.value = id;
  showDrawDialog.value = true;
  nextTick(() => {
    if (geofencing) {
      const _arr = JSON.parse(geofencing);
      if (Array.isArray(_arr) && _arr.length === 1) {
        const _polyArr = _arr[0].map((ele) => [ele.lat, ele.lng]);
        setTimeout(() => {
          tiandiIns.value.createPolygon(_polyArr);
        }, 500);
      } else {
        // TODO： 新版
        const { corrdinates, option } = JSON.parse(geofencing);
        if (Array.isArray(corrdinates) && corrdinates.length > 0) {
          setTimeout(() => {
            tiandiIns.value.createPolygon(
              corrdinates[0].map((location) => [location.lat, location.lng]),
              option
            );
          }, 500);
        }
      }
    } else {
      // TODO 如果不存在围栏，把中心点设置在基地中间
      if (activeBaseCenter.value.length !== 2) return;
      nextTick(() => {
        tiandiIns.value.setCenterZoom(activeBaseCenter.value, 17);
      });
    }
  });
};

const handleCancel = () => {
  selectedDrawId.value = '';
  showDrawDialog.value = false;
};

const handleConfirm = async () => {
  const geofencing = tiandiIns.value.getCurrentSaveCoordinates();
  const { corrdinates, option } = geofencing;
  if (!Array.isArray(corrdinates)) return ElMessage.error('您还未选择区域!');
  if (corrdinates.length < 1) return ElMessage.error('您还未选择区域!');
  const data = await CropGrowthNewApi.saveGeofencing({
    id: selectedDrawId.value,
    geofencing: JSON.stringify(geofencing),
    infraType: showPlotList.value ? '2' : '1'
  });

  if (data) ElMessage.success('保存成功!');
  else ElMessage.error('保存失败！');
  showDrawDialog.value = false;
  selectedDrawId.value = '';
  getList(true);
};
</script>
