<template>
  <div
    class="relative text-sm"
    :style="`width:${props.width};`"
    :id="selectorId"
  >
    <div
      class="selector-selected-label"
      :style="`width:${props.width};`"
      @click="showSelectorOptions = true"
      @blur="showSelectorOptions = false"
    >{{ getLabelByVal(props.modelValue) }}</div>
    <div class="absolute left-0 top-[100%]" v-show="showSelectorOptions">
      <div
        class="selector-option-item"
        :style="`width:${props.width};`"
        v-for="item, index in props.options"
        :key="index"
        @click="() => handleOptionClick(item.key)"
      >{{ item.label }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'BigscreenSelector' })
interface KeyLabelObject {
  key: string,
  label: string
}

const props = defineProps({
  options: {
    type: Array<KeyLabelObject>,
    default: []
  },
  modelValue: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '8rem'
  }
})

function generateRandomId(length = 8) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const selectorId = ref(generateRandomId())

const selectorListener = (event) => {
  const dom = document.getElementById(selectorId.value)
  if (dom && !dom.contains(event.target)) {
      // 如果点击发生在div外部，则隐藏div
      showSelectorOptions.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', selectorListener)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', selectorListener)
})

const showSelectorOptions = ref<boolean>(false)

const getLabelByVal = (val:string) => {
  let res = '请选择'
  props.options.forEach(item => {
    if (item.key === val) res = item.label
  })
  return res
}

const emit = defineEmits(['update:modelValue', 'change']);

const handleOptionClick = (key:string) => {
  showSelectorOptions.value = false
  emit('update:modelValue', key)
  emit('change', key)
}
</script>
<style scoped>
.selector-selected-label {
  border: 1px solid #9c9c9c;
  padding: .2rem .4rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background-color: #141936;
}
.selector-option-item {
  padding: .2rem .4rem;
  display: flex;
  align-items: center;
  border: 1px solid #9c9c9c;
  box-sizing: border-box;
  background-color: #141936;
}

.selector-option-item:last-child {
  border-radius: 0 0 4px 4px;
}
</style>
