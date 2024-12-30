<template>
  <el-tabs v-model="activeName" @tab-click="changeTab">
    <!-- 传感设备预警 -->
    <el-tab-pane name="sensorTab">
      <template #label>
        <el-badge :value="total" class="item">
          <span class="px-2">传感设备预警</span>
        </el-badge>
      </template>

      <el-card
        class="!overflow-visible"
        body-style="padding: 16px; display: flex; flex-direction: column;"
        shadow="never"
      >
        <!-- title -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-[16px]">
            <h1 class="m-0 text-[18px] pr-[16px]" style="border-right: 1px solid #e6e6e6">
              传感设备预警
            </h1>
            <el-button
              type="primary"
              @click="openForm('create')"
              v-hasPermi="['agriculture:agri-warning-record:create']"
            >
              <Icon icon="ep:plus" />
              <span>新增</span>
            </el-button>
          </div>
          <div class="flex items-center space-x-[8px]">
            <el-button type="primary" @click="handleQuery">
              <Icon icon="ep:search" />
              <span>搜索</span>
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" />
              <span>重置</span>
            </el-button>
            <el-button
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['agriculture:agri-warning-record:export']"
            >
              <Icon icon="ep:download" />
              <span>导出</span>
            </el-button>
            <!-- el-radio-button比el-button高 和button放在一行突兀 所以用el-button实现el-radio-button效果 单独使用时el-radio-button更佳 -->
            <div class="flex">
              <el-button
                @click="listType = 'list'"
                class="!rounded-r-none"
                :class="`${listType === 'list' && 'tab-active'}`"
              >
                <Icon icon="ep:list" />
              </el-button>
              <el-button
                @click="listType = 'card'"
                class="!ml-0 !rounded-l-none"
                :class="`${listType === 'card' && 'tab-active'}`"
              >
                <Icon icon="ep:menu" />
              </el-button>
            </div>
            <div
              class="w-[20px] h-[20px] !ml-[16px] text-center leading-[22px] rounded-full cursor-pointer transition-all"
              :class="showSearch ? 'rotate-0' : 'rotate-180'"
              style="border: 1px solid #e6e6e6"
              @click="showSearch = !showSearch"
            >
              <el-icon :size="14"><ArrowUpBold /></el-icon>
            </div>
          </div>
        </div>

        <!-- search form -->
        <el-form
          :model="queryParams"
          ref="queryFormRef"
          class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-[8px] mt-[16px] form overflow-hidden"
          :style="`${!showSearch && 'height: 0'}`"
          label-width="95px"
          :inline="true"
        >
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
        </el-form>
        <!-- 第二行列表数据 -->
        <div class="mt-[20px]">
          <!-- 卡片形式 -->
          <div v-show="listType === 'card'" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in list"
              :key="item.id"
              :class="themeIsDark ? 'card-item-dark' : 'card-item'"
            >
              <!-- 第一行 -->
              <div class="h-[37px] flex md:block xl:flex md:mb-[5px] 2xl:mb-0">
                <div class="text-[18px] md:text-[12px] lg:text-[14px] 2xl:text-[18px]">
                  {{ item.deviceName }}
                </div>
                <dict-tag
                  class="ml-20px md:ml-0 xl:ml-20px md:!text-[10px] md:!h-[16px] 2xl:!text-[12px] 2xl:!h-[20px]"
                  :type="DICT_TYPE.AGRI_WARN_LEVEL"
                  :value="item.warnLevel"
                />
                <!--                <dict-tag-->
                <!--                  class="ml-10px md:!text-[10px] md:!h-[16px] 2xl:!text-[12px] 2xl:!h-[20px]"-->
                <!--                  :type="DICT_TYPE.AGRI_MONITOR_TYPE"-->
                <!--                  :value="item.warnType"-->
                <!--                />-->
                <el-tag class="ml-10px md:!text-[10px] md:!h-[16px] 2xl:!text-[12px] 2xl:!h-[20px]">
                  {{ item.warnType }}
                </el-tag>
              </div>
              <!-- 第二行 -->
              <div class="text-[14px] md:text-[10px] 2xl:text-[14px] text-[#999999]">
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
              <div class="warn-popover text-[16px] md:text-[10px] lg:text-[12px] 2xl:text-[16px]">
                <el-icon>
                  <WarnTriangleFilled />
                </el-icon>
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
                class="grid grid-cols-2 grid-rows-2 gap-1 mt-15px text-[#999999] text-[14px] md:text-[10px] 2xl:text-[14px]"
                v-show="'1' === item.warnStatus"
              >
                <div class="">
                  预警状态:
                  <span class="text-[#009688]">已处理</span>
                </div>
                <div>处理人: {{ item.dealPerson }}</div>
                <div>处理信息: {{ item.dealInfo }}</div>
                <div>处理时间: {{ timeFormat(item.dealTime) }}</div>
              </div>
              <div
                class="grid grid-cols-2 grid-rows-2 gap-1 mt-15px text-[#999999] text-[14px] md:text-[10px] 2xl:text-[14px]"
                v-show="'0' === item.warnStatus"
              >
                <div class="">
                  预警状态:
                  <span class="text-[#FF8500]">未处理</span>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <!-- 第四行 处理预警的功能按钮 -->
              <div v-show="'0' === item.warnStatus" class="flex justify-end">
                <el-button type="primary" @click="handleDeal(item.id)">处理</el-button>
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
                  <el-tag type="primary">{{ scope.row.warnType }}</el-tag>
                  <!--                  <dict-tag :type="DICT_TYPE.AGRI_MONITOR_TYPE" :value="scope.row.warnType" />-->
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
              <el-table-column align="center" label="操作" fixed="right" min-width="184px">
                <template #default="scope">
                  <div class="flex items-center justify-center">
                    <el-button
                      link
                      type="primary"
                      v-show="scope.row.warnStatus !== '1'"
                      @click="handleDeal(scope.row.id)"
                    >
                      处理
                    </el-button>
                    <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                    <el-button
                      link
                      v-show="scope.row.warnStatus !== '1'"
                      @click="openForm('update', scope.row.id)"
                      v-hasPermi="['agriculture:agri-warning-record:update']"
                    >
                      编辑
                    </el-button>
                    <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                    <el-button
                      link
                      v-show="scope.row.warnStatus !== '1'"
                      @click="handleDelete(scope.row.id)"
                      v-hasPermi="['agriculture:agri-warning-record:delete']"
                    >
                      删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>

      <!-- pagination -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList()"
      />
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
          <el-button @click="submitDialog(dealDataFormRef)" type="primary" size="large">
            <span class="text-[16px]">确 定</span>
          </el-button>
          <div class="ml-[20px]">
            <el-button @click="cancelSubmit(dealDataFormRef)" size="large">
              <span class="text-[16px]">取 消</span>
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 监控设备预警 -->
    <el-tab-pane name="monitorTab">
      <template #label>
        <el-badge :value="totalMonitor" class="item">
          <span class="px-2">监控设备预警</span>
        </el-badge>
      </template>

      <el-card
        class="!overflow-visible"
        body-style="padding: 16px; display: flex; flex-direction: column;"
        shadow="never"
      >
        <!-- title -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-[16px]">
            <h1 class="m-0 text-[18px] pr-[16px]" style="border-right: 1px solid #e6e6e6">
              监控设备预警
            </h1>
            <el-button type="primary" @click="openFormMonitor('create')">
              <Icon icon="ep:plus" />
              <span>新增</span>
            </el-button>
          </div>
          <div class="flex items-center space-x-[8px]">
            <el-button type="primary" @click="handleQueryMonitor">
              <Icon icon="ep:search" />
              <span>搜索</span>
            </el-button>
            <el-button @click="resetQueryMonitor">
              <Icon icon="ep:refresh" />
              <span>重置</span>
            </el-button>
            <el-button @click="handleExportMonitor" :loading="exportLoadingMonitor">
              <Icon icon="ep:download" />
              <span>导出</span>
            </el-button>
            <!-- el-radio-button比el-button高 和button放在一行突兀 所以用el-button实现el-radio-button效果 单独使用时el-radio-button更佳 -->
            <div class="flex">
              <el-button
                @click="listTypeMonitor = 'list'"
                class="!rounded-r-none"
                :class="`${listTypeMonitor === 'list' && 'tab-active'}`"
              >
                <Icon icon="ep:list" />
              </el-button>
              <el-button
                @click="listTypeMonitor = 'card'"
                class="!ml-0 !rounded-l-none"
                :class="`${listTypeMonitor === 'card' && 'tab-active'}`"
              >
                <Icon icon="ep:menu" />
              </el-button>
            </div>
            <div
              class="w-[20px] h-[20px] !ml-[16px] text-center leading-[22px] rounded-full cursor-pointer transition-all"
              :class="showSearch ? 'rotate-0' : 'rotate-180'"
              style="border: 1px solid #e6e6e6"
              @click="showSearch = !showSearch"
            >
              <el-icon :size="14"><ArrowUpBold /></el-icon>
            </div>
          </div>
        </div>

        <!-- search form -->
        <el-form
          :model="queryParamsMonitor"
          ref="queryFormRefMonitor"
          class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-y-[8px] mt-[16px] form overflow-hidden"
          :style="`${!showSearch && 'height: 0'}`"
          label-width="95px"
          :inline="true"
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
            <el-select v-model="queryParamsMonitor.noticeEvent" placeholder="请选择" clearable>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.AGRI_NOTICEEVENT_TYPE)"
                :key="dict.label"
                :label="dict.label"
                :value="dict.label"
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
              clearable
            />
          </el-form-item>
        </el-form>

        <!-- main content -->
        <div class="mt-[16px]">
          <!-- list -->
          <el-table
            v-show="listTypeMonitor === 'list'"
            :data="listMonitor"
            v-loading="loading"
            :show-overflow-tooltip="true"
          >
            <el-table-column align="center" prop="monitoringBaseName" label="基地名称" />
            <el-table-column align="center" prop="monitoringPlotName" label="地块名称" />
            <el-table-column align="center" prop="deviceName" label="设备名称" />
            <el-table-column label="事件类型" align="center" prop="noticeEvent">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.AGRI_NOTICEEVENT_TYPE" :value="scope.row.noticeEvent" />
              </template>
            </el-table-column>
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
                  :src="scope.row.captured"
                  :preview-src-list="[scope.row.captured]"
                  preview-teleported
                  fit="contain"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right" min-width="184px">
              <template #default="scope">
                <div class="flex items-center justify-center">
                  <el-button
                    link
                    type="primary"
                    v-show="scope.row.videoLink"
                    @click="openVideoMonitor(scope.row.videoLink)"
                  >
                    查看视频
                  </el-button>
                  <div
                    v-show="scope.row.videoLink"
                    class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"
                  ></div>
                  <el-button link @click="openFormMonitor('update', scope.row.id)">编辑</el-button>
                  <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
                  <el-button link type="danger" @click="handleDeleteMonitor(scope.row.id)">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- card -->
          <div
            v-show="listTypeMonitor === 'card'"
            v-loading="loading"
            class="grid grid-cols-2 gap-[16px]"
          >
            <div>
              <div
                class="sticky top-0 w-full pb-[16px] rounded-b-[4px] shadow-md dark:shadow-[#000]"
              >
                <template v-if="currentIdx !== -1 && list[currentIdx]">
                  <div class="w-full pb-[56.25%] relative">
                    <el-image
                      :src="listMonitor[currentIdx].captured"
                      :alt="listMonitor[currentIdx].deviceName"
                      :preview-src-list="[listMonitor[currentIdx].captured]"
                      preview-teleported
                      fit="cover"
                      class="!absolute top-0 left-0 w-full h-full"
                    />
                    <div
                      v-show="listMonitor[currentIdx].videoLink"
                      @click="openVideoMonitor(listMonitor[currentIdx].videoLink)"
                      class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[110px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                    >
                      <el-icon size="16px"><VideoCamera /></el-icon>
                    </div>
                    <div
                      class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[60px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                      @click="openForm('update', listMonitor[currentIdx].id)"
                    >
                      <el-icon color="#FFFFFF" size="16px"><Edit /></el-icon>
                    </div>
                    <div
                      class="absolute bg-black/50 w-[40px] h-[40px] bottom-[11px] right-[10px] rounded-[6px] text-center text-white leading-[40px] cursor-pointer"
                      @click="handleDelete(listMonitor[currentIdx].id)"
                    >
                      <el-icon color="#FFFFFF" size="16px"><Delete /></el-icon>
                    </div>
                  </div>
                  <div class="text-[8px] 2xl:text-[10px]">
                    <div class="p-[1.6em] flex justify-between">
                      <span class="font-bold text-[1.4em]">
                        {{ listMonitor[currentIdx].deviceName }}
                      </span>
                      <span class="text-[#999] text-[1.4em]">
                        {{ timeFormat(listMonitor[currentIdx].recordTime) }}
                      </span>
                    </div>
                    <div style="border-bottom: 1px dashed #e6e6e6" class="mx-[1.6em]"></div>
                    <div class="mt-[1.6em] px-[1.6em] flex justify-between">
                      <span class="text-[#999] text-[1.4em]">基地名称:</span>
                      <span class="text-[#999] text-[1.4em]">
                        {{ listMonitor[currentIdx].monitoringBaseName }}
                      </span>
                    </div>
                    <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                      <span class="text-[#999] text-[1.4em]">地块名称:</span>
                      <span class="text-[#999] text-[1.4em]">
                        {{ listMonitor[currentIdx].monitoringPlotName }}
                      </span>
                    </div>
                    <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                      <span class="text-[#999] text-[1.4em]">事件类型:</span>
                      <span class="text-[#999] text-[1.4em]">
                        <dict-tag
                          :type="DICT_TYPE.AGRI_NOTICEEVENT_TYPE"
                          :value="listMonitor[currentIdx].noticeEvent"
                        />
                      </span>
                    </div>
                    <div class="mt-[0.8em] px-[1.6em] flex justify-between">
                      <span class="text-[#999] text-[1.4em]">消息内容:</span>
                      <span class="text-[#999] text-[1.4em]">
                        {{
                          listMonitor[currentIdx].remarks ? listMonitor[currentIdx].remarks : '无'
                        }}
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="w-full pb-[56.25%] no-data"></div>
                </template>
              </div>
            </div>
            <div>
              <div class="grid grid-cols-2 xl:grid-cols-3 gap-[16px]">
                <div
                  class="cursor-pointer shadow-md rounded-[4px] overflow-hidden pb-[16px] dark:bg-[#333] dark:shadow-[#000]"
                  v-for="(item, index) in listMonitor"
                  :key="item.id"
                  @click="currentIdx = index"
                  :style="`${index === currentIdx && 'border: 1px solid var(--el-color-primary)'}`"
                >
                  <div class="w-full pb-[56.25%] relative">
                    <el-image
                      :src="item.captured"
                      :alt="item.deviceName"
                      fit="cover"
                      class="!absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                  <div class="text-[8px] 2xl:text-[10px] px-[1.6em] mt-[1.6em]">
                    <div>
                      <span class="truncate text-[1.4em]">{{ item.deviceName }}</span>
                    </div>
                    <div class="mt-[0.8em]">
                      <span class="truncate text-[1.4em]">{{ timeFormat(item.recordTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- pagination -->
          <Pagination
            :total="totalMonitor"
            v-model:page="queryParamsMonitor.pageNo"
            v-model:limit="queryParamsMonitor.pageSize"
            @pagination="getListMonitor()"
          />
        </div>
      </el-card>
    </el-tab-pane>

    <!-- 表单弹窗：添加/修改 -->
    <MonitoringEquipmentNoticeForm ref="formRefMonitor" @success="handleUpdateSuccess" />
    <!-- 视频弹窗 -->
    <el-dialog v-model="isShow" width="900px" height="900px" @close="closeDialog" class="videoBox">
      <video :src="videoUrl" controls autoplay class="video" width="800px" height="800px"></video>
    </el-dialog>
  </el-tabs>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import { dateFormatter } from '@/utils/formatTime';
import download from '@/utils/download';
import { AgriWarningRecordApi, AgriWarningRecordVO } from '@/api/agriculture/agriwarningrecord';
import AgriWarningRecordForm from './AgriWarningRecordForm.vue';
import {
  MonitoringEquipmentNoticeApi,
  MonitoringEquipmentNoticeVO
} from '@/api/agriculture/monitoringequipmentnotice';
import MonitoringEquipmentNoticeForm from '@/views/agriculture/monitoringequipmentnotice/MonitoringEquipmentNoticeForm.vue';
import { useRoute } from 'vue-router';
import { getTenantId } from '@/utils/auth';
import { CACHE_KEY } from '@/hooks/web/useCache';
import { useUserStore } from '@/store/modules/user';
import { getUserProfile } from '@/api/system/user/profile';
// import { da, vi } from 'node_modules/element-plus/es/locale'

const deptName = ref();
const showDeptId = async () => {
  let res = await getUserProfile();
  deptName.value = res.nickname;
};
showDeptId();

const hiddenMonitorTab = ref<boolean>(true);
const judgeMonitorHidden = () => {
  const tenantName = localStorage.getItem('TENANT_NAME');
  console.log('=========', tenantName !== '太原乡村振兴数字化赋能');

  hiddenMonitorTab.value = tenantName !== '太原乡村振兴数字化赋能';
};
judgeMonitorHidden();
const activeName = ref('sensorTab');

const changeTab = (tab: any) => {
  if ('monitorTab' === tab.props.name) {
    visible.value = false;
    getListMonitor();
  } else {
    visible.value = true;
    getList();
  }
};

const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

// --------------------------- sensorTab ---------------------------
const queryParams = reactive({
  pageNo: 1,
  pageSize: 9,
  warnTime: [],
  warnStatus: undefined,
  deviceType: undefined,
  warnType: undefined,
  id: undefined
});
const queryFormRef = ref();
const loading = ref(true); // 列表的加载中
const show = ref();
const userStore = useUserStore();
//获取部门ID
const userName = computed(() => userStore.user.deptId ?? '0');
const list = ref<AgriWarningRecordVO[]>([]); // 列表的数据
const total = ref(0); // 列表的总页数

const getList = async () => {
  loading.value = true;
  //show的值是部门ID的值
  show.value = userName.value;
  // 卡片形式每页加载9项，列表形式每页加载10项
  // queryParams.pageSize = listType.value === 'card' ? 9 : 10
  try {
    const data = await AgriWarningRecordApi.getAgriWarningRecordPage(queryParams);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
  console.log('列表数据', list.value);
};

// 查询
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

// 重置整个页面
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

// 预警等级从数字转换成汉字
const getWarnLevel = (level: string) => {
  const warnLevelDict = {
    '1': '一级',
    '2': '二级',
    '3': '三级'
  };
  return warnLevelDict[level];
};

// 时间戳转换成 YYYY-MM-DD HH:MM:SS
const timeFormat = (dataString: string) => {
  //dataString是整数，否则要parseInt转换
  var time = new Date(dataString);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var hour = time.getHours();
  var minute = time.getMinutes();
  var second = time.getSeconds();
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
  );
};

// 列表展示的形式
const listType = ref('card');

// 预警信息提示框是否显示
const visible = ref(true);

const cardChange = () => {
  if ('card' === listType.value) {
    visible.value = true;
  } else {
    visible.value = false;
  }
  queryParams.pageNo = 1;
  getList();
};

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id);
};

// 新增前 重置表单 然后设置查询最后一页
// if (type === "create") {
//   resetQuery()

//   if ( total.value % queryParams.pageSize === 0 ) {
//     queryParams.pageNo = Math.ceil( total.value / queryParams.pageSize ) + 1;
//   } else {
//     queryParams.pageNo = Math.ceil( total.value / queryParams.pageSize );
//   }
// }

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await AgriWarningRecordApi.deleteAgriWarningRecord(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
};

const exportLoading = ref(false); // 导出的加载中

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await AgriWarningRecordApi.exportAgriWarningRecord(queryParams);
    download.excel(data, '预警记录.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};

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
} as any);

const dealDataRules = reactive({
  dealPerson: [{ required: true, message: '处理人不能为空', trigger: 'blur' }],
  dealInfo: [{ required: true, message: '处理信息不能为空', trigger: 'blur' }]
});

const title = ref('');

const openDeal = ref(false);

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
  };
};

