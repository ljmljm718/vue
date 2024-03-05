<template>
  <ContentWrap>
    <h3>待开发</h3>
  </ContentWrap>

  <div v-show="showTip" id="weixinTip" ref="weixin" class="wxtip">
    <p class="wxtip-txt">
      在微信中无法打开
      <br/>
      1. 请点击右上角按钮
      <br/>
      2. 选择【在浏览器中打开】
    </p>
  </div>
</template>

<script setup lang="ts">
import {BasicScanCodeApi, BasicScanCodeVO} from '@/api/kaizhou/basicscancode'
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import router from '@/router'

/** 扫码记录 列表 */
defineOptions({name: 'BasicScanCode'})

const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BasicScanCodeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  identificationCode: undefined,
  scanTime: [],
  scanIp: undefined,
  scanLon: undefined,
  scanLat: undefined,
  scanLocation: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const showTip = ref(false) // 微信打开弹出层
const formData = ref({
  id: undefined,
  identificationCode: undefined,
  scanTime: undefined,
  scanIp: undefined,
  scanLon: undefined,
  scanLat: undefined,
  scanLocation: undefined,
  tenantId:undefined,
})

const onLoad = async () => {
  const {userAgent} = navigator
  const isWeixin = !!/MicroMessenger/i.test(userAgent)
  const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1
  const isMac = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isWeixin) {
    showTip.value = true
  } else {
    loading.value = true
    saveRecord();
  }
}

const saveRecord = async () => {
  if(router.currentRoute.value.query.qrCode) {
    formData.value.identificationCode = router.currentRoute.value.query.qrCode
    formData.value.tenantId = router.currentRoute.value.query.tenantId
  } else {
    message.error('扫码异常，请重新扫码或联系管理员')
  }
  if (window.navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        // 成功获取位置信息
        const { latitude, longitude } = position.coords;
        formData.value.scanLat = latitude
        formData.value.scanLon = longitude
      },
      error => {
         //message.error('无法获取您的位置信息')
      },
      {
        // 可选定位配置项
        enableHighAccuracy: false,
        timeout: 9000,
        maximumAge: 3600000,
      }
    )
  } else {
    //message.error('您的浏览器不支持地理定位功能')
  }

  console.log(formData.value)
  //存储扫码记录
  await BasicScanCodeApi.createBasicScanCode(formData.value)
}

/** 初始化 **/
onMounted(() => {
  //getList()
  onLoad()
})

</script>
<style lang="scss" scoped>
.wxtip {
  background: rgba(0, 0, 0, 0.8);
  text-align: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;

  img {
    width: 100%;
  }
}

.wxtip-txt {
  margin-top: 107px;
  color: #fff;
  font-size: 20px;
  line-height: 1.8;
}

</style>
