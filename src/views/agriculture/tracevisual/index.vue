<script setup lang="ts">
import {traceStatistics, recordStatistics} from "@/api/agriculture/tracevisual/index"
import {initChartStatic, generatePieOptions} from '../../../utils/bigscreenTool/index'


const items = ref(['今日', '本周', '本月', '本年']);
const selected = ref(0)
const totalCodes = ref('')
const codeds = ref(0)
const unusedCodes = ref(0)
const usedCodes = ref(0)

const selectItem = (index) => {
  selected.value = index
  if(index === 0 ) getRecordStatistics('today')
  if(index === 1 ) getRecordStatistics('week')
  if(index === 2 ) getRecordStatistics('month')
  if(index === 3 ) getRecordStatistics('year')

}

const statisticList = ref([
  {
    id : 1,
    name : '溯源品牌',
    num : 3,
    color : '#F2FCF2',
  },
  {
    id : 2,
    name : '溯源产品',
    num : 3,
    color : '#F5FCFF',
  },
  {
    id : 3,
    name : '溯源模板',
    num : 5,
    color : '#FEFBF4',
  },
  {
    id : 4,
    name : '溯源次数',
    num : 6,
    color : '#FFF7F7',
  }
])

const getTraceStatistics = async() => {
  const {brand,product, template, count,totalCode,coded,unusedCode,usedCode} = await traceStatistics()
  const total = totalCode ? parseFloat(totalCode) : 0
  if (total >= 10000) {
    totalCodes.value = (total / 10000).toFixed(2) + '万';
  } else {
      totalCodes.value = totalCode ? totalCode : '';
  }
  codeds.value = coded ? coded : 0
  unusedCodes.value = unusedCode ? unusedCode : 0
  usedCodes.value = usedCode ? usedCode : 0
  statisticList.value[0].num = brand ?  brand : 0
  statisticList.value[1].num = product ? product : 0
  statisticList.value[2].num = template ? template : 0
  statisticList.value[3].num = count ? count : 0
  const data =  [
              { value: usedCodes.value, name: '已使用' },
              { value: unusedCodes.value, name: '未使用' }
            ]
  initChartStatic('codeStatistics', generatePieOptions({
    legend: {
      show: false, 
    },
    title: {
          show: true,
          text: codeds.value,
          subtext: '已发码',
          x: 'center',//水平安放位置，
          y: 'center',//垂直安放位置，
          borderWidth: 0,//标题边框线宽，单位px，默认为0（无边框）
          padding: [0,0,0,2],//标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
          itemGap: 5,//主副标题纵向间隔，单位px，默认为10
          textStyle: {//主标题文本样式
            fontFamily: 'MiSans',
            fontSize: 28,
        
            fontWeight: 600,
          },
          subtextStyle: {//副标题文本样式
            fontFamily: 'PingFangSC',
            fontSize: 16,
            color:'#333333'
        
          },
        
        },

    color: ["#59B756","#FAC858"],
    tooltip: {
            trigger: 'item',
        },//提示框，鼠标悬浮交互时的信息提示
    series: [
      {
        type: "pie",
        radius:  ['40%', '65%'],
        center: ["50%", "51%"],
        padAngle: 1,  //扇形的间隔角度
        data: data ,
        label: {
          show:false
        },//饼图文字的显示
      },
    ],
  }))

}
getTraceStatistics()

