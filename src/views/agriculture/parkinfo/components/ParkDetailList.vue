<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--       <el-table-column label="编号" align="center" prop="code" width="200"/>-->
      <el-table-column label="名称" align="center" prop="name" width="150"/>
      <el-table-column label="类型" align="center" prop="type" width="150">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.AGRI_PLOT_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>

      <el-table-column label="海拔" align="center" prop="altitude" width="100">
        <template #default="scope">
          {{ scope.row.altitude != undefined ? scope.row.altitude + '米' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="纬度" align="center" prop="latitude" />
      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="通讯地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系电话" align="center" prop="tel" />
      <el-table-column label="面积" align="center" prop="area" width="100">
        <template #default="scope">
          {{ scope.row.area != undefined ? scope.row.area + '亩' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="quantity" width="100"/>
      <el-table-column label="模式" align="center" prop="adoptionType" width="100"/>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="220" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleDraw(scope.row)"
            v-hasPermi="['agriculture:park-info:update']"
          >
            绘制围栏
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="showDrawDialog"
      title="绘制围栏"
      width="1200px"
      append-to-body
      destroy-on-close
    >
      <div class="w-full h-[60vh]">
        <map-custom
          ref="tiandiIns1"
          :enableEdit="true"
        />
      </div>
      <template #footer>
        <el-button size="small" @click="handleCancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm()">确 定</el-button>
      </template>
    </el-dialog>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ParkInfoApi } from '@/api/agriculture/parkinfo'
// TODO: 天地图调整leaflet
import { ElMessage } from 'element-plus'
import { CropGrowthNewApi } from '@/api/agri/cropgrowthnew'
import * as turf from '@turf/turf'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// 绘制围栏
const selectedDrawId = ref('')
const showDrawDialog = ref<boolean>(false)
const tiandiIns1 = ref()
const areaMatchZoom = (_pos:any[]) => {
  const area = turf.area(turf.polygon([
    [..._pos, _pos[0]]
  ]));
  if (area < 3000) return 17;
  if (area > 3600000000) return 5;
  return Math.floor(17 - (12 * area / 3600000000))
}
const handleDraw = (item) => {
  const { id, geofencing } = item
  if (!id) {
    ElMessage.error('当前数据ID不存在')
    return
  }
  selectedDrawId.value = id
  showDrawDialog.value = true;
  nextTick(() => {
    tiandiIns1.value.initMap()
    if (geofencing) {
      const _arr = JSON.parse(geofencing)
      if (Array.isArray(_arr) && _arr.length === 1) {
        const _polyArr =  _arr[0].map(ele => {
          return T.LngLat(ele.lng, ele.lat)
        })
        
        tiandiIns1.value.createPolygon(_polyArr)
      } else {
        // TODO： 新版
        const { corrdinates, option } = JSON.parse(geofencing);
        if (Array.isArray(corrdinates) && corrdinates.length > 0) {
          tiandiIns1.value.createPolygon(corrdinates, option)
        }
      }
    }
  })
}

// 确定保存围栏信息
const handleConfirm = async () => {
  const geofencing = tiandiIns1.value.getCurrentSaveCoordinates()
  const { corrdinates, option } = geofencing;
  if (!Array.isArray(corrdinates)) return ElMessage.error('您还未选择区域!')
  if (corrdinates.length < 1) return ElMessage.error('您还未选择区域!')
  const data = await CropGrowthNewApi.saveGeofencing({
    id: selectedDrawId.value,
    geofencing: JSON.stringify(geofencing),
    infraType: '2'
  })

  if (data) ElMessage.success('保存成功!')
  else ElMessage.error("保存失败！")
  showDrawDialog.value = false
  selectedDrawId.value = ''
}

const handleCancel = () => {
  selectedDrawId.value = ''
  showDrawDialog.value = false
}

const props = defineProps<{
  parkId: undefined // 主表（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ParkInfoApi.getParkDetailListByParkId(props.parkId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