/** 处理按钮操作 */
const handleDeal = async (id: number) => {
  openDeal.value = true;
  title.value = '预警处理';
  // resetForm()
  // 修改时，设置数据
  console.log('ID', id);
  if (id) {
    try {
      dealData.value = await AgriWarningRecordApi.getAgriWarningRecord(id);
    } finally {
    }
  }
};
/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitDialog = async (formEl) => {
  if (!formEl) return;
  let allowSubmit = false;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      allowSubmit = true;
    } else {
      console.log('error submit!', fields);
    }
  });
  if (allowSubmit) {
    try {
      // console.log("dealData", dealData.value)
      dealData.value.dealTime = new Date().valueOf();
      dealData.value.warnStatus = '1';
      const data = dealData.value as unknown as AgriWarningRecordVO;
      // console.log("data", data)
      await AgriWarningRecordApi.updateAgriWarningRecord(data);
      message.success(t('common.updateSuccess'));
      openDeal.value = false;
      // 发送操作成功的事件
      emit('success');
    } finally {
      // resetQuery()
      getList();
    }
  }
};
// 取消提交
const dealDataFormRef = ref();
const cancelSubmit = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  openDeal.value = false;
};
// --------------------------- sensorTab ---------------------------

// --------------------------- monitorTab --------------------------
// openVideo
let videoUrl = ref();
let isShow = ref(false);
const openVideoMonitor = (video: any) => {
  videoUrl.value = video;
  isShow.value = true;
};
const closeDialog = () => {
  isShow.value = false;
};
const queryFormRefMonitor = ref(); // 搜索的表单
const exportLoadingMonitor = ref(false); // 导出的加载中
const listMonitor = ref<MonitoringEquipmentNoticeVO[]>([]); // 列表的数据
const totalMonitor = ref(0); // 列表的总页数
const queryParamsMonitor = reactive({
  pageNo: 1,
  pageSize: 9,
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
});
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
];

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
});

