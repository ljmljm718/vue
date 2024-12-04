<script setup lang="ts">
// 灌区分布
import CustomSelector from '@/components/CustomSelector/src/CustomSelector.vue';
import { ParkInfoApi } from '@/api/agriculture/parkinfo/index';
import { dateFormatter } from '@/utils/formatTime';

const basePlotDataList = ref<any[]>([]);
const getBasePlotDataList = async () => {
  const data = await ParkInfoApi.getParkTree({});
  console.log('🚀 ~ getBasePlotDataList ~ data:', data);
  if (!Array.isArray(data)) return;
  basePlotDataList.value = data;
  nextTick(() => drawBasePlot(data));
};
const findPlotItem = (id) => {
  let selectedItem = null;
  basePlotDataList.value.map((baseItem) => {
    const plotArr = baseItem.child;
    if (!Array.isArray(plotArr)) return;
    selectedItem = plotArr.find((plotItem) => plotItem.id === id);
  });
  if (selectedItem) return selectedItem;
  return;
};
onMounted(() => getBasePlotDataList());

const mapIns = ref();

const handleMenuChange = (id) => {
  console.log('🚀 ~ handleMenuChange ~ id:', id);
  const seletedPlot = findPlotItem(id);
  if (seletedPlot) {
    console.log('🚀 ~ handleMenuChange ~ seletedPlot:', seletedPlot);
    const { longitude, latitude } = seletedPlot;
    if (!longitude || !latitude) return ElMessage.warning('所选地块无经纬度数据!');
    mapIns.value.setCenterZoom([parseFloat(latitude), parseFloat(longitude)], 16);
  }
};

// 绘制地块
const drawBasePlot = (arr: any[]) => {
  arr.forEach((baseItem) => {
    const plotArr = baseItem.child;
    if (!Array.isArray(plotArr)) return;
    plotArr.forEach((plotItem) => {
      const geofencing = JSON.parse(plotItem.geofencing);
      if (Array.isArray(geofencing)) return ElMessage.warning('数据异常');
      const { corrdinates, option } = geofencing;
      if (!Array.isArray(corrdinates)) return ElMessage.warning('数据异常');
      mapIns.value.createPolygon(corrdinates, option);
    });
  });
};

const showJoinAreaDialog = ref<boolean>(false);
const handleJoinArea = (id) => {
  console.log('🚀 ~ handleJoinArea ~ id:', id);
  showJoinAreaDialog.value = true;
};

const dialogDataList = ref<any[]>([]);
const dialogLoading = ref<boolean>(false);
const handleCurrentChange = () => {};
const handleJoinConfirm = () => {
  showJoinAreaDialog.value = false;
};
const handleJoinCancel = () => {
  showJoinAreaDialog.value = false;
};
</script>
<template>
  <CustomSelector
    menuTitle="灌区列表"
    menuType="default"
    @change="handleMenuChange"
    @join="handleJoinArea"
    :menuList="basePlotDataList.map((item) => ({ ...item, children: item.child }))"
  >
    <map-custom ref="mapIns" :enableEdit="false" />
  </CustomSelector>
  <Dialog title="加入灌区" v-model="showJoinAreaDialog">
    <el-table
      v-loading="dialogLoading"
      :data="dialogDataList"
      :stripe="true"
      :show-overflow-tooltip="true"
      @current-change="handleCurrentChange"
      highlight-current-row
    >
      <el-table-column type="selection" width="30" label="选择" :reserve-selection="true" />
      <el-table-column label="灌区编号" align="center" prop="id" />
      <el-table-column label="灌区名称" align="center" prop="id" />
      <el-table-column label="喷灌类型" align="center" prop="id" />
      <el-table-column label="阀门状态" align="center" prop="id" />
      <el-table-column label="图片" align="center" prop="imgId">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            :src="row.imgId"
            :preview-src-list="[row.imgId]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="id"
        :formatter="dateFormatter"
        width="180"
      />
    </el-table>
    <template #footer>
      <el-button @click="handleJoinConfirm()" type="primary">确 定</el-button>
      <el-button @click="handleJoinCancel()">取 消</el-button>
    </template>
  </Dialog>
</template>
<style scoped lang="scss"></style>
