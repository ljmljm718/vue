<script setup lang="ts">
import {
  ProducerEntryApi,
  ProducerEntryVO
} from "@/api/agriculture/producerentry";
import {
  TraceTemplateApi,
  TraceTemplateVO
} from '@/api/agriculture/tracetemplate'

/** 查询生产商列表 */
const producerEntryList = ref<ProducerEntryVO[]>([]) // 生产商的数据
const getProducerEntryList = async () => {
  const data = await ProducerEntryApi.getProducerEntryAll({ approvalStatus: 1 })
  producerEntryList.value = data
}
const getLabelById = (id: string) => {
  const selectedItem = producerEntryList.value.find(item => item.id === id);
  if (!selectedItem) return '';
  return selectedItem.companyName
}
getProducerEntryList()

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
  if (!id) return {}
  const data = await TraceTemplateApi.getTraceTemplate(id)
  if (data) routeData.value = data
}
getDataById()
const dataInfo = computed(() => {
  if (Object.keys(props.data).length !== 0) return props.data;
  return routeData.value;
})
</script>
<template>
  <div class="w-full h-full overflow-auto">
    <div class="header-bg w-full aspect-[1.5]"></div>
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
            <div class="value-right">{{ getLabelById(dataInfo?.mfrsId) }}</div>
          </div>
          <div class="flex items-start justify-between">
            <div class="w-4.5rem">原产地:</div>
            <div class="value-right">{{ dataInfo?.origin }}</div>
          </div>
        </div>
        <div
          class="title-bg w-7rem h-2rem absolute text-center text-white"
          style="top: -1rem;left: calc(50% - 3.5rem);line-height: 2rem;"
        >基础信息</div>
      </div>
      <div class="relative mt-1.8rem w-[90%]">
        <div class="rect-bg aspect-3 pt-1.4rem px-1.3rem pb-.6rem">
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
      <div class="w-90% flex flex-col space-y-3 mt-1.6rem">
        <div v-for="item in 8" :key="item" class="flex items-start space-x-2">
          <div class="flex flex-col items-center w-2rem h-full relative top-1rem">
            <div class="text-#009688 art-font">{{ item }}</div>
            <div
              class="w-1px h-2rem mt-.4rem"
              style="border-right: 1px dashed #009688;"
            ></div>
          </div>
          <div class="grow shadow-md h-3.6rem flex space-x-1rem items-center box-border px-1rem" style="border: 1px solid #e1e1e1;">
            <div class="w-2rem h-2rem rounded-full bg-blue"></div>
            <div>
              <div>育苗</div>
              <div class="text-#999 text-.8rem">2024.08.15 14:21:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-[1.6rem] flex flex-col items-center">
      <div class="relative font-bold text-[1.1rem]">
        <span>产品展示</span>
        <div class="flower-icon absolute right-[-2rem] top-[-.4rem] w-3rem h-3rem"></div>
      </div>
      <div class="w-2.3rem h-4px bg-[#009688] mt-[.2rem] rounded-full"></div>
      <div class="grid gap-3 grid-cols-2 w-90% mt-1rem box-border p-3">
        <div
          class="show-bg w-full aspect-1"
          v-for="item in 4"
          :key="item"
        ></div>
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
</style>