// 当前查看的数据下标
const currentIdx = ref(-1);

/** 查询列表 */
const getListMonitor = async () => {
  loading.value = true;
  currentIdx.value = -1;
  // // 卡片形式每页加载6项，列表形式每页加载10项
  // queryParamsMonitor.pageSize = listTypeMonitor.value === 'card' ? 6 : 10
  try {
    const data =
      await MonitoringEquipmentNoticeApi.getMonitoringEquipmentNoticePage(queryParamsMonitor);
    listMonitor.value = data.list;
    totalMonitor.value = data.total;
    if ('card' === listTypeMonitor.value) {
      // currentItem.value = listMonitor.value[0];
      currentIdx.value = listMonitor.value.length > 0 ? 0 : -1;
    }
  } finally {
    loading.value = false;
  }
};

if (show.value === 119 || show.value === 120) getListMonitor();

/** 搜索按钮操作 */
const handleQueryMonitor = () => {
  queryParamsMonitor.pageNo = 1;
  getListMonitor();
};
/** 重置按钮操作 */
const resetQueryMonitor = () => {
  queryFormRefMonitor.value.resetFields();
  handleQueryMonitor();
};

// 列表展示的形式
const listTypeMonitor = ref('card');

const cardChangeMonitor = () => {
  queryParamsMonitor.pageNo = 1;
  getListMonitor();
};

