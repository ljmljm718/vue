<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="计划编码" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入计划编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入计划名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="所属基地" prop="belongPark">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.belongPark"-->
      <!--          placeholder="请输入所属基地"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="基地名称" prop="parkName">
        <!-- <el-input
          v-model="queryParams.parkName"
          placeholder="请输入基地名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.parkName" placeholder="请选择所属基地">
          <template #append>
            <el-button @click="openParkPopup('0')">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <!--      <el-form-item label="所属地块" prop="belongPlot">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.belongPlot"-->
      <!--          placeholder="请输入所属地块"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="地块名称" prop="plotName">
        <!-- <el-input
          v-model="queryParams.plotName"
          placeholder="请输入地块名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        /> -->
        <el-input v-model="queryParams.plotName" placeholder="请选择所属地块">
          <template #append>
            <el-button @click="openPlotPopup(queryParams.belongPark)">
              <Icon icon="ep:search" />
              选择
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <!--      <el-form-item label="作物id" prop="cropId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.cropId"-->
      <!--          placeholder="请输入作物id"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="农事阶段" prop="farmDefineType">
        <el-select
          v-model="queryParams.farmDefineType"
          placeholder="请选择农事阶段"
          clearable
          class="!w-150px"
        >
          <el-option
            v-for="dict in farmDefineOptions"
            :key="dict.id"
            :label="dict.defineName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作物名称" prop="cropName">
        <el-input
          v-model="queryParams.cropName"
          placeholder="请输入作物名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="品种" prop="cropType">-->
      <!--        <el-select-->
      <!--          v-model="queryParams.cropType"-->
      <!--          placeholder="请选择品种"-->
      <!--          clearable-->
      <!--          class="!w-240px"-->
      <!--        >-->
      <!--          <el-option label="请选择字典生成" value="" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="计划状态" prop="planState">
        <el-select
          v-model="queryParams.planState"
          placeholder="请选择计划状态"
          clearable
          class="!w-150px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.FARM_PLAN_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="责任人编号" prop="personId">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.personId"-->
      <!--          placeholder="请输入责任人编号"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="责任人" prop="personName">
        <el-input
          v-model="queryParams.personName"
          placeholder="请输入责任人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="计划开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <!--      <el-form-item label="计划结束时间" prop="endTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.endTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="计划面积（亩）" prop="planArea">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.planArea"-->
      <!--          placeholder="请输入计划面积（亩）"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="土地面积（亩）" prop="area">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.area"-->
      <!--          placeholder="请输入土地面积（亩）"-->
      <!--          clearable-->
      <!--          @keyup.enter="handleQuery"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="创建时间" prop="createTime">-->
      <!--        <el-date-picker-->
      <!--          v-model="queryParams.createTime"-->
      <!--          value-format="YYYY-MM-DD HH:mm:ss"-->
      <!--          type="daterange"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"-->
      <!--          class="!w-240px"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery" type="primary"
          ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
        >
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="flex items-center justify-between mb-3">
      <div style="margin-bottom: 1rem; margin-left: 1.5rem; margin-right: 1.5rem; height: 2rem">
        <el-form-item>
          <el-button
            type="primary"
            class="!h-2.4rem !bg-[#009688] !color-[#fff]"
            plain
            @click="openForm('create')"
            v-hasPermi="['agri:farm-plan:create']"
          >
            <Icon icon="ep:plus" class="mr-5px" />
            新增
          </el-button>
        </el-form-item>
      </div>
      <div v-if='cardList == "list" ' class="grow ">
        <IntroduceAlert title="农事计划模块专门负责将作物的种植过程细分为若干个易于管理的计划。" />
      </div>
        <div class="flex ml-1.5rem mt-[-10px]">
        <div @click="cardList ='card'" class="py-5px px-15px cursor-pointer rounded-l"
             :style="`background-color: ${cardList  == 'card' ? '#e5f4f3':''}; border:1.5px solid ${cardList  == 'card'?'#36a99e':'#e6e6e6'}; color:${cardList  == 'card' ? '#36a99e' : ''}`">
          <img :src="cardList == 'card'?card:card2" class="w-10px h-10px" alt=""/>
          卡片
        </div>
        <div @click="cardList='list'" class="py-5px cursor-pointer px-15px rounded-r"
             :style="`border:1.5px solid ${cardList == 'list'?'#36a99e':'#e6e6e6'};background-color: ${cardList == 'list'?'#e5f4f3':''}; color:${cardList == 'list'?'#36a99e':''}`">
          <img :src="cardList == 'list'?listImg:listImg2" class="w-10px h-10px" alt=""/>
          列表
        </div>
      </div>
    </div>
    <div v-if="cardList == 'card'" class='flex justify-between'>
      <div class='w-10%'>
        <div class='ml-20px'>
          <div>农事计划</div>
          <div class="mt-20px">
            <el-date-picker
            class="!w-130px"
            v-model="monthVal"
            @change='dataChange'
            type="month"
            placeholder="请选择月份"
          />
          </div>
          <div class='flex items-center mt-20px'><div class='w-8px h-8px mr-10px bg-[#73c0de] rounded-50%'></div> 浇水</div>
          <div class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#3ba272] rounded-50%'></div> 施肥</div>
          <div class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#5db85a] rounded-50%'></div> 除草</div>
          <div class='flex items-center mt-20px'><div class='w-8px h-8px mr-10px bg-[#009688] rounded-50%'></div> 种植</div>
          <div class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#0d9b8e] rounded-50%'></div> 打药</div>
          <div class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#0d9b8e] rounded-50%'></div> 采收</div>
          <div class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#5c7bb6] rounded-50%'></div> 喂养</div>
          <div class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#ee6666] rounded-50%'></div> 除虫防害</div>
        </div>
      </div>
      <div class="w-89% " >
        <div class='grid grid-cols-7 '>
          <div class="w-100% flex items-center justify-center h-60px border-1px border-[#e6e6e6] border-solid bg-[#f5f5f5]" v-for="item,index in ['一','二','三','四','五','六','日']" :key="index" style="font-weight:600">周{{ item }}</div>
        </div>
        <div class="grid grid-cols-7">
          <div v-for="item,index in dataList2" :key="index" :class="`flex flex-col items-center justify-center border-1px border-[#e6e6e6]  border-solid`">
            <div class='text-30px my-18px color-[#999999]' style="font-weight:600">{{item.data}}</div>
            <div class="w-88%">
              <div class="flex items-center justify-between bg-[#80cac3] color-[#fff] box-border px-10px h-30px"><div style= "transform: rotate(180deg) "> > </div> {{item.plotName?item.plotName:'暂无地块'}} <div> > </div> </div>
              <div class="bg-[#f7fbfb] color-[#999999] w-100% h-100px mb-15px flex justify-around flex-wrap">
                <div v-show='item.name == "浇水"' class='flex items-center mt-20px'><div class='w-8px h-8px mr-10px bg-[#73c0de] rounded-50%'></div> 浇水</div>
                <div v-show='item.name == "水质调控"' class='flex items-center mt-20px'><div class='w-8px h-8px mr-10px bg-[#73c0de] rounded-50%'></div> 水质调控</div>
                <div v-show='item.name == "施肥"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#3ba272] rounded-50%'></div> 施肥</div>
                <div v-show='item.name == "除草"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#5db85a] rounded-50%'></div> 除草</div>
                <div v-show='item.name == "种植"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#009688] rounded-50%'></div> 种植</div>
                <div v-show='item.name == "播种"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#009688] rounded-50%'></div> 播种</div>
                <div v-show='item.name == "打药"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#0d9b8e] rounded-50%'></div> 打药</div>
                <div v-show='item.name == "采收"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#0d9b8e] rounded-50%'></div> 采收</div>
                <div v-show='item.name == "喂养"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#5c7bb6] rounded-50%'></div> 喂养</div>
                <div v-show='item.name == "饲料投喂"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#5c7bb6] rounded-50%'></div> 饲料投喂</div>
                <div v-show='item.name == "除虫防害"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#ee6666] rounded-50%'></div> 除虫防害</div>
                <div v-show='item.name == "病虫防害"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#ee6666] rounded-50%'></div> 病虫防害</div>
                <div v-show='!item.name' class='flex items-center color-[#acacac]' style="font-weight:600">当前暂无农事计划</div>
              </div>
            </div>
          </div>
          <div v-for="item,index in dataList" :key="index" :class="`flex flex-col items-center justify-center ${day == item.data ? 'border-2px':'border-1px' }  ${day == item.data ?'border-[#009688]':'border-[#e6e6e6]' }   border-solid`">
            <div class='text-30px my-18px' style="font-weight:600">{{item.data}}</div>
            <div class="w-88%">
              <div class="flex items-center justify-between wrapper-item color-[#fff] box-border px-10px h-30px"><div style= "transform: rotate(180deg)"> > </div> {{item.plotName?item.plotName:'暂无地块'}} <div> > </div> </div>
              <div class="bg-[#f0f7f7] w-100% h-100px mb-15px flex justify-around flex-wrap">
                <div v-show='item.name == "浇水"' class='flex items-center mt-20px'><div class='w-8px h-8px mr-10px bg-[#73c0de] rounded-50%'></div> 浇水</div>
                <div v-show='item.name == "水质调控"' class='flex items-center mt-20px'><div class='w-8px h-8px mr-10px bg-[#73c0de] rounded-50%'></div> 水质调控</div>
                <div v-show='item.name == "施肥"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#3ba272] rounded-50%'></div> 施肥</div>
                <div v-show='item.name == "除草"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#5db85a] rounded-50%'></div> 除草</div>
                <div v-show='item.name == "种植"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#009688] rounded-50%'></div> 种植</div>
                <div v-show='item.name == "播种"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#009688] rounded-50%'></div> 播种</div>
                <div v-show='item.name == "打药"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#0d9b8e] rounded-50%'></div> 打药</div>
                <div v-show='item.name == "采收"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#0d9b8e] rounded-50%'></div> 采收</div>
                <div v-show='item.name == "喂养"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#5c7bb6] rounded-50%'></div> 喂养</div>
                <div v-show='item.name == "饲料投喂"' class='flex items-center'><div class='w-8px h-8px my-20px mr-10px bg-[#5c7bb6] rounded-50%'></div> 饲料投喂</div>
                <div v-show='item.name == "除虫防害"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#ee6666] rounded-50%'></div> 除虫防害</div>
                <div v-show='item.name == "病虫防害"' class='flex items-center'><div class='w-8px h-8px mr-10px bg-[#ee6666] rounded-50%'></div> 病虫防害</div>
                <div v-show='!item.name' class='flex items-center color-[#acacac]' style="font-weight:600">当前暂无农事计划</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-table v-if="cardList == 'list'" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="计划编码" align="center" prop="planCode" width="180" />
      <el-table-column label="计划名称" align="center" prop="planName" width="180" />
      <!--      <el-table-column label="所属基地" align="center" prop="belongPark" />-->
      <el-table-column label="基地名称" align="center" prop="parkName" width="180" />
      <el-table-column label="农事阶段" align="center" prop="farmDefineType" width="120">
        <template #default="scope">
          <el-select v-model="scope.row.farmDefineType" disabled>
            <el-option
              v-for="dict in farmDefineOptions"
              :key="dict.id"
              :label="dict.defineName"
              :value="dict.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <!--      <el-table-column label="所属地块" align="center" prop="belongPlot" />-->
      <el-table-column label="地块名称" align="center" prop="plotName" width="180" />
      <!--      <el-table-column label="作物id" align="center" prop="cropId" />-->
      <el-table-column label="作物名称" align="center" prop="cropName" width="180" />
      <el-table-column align="center" prop="batchCode" width="160px">
        <template #header>
          <QuestionMaskTip
            lable-name="批次号"
            content="批次号是分配给特定种植操作或作业的唯一标识符，每个批次号代表一组具有共同特征的作物或一轮种植活动，在产品追溯中起着重要作用。"
          />
        </template>
      </el-table-column>
      <el-table-column label="品类" align="center" prop="cropType" width="100">
        <template #default="scope">
          <el-tag>{{ scope.row.cropType }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="计划状态" align="center" prop="planState" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.FARM_PLAN_STATE" :value="scope.row.planState" />
        </template>
      </el-table-column>
      <!--      <el-table-column label="责任人编号" align="center" prop="personId" />-->
      <el-table-column label="责任人" align="center" prop="personName" width="150">
        <template #default="scope">
          <label>{{ scope.row.personName == 'null' ? '' : scope.row.personName }} </label>
        </template>
      </el-table-column>
      <el-table-column
        label="计划开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="计划结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="计划面积（亩）" align="center" prop="planArea" width="150" />
      <el-table-column label="计划描述" align="center" prop="planDesc" />
      <!--      <el-table-column label="完成面积（亩）" align="center" prop="finishArea" fixed="right" width="150"/>-->
      <!--      <el-table-column label="剩余面积（亩）" align="center" prop="area"  fixed="right" width="150" />-->
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <el-button
            v-if="scope.row.planState != '2'"
            link
            type="warning"
            @click="subExecute(scope.row)"
            v-hasPermi="['agri:farm-plan:update']"
          >
            执行
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['agri:farm-plan:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agri:farm-plan:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
    v-if="cardList == 'list'"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <FarmPlanForm ref="formRef" @success="getList" />
  <!--  选择基地-->
  <ParkInfoPopup ref="parkPopupRef" @success="handleParkPopupChange" />
  <!--  选择地块-->
  <ParkDetailPopup ref="plotPopupRef" @success="handlePlotPopupChange" />
  <!-- 下一步弹框 -->
  <Dialog
    title="执行农事计划"
    class="!text-20px !w-900px !font-600 !color-[#000] !box-border"
    v-model="dialogVisible"
  >
    <div class="text-17px mb-10px" style="font-weight: 600">农事计划信息</div>
    <el-table
      class="!h-100px"
      v-loading="loading"
      :data="paramsA"
      border
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="计划名称" align="center" prop="planName" />
      <el-table-column label="基地名称" align="center" prop="parkName" width="200px" />
      <el-table-column label="地块名称" align="center" prop="plotName" />
      <el-table-column label="农事阶段" align="center" prop="cropType" />
      <el-table-column label="作物名称" align="center" prop="cropName" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="180px"
      />
    </el-table>
    <div class="flex mt-15px box-border justify-around">
      <div class="w-170px">
        <div class="text-18px mb-15px color-[#000]" style="font-weight: 600">投入品信息</div>
        <div class="text-16px mb-15px">产品名称</div>
        <div class='nameList-wrapper w-100% h-200px'>
          <div @click="inputTab(item,index)" :class="`mb-15px cursor-pointer ${selectOption.name == item.name ? ' color-[#2ca3d8]' : 'color-[#8ca860]'} `"   v-for='item,index in NameList' :key='index'>{{ item.name }}</div>
        </div>
      </div>
      <el-card class="box-card !mt-20px">
        <template #header>
          <div class="card-header" style="font-weight: 600 !important">
            {{ selectOption.name }}消耗情况
          </div>
        </template>
        <div>
          <div class="flex w-100% justify-evenly">
            <div>分类：{{ selectOption.categoryName }}</div>
            <div>采购价格：{{ selectOption.minPrice }}(元)</div>
          </div>
          <div class="flex my-15px w-100% justify-evenly">
            <div>单位：{{ selectOption.unitName }}</div>
            <div>规格：{{ selectOption.standard }}</div>
          </div>
          <div class="w-100% border-1px border-dashed border-[#c1c1c1]"></div>
          <div class="w-100% mt-15px">
            <el-form :model="formData" label-width="90px" inline size="normal">
              <el-form-item label="本次消耗量">
                <el-input
                  v-model="formData.consumeNum"
                  placeholder="请输入消耗量"
                  style="width: 120px"
                />
              </el-form-item>
              <el-form-item label="投入品费用/元" class="custom-label-width">
                <el-input
                  v-model="formData.feedCost"
                  placeholder="自动计费用"
                  style="width: 100px"
                  disabled
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
    </div>

    <template #footer>
      <el-button
        @click="preCli"
        type="primary"
        class="!bg-[#81d3f8] !color-[#000] !border-none"
        :disabled="formLoading"
        >上一步</el-button
      >
      <el-button
        @click="submitForm"
        type="primary"
        class="!bg-[#facd91] !color-[#000] !border-none"
        :disabled="formLoading"
        >确认执行</el-button
      >
      <el-button @click="clearForm" class="!bg-[#cccccc]">取消执行</el-button>
    </template>
  </Dialog>
  <!-- 选择投入品 -->
  <Dialog title="选择投入品" class="!text-20px !font-600 !w-1300px" v-model="dialogVisibleA">
    <div>
      <el-form :model="formSearch" label-width="80px" inline size="normal">
        <el-form-item label="名称">
          <el-input v-model="formSearch.feedName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分类">
          <!-- <el-input v-model="formSearch.feedName"></el-input> -->
          <el-select
            v-model="formSearch.feedType"
            class="!w-200px"
            clearable
            filterable
            @change="formSelect"
          >
            <el-option v-for="item in formSelectList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="!bg-[#009688] !color-[#fff]" @click="handleQueryA">
            <Icon icon="ep:search" class="mr-5px" />
            搜索
          </el-button>
          <el-button @click="resetQueryA">
            <Icon icon="ep:refresh" class="mr-5px" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="relative">
      <el-table
        class="!h-500px"
        v-loading="loading"
        :data="selectList"
        :stripe="true"
        ref="multipleTableRef"
        @row-click="selectClick"
        @selection-change="handleSelectionChange"
        :show-overflow-tooltip="true"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="条码" align="center" prop="barCode" width="160" />
        <el-table-column label="名称" align="center" prop="name" width="160" />
        <el-table-column label="分类" align="center" prop="categoryName" width="130" />
        <el-table-column label="单位" align="center" prop="unitName" width="80" />
        <el-table-column label="规格" align="center" prop="standard" width="100" />
        <el-table-column label="图片" align="center" prop="imgId">
          <template #default="{ row }">
            <el-image
              v-if="row.img != null && row.img != ''"
              class="h-50px w-50px"
              lazy
              :src="row.img"
              :preview-src-list="[row.img]"
              preview-teleported
              fit="cover"
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column
          label="采购价格"
          align="center"
          prop="purchasePrice"
          width="120"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column
          label="销售价格"
          align="center"
          prop="salePrice"
          width="120"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column
          label="最低价格"
          align="center"
          prop="minPrice"
          width="120"
          :formatter="erpPriceTableColumnFormatter"
        />
        <el-table-column
          label="生产日期"
          align="center"
          prop="produceDate"
          :formatter="dateFormatter2"
          width="140"
        />
        <el-table-column label="保质期天数" align="center" prop="expiryDay" width="100" />
        <el-table-column
          label="有效日期"
          align="center"
          prop="effectiveTime"
          :formatter="dateFormatter2"
          width="140"
        />
        <el-table-column label="登记证号123" align="center" prop="registerNum" width="100" />
        <el-table-column label="包装关系" align="center" prop="packagingRelationship" width="100" />
        <el-table-column label="认证状态" align="center" prop="certifyStatus" width="100" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        class="!absolute"
        :total="totalA"
        v-model:page="queryParamsA.pageNo"
        v-model:limit="queryParamsA.pageSize"
        @pagination="getPage()"
      />
    </div>
    <template #footer>
      <el-button
        class="!bg-[#80ffff] !border-none"
        @click="skipCli"
        type="primary"
        :disabled="formLoading"
        ><el-tooltip content="跳过选择投入品,直接执行" placement="top">
          <div>跳过</div>
        </el-tooltip>
      </el-button>

      <el-button
        @click="submitTable"
        class="!bg-[#f59a23] !border-none"
        type="primary"
        :disabled="formLoading"
        >下一步</el-button
      >
      <el-button @click="clearFormA">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { FarmPlanApi, FarmPlanVO } from '@/api/agriculture/farmplan'
import FarmPlanForm from './FarmPlanForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { FarmDefineApi } from '@/api/agriculture/farmdefine'
import ParkDetailPopup from '@/views/agriculture/parkdetail/components/ParkDetailPopup.vue'
import ParkInfoPopup from '@/views/agriculture/parkinfo/components/ParkInfoPopup.vue'
import { allDataCacheManager, CategoryManagementVO } from '@/api/agriculture/categorymanagement'
import { ParkInfoVO } from '@/api/agriculture/parkinfo'
import { ParkDetailVO } from '@/api/agriculture/parkdetail'
import QuestionMaskTip from '@/components/QuestionMaskTip/index.vue'
import { page, carryOutUpdate, isFarmPlan } from './api'
import card from '../../../assets/imgs/card-active.png'
import card2 from '../../../assets/imgs/card-actived.png'
import listImg from '../../../assets/imgs/list-active.png'
import listImg2 from '../../../assets/imgs/list-actived.png'
import { watch } from 'vue'
interface AnyObject {
  [key: string]: any;
}
/** 农事计划 列表 */
defineOptions({ name: 'FarmPlan' })

const cardList=ref('card') //列表和网格
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const day = ref(new Date().getDate())

const list = ref<FarmPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  planCode: undefined,
  planName: undefined,
  belongPark: undefined,
  parkName: undefined,
  belongPlot: undefined,
  plotName: undefined,
  cropId: undefined,
  cropName: undefined,
  cropType: undefined,
  planState: undefined,
  personId: undefined,
  personName: undefined,
  startTime: [],
  endTime: [],
  planArea: undefined,
  area: undefined,
  createTime: []
})
const queryParamsA = reactive({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const farmDefineOptions = ref([]) // 设备分类选项
const formData = ref({
  feedType: '',
  feedName: '',
  consumeNum: '',
  feedCost: '',
  consumeUnit: ''
})
const formSearch = ref({
  feedName: '',
  feedType: ''
})
const listCategoryManagement = ref<CategoryManagementVO[]>([]) // 品类列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FarmPlanApi.getFarmPlanPage(queryParams)
    //请求品类信息
    listCategoryManagement.value = await allDataCacheManager.getData({})
    console.log(data.list,'列表')
    console.log(listCategoryManagement.value,'品种')
    //把品类数据的name拼接到列表中
    data.list.forEach((item) => {
      item.farmDefineType = item.farmDefineType ? parseInt(item.farmDefineType) : ''
      listCategoryManagement.value.forEach((itm) => {
        if (item.cropType == itm.id) item.cropType = itm.categoryName
      })
    })
    list.value = data.list
    total.value = data.total
    let month= new Date().getMonth()+1
    list.value.forEach((itm:any) => {
      let time=new Date(itm.startTime).toLocaleDateString().split('/')
      if(month == Number(time[1])){
        dataList.value.forEach((item:any) => {
          if(item.data == Number(time[2])){
            item.name = fn(itm.farmDefineType)
            item.plotName = itm.plotName
          }
        })
      }
    })
    list.value.forEach((itm:any) => {
      let time=new Date(itm.startTime).toLocaleDateString().split('/')
      if(month == Number(time[1])){
        dataList2.value.forEach((item:any) => {
          if(item.data == Number(time[2])){
            item.name = fn(itm.farmDefineType)
            item.plotName = itm.plotName
          }
        })
      }
    })
  } finally {
    loading.value = false
  }
}

//替换方法
const fn = (id) =>{
  let name = ''
  farmDefineOptions.value.forEach((item:any)=>{
    if(id == item.id){
      name = item.defineName
    }
  })
  return name
}

/** 搜索按钮操作 */
const handleQuery = () => {
  if (queryParams.parkName == null || queryParams.parkName == '') {
    queryParams.belongPark = undefined
    queryParams.parkName = undefined
  }
  if (queryParams.plotName == null || queryParams.plotName == '') {
    queryParams.plotName = undefined
    queryParams.belongPlot = undefined
  }
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const router = useRouter()
const openForm = (type: string, id?: number) => {
  if (type == 'create') {
    router.push('/farm_work/farmManage/createOrUpdate')
  } else {
    router.push('/farm_work/farmManage/createOrUpdate?type=' + type + '&id=' + id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FarmPlanApi.deleteFarmPlan(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await FarmPlanApi.exportFarmPlan(queryParams)
    download.excel(data, '农事计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  getList()
  farmDefineOptions.value = await FarmDefineApi.getFarmDefineTree({ parentId: 0, status: 1 })
})
onActivated(async () => {
  await getList()
})

//基地的选择
const parkPopupRef = ref()
const openType = ref('')
const openParkPopup = (id: string) => {
  openType.value = id
  if (openType.value === undefined || openType.value === '') {
    message.error('请选择基地')
  } else parkPopupRef.value.open(id)
}
const handleParkPopupChange = (order: ParkInfoVO) => {
  if (openType.value === '0') {
    queryParams.belongPark = String(order[0].id)
    queryParams.parkName = String(order[0].name)
  } else queryParams.parkName = String(order[0].name)
}
//获取投入品
const selectList = ref([])
const totalA = ref(0)
const selectList2 = ref([])
const formSelectList = ref([])
const getPage = async () => {
  let res = await page({ pageNo: queryParamsA.pageNo, pageSize: queryParamsA.pageSize })
  totalA.value = res.total
  selectList.value = res.list
  selectList2.value = res.list
  formSelectList.value = Array.from(new Set(res.list.map((item) => item.categoryName)))
}
getPage()
//监听消耗费用
const selectOption = ref<AnyObject>({})
watch(
  () => formData.value.consumeNum,
  (newVal) => {
    formData.value.feedCost = newVal * selectOption.value.minPrice
  }
)
//选择消耗品
const openCropInfoPopup = () => {
  dialogVisible.value = false
  dialogVisibleA.value = true
}
//执行按钮
const paramsA = ref<Array<any>>([])
const params = ref<Object>({})
const dialogVisible = ref<Boolean>(false)
const dialogVisibleA = ref<Boolean>(false)
const endTime = ref()
const startTime = ref()
const feedType = ref(0)
const subExecuteId = ref()
const subExecute = async (obj) => {
  subExecuteId.value = obj.id
  startTime.value = new Date(obj.startTime).toLocaleString()
  endTime.value = new Date(obj.endTime).toLocaleString()
  params.value = obj
  paramsA.value.push(obj)
  if (obj.planState == 1) {
    let res = await isFarmPlan({ id: obj.id, planState: obj.planState })
    if (res == true) dialogVisibleA.value = true
    else if (res.data == false) {
      message.error('执行农事计划失败，请先去农事记录添加')
      dialogVisibleA.value = false
    }
  } else {
    dialogVisibleA.value = true
  }
}
watch(
  () => dialogVisible.value,
  (val) => {
    if (!val && dialogVisibleA.value) {
      formData.value = {
        feedType: '',
        feedName: '',
        consumeNum: '',
        feedCost: '',
        consumeUnit: 'KG',
        feedTwo: '元'
      }
    }else if( !val && !dialogVisibleA.value){
      paramsA.value = []
    }
  }
)
watch(
  () => dialogVisibleA.value,
  (val) => {
    if (!val) {
      selectionList.value = []
      selectList.value = selectList2.value
    }
  }
)
//Esc关闭
window.addEventListener('keydown', (e) => {
     if (e.keyCode === 27) {
        paramsA.value = []
        formSearch.value = {
          feedName: '',
          feedType: ''
        }

     }
});
//跳过
const skipCli = async () => {

  //跳过之前处理params中croType字段
  const data = await FarmPlanApi.getFarmPlanPage(queryParams)
  data.list.forEach((item:any) => {
    console.log(item,'itemtiaoguo')
    if(item.id == params.value.id){
      params.value.cropType = item.cropType
    }
  })

  let res = await carryOutUpdate({
    ...params.value,
    isInput: false,
    agriFarmRecordSaveReqVO: {
      ...params.value,
      recordTime: params.value.startTime,
      recordArea: params.value.area,
    }
  })
  if (res) {
    message.success('执行农事计划成功')
    dialogVisibleA.value = false
    await getList()
  }
}
//上一步
const preCli = () => {
  dialogVisibleA.value = true
  dialogVisible.value = false
  selectionList.value = []
}
//确认
const submitForm = async () => {
  // if(inputNum.value == 0 ){
  //   NameList.value[0]={
  //   ...NameList.value[0],
  //   ...formData.value
  //   }
  // }
   //提交之前处理params中croType字段
   const data = await FarmPlanApi.getFarmPlanPage(queryParams)
  data.list.forEach((item:any) => {
    console.log(item,'itemtiaoguo')
    if(item.id == params.value.id){
      params.value.cropType = item.cropType
    }
  })
  delete formData.value.id
  delete params.value.id
  NameList.value= NameList.value.map((item:any) => ({
    ...item,
    ...params.value,
     farmPlanId: subExecuteId.value,
    feedTime: new Date().getTime(),
    farmingStage : params.value.farmDefineType
  }))
  let res = await carryOutUpdate({
    id: subExecuteId.value,
    planName: params.value.planName,
    parkName: params.value.parkName,
    plotName: params.value.plotName,
    cropName: params.value.cropName,
    planState: params.value.planState,
    startTime: params.value.startTime,
    endTime: params.value.endTime,
    isInput: true,
    agriFarmRecordSaveReqVO: {
      ...params.value,
      recordTime: params.value.startTime,
      recordArea: params.value.area
    },
    feedInfoSaveReqVO: NameList.value
  })
  if (res) {
    message.success('执行农事计划成功')
    dialogVisible.value = false
    formData.value = {
      feedType: '',
      feedName: '',
      consumeNum: '',
      feedCost: '',
      consumeUnit: 'KG',
      feedTwo: '元'
    }
    await getList()
    paramsA.value = []
  }
}
//取消并且清除Form
const clearForm = () => {
  dialogVisible.value = false
  formData.value = {
    feedType: '',
    consumeNum: '',
    feedCost: '',
    consumeUnit: 'KG',
    feedTwo: '元'
  }
  paramsA.value = []
}
//取消并且清除Form
const clearFormA = () => {
  dialogVisibleA.value = false
  formData.value = {
    feedType: '',
    consumeNum: '',
    feedCost: '',
    consumeUnit: 'KG',
    feedTwo: '元'
  }
  formSearch.value={
    feedName: '',
  feedType: ''
  }
  selectList.value = selectList2.value
  selectionList.value = []
}
//投入品表格确定
const NameList = ref<Array<any>>([])
const submitTable = () => {
  if (selectionList.value.length == 0) {
    message.warning('请先选择投入品，再点击下一步')
    dialogVisibleA.value = true
    dialogVisible.value = false
  } else {
    dialogVisibleA.value = false
    dialogVisible.value = true
    selectOption.value = selectionList.value[0]
    NameList.value = selectionList.value
    formData.value.feedType = selectionList.value[0].id
    formData.value.consumeUnit = selectionList.value[0].unitName

    formData.value.feedName = selectionList.value[0].name
  }
}
/** 选中操作 */
const selectionList = ref<Array<any>>([])
const handleSelectionChange = (rows) => {
  selectionList.value = rows
}

const multipleTableRef = ref()
// 控制单选——table选择项发生变化时
const selectClick = ( row ) => {
  const selectData = selectionList.value
  if (selectData.length) {
    selectData.forEach((item) => {
      // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
      if (item == row) {
        multipleTableRef.value.toggleRowSelection(row, false)
      }
      // 不然就让当前的一行勾选
      else {
        multipleTableRef.value.toggleRowSelection(row, true)
      }
    })
  } else {
    multipleTableRef.value.toggleRowSelection(row, true)
  }
}
//重置
const resetQueryA = () => {
  formSearch.value = {
    feedName: '',
    feedType: ''
  }
  getPage()
  handleQueryA()
}
//搜索
const handleQueryA = () => {
  selectList.value = selectList2.value.filter((item: any) => {
    if (item.name.includes(formSearch.value.feedName)) {
      return item
    }
  })
}
//投入品下拉框事件
const formSelect = (e) => {
  if(e == '') selectList.value = selectList2.value
  else {
    selectList.value = selectList2.value.filter((item: any) => {
      if (item.categoryName == e) {
        return item
      }
    })
  }
}
//投入品切换
const inputNum = ref<Number>(0)
const inputTab = (val:any,index:Number) => {
  inputNum.value=index
  // NameList.value[index]={
  //   ...NameList.value[index],
  //   ...formData.value
  // }
  if(NameList.value[index].consumeNum && NameList.value[index].feedCost){
    formData.value.consumeNum = NameList.value[index].consumeNum
    formData.value.feedCost = NameList.value[index].feedCost
  }else{
  formData.value = {
      feedType: '',
      feedName: '',
      consumeNum: '',
      feedCost: '',
      consumeUnit: ''
    }
  }


  selectOption.value = val

}

watch(() => formData.value, (val)=>{
  NameList.value[inputNum.value] = {
    ...NameList.value[inputNum.value],
    ...val
  }

},{
  deep:true,immediate:true
})

//地块的选择
const plotPopupRef = ref()
const openType1 = ref('')
const openPlotPopup = (id: string) => {
  openType1.value = id
  if (!openType1.value) {
    message.error('请选择基地')
  } else plotPopupRef.value.open(id)
}
const handlePlotPopupChange = (order: ParkDetailVO) => {
  queryParams.belongPlot = String(order[0].id)
  queryParams.plotName = String(order[0].name)
}

/******************************* 卡片 *******************************/

const monthVal = ref('2024年9月')
const dataList = ref<Array<any>>([])
const dataList2 = ref<Array<any>>([])
const firstDayOfMonth = ref( new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const lastDayOfMonth = ref( new Date(new Date().getFullYear(), new Date().getMonth()+1, 0))
const lastDayOfMonth2 = ref( new Date(new Date().getFullYear(), new Date().getMonth(), 0))
const dayOfWeek = ref(firstDayOfMonth.value.getDay())
const data = ref(lastDayOfMonth.value.getDate())
const month =ref()
const data2 = ref(lastDayOfMonth2.value.getDate())

const getData = () => {
  const num= dayOfWeek.value == 0?6: dayOfWeek.value == 6?5:dayOfWeek.value == 5?4:dayOfWeek.value == 4?3:dayOfWeek.value == 3?2:dayOfWeek.value == 2?1:''
  for( let i = 1 ; i <= data.value ; i++ ) {
    dataList.value.push({
      data:i,
      name:''
    })
  }
  for(let i=0 ; i< num ; i++) {
      dataList2.value.unshift({
        data:data2.value-i,
        name:''
      })
  }
}
getData()

const dataChange = (e) =>{
  if(e.getMonth()+1 == new Date().getMonth()+1){
    day.value = new Date().getDate()
  }else day.value = 0

  month.value=e.getMonth()+1
  firstDayOfMonth.value = new Date(e.getFullYear(), e.getMonth(), 1);
  lastDayOfMonth.value = new Date(e.getFullYear(), e.getMonth()+1, 0);
  lastDayOfMonth2.value = new Date(e.getFullYear(), e.getMonth(), 0);
  dayOfWeek.value=firstDayOfMonth.value.getDay()
  data.value = lastDayOfMonth.value.getDate()
  data2.value = lastDayOfMonth2.value.getDate()
  dataList.value=[]
  dataList2.value=[]
  getData()
  list.value.forEach((itm:any) => {
      let time=new Date(itm.startTime).toLocaleDateString().split('/')
      if( e.getMonth()+1 == Number(time[1])){
          dataList.value.forEach((item:any) => {
            if(item.data == Number(time[2])){
              item.name=fn(itm.farmDefineType)
              item.plotName=itm.plotName
            }
        })
      }
  })
  list.value.forEach((itm:any) => {
      let time=new Date(itm.startTime).toLocaleDateString().split('/')
      if( e.getMonth()+1 == Number(time[1])){
          dataList2.value.forEach((item:any) => {
            if(item.data == Number(time[2])){
              item.name=fn(itm.farmDefineType)
              item.plotName=itm.plotName
            }
        })
      }
  })
  console.log(dataList2.value,'dataList2.value1234')
  console.log(dataList.value,'dataList.value999987')
}
</script>
<style lang="scss" scoped>
::v-deep .com-dialog .el-dialog__body {
  padding: 0 !important;
}
.wrapper-item{
  background-size: 100% 100%;
  background-image: url(../../../assets/imgs/wrapper-item-top.png);
}
::v-deep .custom-label-width .el-form-item__label {
  width: 110px !important;
}
.formParams {
  overflow-y: scroll !important;
}
.formParams::-webkit-scrollbar {
  width: 0;
}
::v-deep .el-dialog__header {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.nameList-wrapper{
  overflow-y: scroll ;
}
.nameList-wrapper::-webkit-scrollbar{
  width:0;
}
.wrapper{
  width: 200px;
  height: 200px;
  background-size: 100% 100%;
  background-image: url();
  background-repeat: no-repeat;
  background-position: center center ;
  border: 1px solid red;

}
</style>
