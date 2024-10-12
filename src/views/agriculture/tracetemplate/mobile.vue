<script setup lang="ts">
import {
  ProducerEntryApi,
  ProducerEntryVO
} from "@/api/agriculture/producerentry";
import {
  TraceTemplateApi
} from '@/api/agriculture/tracetemplate'
import dayjs from 'dayjs'

/** 查询生产商列表 */
const producerEntryList = ref<ProducerEntryVO[]>([]) // 生产商的数据
const getProducerEntryList = async () => {
  const data = await ProducerEntryApi.getProducerEntryAll({ approvalStatus: 1 })
  producerEntryList.value = data
}
const getLabelById = (id: string) => {
  const selectedItem = producerEntryList.value.find(item => item.id === id);
  if (!selectedItem) return null;
  return selectedItem.companyName
}

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const route = useRoute()
const routeData = ref<any>({})
const getDataById = async () => {
  const { id } = route.query;
  if (!id) {
    getProducerEntryList()
    return {}
  }
  const data = await TraceTemplateApi.getCodeSendingInfoAndCreatTraceRecord({ id })
  console.log("🚀 ~ getDataById ~ data:", data)
  if (data) routeData.value = data
}
getDataById()
const dataInfo = computed(() => {
  if (Object.keys(props.data).length !== 0) return props.data;
  return routeData.value;
})

const resourceInfoList = computed(() => {
  const iconArr = ['苗', '秧', '地', '虫', '除草', '肥', '地', '药']
  if (routeData.value && Array.isArray(routeData.value.farmRecordList)) {
    return routeData.value.farmRecordList.map(item => {
      const index = iconArr.findIndex(ele => item.defineName.indexOf(ele) !== -1);
      return { ...item, icon: `icon-${index === -1 ? 7 : index + 1}` }
    });
  } else {
    // return [
    //   { recordTime: new Date().valueOf(), defineName: '浇水', icon: 'icon-7' },
    //   { recordTime: new Date().valueOf(), defineName: '除草', icon: 'icon-5' },
    //   { recordTime: new Date().valueOf(), defineName: '打药', icon: 'icon-8' },
    // ]
    return []
  }
})

