<script lang="tsx">
interface LabelValue {
  label: string,
  value: string
}
export default defineComponent({
  name: 'BigscreenSelector',
  props: {
    options: {
      type: Array<LabelValue>,
      default: []
    },
    selectedValue: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const showLabel = ref('------')
    const options = ref<any>([])
    watch(props, () => {
      const { selectedValue, options:_options } = props
      console.log("selectedValue", selectedValue);
      console.log("_options", _options);
      showLabel.value = getLabelByValue(selectedValue)
      if (Array.isArray(_options)) options.value = _options
    })
    const getLabelByValue = (val) => {
      let res = '------'
      if (Array.isArray(options)) {
        options.forEach(item => {
          if (item.value === val) res = item.label
        })
      }
      return res
    }
    const showOptions = ref<boolean>(false)

    window.addEventListener('click', () => {
      showOptions.value = false
    })
    return () => (
      <div class="relative h-[1.4rem] w-[10rem]">
        <div class="h-full text-center cursor-pointer" onClick={(e) => {
          e.stopPropagation()
          showOptions.value = true
        }}>{showLabel.value}</div>
        {
          showOptions.value ? <div class="absolute left-0 top-[1.4rem] w-full">
            {
              Array.isArray(options) ? options.map(item => (
                <div class="py-3 text-center w-full bg-[#0d1724]" onClick={() => emit("change", item)}>{item.label}</div>
              )) : null
            }
          </div> : null
        }
      </div>
    )
  }
})
</script>