const changCurrentItem = (item: any) => {
  currentItem.value = item;
};

/** 添加/修改操作 */
const formRefMonitor = ref();
const tmpIndex = ref(-1);
const openFormMonitor = (type: string, id?: number) => {
  // 新增和编辑前 保存当前编辑项的下标
  if ('card' === listTypeMonitor.value) {
    tmpIndex.value = listMonitor.value.findIndex((ele) => {
      return ele.id === listMonitor.value[currentIdx.value].id;
    });
  }

  formRefMonitor.value.open(type, id);
};

// 新增和修改成功后调用的函数
const handleUpdateSuccess = async () => {
  await getListMonitor();
  if ('card' !== listTypeMonitor.value) return;
  if (-1 !== tmpIndex.value) {
    // currentItem.value = listMonitor.value[tmpIndex.value];
    currentIdx.value = tmpIndex.value;
    tmpIndex.value = -1;
  }

  // 新增前 重置表单 然后设置查询最后一页
  // if (-1 === tmpIndex.value) {
  //   resetQueryMonitor()
  //   if ( totalMonitor.value % queryParamsMonitor.pageSize === 0 ) {
  //     queryParamsMonitor.pageNo =
  //       Math.ceil( totalMonitor.value / queryParamsMonitor.pageSize ) + 1;
  //   } else {
  //     queryParamsMonitor.pageNo =
  //       Math.ceil( totalMonitor.value / queryParamsMonitor.pageSize );
  //   }
  //   await getListMonitor()
  // }
};

