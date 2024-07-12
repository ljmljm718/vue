<template>
  <div class="w-full h-100vh main" style="overflow-y: auto">
    <div class="w-full topBg relative">
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
        <div class="w-50% h-660px initMap" id="mainMap"></div>
        <div class="absolute left--150px bottom--150px">
          <img src="./assets/top-bg.png" class="w-300px h-300px" />
        </div>
      </div>
    </div>
    <div class="w-100% flex justify-center center-bg">
      <div
        class="!w-100vw h-300px border-2 color-[#fff] flex items-center justify-evenly box-border container"
      >
        <div
          @mouseenter="mouseenterChange(1)"
          @mouseleave="mainNum = 0"
          :class="`${
            mainNum == 1 ? 'monve' : ''
          } box-border  flex py-[5px] w-[16.6%] h-full justify-center flex-col items-center`"
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
            class="h-290px py-[15px] px-[15px] monve-bg box-border"
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
          } flex box-border py-[5px] w-[16.6%] h-full items-center flex-col justify-center`"
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
            class="h-290px py-[15px] px-[15px] monve-bg box-border"
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
          } flex box-border py-[5px] w-[16.6%] h-full  items-center flex-col justify-center`"
        >
          <div v-if="mainNum != 3">
            <div :class="['data-icon', 'data-icon-3']"></div>
            <div calss="flex-1">
              <div class="text-center mb-[10px]">{{ disVal3 }}</div>
              <div>精准帮扶基地</div>
            </div>
          </div>
          <div
            v-show="mainNum === 3"
            class="h-290px py-[15px] px-[15px] monve-bg box-border"
            style="overflow-y: scroll"
          >
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
          } flex box-border py-[5px] w-[16.6%] h-full  items-center flex-col justify-center`"
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
            class="h-290px py-[15px] px-[15px] monve-bg box-border"
            style="overflow-y: scroll"
          >
            <div class="mb-20px">产业形态({{ dataList.length }})</div>
            <div class="mb-10px" v-for="(item, index) in dataList" :key="index"
              >{{ item.name }}({{ item.sum }})</div
            >
          </div>
        </div>
        <div class="flex items-center w-[16.6%] h-full box-border py-[5px] justify-center flex-col">
          <div :class="['data-icon', 'data-icon-5']"></div>
          <div calss="flex-1">
            <div class="text-center mb-[10px]">35</div>
            <div>打造品牌</div>
          </div>
        </div>
        <div class="flex items-center w-[16.6%] h-full box-border py-[5px] justify-center flex-col">
          <div :class="['data-icon', 'data-icon-6']"></div>
          <div calss="flex-1">
            <div class="text-center mb-[10px]">224</div>
            <div>数字感知设备</div>
          </div>
        </div>
      </div>
    </div>

    <div class="h-[500px] w-full bg-[#fff]">
      <div class="text-center text-3xl mt-50px">精准帮扶建设情况</div>
      <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
        >基于自主可控的数字孪生技术、物联管控技术、云计算、人工智能、数字挖掘、边缘计算、GIS遥感监测等多种技术手段融合显示精准帮扶，解决现有农业问题</div
      >
      <div class="flex justify-evenly">
        <div class="container flex space-x-4 justify-center">
          <div class="w-45%">
            <div class="rounded-t-xl bg-[#2ec66d] text-center py-[12px] color-[#fff]"
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
            <div class="rounded-t-xl bg-[#2ec66d] text-center py-[12px] color-[#fff]">帮扶产业</div>
            <div class="table-wrapper">
              <div class="table-header-row">
                <div
                  class="table-header-cell"
                  v-for="(column, index) in leftArr3.tableColumns1"
                  :style="`width: ${column.width};`"
                  :key="index"
                  >{{ column.label }}</div
                >
              </div>
              <div class="table-data-row" v-for="(item, index) in leftArr3.tableData1" :key="index">
                <div
                  v-show="item[column.key] != item.warnStatus"
                  class="table-data-cell"
                  v-for="(column, inde) in leftArr3.tableColumns1"
                  :key="inde"
                  :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
                  >{{ item[column.key] }}</div
                >
              </div>
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
          <div class="flex flex-col items-center">
            <div class="flex items-center" @click="tabTime(1, '2024')">
              <div
                class="w-10px h-10px rounded-full"
                :style="`background-color:${timeNum == 1 ? '#17d46b' : '#c1c1c1'}`"
              ></div>
              <div class="ml-10px text-sm" :style="`color:${timeNum == 1 ? '#17d46b' : '#fff'}`"
                >2024</div
              >
            </div>
            <div class="w-2px h-40px bg-[#c1c1c1] mr-45px"></div>
            <div class="flex items-center" @click="tabTime(2, '2023')">
              <div
                class="w-10px h-10px rounded-full"
                :style="`background-color:${timeNum == 2 ? '#17d46b' : '#c1c1c1'}`"
              ></div>
              <div class="ml-10px text-sm" :style="`color:${timeNum == 2 ? '#17d46b' : '#fff'}`"
                >2023</div
              >
            </div>
            <div class="w-2px h-40px bg-[#c1c1c1] mr-45px"></div>
            <div class="flex items-center" @click="tabTime(3, '2022')">
              <div
                class="w-10px h-10px rounded-full"
                :style="`background-color:${timeNum == 3 ? '#17d46b' : '#c1c1c1'}`"
              ></div>
              <div class="ml-10px text-sm" :style="`color:${timeNum == 3 ? '#17d46b' : '#fff'}`"
                >2022</div
              >
            </div>
          </div>
          <div class="ml-15px">
            <div class="text-lg"
              >{{ timeNum == 1 ? '2024' : timeNum == 2 ? '2023' : '2022' }}年，我们建设</div
            >
            <div class="my-10px"
              >示范村 <span class="text-lg color-[#38c874]">{{ leftArr2.tableData1.length }}</span
              >个
            </div>
            <div
              >区县<span class="text-lg color-[#38c874]">{{ options.length }}</span
              >个 | 产业类型<span class="text-lg color-[#38c874]">{{ from }}</span
              >个 | 产业形态<span class="text-lg color-[#38c874]">{{ industry }}</span
              >种</div
            >
          </div>
        </div>
        <div class="table-wrapper2 bg-[#feffff] w-30% h-220px rounded">
          <div class="table-header-row">
            <div
              class="table-header-cell"
              v-for="(column, index) in leftArr2.tableColumns1"
              :style="`width: ${column.width};`"
              :key="index"
              >{{ column.label }}
              <el-select
                @change="selectChange"
                class="!bg-[#3ac975] color-[#fff]"
                v-show="column.label === ''"
                v-model="county"
                placeholder="请选择区县"
                style="width: 130px"
              >
                <el-option class="color-[#fff]" label="全部" value="全部" />
                <el-option
                  class="color-[#fff]"
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </div>
          <div
            class="table-data-row"
            v-for="(item, index) in leftArr2.tableData1"
            @click="goPage(item.bigscreen)"
            style="cursor: pointer"
            :key="index"
          >
            <div
              v-show="column.label === '序号'"
              class="table-data-cell"
              v-for="(column, inde) in leftArr2.tableColumns1"
              :key="inde"
              :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
              >{{ index + 1 }}</div
            >
            <div
              v-show="item[column.key] != item.warnStatus"
              class="table-data-cell"
              v-for="(column, inde) in leftArr2.tableColumns1"
              :key="inde"
              :style="`width: ${column.width};font-size:12px;color:#c1c1c1`"
              >{{ item[column.key] }}
            </div>
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
        <div class="w-32%">
          <div class="SAAS-bg1 w-100% h-[300px]"> </div>
          <div><img src="./assets/SAAS-bg-fall1.png" class="w-100%" alt="" /></div>
        </div>
        <div class="mt-[-90px] w-32%">
          <div class="SAAS-bg2 w-100% h-[250px]"></div>
          <div class="mt-10px"><img src="./assets/SAAS-bg-fall2.png" class="w-100%" alt="" /></div>
        </div>
        <div class="w-32%">
          <div class="SAAS-bg3 w-100% h-[300px]"></div>
          <div><img src="./assets/SAAS-bg-fall3.png" class="w-100%" alt="" /></div>
        </div>
      </div>
    </div>
    <div class="py-[20px] bg-[#f7f7f7]">
      <div>
        <div class="text-center text-3xl !decoration-8">政府政策</div>
        <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
          >关注行业新闻，助农新政策早知道</div
        >
      </div>
      <div class="flex justify-evenly items-center">
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
        <div class="w-50% h-350px city-scroll" style="overflow-y: auto">
          <div
            @click="goPage3(item.urlAddr)"
            style="cursor: pointer"
            v-for="(item, index) in list"
            :key="index"
            class="flex h-160px mb-20px items-center bg-[#fff] justify-evenly py-[15px] px-[15px] box-border"
          >
            <div class="text-lg color-[#6a6a6a]">{{ item.upTime }}</div>

            <div class="w-1px h-70px bg-[#c1c1c1]"></div>
            <div class="w-78%">
              <div>{{ item.title }}</div>
              <div class="text-sm color-[#c1c1c1]">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[#fff] py-20px">
      <div>
        <div class="text-center text-3xl !decoration-8">数字农业综合解决案例</div>
        <div class="text-center mt-20px mb-30px color-[#c1c1c1] text-sm"
          >构建全流程的新型农业一体化管理平台，融合农业数据管理、农业数据预警显示、多维数据综合显示、农产品生产周期预测、农业气象预警、信息<br />综合利用、信息发布服务、病虫害预警、溯源系统等功能与数据为一体，提供全方位、智慧化、立体可视化的运营保障服务</div
        >
      </div>
      <div class="w-100vw h-550px">
        <div
          class="w-100vw h-[170px]"
          style="overflow: hidden; position: relative; display: inline-flex"
        >
          <div class="target-img h-100%" ref="el" @mouseenter="targetMouse">
            <div class="num-one-1" @click="goPage2('')"></div>
            <div class="num-one-2" @click="goPage2('')"></div>
            <div
              class="num-one-3"
              @click="goPage2('https://yzl.qualink.com/iir-efficient-tools/#/shareView/YG160rnu')"
            ></div>
            <div class="num-one-4" @click="goPage2('')"></div>
            <div class="num-one-5" @click="goPage2('')"></div>
            <div class="num-one-6" @click="goPage2('')"></div>
            <div class="num-one-7" @click="goPage2('')"></div>
            <div class="num-one-8" @click="goPage2('')"></div>
            <div class="num-one-9" @click="goPage2('')"></div>
            <div class="num-one-10" @click="goPage2('')"></div>
            <div class="num-one-11" @click="goPage2('')"></div>
            <div class="num-one-12" @click="goPage2('')"></div>
            <div class="num-one-13" @click="goPage2('')"></div>
            <div class="num-one-14" @click="goPage2('')"></div>
            <div class="num-one-15" @click="goPage2('')"></div>
          </div>
        </div>
        <div
          class="w-100vw h-[170px] my-15px"
          style="overflow: hidden; position: relative; display: inline-flex"
        >
          <div class="target-img1 h-100%">
            <div class="num-two-16" @click="goPage2('')"></div>
            <div class="num-two-15" @click="goPage2('')"></div>
            <div class="num-two-14" @click="goPage2('')"></div>
            <div class="num-two-13" @click="goPage2('')"></div>
            <div class="num-two-12" @click="goPage2('')"></div>
            <div class="num-two-11" @click="goPage2('')"></div>
            <div class="num-two-10" @click="goPage2('')"></div>
            <div class="num-two-9" @click="goPage2('')"></div>
            <div class="num-two-8" @click="goPage2('')"></div>
            <div class="num-two-7" @click="goPage2('')"></div>
            <div class="num-two-6" @click="goPage2('')"></div>
            <div class="num-two-5" @click="goPage2('')"></div>
            <div class="num-two-4" @click="goPage2('')"></div>
            <div class="num-two-3" @click="goPage2('')"></div>
            <div
              class="num-two-2"
              @click="goPage2('https://yzl.qualink.com/iir-efficient-tools/#/shareView/Odl2Pjp4')"
            ></div>
            <div
              class="num-two-1"
              @click="goPage2('https://yzl.qualink.com/iir-efficient-tools/#/shareView/XNq8Fc3f')"
            ></div>
          </div>
        </div>
        <div
          class="w-100vw h-[170px]"
          style="overflow: hidden; position: relative; display: inline-flex"
        >
          <div class="target-img h-100%">
            <div
              class="num-three-1"
              @click="goPage2('https://yzl.qualink.com/iir-efficient-tools/#/shareView/KwF2EwRO')"
            ></div>
            <div class="num-three-2" @click="goPage2('')"></div>
            <div class="num-three-3" @click="goPage2('')"></div>
            <div
              class="num-three-4"
              @click="goPage2('https://yzl.qualink.com/iir-efficient-tools/#/shareView/V8xONDZo')"
            ></div>
            <div class="num-three-5" @click="goPage2('')"></div>
            <div class="num-three-6" @click="goPage2('')"></div>
            <div class="num-three-7" @click="goPage2('')"></div>
            <div class="num-three-8" @click="goPage2('')"></div>
            <div class="num-three-9" @click="goPage2('')"></div>
            <div class="num-three-10" @click="goPage2('')"></div>
            <div class="num-three-11" @click="goPage2('')"></div>
            <div class="num-three-12" @click="goPage2('')"></div>
            <div class="num-three-13" @click="goPage2('')"></div>
            <div class="num-three-14" @click="goPage2('')"></div>
            <div class="num-three-15" @click="goPage2('')"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-[#345442] py-[20px]">
      <div class="flex justify-evenly">
        <div>
          <div class="color-[#fff] text-lg mb-20px">成功案例</div>
          <div class="color-[#c1c1c1] tex-sm">隘口镇山银花产业数字化赋能</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">白帝镇农文旅产业数字化赋能</div>
          <div class="color-[#c1c1c1] tex-sm">奉节县鲁渝协作乡村振兴服务大屏</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">稻鱼鸭产业可视化数字驾驶舱</div>
          <div class="color-[#c1c1c1] tex-sm">黑水镇鲁渝协作乡村振兴示范数字化赋能</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">开州区鲁渝协作乡村振兴示范数字化赋能</div>
        </div>
        <div>
          <div class="color-[#fff] text-lg mb-20px">帮扶基地</div>
          <div class="color-[#c1c1c1] tex-sm">巫山县福田镇双凤村清霸茶叶基地</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">秀山县梅江镇兴隆坳现代茶叶农业园</div>
          <div class="color-[#c1c1c1] tex-sm">奉节县鹤峰乡青杠村百果园</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">开州区临江镇明月村柑橘园</div>
          <div class="color-[#c1c1c1] tex-sm">石柱县王场镇双龙村柑橘园</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">酉阳县黑水镇黑水村智慧化稻蟹养殖基地</div>
        </div>
        <div>
          <div class="color-[#fff] text-lg mb-20px">政府政策</div>
          <div class="color-[#c1c1c1] tex-sm">党中央国务院政策</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">部委</div>
          <div class="color-[#c1c1c1] tex-sm">市委市政府</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">部委</div>
        </div>
        <div>
          <div class="color-[#fff] text-lg mb-20px">SAAS平台</div>
          <div class="color-[#c1c1c1] tex-sm">乡村振兴平台</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">数商兴农平台</div>
          <div class="color-[#c1c1c1] tex-sm">乡村服务平台</div>
          <div class="color-[#c1c1c1] tex-sm my-10px">数字化赋能平台</div>
        </div>
        <div>
          <div class="color-[#fff] text-lg mb-10px ml-45px">联系我们</div>
          <div class="color-[#c1c1c1] tex-sm">0531-00000000</div>
          <img src="./assets/footLogo.png" class="w-100px h-90px mt-40px ml-30px" />
        </div>
      </div>
      <div class="w-full h-1px mt-20px bg-[#496555]"></div>
      <div class="mt-20px">
        <div class="text-center color-[#c1c1c1] text-sm"
          >Copyright © 2024 zhinengshengchan. | 鲁ICP备17022090号 | ©2024
          山东浪潮智能生产技术有限公司</div
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { distinct, page, selectMap, filePage, selectHelp } from './api'
import * as echarts from 'echarts'
import { jsonData } from './assets/chongqing'
import { constant } from 'lodash'
import { useRouter } from 'vue-router'
import meassageBg from './assets/meassageBg.png'

const router = useRouter()
const mainNum = ref(0)
const dataList = ref([])
const county = ref('') //区县参数
const options = ref([])
//鼠标移入事件
const mouseenterChange = async (val) => {
  mainNum.value = val
  let res = await distinct({ type: val })
  console.log(res, '基础数据')
  dataList.value = res
}
//时间线
const timeNum = ref(1)
const industry = ref()
const from = ref()
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
    },
    {
      index: '5',
      city: '烟台市',
      county: '巫溪县'
    },
    {
      index: '6',
      city: '威海市',
      county: '巫山县'
    },
    {
      index: '7',
      city: '青岛市',
      county: '开州区'
    },
    {
      index: '8',
      city: '临沂市',
      county: '云阳县'
    },
    {
      index: '9',
      city: '聊城市',
      county: '奉节县'
    }
  ]
})