const productList = computed(() => {
  if (routeData.value && routeData.value.productImg) {
    const arr = routeData.value.productImg.split(',')
    return arr.map((img, i) => {
      return { id: i + 1, img}
    })
  } else {
    if (Object.keys(props.data).length !== 0) {
      const { productImgs } = props.data;
      if (Array.isArray(productImgs)) {
        return productImgs.map((img, i) => {
          return { id: i + 1, img}
        })
      }
    }
    return []
  }
})
</script>
<template>
  <div class="w-full h-full overflow-auto text-[#000]">
    <!-- <div class="header-bg w-full max-h-[8rem]">
    </div> -->
    <img
      :src="dataInfo?.headerImg"
      class="w-full h-18rem object-cover"
    />
    <div class="linear-bg py-[1.6rem] flex flex-col items-center">
      <div class="relative font-bold text-[1.1rem]">
        <span>产品概况</span>
        <div class="flower-icon absolute right-[-2rem] top-[-.4rem] w-3rem h-3rem"></div>
      </div>
      <div class="w-2.3rem h-4px bg-[#009688] mt-[.2rem] rounded-full"></div>
      <div class="relative mt-2rem w-[90%]">
        <div class="rect-bg aspect-3 box-border p-2rem space-y-.4rem">
          <div class="flex items-start justify-between">
            <div class="w-4.5rem">模板名称:</div>
            <div class="value-right">{{ dataInfo?.templateName }}</div>
          </div>
          <div class="flex items-start justify-between">
            <div class="w-4.5rem">生产商:</div>
            <div class="value-right">{{ getLabelById(dataInfo?.mfrsId) ?? dataInfo?.producer }}</div>
          </div>
          <div class="flex items-start justify-between">
            <div class="w-4.5rem">原产地:</div>
            <div class="value-right">{{ dataInfo?.origin ?? dataInfo?.sourceArea }}</div>
          </div>
        </div>
        <div
          class="title-bg w-7rem h-2rem absolute text-center text-white"
          style="top: -1rem;left: calc(50% - 3.5rem);line-height: 2rem;"
        >基础信息</div>
      </div>
      <div class="relative mt-1.8rem w-[90%]">
        <div
          class="rect-bg aspect-3 pt-1.4rem px-1.3rem pb-.6rem"
          style="text-indent: 2rem;"
        >
          {{ dataInfo?.brandDetail }}
        </div>
        <div
          class="title-bg w-7rem h-2rem absolute text-center text-white"
          style="top: -1rem;left: calc(50% - 3.5rem);line-height: 2rem;"
        >品牌介绍</div>
      </div>
    </div>
    <div class="py-[1.6rem] flex flex-col items-center">
      <div class="relative font-bold text-[1.1rem]">
        <span>溯源信息</span>
        <div class="flower-icon absolute right-[-2rem] top-[-.4rem] w-3rem h-3rem"></div>
      </div>
      <div class="w-2.3rem h-4px bg-[#009688] mt-[.2rem] rounded-full"></div>
      <div v-if="resourceInfoList.length > 0" class="w-90% flex flex-col space-y-3 mt-1.6rem">
        <div
          v-for="item, index in resourceInfoList"
          :key="item.id"
          class="flex items-start space-x-2"
        >
          <div class="flex flex-col items-center w-2rem h-full relative top-1rem">
            <div class="text-#009688 art-font">{{ index + 1 }}</div>
            <div
              class="w-1px h-2rem mt-.4rem"
              style="border-right: 1px dashed #009688;"
            ></div>
          </div>
          <div class="grow shadow-md h-3.6rem flex space-x-1rem items-center box-border px-1rem" style="border: 1px solid #e1e1e1;">
            <div :class="`w-2rem h-2rem rounded-full ${item.icon}`"></div>
            <div>
              <div>{{ item.defineName }}</div>
              <div class="text-#999 text-.8rem">{{ dayjs(item.recordTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-90% h-[10rem] mt-1.6rem no-data text-center tracking-widest">暂无数据</div>
    </div>
    <div class="py-[1.6rem] flex flex-col items-center">
      <div class="relative font-bold text-[1.1rem]">
        <span>产品展示</span>
        <div class="flower-icon absolute right-[-2rem] top-[-.4rem] w-3rem h-3rem"></div>
      </div>
      <div class="w-2.3rem h-4px bg-[#009688] mt-[.2rem] rounded-full"></div>
      <div class="grid gap-3 grid-cols-2 w-90% mt-1rem box-border p-3">
        <div
          class="w-full p-1 box-border rounded-2"
          v-for="item in productList"
          :key="item.id"
          style="border: 1px solid #009688;"
        >
          <img :src="item.img" class="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.header-bg {
  background-image: url(./assets/headerBg.png);
  background-size: 100% 100%;
}

.linear-bg {
  background: linear-gradient(to top, #FFFFFF, #EAF5F4, #FFFFFF);
}

.rect-bg {
  background-image: url(./assets/rect.png);
  background-size: 100% 100%;
}

.title-bg {
  background-image: url(./assets/titleBg.png);
  background-size: 100% 100%;
}

.flower-icon {
  background-image: url(./assets/flower.png);
  background-size: 100% 100%;
}

.show-bg {
  background-image: url(./assets/show.png);
  background-size: 100% 100%;
}

.value-right {
  width: calc(100% - 4.5rem);
}

@for $i from 1 through 8 {
  .icon-#{$i} {
    background-image: url(./assets/icons/icon#{$i}.png);
    background-size: 100% 100%;
  }
}

.no-data {
  background: {
    image: url(@/assets/imgs/chartNull.png);
    size: contain;
    position: center;
    repeat: no-repeat;
  }
}
</style>