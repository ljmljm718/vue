<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px login"
  >
    <div class="logo"></div>
    <div class="relative mx-auto h-full flex">
      
      <div class="relative relative2 flex-1 p-30px dark:bg-[var(--login-bg-color)] lt-sm:p-10px">
      
         <!-- 右上角的主题、语言选择 -->
        <!-- <div
          class="flex items-center justify-between text-white at-2xl:justify-end at-xl:justify-end"
        >
          <div class="flex items-center at-2xl:hidden at-xl:hidden">
            <img alt="" class="mr-10px h-48px w-48px" src="@/assets/imgs/logo.png" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>
          <div class="flex items-center justify-end space-x-10px">
            <ThemeSwitch />
            <LocaleDropdown class="dark:text-white lt-xl:text-white" />
          </div>
        </div>  -->
        <!-- 右边的登录界面 -->
        <!-- <Transition appear enter-active-class="animate__animated animate__bounceInRight" style="color:#fff">
          
          <div 
            class="m-auto h-full w-[100%] flex items-center at-2xl:max-w-800px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px;"
          > -->
            <!-- 账号登录 -->
            <!-- <LoginForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)"/> -->
            <!-- 手机登录 -->
            <!-- <MobileForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)"/> -->
            <!-- 二维码登录 -->
            <!-- <QrCodeForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" /> -->
            <!-- 注册 -->
            <!-- <RegisterForm class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" /> -->
            <!-- 三方登录 -->
            <!-- <SSOLoginVue class="m-auto h-auto p-20px lt-xl:(rounded-3xl light:bg-white)" /> -->
          <!-- </div> -->
        <!-- </Transition> -->
        <div class="cont">
          <div class="left">
            <div class="left-top"></div>
            <div class="left-content"></div>
          </div>
          <div style="width: 35%;height: 100%;">
              <LoginForm />
          </div>
        </div>
       
        
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'

import { LoginForm, MobileForm, QrCodeForm, RegisterForm, SSOLoginVue } from './components'
import { mainEventBus } from '@/utils/eventBus'

defineOptions({ name: 'Login' })

mainEventBus.emit("LOGIN", {})

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;

  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/imgs/loginBg.png');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
.relative{
    background-size:100% 100% ;
    background-image: url('@/assets/imgs/loginBg.png');
}
.relative2{
  display: flex;
  justify-content: center;
  align-items: center;
  .cont{
    width: 1300px;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    .left{
      width: 100%;
      .left-top{
        width: 200px;
        height: 70px;
        margin: auto;
        background-size: 100% 100%;
        background-image: url(@/assets/imgs/left-top.png);
      }
      .left-content{
        width: 65%;
        margin: auto;
        height: calc(500px - 50px);
        background-size: 100% 100%;
        background-image: url(@/assets/imgs/left-content.png);
      }
    }
}
}

.login{
  position: relative;
  .logo{
  position: absolute;
  top: 5%;
  z-index: 999;
  left: 3%;
  width: 35rem;
  height: 20px;
  background-size: 100% 100%;
  object-fit:container;
  background-image: url(@/assets/imgs/Logo2.png);
}
}

</style>
