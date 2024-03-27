<script lang="ts" setup>
import DeviceInfo from "@/views/agriculture/deviceinfo/index.vue";
import {DeviceInfoVO} from "@/api/agriculture/deviceinfo";

defineOptions({name: 'DeviceInfoHelper'})

const dialogVisible = ref(false) // 弹窗的是否展示
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
}
defineExpose({open}) // 提供 open 方法，用于打开弹窗

/**
 * props
 */
const deviceInfoProps = defineProps({
  // 多选
  multi: {
    type: Boolean,
    default: false
  },
  // 只读
  readonly: {
    type: Boolean,
    default: true
  }
})

/**
 * 拿到子组件传过来的选中的设备信息
 */
const selectedDeviceInfoList = ref<DeviceInfoVO[]>([])
const selectedDeviceInfo = (val) => {
  selectedDeviceInfoList.value = val
}
/**
 * 向父组件传值-选中的设备信息
 */
const emit = defineEmits(["confirmDeviceInfoList"])
const confirmSelectedDeviceInfoList = () => {
  emit('confirmDeviceInfoList', selectedDeviceInfoList.value)
  console.log("...", selectedDeviceInfoList.value)
  dialogVisible.value = false
}

</script>
<template>
  <Dialog
    v-model="dialogVisible"
    title="选择设备"
    width="70%"
  >
    <DeviceInfo
      :readonly="deviceInfoProps.readonly"
      :multi="deviceInfoProps.multi"
      @selected-device-info="selectedDeviceInfo"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmSelectedDeviceInfoList"
        >
          确认
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </Dialog>
</template>
