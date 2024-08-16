<template>
  <el-tabs v-model="activeName" @tab-click="changeTab">
    <!-- 传感设备预警 -->
    <el-tab-pane label="传感设备预警" name="sensorTab">
      <!-- 搜索栏 -->
      <ContentWrap>
        <el-form
          class="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2"
          :model="queryParams"
          ref="queryFormRef"
          label-width="68px"
          :inline="true"
        >
          <!-- 表单内容 -->
          <div
            class="lg:col-span-4 xl:col-span-5 2xl:col-span-6 lg:border-r lg:border-r-solid lg:border-[#E5E5E5] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-2 lg:pr-20px"
          >
            <el-form-item label="预警类型" prop="warnType">
              <el-select v-model="queryParams.warnType" placeholder="请选择预警类型" clearable>
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_MONITOR_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预警状态" prop="warnStatus">
              <el-select v-model="queryParams.warnStatus" placeholder="请选择预警状态" clearable>
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.KAIZHOU_WARN_STATUS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预警等级" prop="warnLevel">
              <el-select v-model="queryParams.warnLevel" placeholder="请选择预警等级" clearable>
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.AGRI_WARN_LEVEL)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预警时间" prop="warnTime">
              <el-date-picker
                v-model="queryParams.warnTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              />
            </el-form-item>
          </div>
          <!-- 表单按钮 -->
          <div class="flex flex-wrap justify-center content-center md:col-span-1">
            <el-form-item class="">
              <el-button @click="handleQuery" type="primary">
                <Icon icon="ep:search" />
                查询
              </el-button>
              <el-button @click="resetQuery">
                <Icon icon="ep:refresh" />
                重置
              </el-button>
            </el-form-item>
          </div>
        </el-form>
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
              v-hasPermi="['agriculture:agri-warning-record:create']"
            >
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
            <el-button
              plain
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['agriculture:agri-warning-record:export']"
            >
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>
          <div class="flex flex-wrap content-center">
            <el-radio-group v-model="listType" size="small" @change="cardChange">
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
            v-show="listType === 'card'"
            class="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4"
          >
            <div v-for="item in list" :key="item.id" class="card-item">
              <!-- 第一行 -->
              <div class="h-[22px] flex">
                <div class="font-['AlibabaPuHuiTi'] text-[18px]">{{ item.deviceName }}</div>
                <dict-tag
                  class="ml-20px"
                  :type="DICT_TYPE.AGRI_WARN_LEVEL"
                  :value="item.warnLevel"
                />
                <dict-tag
                  class="ml-10px"
                  :type="DICT_TYPE.AGRI_MONITOR_TYPE"
                  :value="item.warnType"
                />
              </div>
              <!-- 第二行 -->
              <div class="text-[14px] text-[#999999] mt-[15px]">
                当前值:
                <span class="text-[#E31205] border-r border-r-solid border-[#E5E5E5] pr-[5px]">
                  {{ item.currentValue }}{{ item.warnUnit }}
                </span>
                阈值:
                <span class="border-r border-r-solid border-[#E5E5E5] pr-[5px] pl-[5px]">
                  {{ item.threshold }}{{ item.warnUnit }}
                </span>
                预警时间:
                <span class="pl-[5px]">
                  {{ timeFormat(item.warnTime) }}
                </span>
              </div>
              <div class="warn-popover">
                <el-icon><WarnTriangleFilled /></el-icon>
                {{ item.warnInfo }}!
                <!-- 旋转10乘10的正方形区域45度 -->
                <div
                  style="
                    position: absolute;
                    top: -5px;
                    left: 60px;
                    background-image: linear-gradient(
                      to bottom right,
                      hsla(4, 96%, 45%, 0.08),
                      transparent
                    );
                    width: 10px;
                    height: 10px;
                    transform: rotate(45deg);
                  "
                ></div>
              </div>

              <!-- 第三行 -->
              <!-- grid布局，两行两列，已处理显示四个格子，未处理只显示第1个格子 -->
              <div
                class="grid grid-cols-2 grid-rows-2 gap-1 mt-15px text-[#999999] text-[14px] font-['AlibabaPuHuiTi']"
                v-show="'1' === item.warnStatus"
              >
                <div class=""> 预警状态: <span class="text-[#009688]">已处理</span> </div>
                <div> 处理人: {{ item.dealPerson }} </div>
                <div> 处理信息: {{ item.dealInfo }} </div>
                <div> 处理时间: {{ timeFormat(item.dealTime) }} </div>
              </div>
              <div
                class="grid grid-cols-2 grid-rows-2 gap-1 mt-15px text-[#999999] text-[14px] font-['AlibabaPuHuiTi']"
                v-show="'0' === item.warnStatus"
              >
                <div class=""> 预警状态: <span class="text-[#FF8500]">未处理</span> </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <!-- 第四行 处理预警的功能按钮 -->
              <div v-show="'0' === item.warnStatus" class="flex justify-end">
                <el-button type="primary" @click="handleDeal(item.id)"> 处理 </el-button>
                <el-button
                  @click="openForm('update', item.id)"
                  v-hasPermi="['agriculture:agri-warning-record:update']"
                >
                  编辑
                </el-button>
                <el-button
                  @click="handleDelete(item.id)"
                  v-hasPermi="['agriculture:agri-warning-record:delete']"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
          <!-- 列表形式 -->
          <div v-show="listType === 'list'">
            <el-table :data="list">
              <el-table-column align="center" prop="deviceName" label="设备名称" />
              <el-table-column align="center" label="预警类型">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="预警等级">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.AGRI_WARN_LEVEL" :value="scope.row.warnLevel" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="warnInfo"
                label="预警信息"
                class-name="text-[#E31205]"
                label-class-name="text-zinc-500"
              />
              <el-table-column align="center" label="当前值">
                <template #default="scope">
                  {{ scope.row.currentValue }}{{ scope.row.warnUnit }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="阈值">
                <template #default="scope">
                  {{ scope.row.threshold }}{{ scope.row.warnUnit }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="预警时间">
                <template #default="scope">
                  {{ timeFormat(scope.row.warnTime) }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="预警状态">
                <template #default="scope">
                  <span :class="scope.row.warnStatus === '1' ? 'text-[#009688]' : 'text-[#FF8500]'">
                    {{ scope.row.warnStatus === '1' ? '已处理' : '未处理' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="dealTime" label="处理时间">
                <template #default="scope">
                  {{ scope.row.warnStatus === '1' ? timeFormat(scope.row.dealTime) : '' }}
                </template>
              </el-table-column>
              <el-table-column align="center" prop="dealPerson" label="处理人">
                <template #default="scope">
                  {{ scope.row.warnStatus === '1' ? scope.row.dealPerson : '' }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="处理信息">
                <template #default="scope">
                  {{ scope.row.warnStatus === '1' ? scope.row.dealInfo : '' }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right" width="280px">
                <template #default="scope">
                  <el-button
                    type="primary"
                    v-show="scope.row.warnStatus !== '1'"
                    @click="handleDeal(scope.row.id)"
                  >
                    处理
                  </el-button>
                  <el-button
                    v-show="scope.row.warnStatus !== '1'"
                    @click="openForm('update', scope.row.id)"
                    v-hasPermi="['agriculture:agri-warning-record:update']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-show="scope.row.warnStatus !== '1'"
                    @click="handleDelete(scope.row.id)"
                    v-hasPermi="['agriculture:agri-warning-record:delete']"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList()"
        />
      </ContentWrap>
    </el-tab-pane>

    <!-- 表单弹窗：添加/修改 -->
    <AgriWarningRecordForm ref="formRef" @success="getList" />

    <!-- 处理预警信息对话框 -->
    <el-dialog
      :title="title"
      v-model="openDeal"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="dealData"
        :rules="dealDataRules"
        ref="dealDataFormRef"
        label-width="100px"
        size="large"
        class="grid grid-cols-1 gap-6"
      >
        <el-form-item label="处理人" prop="dealPerson">
          <el-input v-model="dealData.dealPerson" placeholder="请输入处理人" />
        </el-form-item>
        <el-form-item label="处理信息" prop="dealInfo">
          <el-input
            v-model="dealData.dealInfo"
            type="textarea"
            placeholder="请填写处理信息"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-center">
          <el-button @click="submitDialog(dealDataFormRef)" type="primary" size="large"
            ><span class="text-[16px]">确 定</span></el-button
          >
          <div class="ml-[20px]">
            <el-button @click="cancelSubmit(dealDataFormRef)" size="large"
              ><span class="text-[16px]">取 消</span></el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 监控设备预警 -->
    <el-tab-pane label="监控设备预警" name="monitorTab">
      <!-- 搜索栏 -->
      <ContentWrap>
        <el-form
          class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2"
          :model="queryParamsMonitor"
          ref="queryFormRefMonitor"
          label-width="68px"
          :inline="true"
        >
          <!-- 表单内容 -->
          <div
            class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-2 md:col-span-3 lg:col-span-4 xl:col-span-5 2xl:col-span-6 md:border-r md:border-r-solid md:border-[#E5E5E5] md:pr-20px"
          >
            <el-form-item label="基地名称" prop="monitoringBaseName">
              <el-input
                v-model="queryParamsMonitor.monitoringBaseName"
                placeholder="请输入"
                clearable
                @keyup.enter="handleQueryMonitor"
              />
            </el-form-item>
            <el-form-item label="地块名称" prop="monitoringPlotName">
              <el-input
                v-model="queryParamsMonitor.monitoringPlotName"
                placeholder="请输入"
                clearable
                @keyup.enter="handleQueryMonitor"
              />
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
              <el-input
                v-model="queryParamsMonitor.deviceName"
                placeholder="请输入"
                clearable
                @keyup.enter="handleQueryMonitor"
              />
            </el-form-item>
            <el-form-item label="事件类型" prop="noticeEvent">
              <el-select
                v-model="queryParamsMonitor.noticeEvent"
                placeholder="请选择"
                clearable
                @change="handleSelectChangeEvent"
              >
                <el-option
                  v-for="dict in options"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="拍摄时间" prop="recordTime">
              <el-date-picker
                v-model="queryParamsMonitor.recordTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              />
            </el-form-item>
          </div>
          <!-- 表单按钮 -->
          <div class="flex flex-wrap justify-center content-center md:col-span-1">
            <el-form-item>
              <el-button @click="handleQueryMonitor" type="primary">
                <Icon icon="ep:search" />
                查询
              </el-button>
              <el-button @click="resetQueryMonitor">
                <Icon icon="ep:refresh" />
                重置
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </ContentWrap>
      <!-- 数据列表 -->
      <ContentWrap>
        <!-- 第一行功能按钮 -->
        <div class="flex justify-between">
          <div class="flex flex-wrap content-center">
            <el-button type="primary" plain @click="openFormMonitor('create')">
              <el-icon><Plus /></el-icon>
              新增
            </el-button>
            <el-button plain @click="handleExportMonitor" :loading="exportLoadingMonitor">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </div>
          <div class="flex flex-wrap content-center">
            <el-radio-group v-model="listTypeMonitor" size="small" @change="cardChangeMonitor">
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
            v-show="listTypeMonitor === 'card'"
            class="grid grid-cols-8 lg:grid-cols-3 2xl:grid-cols-2 gap-3 text-[12px] 2xl:text-[14px] text-[#999999]"
          >
            <!-- 预览区 -->
            <div class="col-span-7 lg:col-span-2 2xl:col-span-1 rounded-md bg-[#F5F5F5] shadow-md">
              <div class="relative">
                <el-image
                  lazy
                  :src="currentItem.captured"
                  :preview-src-list="[currentItem.captured]"
                  preview-teleported
                  fit="cover"
                  class="w-full"
                />
                <div
                  v-show="currentItem.videoLink"
                  @click="openVideoMonitor(currentItem.videoLink)"
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded text-center leading-[40px] hover:cursor-pointer"
                >
                  <el-icon color="#FFFFFF" size="16px"><VideoCamera /></el-icon>
                </div>
                <div
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded text-center leading-[40px] hover:cursor-pointer"
                  @click="openFormMonitor('update', currentItem.id)"
                >
                  <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
                </div>
                <div
                  class="absolute bg-black opacity-50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded text-center leading-[40px] hover:cursor-pointer"
                  @click="handleDeleteMonitor(currentItem.id)"
                >
                  <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-1 my-10px px-3">
                <div
                  >基地名称:
                  <span class="text-[#666666]">{{ currentItem.monitoringBaseName }}</span></div
                >
                <div
                  >地块名称:
                  <span class="text-[#666666]">{{ currentItem.monitoringPlotName }}</span></div
                >
                <div
                  >设备名称: <span class="text-[#666666]">{{ currentItem.deviceName }}</span></div
                >
                <div
                  >事件类型: <span class="text-[#666666]">{{ currentItem.noticeEvent }}</span></div
                >
                <div
                  >消息内容: <span class="text-[#666666]">{{ currentItem.remarks }}</span></div
                >
                <div
                  >记录时间:
                  <span class="text-[#666666]">{{ timeFormat(currentItem.recordTime) }}</span></div
                >
              </div>
            </div>
            <!-- 卡片列表区 -->
            <div
              class="col-span-1 grid grid-cols-1 grid-rows-6 lg:grid-cols-2 lg:grid-rows-3 2xl:grid-cols-3 2xl:grid-rows-2 gap-3 rounded"
            >
              <div
                class="bg-[#F5F5F5] cursor-pointer 2xl:grid 2xl:grid-rows-4 shadow-md rounded-md"
                v-for="item in listMonitor"
                :key="item.id"
                @click="changCurrentItem(item)"
              >
                <el-image
                  lazy
                  :src="item.captured"
                  preview-teleported
                  fit="cover"
                  class="w-full 2xl:row-span-3"
                />
                <div
                  class="grid grid-cols-1 2xl:row-span-1 2xl:gap-1 2xl:mt-[10px] text-[4px] lg:text-[8px] xl:text-[10px] 2xl:text-[14px] ml-2px mb-2px px-3"
                >
                  <div
                    >设备名称: <span class="text-[#666666]">{{ item.deviceName }}</span></div
                  >
                  <div
                    >记录时间:
                    <span class="text-[#666666]">{{ timeFormat(item.recordTime) }}</span></div
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 列表形式 -->
          <div v-show="listTypeMonitor === 'list'">
            <el-table :data="listMonitor">
              <el-table-column align="center" prop="monitoringBaseName" label="基地名称" />
              <el-table-column align="center" prop="monitoringPlotName" label="地块名称" />
              <el-table-column align="center" prop="deviceName" label="设备名称" />
              <el-table-column align="center" prop="noticeEvent" label="事件类型" />
              <el-table-column align="center" prop="remarks" label="消息内容" />
              <el-table-column align="center" label="拍摄时间">
                <template #default="scope">
                  {{ timeFormat(scope.row.recordTime) }}
                </template>
              </el-table-column>
              <el-table-column label="抓拍图片" align="center" prop="captured">
                <template #default="scope">
                  <el-image
                    class="h-50px w-50px"
                    lazy
                    :src="scope.row.captured"
                    :preview-src-list="[scope.row.captured]"
                    preview-teleported
                    fit="cover"
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right" width="280px">
                <template #default="scope">
                  <el-button
                    type="primary"
                    v-show="scope.row.videoLink"
                    @click="openVideoMonitor(scope.row.videoLink)"
                  >
                    查看视频
                  </el-button>
                  <el-button @click="openFormMonitor('update', scope.row.id)"> 编辑 </el-button>
                  <el-button type="danger" @click="handleDeleteMonitor(scope.row.id)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <Pagination
          :total="totalMonitor"
          v-model:page="queryParamsMonitor.pageNo"
          v-model:limit="queryParamsMonitor.pageSize"
          @pagination="getListMonitor()"
        />
      </ContentWrap>
    </el-tab-pane>

    <!-- 表单弹窗：添加/修改 -->
    <MonitoringEquipmentNoticeForm ref="formRefMonitor" @success="getListMonitor" />
    <!-- 视频弹窗 -->
    <el-dialog v-model="isShow" width="900px" height="900px" @close="closeDialog" class="videoBox">
      <video :src="videoUrl" controls autoplay class="video" width="800px" height="800px"></video>
    </el-dialog>
  </el-tabs>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AgriWarningRecordApi, AgriWarningRecordVO } from '@/api/agriculture/agriwarningrecord'
import AgriWarningRecordForm from './AgriWarningRecordForm.vue'
import {
  MonitoringEquipmentNoticeApi,
  MonitoringEquipmentNoticeVO
} from '@/api/agriculture/monitoringequipmentnotice'
import MonitoringEquipmentNoticeForm from '@/views/agriculture/monitoringequipmentnotice/MonitoringEquipmentNoticeForm.vue'
import { useRoute } from 'vue-router'
import { getTenantId } from '@/utils/auth'
import { CACHE_KEY } from '@/hooks/web/useCache'
import { useUserStore } from '@/store/modules/user'
import { da, vi } from 'node_modules/element-plus/es/locale'

const activeName = ref('sensorTab')

const changeTab = (tab: any) => {
  if ('monitorTab' === tab.props.name) {
    visible.value = false
    getListMonitor()
  } else {
    visible.value = true
    getList()
  }
}

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

// --------------------------- sensorTab ---------------------------
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  warnTime: [],
  warnStatus: undefined,
  deviceType: undefined,
  warnType: undefined,
  id: undefined
})
const queryFormRef = ref()
const loading = ref(true) // 列表的加载中
const show = ref()
const userStore = useUserStore()
//获取部门ID
const userName = computed(() => userStore.user.deptId ?? '0')
const list = ref<AgriWarningRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数

const getList = async () => {
  loading.value = true
  //show的值是部门ID的值
  show.value = userName.value
  // 卡片形式每页加载9项，列表形式每页加载10项
  // queryParams.pageSize = listType.value === 'card' ? 9 : 10
  try {
    const data = await AgriWarningRecordApi.getAgriWarningRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 查询
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 重置整个页面
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 预警等级从数字转换成汉字
const getWarnLevel = (level: string) => {
  const warnLevelDict = {
    '1': '一级',
    '2': '二级',
    '3': '三级'
  }
  return warnLevelDict[level]
}

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

// 列表展示的形式
const listType = ref('card')

// 预警信息提示框是否显示
const visible = ref(true)

const cardChange = () => {
  if ('card' === listType.value) {
    visible.value = true
  } else {
    visible.value = false
  }
  queryParams.pageNo = 1
  getList()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AgriWarningRecordApi.deleteAgriWarningRecord(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const exportLoading = ref(false) // 导出的加载中

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AgriWarningRecordApi.exportAgriWarningRecord(queryParams)
    download.excel(data, '预警记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const dealData = ref({
  id: undefined,
  parkCode: undefined,
  plotCode: undefined,
  deviceCode: undefined,
  warnInfo: undefined,
  currentValue: undefined,
  threshold: undefined,
  warnTime: undefined,
  warnStatus: undefined,
  dealTime: undefined,
  dealPerson: undefined,
  dealPersonId: undefined,
  dealInfo: undefined,
  deviceType: undefined,
  imgId: undefined,
  warnType: undefined,
  warnUnit: undefined,
  warnTitle: undefined,
  warnLevel: undefined
} as any)

const dealDataRules = reactive({
  dealPerson: [{ required: true, message: '处理人不能为空', trigger: 'blur' }],
  dealInfo: [{ required: true, message: '处理信息不能为空', trigger: 'blur' }]
})

const title = ref('')

const openDeal = ref(false)

const resetForm = () => {
  dealData.value = {
    id: undefined,
    parkCode: undefined,
    plotCode: undefined,
    deviceCode: undefined,
    warnInfo: undefined,
    currentValue: undefined,
    threshold: undefined,
    warnTime: undefined,
    warnStatus: undefined,
    dealTime: undefined,
    dealPerson: undefined,
    dealPersonId: undefined,
    dealInfo: undefined,
    deviceType: undefined,
    imgId: undefined,
    warnType: undefined,
    warnUnit: undefined,
    warnTitle: undefined,
    warnLevel: undefined
  }
}

/** 处理按钮操作 */
const handleDeal = async (id: number) => {
  openDeal.value = true
  title.value = '预警处理'
  resetForm()
  // 修改时，设置数据
  console.log('ID', id)
  if (id) {
    try {
      dealData.value = await AgriWarningRecordApi.getAgriWarningRecord(id)
    } finally {
    }
  }
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitDialog = async (formEl) => {
  if (!formEl) return
  let allowSubmit = false
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      allowSubmit = true
    } else {
      console.log('error submit!', fields)
    }
  })
  if (allowSubmit) {
    try {
      // console.log("dealData", dealData.value)
      dealData.value.dealTime = new Date().valueOf()
      dealData.value.warnStatus = '1'
      const data = dealData.value as unknown as AgriWarningRecordVO
      // console.log("data", data)
      await AgriWarningRecordApi.updateAgriWarningRecord(data)
      message.success(t('common.updateSuccess'))
      openDeal.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      resetQuery()
    }
  }
}
// 取消提交
const dealDataFormRef = ref()
const cancelSubmit = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  openDeal.value = false
}
// --------------------------- sensorTab ---------------------------

// --------------------------- monitorTab --------------------------
// openVideo
let videoUrl = ref()
let isShow = ref(false)
const openVideoMonitor = (video: any) => {
  videoUrl.value = video
  isShow.value = true
}
const closeDialog = () => {
  isShow.value = false
}
const queryFormRefMonitor = ref() // 搜索的表单
const exportLoadingMonitor = ref(false) // 导出的加载中
const listMonitor = ref<MonitoringEquipmentNoticeVO[]>([]) // 列表的数据
const totalMonitor = ref(0) // 列表的总页数
const queryParamsMonitor = reactive({
  pageNo: 1,
  pageSize: 10,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  captured: undefined,
  videoLink: undefined,
  noticeEvent: undefined,
  recordTime: [],
  remarks: undefined,
  createTime: []
})
const options = [
  {
    value: '逗留',
    label: '逗留'
  },
  {
    value: '经过',
    label: '经过'
  },
  {
    value: '非法入侵',
    label: '非法入侵'
  }
]

const currentItem = ref({
  id: undefined,
  deviceId: undefined,
  deviceName: undefined,
  monitoringBaseId: undefined,
  monitoringBaseName: undefined,
  monitoringPlotId: undefined,
  monitoringPlotName: undefined,
  captured: undefined,
  videoLink: undefined,
  noticeEvent: undefined,
  recordTime: undefined,
  remarks: undefined,
  createTime: undefined
})

/** 查询列表 */
const getListMonitor = async () => {
  loading.value = true
  // 卡片形式每页加载6项，列表形式每页加载10项
  queryParamsMonitor.pageSize = listTypeMonitor.value === 'card' ? 6 : 10
  try {
    const data =
      await MonitoringEquipmentNoticeApi.getMonitoringEquipmentNoticePage(queryParamsMonitor)
    listMonitor.value = data.list
    totalMonitor.value = data.total
    if ('card' === listTypeMonitor.value) {
      currentItem.value = listMonitor.value[0]
      console.log('aaaaaaaaaaaa', currentItem.value)
    }
  } finally {
    loading.value = false
  }
}

if (show.value === 119 || show.value === 120) getListMonitor()

/** 搜索按钮操作 */
const handleQueryMonitor = () => {
  queryParamsMonitor.pageNo = 1
  getListMonitor()
}
/** 重置按钮操作 */
const resetQueryMonitor = () => {
  queryFormRefMonitor.value.resetFields()
  handleQueryMonitor()
}

// 列表展示的形式
const listTypeMonitor = ref('card')

const cardChangeMonitor = () => {
  queryParamsMonitor.pageNo = 1
  getListMonitor()
}

const changCurrentItem = (item: any) => {
  currentItem.value = item
}

/** 添加/修改操作 */
const formRefMonitor = ref()
const openFormMonitor = (type: string, id?: number) => {
  formRefMonitor.value.open(type, id)
}

/** 删除按钮操作 */
const handleDeleteMonitor = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MonitoringEquipmentNoticeApi.deleteMonitoringEquipmentNotice(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getListMonitor()
  } catch {}
}
/** 导出按钮操作 */
const handleExportMonitor = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await MonitoringEquipmentNoticeApi.exportMonitoringEquipmentNotice(queryParams)
    download.excel(data, '监控设备通知.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
// --------------------------- monitorTab --------------------------

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
/* 消除element部分组件的部分样式 */
.el-tabs__nav-wrap::after {
  display: none;
}
.el-form-item {
  margin-bottom: 0;
}
.el-form-item--small {
  margin-bottom: 0;
}
.el-form--inline .el-form-item {
  margin-right: 0;
}
.el-range-editor.el-input__wrapper {
  padding: 0;
}
.el-button + .el-button {
  margin-left: 10px;
}

/* 单个卡片样式 */
.card-item {
  width: 100%;
  height: 260px;
  border-radius: 4px;
  opacity: 1;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  box-shadow: 0px 2px 10px 0px rgba(153, 153, 153, 0.5);
  padding: 20px;
}
/* 预警信息提示框样式 */
.warn-popover {
  color: #e31205;
  font: 16px 'AlibabaPuHuiTi';
  width: 95%;
  border: none;
  background-color: hsla(4, 96%, 45%, 0.08);
  margin-top: 10px;
  padding: 15px;
  border-radius: 5px;
  position: relative;
}
</style>
