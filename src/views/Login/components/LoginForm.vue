<template>
  <div class="flex flex-col ">
    <el-form
      v-show="getShow"
      ref="formLogin"
      :model="loginData.loginForm"
      :rules="LoginRules"
      class=" bg-[#ffffff] px-[2rem] rounded-3 py-[3rem]"
      label-position="top"
      label-width="120px"
      size="small"
    >
      <!-- <LoginFormTitle style="margin-bottom:10px;"/> -->
      <LoginFormTitle class="my-1 text-3xl" />
      <el-row style="margin-right: -10px; margin-left: -10px;">
        <el-col
          :span="24"
          class="px-[1.5rem] mt-[1.5rem] mb-[0.5rem]"
        >
          <el-form-item
            class="form-item"
            style="border:none !important;"
            v-if="loginData.tenantEnable === 'true'"
            prop="tenantName"
          >
            <el-input
              class="login-input is-empty h-[3rem] !font-size-[1rem]"
              style="border:none"
              v-model="loginData.loginForm.tenantName"
              :placeholder="t('login.tenantNamePlaceholder')"
              link
            >
              <template #prefix>
                <div class="px-2 pl-3 flex justify-center items-center">
                  <iconHouse />
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>

        <el-col
          :span="24"
          class="px-[1.5rem] mb-[0.5rem]"
        >
          <el-form-item
            prop="username"
            class="form-item"
          >
            <el-input
              class="login-input h-[3rem] !font-size-[1rem]"
              v-model="loginData.loginForm.username"
              :placeholder="t('login.usernamePlaceholder')"
            >
              <template #prefix>
                <div class="px-2 pl-3 flex justify-center items-center">
                  <iconAvatar />
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          class="px-[1.5rem] mb-[0.5rem]"
        >
          <el-form-item
            prop="password"
            class="form-item"
          >
            <el-input
              class="login-input h-[3rem] !font-size-[1rem]"
              v-model="loginData.loginForm.password"
              :placeholder="t('login.passwordPlaceholder')"
              show-password
              type="password"
              @keyup.enter="getCode()"
            >
              <template #prefix>
                <div class="px-2 pl-3 flex justify-center items-center">
                  <iconLock />
                </div>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="px-[20px] mt-[-20px]">
          <el-form-item>
            <el-row
              justify="space-between"
              style="width: 100%; height:30px; margin-top:1rem"
            >
              <el-col
                class="!color-[#46696c]"
                :span="6"
              >
                <el-checkbox
                  class="!color-[#46696c]"
                  v-model="loginData.loginForm.rememberMe"
                >
                  <span class="text-1.1rem">
                    {{ t('login.remember') }}
                  </span>
                </el-checkbox>
              </el-col>
              <el-col
                :offset="6"
                :span="12"
              >
                <el-link
                  style="float: right;"
                  class="!color-[#46696c]"
                  type="primary"
                >
                  <span class="text-1.1rem">
                    {{ t('login.forgetPassword') }}
                  </span>
                </el-link>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col
          :span="24"
          class="px-[20px]"
        >
          <el-form-item>
            <XButton
              :loading="loginLoading"
              :title="t('login.login')"
              class="w-[100%] btn-bg mb-20px !color-[#fff]  !py-1.5rem !text-1.3rem"
              @click="getCode()"
            />
          </el-form-item>
        </el-col>
        <Verify
          ref="verify"
          :captchaType="captchaType"
          :imgSize="{ width: '400px', height: '200px' }"
          mode="pop"
          @success="handleLogin"
        />
        <el-col
          :span="24"
          style="padding-right: 10px; padding-left: 10px"
        >
          <!-- <el-form-item>
          <el-row :gutter="5" justify="space-between" style="width: 100%">
            <el-col :span="8">
              <XButton
                :title="t('login.btnMobile')"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.MOBILE)"
              />
            </el-col>
            <el-col :span="8">
              <XButton
                :title="t('login.btnQRCode')"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.QR_CODE)"
              />
            </el-col>
            <el-col :span="8">
              <XButton
                :title="t('login.btnRegister')"
                class="w-[100%]"
                @click="setLoginState(LoginStateEnum.REGISTER)"
              />
            </el-col>
          </el-row>
        </el-form-item> -->
        </el-col>
        <!--      <el-divider content-position="center">{{ t('login.otherLogin') }}</el-divider>-->
        <!--      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">-->
        <!--        <el-form-item>-->
        <!--          <div class="w-[100%] flex justify-between">-->
        <!--            <Icon-->
        <!--              v-for="(item, key) in socialList"-->
        <!--              :key="key"-->
        <!--              :icon="item.icon"-->
        <!--              :size="30"-->
        <!--              class="anticon cursor-pointer"-->
        <!--              color="#999"-->
        <!--              @click="doSocialLogin(item.type)"-->
        <!--            />-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--      </el-col>-->
        <!--      <el-divider content-position="center">萌新必读</el-divider>-->
        <!--      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">-->
        <!--        <el-form-item>-->
        <!--          <div class="w-[100%] flex justify-between">-->
        <!--            <el-link href="https://doc.iocoder.cn/" target="_blank">📚开发指南</el-link>-->
        <!--            <el-link href="https://doc.iocoder.cn/video/" target="_blank">🔥视频教程</el-link>-->
        <!--            <el-link href="https://www.iocoder.cn/Interview/good-collection/" target="_blank">-->
        <!--              ⚡面试手册-->
        <!--            </el-link>-->
        <!--            <el-link href="http://static.yudao.iocoder.cn/mp/Aix9975.jpeg" target="_blank">-->
        <!--              🤝外包咨询-->
        <!--            </el-link>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <!--      </el-col>-->
      </el-row>
    </el-form>

  </div>

