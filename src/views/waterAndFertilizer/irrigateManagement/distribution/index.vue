<script setup lang="ts">
// 灌区分布
import CustomSelector from '@/components/CustomSelector/src/CustomSelector.vue';
import { dateFormatter } from '@/utils/formatTime';
import * as turf from '@turf/turf';
import request from '@/config/axios';
import { DICT_TYPE } from '@/utils/dict';
import { IrrigationAreaApi, IrrigationAreaVO } from '@/api/agriculture/irrigationarea';
import { ElMessageBox } from 'element-plus';

const irrigation_area_distribution = async (params: any) => {
  return await request.get({
    url: `/agriculture/irrigation-area/irrigation_area_distribution`,
    params
  });
};

const basePlotDataList = ref<any[]>([]);
const getBasePlotDataList = async () => {
  const data = await irrigation_area_distribution({});
  console.log('🚀 ~ getBasePlotDataList ~ data:', data);
  if (!Array.isArray(data)) return;
  basePlotDataList.value = data.map((item) => ({
    ...item,
    name: item.iaName,
    child: item.parkDetailDOList.map((ele) => ({ ...ele }))
  }));
  nextTick(() => drawBasePlot(data));
};
const findPlotItem = (id) => {
  let selectedItem = null,
    found = false;
  basePlotDataList.value.map((baseItem) => {
    if (found) return;
    const plotArr = baseItem.child;
    if (!Array.isArray(plotArr)) return;
    selectedItem = plotArr.find((plotItem) => plotItem.id === id);
    if (selectedItem) found = true;
  });
  if (selectedItem) return selectedItem;
  return;
};
onMounted(() => getBasePlotDataList());

const mapIns = ref();

const handleMenuChange = (id) => {
  const seletedPlot = findPlotItem(id);
  if (seletedPlot) {
    const { longitude, latitude, geofencing } = seletedPlot;
    const geoArr = JSON.parse(geofencing);
    const { corrdinates } = geoArr;
    const centerPoi = turf.centroid(turf.points(corrdinates[0].map((ele) => [ele.lng, ele.lat])));
    const [centerLng, centerLat] = centerPoi.geometry.coordinates;
    mapIns.value.setCenterZoom([centerLat, centerLng], 17);
    return;
    // TODO 配置的中心点都是错的，先按上面的围栏计算中心点吧
    if (!longitude || !latitude) return ElMessage.warning('所选地块无经纬度数据!');
    mapIns.value.setCenterZoom([parseFloat(latitude), parseFloat(longitude)], 16);
  }
};

// 绘制地块
const drawBasePlot = (arr: any[]) => {
  mapIns.value.clearHTMLMarker();
  arr.forEach((baseItem) => {
    const allPlotList: any[] = [];
    const plotArr = baseItem.parkDetailDOList;
    if (!Array.isArray(plotArr)) return;
    plotArr.forEach((plotItem) => {
      const geofencing = JSON.parse(plotItem.geofencing);
      if (Array.isArray(geofencing)) return ElMessage.warning('数据异常');
      const { corrdinates, option } = geofencing;
      if (!Array.isArray(corrdinates)) return ElMessage.warning('数据异常');
      mapIns.value.createPolygon(corrdinates, option);
      const centerPoi = turf.centroid(turf.points(corrdinates[0].map((ele) => [ele.lng, ele.lat])));
      setTimeout(() => {
        mapIns.value.addHTMLMarker(
          `${plotItem.name}`,
          [14 * plotItem.name.length, 30],
          centerPoi.geometry.coordinates
        );
      }, 1000);
      allPlotList.push(...corrdinates[0].map((poi) => [poi.lng, poi.lat]));
    });
    if (allPlotList.length < 2) return;
    const featureCollection = turf.featureCollection(allPlotList.map((item) => turf.point(item)));
    const convexHull = turf.convex(featureCollection);
    mapIns.value.createPolygon([
      convexHull?.geometry.coordinates[0].map((item) => ({ lng: item[0], lat: item[1] }))
    ]);
    const HullcenterPoi = turf.centroid(turf.points(convexHull?.geometry.coordinates[0]));
    if (baseItem.iaName !== '未分配灌区')
      mapIns.value.addHTMLMarker(
        `<div
      style="position: relative;left: 20px;bottom: 95px;"
     >
      <div class="flex flex-col items-start">
        <div class="flex">
          <div
            class="flex justify-center items-center w-[35px] h-[35px] bg-[#0CCCB9C0]"
            style="border: 2px solid #42e6d6;background-image: url('/mapIcon.png');background-size: 100%;"
           ></div>
          <div class="bg-[#06443E90] flex items-center px-[16px] text-nowrap" style="border: 2px solid #098c7e;">${baseItem.iaName}</div>
        </div>
        <div class="w-2px h-60px bg-[#0CCCB9] ml-[17px]"></div>
      </div>
     </div>`,
        [14 * baseItem.iaName.length, 30],
        HullcenterPoi.geometry.coordinates
      );
  });
};

