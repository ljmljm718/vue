<script lang="tsx">
import { computed, defineComponent, unref, ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { Backtop } from '@/components/Backtop';
import { Setting } from '@/layout/components/Setting';
import { useRenderLayout } from './components/useRenderLayout';
import { useDesign } from '@/hooks/web/useDesign';
import { record_start, record_upload, asr, matchMenu } from '@/utils/menuMatch';
import { useRouter } from 'vue-router';

const { getPrefixCls } = useDesign();

const prefixCls = getPrefixCls('layout');

const appStore = useAppStore();

// 是否是移动端
const mobile = computed(() => appStore.getMobile);

// 菜单折叠
const collapse = computed(() => appStore.getCollapse);

const layout = computed(() => appStore.getLayout);

const handleClickOutside = () => {
  appStore.setCollapse(true);
};

const renderLayout = () => {
  switch (unref(layout)) {
    case 'classic':
      const { renderClassic } = useRenderLayout();
      return renderClassic();
    case 'topLeft':
      const { renderTopLeft } = useRenderLayout();
      return renderTopLeft();
    case 'top':
      const { renderTop } = useRenderLayout();
      return renderTop();
    case 'cutMenu':
      const { renderCutMenu } = useRenderLayout();
      return renderCutMenu();
    default:
      break;
  }
};

// 开始录音
const startRecord = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // 如果成功获取到流，则有权限
  console.log('麦克风权限已授予');

  // 使用完毕后记得关闭流
  stream.getTracks().forEach((track) => track.stop());
  record_start();
};

// 停止录音
const matchList = ref<any[]>([]);
const stopRecord = async () => {
  console.log('触发 stopRecord');
  const path = await record_upload().catch(() => {
    console.log('record_upload catch');
  });
  const asrRes = await asr({
    audioPath: path
  }).catch(() => {
    console.log('asr catch');
  });
  if (typeof asrRes === 'string') {
    console.log('asrRes: ', asrRes);
    // 识别出文字后开始匹配
    matchList.value = matchMenu(asrRes);
    console.log('match res: ', matchList.value);
  } else {
    ElMessage.warning('语音识别失败，请稍后重试！');
    matchList.value = [];
  }
};

const renderMenuMatch = () => {
  const router = useRouter();

  // 跳转
  const handleRoute = (path: string) => {
    router.push({ path });
    matchList.value = [];
  };
  return (
    <div class="fixed bottom-0 right-0 w-[200px] h-[100px] bg-black flex flex-col justify-evenly items-center z-50">
      <div
        class="w-[150px] h-[40px] bg-white cursor-pointer text-center leading-[40px]"
        onClick={startRecord}
      >
        开始录音
      </div>
      <div
        class="w-[150px] h-[40px] bg-white cursor-pointer text-center leading-[40px]"
        onClick={stopRecord}
      >
        停止录音
      </div>
      <div class="absolute top-0 left-0 -translate-y-full bg-violet-300">
        {matchList.value.length > 0 &&
          matchList.value.map((item: any) => (
            <div
              class="bg-white px-[8px] py-[4px] cursor-pointer"
              onClick={() => {
                handleRoute(item.route);
              }}
            >
              {item.name}
            </div>
          ))}
      </div>
    </div>
  );
};

export default defineComponent({
  name: 'Layout',
  setup() {
    return () => (
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, 'w-[100%] h-[100%] relative']}>
        {mobile.value && !collapse.value ? (
          <div
            class="absolute left-0 top-0 z-99 h-full w-full bg-[var(--el-color-black)] opacity-30"
            onClick={handleClickOutside}
          ></div>
        ) : undefined}

        {renderLayout()}

        <Backtop></Backtop>

        {/* <Setting></Setting> */}
        {/* renderMenuMatch() */}
      </section>
    );
  }
});
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-layout;

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
  :deep(.#{$elNamespace}-scrollbar__view) {
    height: 100% !important;
  }
}
</style>
