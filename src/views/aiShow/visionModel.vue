<script setup lang="ts">
const activeTab = ref<string>('text2img');
const imgAspect = ref<string>('1:1');
</script>

<template>
  <div style="width: calc(100% - 74px)">
    <div
      class="h-[63px] px-[24px] flex items-center bg-[#F2F4FA] font-bold"
      style="border-bottom: 1px solid #e0e3eb"
    >
      视觉模型
    </div>
    <div class="h-[calc(100%_-_64px)] bg-[#f5f7fb]">
      <div class="w-full h-[75px] text-16px flex justify-center items-center">
        <div class="rounded-full bg-white flex items-center cursor-pointer select-none">
          <div
            class="flex items-center p-3 px-21px space-x-2 transition-all"
            :class="[activeTab === 'text2img' ? 'active-tab' : '']"
            @click="activeTab = 'text2img'"
          >
            <div
              class="w-14px h-16px"
              :class="[activeTab === 'text2img' ? 't-icon-1' : 'td-icon-1']"
            ></div>
            <div>文生图</div>
          </div>
          <div
            class="flex items-center p-3 px-21px space-x-2 transition-all"
            :class="[activeTab === 'imgparse' ? 'active-tab' : '']"
            @click="activeTab = 'imgparse'"
          >
            <div
              class="w-14px h-16px"
              :class="[activeTab === 'imgparse' ? 't-icon-2' : 'td-icon-2']"
            ></div>
            <div>图文解析</div>
          </div>
        </div>
      </div>
      <div class="h-[calc(100%_-_75px)] flex justify-center items-center px-2 pb-4 box-border">
        <div class="container h-full flex space-x-16px" v-show="activeTab === 'text2img'">
          <div class="w-500px bg-white rounded-1 px-24px py-16px">
            <el-scrollbar>
              <div class="space-y-16px">
                <div>文生图</div>
                <textarea class="textarea-container"></textarea>
                <div class="flex items-center space-x-8px select-none">
                  <div class="pr-8px">图片比例</div>
                  <div
                    class="bg-#F5F6FA rounded-1 px-21px py-6px cursor-pointer"
                    :class="[imgAspect === '1:1' ? 'active-aspect' : '']"
                    @click="imgAspect = '1:1'"
                  >
                    1:1
                  </div>
                  <div
                    class="bg-#F5F6FA rounded-1 px-21px py-6px cursor-pointer"
                    :class="[imgAspect === '4:3' ? 'active-aspect' : '']"
                    @click="imgAspect = '4:3'"
                  >
                    4:3
                  </div>
                  <div
                    class="bg-#F5F6FA rounded-1 px-21px py-6px cursor-pointer"
                    :class="[imgAspect === '16:9' ? 'active-aspect' : '']"
                    @click="imgAspect = '16:9'"
                  >
                    16:9
                  </div>
                </div>
                <div class="w-full text-center py-3 bg-green text-white cursor-pointer">
                  立即生成
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="w-[calc(100%_-_516px)] bg-white rounded-1">
            <div class="w-full h-full flex flex-col items-center justify-center">
              <div class="no-content w-240px h-232px"></div>
              <div class="text-[#999999] text-16px">暂无内容，快去生成吧</div>
            </div>
          </div>
        </div>
        <div class="container h-full flex space-x-16px" v-show="activeTab === 'imgparse'"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.textarea-container {
  width: calc(100% - 10px);
  border: 1px solid #29b808;
  margin: 0;
  height: 200px;
}

.active-tab {
  background-color: #e5f5f3;
  border-radius: 999px;
  color: #009688;
}

.no-content {
  background-image: url('./assets/noContent.png');
  background-size: 100% 100%;
}

.active-aspect {
  border: 1px solid #29b808;
  background-color: #0fbf7a40;
}

.t-icon-1 {
  background-image: url('./assets/ticon1.png');
  background-size: 100% 100%;
}

.td-icon-1 {
  background-image: url('./assets/tdicon1.png');
  background-size: 100% 100%;
}

.t-icon-2 {
  background-image: url('./assets/ticon2.png');
  background-size: 100% 100%;
}

.td-icon-2 {
  background-image: url('./assets/tdicon2.png');
  background-size: 100% 100%;
}
</style>
