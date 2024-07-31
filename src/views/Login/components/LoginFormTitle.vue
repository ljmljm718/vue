<template>
  <h2 class="enter-x !my-20px text-center  text-xl  color-[#12bb86]" style="font-weight:500" >
     <!-- 开州区鲁渝协作乡村振兴示范村数字化赋能 -->
     欢迎登陆
  </h2>
</template>
<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'

defineOptions({ name: 'LoginFormTitle' })

const { t } = useI18n()

const { getLoginState } = useLoginState()

const getFormTitle = computed(() => {
  const titleObj = {
    [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
    [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
    [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
    [LoginStateEnum.MOBILE]: t('sys.login.mobileSignInFormTitle'),
    [LoginStateEnum.QR_CODE]: t('sys.login.qrSignInFormTitle'),
    [LoginStateEnum.SSO]: t('sys.login.ssoFormTitle')
  }
  return titleObj[unref(getLoginState)]
})
</script>
