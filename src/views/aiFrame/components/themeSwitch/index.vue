<script setup lang="ts">
import cloud from './cloud.vue';
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'change']);

const handleClick = () => {
  emit('change', !props.modelValue);
  emit('update:modelValue', !props.modelValue);
};

const enableWhite = computed(() => !props.modelValue);
</script>
<template>
  <div
    class="my-switch-frame"
    @click="handleClick"
    :style="`
            // background-color:${enableWhite ? 'white' : 'black'};
            box-shadow: ${
              enableWhite
                ? '2px 2px 5px #00000079'
                : '3px 2px 3px #ffffff90, -2px -3px 14px #ffffff40'
            };
        `"
  >
    <cloud :style="`top:${enableWhite ? '22px' : '40px'};`" />
    <div
      class="cloud"
      :style="`
                top:${enableWhite ? '-9px' : '-4px'};
                background-color: ${enableWhite ? '#aefbffb9' : 'black'};
            `"
    ></div>
    <div
      :class="['inner-btn']"
      :style="`
                margin-left:${enableWhite ? '4px' : '35px'};
            `"
    >
      <div class="inner-border-1"></div>
      <div class="inner-border-2"></div>
      <div :class="['inner-border-3', enableWhite ? 'light-btn' : 'dark-btn']">
        <div :class="[enableWhite ? '' : 'moon-mountain']" style="left: 6px; top: 4px"></div>
        <div :class="[enableWhite ? '' : 'moon-mountain']" style="left: 12px; top: 8px"></div>
        <div
          :class="[enableWhite ? '' : 'moon-mountain']"
          style="left: 5px; top: 10px; width: 6px; height: 6px; border-radius: 3px"
        ></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.my-switch-frame {
  width: 60px;
  height: 26px;
  border-radius: 16px;
  box-shadow:
    2px 2px 2px #00000079,
    inset -2px -2px 8px rgba(255, 255, 255, 1),
    inset -2px -2px 12px rgba(255, 255, 255, 0.5),
    inset 2px 2px 4px #ffffffc0,
    inset 1px 2px 4px #000000;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  .cloud {
    width: 100px;
    height: 100px;
    position: absolute;
    z-index: 98;
    top: 10px;
    left: -10px;
    background-color: #faebd776;
    border: 1px solid #000000;
    transition: all 0.8s ease-in-out;
  }
}

.dark-btn {
  background-color: #9f9f9f;
  box-shadow:
    -3px 1px 3px #565656bb,
    inset 4px 4px 6px #a8a8a8b4;
}
.light-btn {
  background-color: #fcc423;
  box-shadow:
    3px 1px 3px #0000004e,
    inset 4px 4px 6px #ffffffb4;
}
.inner-btn {
  width: 20px;
  height: 20px;
  transition: all 0.6s ease-in-out;
  border-radius: 10px;
  background-color: red;
  margin: 0 2px 0 2px;
  position: relative;
  z-index: 99;
  .inner-border-1 {
    position: absolute;
    width: 38px;
    height: 38px;
    border-radius: 19px;
    background-color: #c6c6c63c;
    box-shadow: 0px 0px 6px #000000c0;
    top: -9px;
    left: -9px;
    z-index: 24;
  }
  .inner-border-2 {
    position: absolute;
    width: 68px;
    height: 68px;
    border-radius: 34px;
    background-color: #e4e4e479;
    top: -24px;
    left: -24px;
    z-index: 24;
    box-shadow: 0px 0px 6px #00000029;
  }
  .inner-border-3 {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    transition: all 0.4s ease-in-out;
    z-index: 26;
    .moon-mountain {
      width: 4px;
      height: 4px;
      border-radius: 2px;
      transition: all 0.4s ease-in-out;
      background-color: #5b5b5b;
      position: absolute;
      top: 3px;
      left: 4px;
    }
  }
}
</style>
