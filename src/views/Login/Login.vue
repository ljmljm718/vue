<template>
  <div
    :class="` basic-login ${isTaiyuan ? 'taiyuan-login' : ''} w-[100vw] h-[100vh]`"
    id="loginPageDom"
  >
    <ScaleBox>
      <div
        :class="`${prefixCls} relative w-full h-full lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px`"
      >
        <div class="logo"></div>
        <div class="absolute left-[220px] left-img w-[850px] top-[270px] aspect-[1.56]"></div>
        <div class="relative mx-auto h-full flex">
          <div class="relative relative2 flex-1 p-30px lt-sm:p-10px overflow-hidden">
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
              <div class="w-[700px] h-600px ml-[1100px]">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScaleBox>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils';
import { useDesign } from '@/hooks/web/useDesign';
import { useAppStore } from '@/store/modules/app';
import { ThemeSwitch } from '@/layout/components/ThemeSwitch';
import { LocaleDropdown } from '@/layout/components/LocaleDropdown';
import ScaleBox from 'vue3-scale-box';
import { LoginForm, MobileForm, QrCodeForm, RegisterForm, SSOLoginVue } from './components';
import { mainEventBus } from '@/utils/eventBus';

defineOptions({ name: 'Login' });

mainEventBus.emit('LOGIN', {});

const { t } = useI18n();
const appStore = useAppStore();
const { getPrefixCls } = useDesign();
const prefixCls = getPrefixCls('login');

const route = useRoute();
const isTaiyuan = route.path.indexOf('taiyuan') !== -1;

onMounted(() => {
  const routePath = route.path;
  const matchedArr = routePath.match(/\/[A-Za-z]+\//g);
  if (Array.isArray(matchedArr) && matchedArr.length > 0) {
    const matchedItem = matchedArr[0];
    const formattedName = matchedItem.replaceAll('/', '');
    localStorage.setItem('CURRENT_PROJECT_NAME', formattedName);
  } else {
    localStorage.setItem('CURRENT_PROJECT_NAME', '');
  }
});
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
      // background-image: url('@/assets/imgs/loginBg.png');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
.relative {
  background-size: 100% 100%;
  // background-image: url('@/assets/imgs/loginBg.png');
}
.relative2 {
  display: flex;
  justify-content: center;
  align-items: center;
  .cont {
    width: 90%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
}

.basic-login {
  // position: relative;
  background-image: url('./assets/bgwithmengban.png');
  background-size: 100% 100%;
  .logo {
    position: absolute;
    top: 1.5%;
    z-index: 999;
    left: 0px;
    // height: 40px;
    width: 1200px;
    aspect-ratio: 8.6;
    background-size: 100% 100%;
    object-fit: container;
    background-image: url('./assets/leftTitle.png');
  }

  .left-img {
    background-size: 100% 100%;
    background-image: url('./assets/leftContent.png');
  }
}

.taiyuan-login {
  background-image: url('./assets/bgwithmengban2.png') !important;
  .logo {
    top: 5% !important;
    left: 0 !important;
    width: 800px !important;
    aspect-ratio: 13 !important;
    background-image: url('./assets/leftTitle2.png') !important;
  }
  .left-img {
    background-image: none !important;
  }
}
</style>