/** 删除按钮操作 */
const handleDeleteMonitor = async (id: number) => {
  // 删除之前 记录下currentItem的下标 列表刷新后直接显示记录下标的项
  let idx: number = -1;
  idx = listMonitor.value.findIndex((ele) => ele.id === listMonitor.value[currentIdx.value].id);

  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await MonitoringEquipmentNoticeApi.deleteMonitoringEquipmentNotice(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getListMonitor();
  } catch {
    console.log('删除失败');
  }

  // 删除后 设置curItem
  // 如果删除成功 则下标处是删除后的下一项
  // 如果删除失败 则下标处是原来的项
  if (-1 === idx) return;
  if (idx >= listMonitor.value.length) {
    currentIdx.value = listMonitor.value.length - 1;
  } else {
    currentIdx.value = idx;
  }
};
/** 导出按钮操作 */
const handleExportMonitor = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm();
    // 发起导出
    exportLoading.value = true;
    const data = await MonitoringEquipmentNoticeApi.exportMonitoringEquipmentNotice(queryParams);
    download.excel(data, '监控设备通知.xls');
  } catch {
  } finally {
    exportLoading.value = false;
  }
};
// --------------------------- monitorTab --------------------------

onMounted(() => {
  getList();
  getListMonitor();
  // 获取当前是否是深色主题
  themeIsDark.value = appStore.getIsDark;
});