const showJoinAreaDialog = ref<boolean>(false);
const activePlotID = ref<string>('');
const handleJoinArea = (id) => {
  console.log('🚀 ~ handleJoinArea ~ id:', id);
  activePlotID.value = id;
  showJoinAreaDialog.value = true;
};

const handleLeaveArea = (id) => {
  ElMessageBox.confirm('确认移出该地块吗？', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消'
  })
    .then(async () => {
      await IrrigationAreaApi.out_irrigation_area({
        plotId: id
      }).catch(() => {
        ElMessage.error('操作失败，请稍后重试！');
      });
      ElMessage.success('操作成功！');
      getBasePlotDataList();
    })
    .catch(() => console.info('操作取消'));
};

// dialog 表格单选
const joinAreaTableRef = ref();
const selectedRow = ref<any>();
const select = (selection, row) => {
  joinAreaTableRef.value.clearSelection();
  if (selection.length == 0) return;
  joinAreaTableRef.value.toggleRowSelection(row, true);
  selectedRow.value = row;
};

const dialogDataList = ref<IrrigationAreaVO[]>([]);
const dialogQueryParams = reactive({
  pageNo: 1,
  pageSize: 10
});
const dialogLoading = ref<boolean>(false);
const dialogDataTotal = ref<number>(0);
const getDialogDataList = async () => {
  dialogLoading.value = true;
  joinAreaTableRef.value?.clearSelection();
  try {
    const data = await IrrigationAreaApi.getIrrigationAreaPage({ dialogQueryParams });
    console.log('IrrigationAreaApi data', data);
    dialogDataList.value = data.list;
    dialogDataTotal.value = data.total;
  } finally {
    dialogLoading.value = false;
  }
};
getDialogDataList();

const handleCurrentChange = () => {};
const handleJoinConfirm = () => {
  const { id } = selectedRow.value; // 灌区ID
  IrrigationAreaApi.in_irrigation_area({
    plotId: activePlotID.value,
    iaId: id
  })
    .then(() => {
      ElMessage.success('加入灌区成功');
      showJoinAreaDialog.value = false;
      selectedRow.value = null;
      getBasePlotDataList();
    })
    .catch(() => {
      showJoinAreaDialog.value = false;
      selectedRow.value = null;
    });
};
const handleJoinCancel = () => {
  showJoinAreaDialog.value = false;
  selectedRow.value = null;
};
</script>
<template>
  <CustomSelector
    menuTitle="灌区列表"
    menuType="default"
    @change="handleMenuChange"
    @join="handleJoinArea"
    @leave="handleLeaveArea"
    :menuList="basePlotDataList.map((item) => ({ ...item, children: item.child }))"
  >
    <map-custom ref="mapIns" :enableEdit="false" />
  </CustomSelector>
  <Dialog title="加入灌区" v-model="showJoinAreaDialog">
    <el-table
      ref="joinAreaTableRef"
      v-loading="dialogLoading"
      :data="dialogDataList"
      :stripe="true"
      :show-overflow-tooltip="true"
      @current-change="handleCurrentChange"
      highlight-current-row
      @select="select"
    >
      <el-table-column type="selection" width="30" label="选择" :reserve-selection="true" />
      <el-table-column label="灌区编号" align="center" prop="iaCode" />
      <el-table-column label="灌区名称" align="center" prop="iaName" />
      <el-table-column label="喷灌类型" align="center" prop="irrigationType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WFI_IRRIGATION_TYPE" :value="scope.row.irrigationType" />
        </template>
      </el-table-column>
      <el-table-column label="阀门状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <div v-if="scope.row.deviceStatus === 'online'" class="text-green-500">开</div>
          <div v-if="scope.row.deviceStatus === 'offline'" class="text-gray-500">关</div>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template #default="{ row }">
          <el-image
            class="h-50px w-50px"
            :src="row.iaImage"
            :preview-src-list="[row.iaImage]"
            preview-teleported
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
    </el-table>
    <div class="w-full h-38px">
      <Pagination
        :total="dialogDataTotal"
        v-model:page="dialogQueryParams.pageNo"
        v-model:limit="dialogQueryParams.pageSize"
        @pagination="getDialogDataList"
      />
    </div>
    <template #footer>
      <el-button @click="handleJoinConfirm()" type="primary">确 定</el-button>
      <el-button @click="handleJoinCancel()">取 消</el-button>
    </template>
  </Dialog>
</template>
<style scoped lang="scss"></style>