const recordList = ref<any[]>([])
const getRecordStatistics = async (time) => {
  const data = await recordStatistics(time)
  if(Array.isArray(data))
    recordList.value = data
    recordList.value = data.sort((a,b) => {
    if (a.count > b.count) {
        return -1
    }
    if (a.count < b.count) {
        return 1
    }
    return 0
})
}
getRecordStatistics('today')
</script>
<template>
  <div class="flex">
    <div class="w-70% h-[100hv] pb-2 mr-1">
      <ContentWrap>
        <div class="flex items-start space-x-2  pb-2">
          <div class="w-5px h-20px bg-#009688 mt-1.5 ml-1"></div>
          <div class="text-[18px] mt-1 font-bold">溯源统计</div>
        </div>
        <div class="p-2">
          <div class="flex flex-row">
            <div v-for="item in statisticList" :key="item.id" class="flex p-2 m-1 w-[220px]"  :style="{ backgroundColor: item.color }"> 
            <div :class="`w-[50px] h-[60px] icon-${item.id} p-1`"> </div>
            <div class="flex flex-col"> 
              <div class="text-[18px] p-1">{{item.name}}</div>
              <div class="text-[30px] font-bold p-1">{{ item.num }}</div>
            </div>
          </div>
        </div>
      </div>

      </ContentWrap>
      <ContentWrap>
        <div class="flex justify-between">
          <div class="flex items-start space-x-2 mt-1 pb-1">
            <div class="w-5px h-20px bg-#009688 mt-1.5 ml-1"></div>
            <div class="text-[18px] mt-1 font-bold">扫码统计</div>
          </div>
          <div class="flex text-[#666] bg-[#F5F5F5] mt-1 mr-1">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="w-[80px] text-center h-full flex justify-center items-center cursor-pointer"
              :style="`${selected === index ? 'background: #009688 ; color:white' : ''} `"
              @click="selectItem(index)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="p-2 mt-2">
          <div class="flex flex-row" v-for="(item,index) in recordList" :key="index"> 
            <div class=" w-[110px] h-[110px] justify-center items-center p-2">
              <img :src=item.brandLogo class="w-full h-90% object-contain flex items-center" />
            </div>
            <div class="flex flex-col p-2 w-full pl-2 ml-2 mt-2">
              <div class="flex justify-between pb-4 items-center ">
                <div class="text-[16px]">{{item.productBrand}}</div>
                <div class="text-[16px]">扫码次数：<span class="text-[24px] font-bold">{{ item.count }}</span></div>
              </div>
              <div><el-progress :text-inside="false" :stroke-width="5" :show-text="false" :percentage="item.count"/></div>
            </div>
          </div>
      
        </div>
        
      </ContentWrap>
    </div>
    <div class="w-30% h-[80px] pl-2 ml-1">
      <ContentWrap>
        <div class="flex items-start space-x-2 mt-2 pb-2 mb-2">
          <div class="w-5px h-20px bg-#009688 mt-1.5 ml-1"></div>
          <div class="text-[18px] mt-1 font-bold">溯源码</div>
        </div>
        <div class="flex justify-between h-[90px] p-3 bg-#F0FAF9 ">
          <div class="code w-50% h-90%"> </div>
          <div class="text-[18px] w-full h-full flex justify-center items-center text-center"> 总计：<span class="text-[30px] font-bold"> {{totalCodes}}</span> </div>
        </div>
        <div class="w-full flex justify-center items-center">
            <div id="codeStatistics" class="w-20rem h-16rem justify-center items-center"></div>
        </div>
        
        <div class="flex justify-between p-3 mt-2 h-[30px] items-center" style="background: rgba(250, 200, 88, 0.1); border-radius: 4px;">
          <div class="flex flex-row">
            <div class="w-[8px] items-center p-3"><div class="h-[0.1px] w-[0.1px] bg-#FAC858 rounded-full  p-1.5"></div></div>
            <div class=" p-2 text-[16px]">未使用 </div>
            <div class=" p-2 text-[16px] font-bold">{{unusedCodes}}</div>
          </div>
          <div class="text-[16px] font-bold p-2">{{ (unusedCodes/codeds*100).toFixed(1) }}%</div>
        </div>
        <div class="flex justify-between p-3 mt-3 h-[30px] items-center" style="background: rgba(89, 183, 86, 0.1); border-radius: 4px;">
          <div class="flex flex-row">
            <div class="w-[8px] items-center p-3"><div class="h-[0.1px] w-[0.1px] bg-#59B756 rounded-full  p-1.5"></div></div>
            <div class=" p-2 text-[16px]">已使用 </div>
            <div class=" p-2 text-[16px] font-bold">{{ usedCodes }}</div>
          </div>
          <div class="text-[16px] font-bold p-2">{{ (usedCodes/codeds*100).toFixed(1) }}%</div>
        </div>
      </ContentWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
@for $i from 1 through 4{
  .icon-#{$i}{
    background-image: url(./assets/statistics#{$i}.png);
    background-size: 2.5rem 2.5rem;
    background-position: center center;
    background-repeat: no-repeat;
  }
}
.test {
  background-image: url(./assets/text.png);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
.code {
  background-image: url(./assets/code.png);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>