<template>
  <div class="w-full h-100vh main" style="overflow-y: auto">
    <div class="w-full topBg">
      <div class="flex py-[15px] items-center">
        <div class="logo ml-[30px]"></div>
        <div class="color-[#fff] text-2xl">鲁渝协作乡村振兴示范村数字化赋能工程</div>
      </div>
      <div class="bg-[#25546b] h-[2px]"></div>
      <div class="flex box-border px-[20px] color-[#fff]">
        <div class="w-50% h-[450px] !text-left flex justify-center items-center flex-col">
          <div class="text-4xl" style="font-family: 'TitleFont'"
            >打造100个鲁渝协作乡村振兴示范镇</div
          >
          <div class="text-4xl my-[15px]" style="font-family: 'TitleFont'"
            >共建100个鲁渝协作特色产业园区</div
          >
          <div class="text-3xl" style="font-family: 'TitleFont'">培育100个鲁渝协作品牌</div>
          <div class="text-sm color-[#c1c1c1] mt-[20px]"
            >强化产业协作，实施"东产西移"，大力推动区域协同发展</div
          >
        </div>
        <div class="w-50%">右边</div>
      </div>
    </div>
    <div class="center-bg w-full h-300px border-2 color-[#fff] grid grid-cols-6 box-border">
      <div
        @mouseenter="mouseenterChange(1)"
        @mouseleave="mainNum = 0"
        :class="`${
          mainNum == 1 ? 'monve' : ''
        } box-border flex py-[5px] justify-center flex-col items-center`"
      >
        <div v-if="mainNum !== 1">
          <div :class="['data-icon', 'data-icon-1']"></div>
          <div calss="flex-1">
            <div class="text-center mb-[10px]">{{ disVal }}</div>
            <div>帮扶区县</div>
          </div>
        </div>
        <div
          v-show="mainNum === 1"
          class="h-290px py-[5px] monve-bg box-border"
          style="overflow-y: scroll"
        >
          <div class="mb-20px text-center">帮扶区县({{ dataList.length }})</div>
          <div class="mb-10px" v-for="(item, index) in dataList" :key="index"
            >{{ item.name }} <span v-show="item.sum">({{ item.sum }})</span></div
          >
        </div>
      </div>
      <div
        @mouseenter="mouseenterChange(2)"
        @mouseleave="mainNum = 0"
        :class="`${
          mainNum == 2 ? 'monve' : ''
        } flex box-border py-[5px]  items-center flex-col justify-center`"
      >
        <div v-if="mainNum != 2">
          <div :class="['data-icon', 'data-icon-2']"></div>
          <div calss="flex-1">
            <div class="text-center mb-[10px]">{{ disVal2 }}</div>
            <div>示范村</div>
          </div>
        </div>
        <div
          v-show="mainNum === 2"
          class="h-290px py-[5px] monve-bg box-border"
          style="overflow-y: scroll"
        >
          <div class="mb-20px">示范村({{ dataList.length }})</div>
          <div class="mb-10px" v-for="(item, index) in dataList" :key="index"
            >{{ item.name }}<span v-show="item.sum">({{ item.sum }})</span></div
          >
        </div>
      </div>
      <div
        @mouseenter="mouseenterChange(3)"
        @mouseleave="mainNum = 0"
        :class="`${
          mainNum == 3 ? 'monve' : ''
        } flex box-border py-[5px]  items-center flex-col justify-center`"
      >
        <div v-if="mainNum != 3">
          <div :class="['data-icon', 'data-icon-3']"></div>
          <div calss="flex-1">
            <div class="text-center mb-[10px]">{{ disVal3 }}</div>
            <div>精准帮扶基地</div>
          </div>
        </div>
        <div v-show="mainNum === 3" class="h-290px monve-bg box-border" style="overflow-y: scroll">
          <div class="mb-20px text-center">精准帮扶基地({{ dataList.length }})</div>
          <div class="mb-10px" v-for="(item, index) in dataList" :key="index"
            >{{ item.name }}<span v-show="item.sum">({{ item.sum }})</span></div
          >
        </div>
      </div>
      <div
        @mouseenter="mouseenterChange(4)"
        @mouseleave="mainNum = 0"
        :class="`${
          mainNum == 4 ? 'monve' : ''
        } flex box-border py-[5px]  items-center flex-col justify-center`"
      >
        <div v-if="mainNum != 4">
          <div :class="['data-icon', 'data-icon-4']"></div>
          <div calss="flex-1">
            <div class="text-center mb-[10px]">{{ disVal4 }}</div>
            <div>产业形态</div>
          </div>
        </div>
        <div
          v-show="mainNum === 4"
          class="h-290px py-[5px] monve-bg box-border"
          style="overflow-y: scroll"
        >
          <div class="mb-20px">产业形态({{ dataList.length }})</div>
          <div class="mb-10px" v-for="(item, index) in dataList" :key="index"
            >{{ item.name }}({{ item.sum }})</div
          >
        </div>
      </div>
      <div class="flex items-center box-border py-[5px] justify-center flex-col">
        <div :class="['data-icon', 'data-icon-5']"></div>
        <div calss="flex-1">
          <div class="text-center mb-[10px]">35</div>
          <div>打造品牌</div>
        </div>
      </div>
      <div class="flex items-center box-border py-[5px] justify-center flex-col">
        <div :class="['data-icon', 'data-icon-6']"></div>
        <div calss="flex-1">
          <div class="text-center mb-[10px]">224</div>
          <div>数字感知设备</div>
        </div>
      </div>
    </div>
    <div class="h-[500px] w-full bg-[#fff]">
      <div class="text-center text-3xl mt-50px">精准帮扶建设情况</div>
      <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
        >基于自主可控的数字孪生技术、物联管控技术、云计算、人工智能、数字挖掘、边缘计算、GIS遥感监测等多种技术手段融合显示精准帮扶，解决现有农业问题</div
      >
      <div class="flex justify-evenly">
        <div class="w-45%">
          <div class="rounded-t-xl bg-[#2ec66d] text-center py-[5px] color-[#fff]"
            >对口帮扶地域</div
          >
          <div class="table-wrapper h-500px">
            <div class="table-header-row">
              <div
                class="table-header-cell"
                v-for="(column, index) in leftArr.tableColumns1"
                :style="`width: ${column.width};`"
                :key="index"
                >{{ column.label }}</div
              >
            </div>
            <div class="table-data-row" v-for="(item, index) in leftArr.tableData1" :key="index">
              <div
                v-show="item[column.key] != item.warnStatus"
                class="table-data-cell"
                v-for="(column, inde) in leftArr.tableColumns1"
                :key="inde"
                :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                >{{ item[column.key] }}</div
              >
            </div>
          </div>
        </div>
        <div class="w-45%">
          <div class="rounded-t-xl bg-[#2ec66d] text-center py-[5px] color-[#fff]">帮扶产业</div>
          <div class="table-wrapper">
            <div class="table-header-row">
              <div
                class="table-header-cell"
                v-for="(column, index) in leftArr.tableColumns1"
                :style="`width: ${column.width};`"
                :key="index"
                >{{ column.label }}</div
              >
            </div>
            <div class="table-data-row" v-for="(item, index) in leftArr.tableData1" :key="index">
              <div
                v-show="item[column.key] != item.warnStatus"
                class="table-data-cell"
                v-for="(column, inde) in leftArr.tableColumns1"
                :key="inde"
                :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                >{{ item[column.key] }}</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="village-Bg w-full h-450px mb-20px">
      <div>
        <div class="text-center text-3xl mt-50px">示范村建设</div>
        <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
          >数字监控全方位覆盖，多种设备及多种技术相结合的安全防范管理系统，为农业园区提供先进、快捷、行之有效的科技管理手段，加快数字新农业的发展</div
        >
      </div>
      <div class="flex justify-evenly mt-40px">
        <div class="flex">
          <el-timeline class="custom-timeline">
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :color="index == 0 ? '#2ec66d' : ''"
              :timestamp="activity.timestamp"
              >{{ activity.content }}
            </el-timeline-item>
          </el-timeline>
          <div class="ml-15px">
            <div class="text-lg">2024年，我们建设</div>
            <div class="my-10px">示范村 <span class="text-lg color-[#38c874]">29</span>个 </div>
            <div
              >区县<span class="text-lg color-[#38c874]">10</span>个|产业类型<span
                class="text-lg color-[#38c874]"
                >4</span
              >个|产业形态<span class="text-lg color-[#38c874]">8</span>重</div
            >
          </div>
        </div>
        <div class="table-wrapper2 bg-[#feffff] w-40% h-280px rounded">
          <div class="table-header-row">
            <div
              class="table-header-cell"
              v-for="(column, index) in leftArr2.tableColumns1"
              :style="`width: ${column.width};`"
              :key="index"
              >{{ column.label }}</div
            >
          </div>
          <div class="table-data-row" v-for="(item, index) in leftArr2.tableData1" :key="index">
            <div
              v-show="item[column.key] != item.warnStatus"
              class="table-data-cell"
              v-for="(column, inde) in leftArr2.tableColumns1"
              :key="inde"
              :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
              >{{ item[column.key] }}</div
            >
          </div>
        </div>
      </div>
    </div>
    <div class="mb-20px">
      <div>
        <div class="text-center text-3xl mt-50px !decoration-8">精准农业SAAS平台</div>
        <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
          >农业设施监测 | 土壤监测 | 气象检测 | 水质检测 | 农田物联网检测 | 虫情灾害监测 | 智能农机
          | 成熟期预测 | 农产品溯源</div
        >
      </div>
      <div class="flex justify-evenly items-center">
        <div class="SAAS-bg1 w-32% h-[300px]"></div>
        <div class="SAAS-bg2 w-32% h-[260px] mt-10px"></div>
        <div class="SAAS-bg3 w-32% h-[300px]"></div>
      </div>
    </div>
    <div class="py-[20px] bg-[#f7f7f7]">
      <div>
        <div class="text-center text-3xl !decoration-8">政府政策</div>
        <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
          >关注行业新闻，助农新政策早知道</div
        >
      </div>
      <div class="flex justify-evenly">
        <div class="w-35%">
          <img src="./assets/governmentImage.png" class="w-100% h-300px" />
          <div class="bg-[#fff]">
            <div class="text-lg mt-20px mb-10px"
              >中共重庆史农村工作实施乡村振兴战略领导小组关于2024年东西部协...</div
            >
            <div class="color-[#c1c1c1] text-sm"
              >中共中央总书记、国家主席、中央军委主席习近平近日在重庆考察时期强调，重庆要对标新时代新征程党的中心任务和党中央赋予的使命，充分发挥比较优势、后发优势，进一步全面深化改革开放，主动服务和融入新发展格...</div
            >
          </div>
        </div>
        <div class="w-50%">
          <div class="flex mb-20px bg-[#fff] justify-evenly py-[15px] px-[15px] box-border">
            <div>
              <div class="text-lg color-[#6a6a6a]">06-30</div>
              <div class="text-sm">2024</div>
            </div>
            <div class="w-1px h-70px bg-[#c1c1c1]"></div>
            <div class="w-78%">
              <div>中共重庆市委、重庆市人民政府印发《重庆市建设深化集体...</div>
              <div class="text-sm color-[#c1c1c1]"
                >为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我市实际...</div
              >
            </div>
          </div>
          <div class="flex mb-20px bg-[#fff] justify-evenly py-[15px] px-[15px] box-border">
            <div>
              <div class="text-lg color-[#6a6a6a]">06-29</div>
              <div class="text-sm">2024</div>
            </div>
            <div class="w-1px h-70px bg-[#c1c1c1]"></div>
            <div class="w-78%">
              <div>中共重庆市委、重庆市人民政府印发《重庆市建设深化集体...</div>
              <div class="text-sm color-[#c1c1c1]"
                >为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我市实际...</div
              >
            </div>
          </div>
          <div class="flex mb-20px bg-[#fff] justify-evenly py-[15px] px-[15px] box-border">
            <div>
              <div class="text-lg color-[#6a6a6a]">06-28</div>
              <div class="text-sm">2024</div>
            </div>
            <div class="w-1px h-70px bg-[#c1c1c1]"></div>
            <div class="w-78%">
              <div>中共重庆市委、重庆市人民政府印发《重庆市建设深化集体...</div>
              <div class="text-sm color-[#c1c1c1]"
                >为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我市实际...</div
              >
            </div>
          </div>
          <div class="flex mb-20px bg-[#fff] justify-evenly py-[15px] px-[15px] box-border">
            <div>
              <div class="text-lg color-[#6a6a6a]">06-26</div>
              <div class="text-sm">2024</div>
            </div>
            <div class="w-1px h-70px bg-[#c1c1c1]"></div>
            <div class="w-78%">
              <div>中共重庆市委、重庆市人民政府印发《重庆市建设深化集体...</div>
              <div class="text-sm color-[#c1c1c1]"
                >为深入贯彻习近平生态文明思想，认真落实中共中央办公厅、国务院办公厅印发的《深化集体林权制度改革方案》精神，加快建设深化集体林权制度改革先行区（以下简称先行区），结合我市实际...</div
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { distinct } from './api'
const mainNum = ref(0)
const dataList = ref([])
//鼠标移入事件
const mouseenterChange = async (val) => {
  mainNum.value = val
  let res = await distinct({ type: val })
  console.log(res, '基础数据')
  dataList.value = res
}
//时间线
const activities = [
  {
    content: '',
    timestamp: '2024'
  },
  {
    content: '',
    timestamp: '2023'
  },
  {
    content: '',
    timestamp: '2022'
  }
]
const leftArr = reactive({
  tableColumns1: [
    {
      key: 'index',
      label: '序号',
      width: '33%'
    },
    {
      key: 'city',
      label: '帮扶城市',
      width: '33%'
    },
    {
      key: 'county',
      label: '挂职区县',
      width: '33%'
    }
  ],
  tableData1: [
    {
      index: '1',
      city: '济南市',
      county: '武隆区'
    },
    {
      index: '2',
      city: '淄博市',
      county: '石柱县'
    },
    {
      index: '3',
      city: '枣庄市',
      county: '丰都县'
    },
    {
      index: '4',
      city: '济宁市',
      county: '城口县'
    }
  ]
})
const leftArr2 = reactive({
  tableColumns1: [
    {
      key: 'index',
      label: '序号',
      width: '8%'
    },
    {
      key: 'county',
      label: '区县',
      width: '20%'
    },
    {
      key: 'city',
      label: '示范村',
      width: '21%'
    },
    {
      key: 'industryType',
      label: '产业类型',
      width: '20%'
    },
    {
      key: 'industry',
      label: '产业形态',
      width: '21%'
    }
  ],
  tableData1: [
    {
      index: '1',
      county: '开州区',
      city: '竹溪镇灵泉村',
      industryType: '农旅文旅类',
      industry: '柑橘'
    },
    {
      index: '2',
      county: '万州区',
      city: '长滩镇龙泉社区',
      industryType: '养殖类-水产',
      industry: '四鼻鲤鱼'
    },
    {
      index: '3',
      county: '武隆区',
      city: '芙蓉街道堰塘村',
      industryType: '农旅文旅类',
      industry: '翡翠梨'
    }
  ]
})
//获取数据
const disVal = ref()
const disVal2 = ref()
const disVal3 = ref()
const disVal4 = ref()
const getDistinct = async () => {
  let res = await distinct({ type: 1 })
  let res2 = await distinct({ type: 2 })
  let res3 = await distinct({ type: 3 })
  let res4 = await distinct({ type: 4 })
  disVal.value = res.length
  disVal2.value = res2.length
  disVal3.value = res3.length
  disVal4.value = res4.length
}

getDistinct()
</script>
<style lang="scss" scoped>
@import url(../../utils/bigscreenTool/index.scss);
.main::-webkit-scrollbar {
  display: none;
}
.logo {
  width: 3rem;
  height: 3rem;
  background-size: 100% 100%;
  background-image: url(./assets/logo.png);
}
.topBg {
  background-size: 100% 100%;
  background-image: url(./assets/topBg.png);
}
.el-timeline-item__timestamp.is-top {
  color: #ff0000;
}
.SAAS-bg1 {
  // -webkit-box-reflect: below 3px -webkit-linear-gradient(transparent, transparent 1%, rgba(0, 0, 0, 0.5));
  background-size: 100% 100%;
  background-image: url(./assets/SAASImage.png);
}
.SAAS-bg2 {
  // -webkit-box-reflect: below 5px -webkit-linear-gradient(transparent, transparent 1%, rgba(0, 0, 0, 0.5));
  background-size: 100% 100%;
  background-image: url(./assets/SAASImage2.png);
}
.SAAS-bg3 {
  // -webkit-box-reflect: below 3px -webkit-linear-gradient(transparent, transparent 1%, rgba(0, 0, 0, 0.5));
  background-size: 100% 100%;
  background-image: url(./assets/SAASImage3.png);
}
.center-bg {
  background-size: 100% 100%;
  background-image: url(./assets/dataBg.png);
}
.data-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 20px;
  background-size: 100% 100%;
}
.table-wrapper {
  width: 100%;
  height: calc(500px - 10rem);
  position: relative;
  overflow: auto;
  background-color: #f3fcf7;
  font-size: 0.9rem;
  .table-header-row {
    width: 100%;
    padding: 8px 0;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #f3fcf7;
    .table-header-cell {
      text-align: center;
    }
  }
  .table-data-row {
    margin-top: 10px;
    width: 100%;
    height: 18%;
    background-color: #f3fcf7;

    display: flex;
    align-items: center;
    padding: 8px 0;
    .table-data-cell {
      text-align: center;
    }
  }
}
.table-wrapper::-webkit-scrollbar {
  width: 0px;
}
.table-wrapper2 {
  position: relative;
  overflow: auto;
  background-color: #f3f6ee;
  font-size: 0.9rem;
  .table-header-row {
    width: 100%;
    padding: 8px 0;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #3ac975;
    .table-header-cell {
      text-align: center;
      color: #fff;
    }
  }
  .table-data-row {
    margin-top: 10px;
    width: 100%;
    height: 18%;
    display: flex;
    align-items: center;
    padding: 8px 0;
    .table-data-cell {
      text-align: center;
    }
  }
}
.table-wrapper2::-webkit-scrollbar {
  width: 0px;
}
.village-Bg {
  background-size: 100% 100%;
  background-image: url(./assets/villageBg.png);
}
.monve {
  background-size: 100% 100%;
  background-image: url(./assets/dataMoveIn.png);
}
.monve-bg::-webkit-scrollbar {
  display: none;
}
.rightMap {
  width: 100%;
  height: 100px;
  border: 1px solid red;
}
@for $i from 1 through 6 {
  .data-icon-#{$i} {
    background-image: url(./assets/dataIcon#{$i}.png);
  }
}
</style>