const getSelectedHelp = async (type) => {
  if (!type) return
  const list = await selectHelp({ type })
  console.log("对口帮扶地域" + type, list);
  if (Array.isArray(list)) {
    if (type === '1') leftArr.tableData1 = list.map((item, index) => ({
      ...item,
      index: index + 1,
    }))

    if (type === '2') leftArr3.tableData1 = list.map((item, index) => ({
      ...item,
      index: index + 1,
      city: item.village,
      county: item.industry
    }))

    if (type === '3') return list
  }
}
getSelectedHelp('1')
getSelectedHelp('2')
const leftArr2 = reactive({
  tableColumns1: [
    {
      key: 'index',
      label: '序号',
      width: '8%'
    },
    {
      key: 'county',
      label: '',
      width: '20%'
    },
    {
      key: 'village',
      label: '示范村',
      width: '21%'
    },
    {
      key: 'form',
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
const leftArr3 = reactive({
  tableColumns1: [
    {
      key: 'index',
      label: '序号',
      width: '33%'
    },
    {
      key: 'city',
      label: '帮扶基地',
      width: '33%'
    },
    {
      key: 'county',
      label: '产业',
      width: '33%'
    }
  ],
  tableData1: [
    {
      index: '1',
      city: '开州区竹溪县灵泉村好耍主席园',
      county: '柑橘'
    },
    {
      index: '2',
      city: '万州区长滩镇龙泉社区四鼻鲤鱼养殖中心',
      county: '鲤鱼'
    },
    {
      index: '3',
      city: '武隆区芙蓉街道堰塘村田园综合体',
      county: '稻田'
    },
    {
      index: '4',
      city: '石柱县中益乡华溪村中药材基地',
      county: '中药'
    },
    {
      index: '5',
      city: '彭水县润溪乡樱桃井村布福娜',
      county: '樱桃'
    },
    {
      index: '6',
      city: '巫山县竹贤乡下庄村蔬菜大棚基地',
      county: '蔬菜'
    },
    {
      index: '7',
      city: '云阳县鱼泉镇木瓜村李子园',
      county: '李子'
    },
    {
      index: '8',
      city: '奉节县永乐镇大坝村柑橘园',
      county: '感觉'
    },
    {
      index: '9',
      city: '巫溪县通城镇龙池村水果园',
      county: '苹果'
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
//初始化地图
const mapList = ref([])
const getselectMap = (val) => {
  // let res=await selectMap({county:val})
  // localStorage.setItem('obj',JSON.stringify(res))
  // mapList.value=res
  return new Promise((resolve, reject) => {
    selectMap({ county: val }).then((res) => {
      mapList.value = res
      resolve(res)
    })
  })
}

const nameDataMap = {}
const initChinaMap = async () => {
  const res:any = await getSelectedHelp('3')
  
  const highlightList = res.map(item => ({
    name: item.county, value: 2000, selected: false
  }))
  
  echarts.registerMap('chongqing', jsonData)
  const nameArr = jsonData.features.map((item) => item.properties.name)

  nameArr.forEach((item) => {
    selectMap({ county: item }).then((res) => {
      console.log("ddss", res);
      
      nameDataMap[item] = res
    })
  })

  const chartDom = document.getElementById('mainMap')
  const myChart = echarts.init(chartDom)
  myChart.setOption(
    {
      baseOption: {
        geo: {
          zoom: 1.2,
          aspectScale: 1.2, //长宽比
          map: 'chongqing',
          roam: false,
          itemStyle: {
            borderColor: '#196059',
            borderWidth: 2,
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: '#17895d' // 0% 处的颜色// 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#17895d' // 100% 处的颜色 // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            },
            shadowColor: '#0938b6',
            shadowOffsetX: -10,
            shadowOffsetY: -10,
            shadowBlur: 19,
            emphasis: {
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: '#17895d' // 0% 处的颜色// 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#17895d' // 100% 处的颜色 // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              borderWidth: 2,
              borderColor: '#fda809'
            }
          }
        },
        tooltip: {
          show: true,
          className: 'tooltip-frame',
          trigger: 'item',
          enterable: true, //鼠标是否可进入提示框浮层中，默认为false，
          showContent: true, //是否显示提示框浮层
          triggerOn: 'click', //提示框触发的条件(mousemove|click|none)
          padding: [0, 0],
          backgroundColor: 'none',
          formatter: function (params) {
            const mapData: any = nameDataMap[params.name]
            console.log('mapData', mapData)
            if (!mapData[0].data || mapData[0].data.length === 0) return '<div></div>'
            let str = ``
            let div=`
            ${
              mapData[0].data ? mapData[0].data.map(item=>{
                return `
                <div class='mt--5px'>
                      <div class="color-[#fafafa] z-9999 my-8px text-sm">帮扶城市：${mapData[0]?.city}</div>
                      <div class="color-[#fafafa] text-sm">${item.years}年示范村：<a href="${item.bigscreen}" style="color: white;">${item.village}</a></div>  
                    </div>
                `
              }) : ''
            }`
            if (mapData.length == 0) {
              str = ''
            } else {
              str = `<div class=" relative p-[20px]">
                    <img src="${meassageBg}" class="absolute z--1 left-0 top-0 w-100% bg-none h-100% "/>
                    <div class="text-lg color-[#04c2c2] z-9999 " style="font-weight:700;">${mapData[0]?.county}</div>
                    ${div}

                    </div>`
            }
            return str
          },
          rich: {
            img: {
              backgroundColor: {
                image: './assets/meassageBg.png'
              },
              width: 100,
              height: 100,
              align: 'center'
            }
          }
        },
        dataRange: {
          x: '-1000px',
          y: '-1000px',
          splitList: [
            { start: 1, end: 1, label: '城口县', color: '' }
          ]
        },
        series: [
          {
            type: 'map',
            map: 'chongqing',
            zoom: 1.2,
            roam: false,
            aspectScale: 1.2,
            itemStyle: {
              borderColor: '#05d6f8',
              borderWidth: 2,
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: '#004647' // 0% 处的颜色// 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#004647' // 100% 处的颜色 // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              },
              shadowColor: '#0938b6',
              shadowOffsetX: -10,
              shadowOffsetY: -10,
              shadowBlur: 12,
              emphasis: {
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#004647' // 0% 处的颜色// 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#004647' // 100% 处的颜色 // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                },
                borderWidth: 2,
                borderColor: '#fda809'
              }
            },
            label: {
              show: true,
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '11',
              emphasis: {
                color: '#ffffff'
              },
              formatter: (item) => {
                const _name = item.name.replace("区", "").replace("自治县", "").replace("县", "")
                const labelMap = [
                  "九龙坡",
                  "大渡口",
                ]
                return labelMap.indexOf(_name) !== -1 ? _name.split("").join('\n') : _name
              }
            },
            data: highlightList
          }
        ]
      }
    },
    true
  )

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
onMounted(() => {
  initChinaMap()
})
//获取区县
const getPage = async (years) => {
  let res = await page({ pageNo: 1, pageSize: 100, years })
  leftArr2.tableData1 = res.list
  let list = []
  let list2 = []
  let list3 = []
  res.list.forEach((item) => {
    list.push(item.county)
    list2.push(item.form)
    list3.push(item.industry)
  })
  console.log(list2, 'list22')
  console.log(list3, 'list33333')
  options.value = Array.from(new Set(list))
  from.value = Array.from(new Set(list2)).length
  industry.value = Array.from(new Set(list3)).length
}
getPage('2024')
const tabTime = (val, years) => {
  timeNum.value = val
  getPage(years)
}
//下拉框切换
const selectChange = async (e) => {
  console.log(e, 'eeeeeeeeeeeee')
  county.value = e
  let res = await page({ pageNo: 1, pageSize: 100, county: e == '全部' ? '' : e })
  console.log(res, 'rrrrrrrrrrer')
  leftArr2.tableData1 = res.list
}
const goPage = (url) => {
  url? window.open(url):''
}
const list = ref([])
const getfilePage = async () => {
  let res = await filePage()
  res.list.forEach((item) => {
    item.upTime = new Date().toLocaleDateString(item.upTime)
  })
  list.value = res.list
}
getfilePage()
const goPage3 = (url) => {
  window.open(url)
}
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
  overflow: hidden;
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
.initMap {
  background-size: contain;
  background-image: url(./assets/initMapBg.png);
  background-repeat: no-repeat;
  background-position: center center;
}
.tooltip-frame {
  background-size: 100% 100%;
  background-image: url(./assets/meassageBg.png);
}
.center-bg {
  background-size: 100% 100%;
  background-image: url(./assets/dataBg.png);
}
.bigscreen-bg {
  background-size: 100% 100%;
  background-image: url(./assets/bigscreenBg.png);
}
.city-scroll::-webkit-scrollbar {
  display: none;
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

.num-one {
  white-space: nowrap;
  overflow: hidden;
}

@for $i from 1 through 6 {
  .data-icon-#{$i} {
    background-image: url(./assets/dataIcon#{$i}.png);
  }
}
@for $i from 1 through 15 {
  .num-one-#{$i} {
    background-image: url(./assets/num-one-#{$i}.png);
    background-size: 100% 100%;
    width: 20%;
    height: 100%;
    display: inline-block;
    margin-right: 10px;
  }
}
@for $i from 1 through 16 {
  .num-two-#{$i} {
    background-image: url(./assets/num-two-#{$i}.png);
    background-size: 100% 100%;
    width: 20%;
    height: 100%;
    margin-right: 15px;
  }
}
@for $i from 1 through 15 {
  .num-three-#{$i} {
    background-image: url(./assets/num-three-#{$i}.png);
    background-size: 100% 100%;
    width: 20%;
    margin-right: 15px;
    height: 100%;
  }
}
</style>
<style lang="scss" scoped>
.img-right {
  position: relative;
  left: 500px;
}
.target-img {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  animation: marquee 50s linear infinite;
}
.target-img div:hover {
  transition: all 0.6s;
  transform: scale(1.1);
}

.target-img div {
  width: 400px;
  flex-shrink: 0;
}
.target-img1 {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  animation: marquee1 50s linear infinite;
}

.target-img1 div:hover {
  transition: all 0.6s;
  transform: scale(1.1);
}

.target-img1 div {
  width: 400px;
  flex-shrink: 0;
}
/* 定义动画效果开始的位置以及消失的位置 */
@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-230vw);
  }
}

@keyframes marquee1 {
  0% {
    transform: translateX(-252vw);
  }

  100% {
    transform: translateX(0);
  }
}

/* 实现鼠标移入放大的效果 */
.target-top:hover .target-img {
  animation-play-state: paused;
}

.target-top:hover .target-img1 {
  animation-play-state: paused;
}
</style>