</template>
<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useIcon } from '@/hooks/web/useIcon'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'

defineOptions({ name: 'LoginForm' })

const { t } = useI18n()
const message = useMessage()
const iconHouse = useIcon({ icon: 'ep:house', size: 20 })
const iconAvatar = useIcon({ icon: 'ep:avatar', size: 20 })
const iconLock = useIcon({ icon: 'ep:lock', size: 20 })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '鲁渝协作乡村振兴示范村数字化赋能',
    username: 'admin',
    password: '',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  }
})

const socialList = [
  { icon: 'ant-design:wechat-filled', type: 30 },
  { icon: 'ant-design:dingtalk-circle-filled', type: 20 },
  { icon: 'ant-design:github-filled', type: 0 },
  { icon: 'ant-design:alipay-circle-filled', type: 0 }
]

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// 获取租户 ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}
// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
// 根据域名，获得租户信息
const getTenantByWebsite = async () => {
  const website = location.host
  const res = await LoginApi.getTenantByWebsite(website)
  if (res) {
    loginData.loginForm.tenantName = res.name
    authUtil.setTenantId(res.id)
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    loginData.loginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login(loginData.loginForm)
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    // 判断是否为SSO登录
    if (redirect.value.indexOf('sso') !== -1) {
      window.location.href = window.location.href.replace('/login?redirect=', '')
    } else {
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } finally {
    loginLoading.value = false
    loading.value.close()
  }
}

// 社交登录
const doSocialLogin = async (type: number) => {
  if (type === 0) {
    message.error('此方式未配置')
  } else {
    loginLoading.value = true
    if (loginData.tenantEnable === 'true') {
      // 尝试先通过 tenantName 获取租户
      await getTenantId()
      // 如果获取不到，则需要弹出提示，进行处理
      if (!authUtil.getTenantId()) {
        try {
          const data = await message.prompt('请输入租户名称', t('common.reminder'))
          if (data?.action !== 'confirm') throw 'cancel'
          const res = await LoginApi.getTenantIdByName(data.value)
          authUtil.setTenantId(res)
        } catch (error) {
          if (error === 'cancel') return
        } finally {
          loginLoading.value = false
        }
      }
    }
    // 计算 redirectUri
    // tricky: type、redirect需要先encode一次，否则钉钉回调会丢失。
    // 配合 Login/SocialLogin.vue#getUrlValue() 使用
    const redirectUri =
      location.origin +
      '/social-login?' +
      encodeURIComponent(`type=${type}&redirect=${redirect.value || '/'}`)

    // 进行跳转
    const res = await LoginApi.socialAuthRedirect(type, encodeURIComponent(redirectUri))
    window.location.href = res
  }
}
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getLoginFormCache()
  getTenantByWebsite()
})
</script>

<style lang="scss" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
:deep(.el-form-item__error) {
  font-size: 1.3rem !important;
}
.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
.el-input {
  --el-input-text-color: #000 !important;
}
.btn-bg {
  box-sizing: border-box;
  background-color: #00aa52;
  border: none !important;
  background-size: 100% 100% !important;
  // background-image: url(@/assets/imgs/btn-bg.png) !important;
}

::v-deep .el-input__wrapper {
  background-color: transparent !important;
  border-color: transparent !important;
  background-size: 100% 100% !important;
  background-image: url('../assets/formInput.png') !important;
}

.form-item {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    cursor: text;
    .el-input__inner {
      cursor: text !important;
    }
  }
}

/* 针对el-input的自动填充样式 */
::v-deep .el-input__inner:-webkit-autofill {
  -webkit-border-radius: 4px;
  border-radius: 4px;
  color: pink !important;
  -webkit-text-fill-color: #000000;
  transition: background-color 50000s ease-in-out 0s;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #46696c !important;
  border: 1px solid #46696c !important;
}
::v-deep .el-checkbox__inner:hover {
  border-color: #46696c;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #46696c;
}
::v-deep .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #46696c !important;
}

::v-deep .login-input .el-input__inner:hover {
  cursor: text !important;
}
</style>