import { useAppStore } from '@/store/modules/app';
import { watch } from 'vue';
import { ArrowUpBold, Delete, Edit, VideoCamera } from '@element-plus/icons-vue';

const appStore = useAppStore();
const themeIsDark = ref(false);

// 监听主题模式变化
watch(
  () => appStore.isDark,
  (newVal, oldVal) => {
    console.log('isDark', newVal, oldVal);
    themeIsDark.value = newVal;
  }
);

const showSearch = ref(true);
</script>

<style scoped lang="scss">
/* 消除element部分组件的部分样式 */
//.el-tabs__nav-wrap::after {
//  display: none;
//}
//.el-form-item {
//  margin-bottom: 0;
//}
//.el-form-item--small {
//  margin-bottom: 0;
//}
//.el-form--inline .el-form-item {
//  margin-right: 0;
//}
//.el-range-editor.el-input__wrapper {
//  padding: 0;
//}
//.el-button + .el-button {
//  margin-left: 10px;
//}

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

.card-item-dark {
  width: 100%;
  height: 260px;
  border-radius: 4px;
  opacity: 1;
  background-color: #343a46;
  box-sizing: border-box;
  box-shadow: 0px 2px 5px 0px rgba(153, 153, 153, 0.5);
  padding: 20px;
}

/* 预警信息提示框样式 */
.warn-popover {
  color: #e31205;
  width: 95%;
  border: none;
  background-color: hsla(4, 96%, 45%, 0.08);
  margin-top: 10px;
  padding: 15px;
  border-radius: 5px;
  position: relative;
}

.tab-active {
  color: white;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

// 鼠标移在按钮上时显示主题色边框
:deep(.el-button:hover) {
  border-color: var(--el-color-primary);
}

// 去掉表单的边距
:deep(.form > *) {
  margin: 0;
}

// 调整表单标签和输入框之间的距离
:deep(.form .el-form-item__label) {
  padding: 0 4px 0 0;
}

.no-data {
  background-image: url(/images/noData.png);
  background-size: 100% 100%;
}
</style>

<style lang="scss">
.video-dialog .el-dialog__body {
  height: calc(100% - 54px);
  box-sizing: border-box;
}
</style>
