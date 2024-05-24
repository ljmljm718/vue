<template>
  <div class="current-time-wrapper">
    <span>{{ dateDay }}</span>
    <span>{{ dateTime }}</span>
  </div>
</template>
<script>
import { ref, onBeforeUnmount, defineComponent } from 'vue'
export default defineComponent({
  name: 'BigScreenTime',
  setup() {
    const dateDay = ref('')
    const dateTime = ref('')
    const timeTimer = ref()
    const getNowTime = () => {
      const date = new Date();
      let year = date.getFullYear();	//获取当前年份
      let month = date.getMonth() + 1;	//获取当前月份（记得+1）
      month = month < 10 ? '0' + month.toString() : month.toString();
      let dates = date.getDate();		//获取当前是几日
      dates = dates < 10 ? '0' + dates.toString() : dates.toString();
      let day = date.getDay();
      const arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      dateDay.value = year + '-' + month + '-' + dates + ' ' + arr[day];
      dateTime.value = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
        + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        + ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    }
    getNowTime()
    timeTimer.value = setInterval(() => {
      getNowTime();
    }, 1000);

    onBeforeUnmount(() => {
      clearInterval(timeTimer.value);
    })
  }
})
</script>
<style lang='scss' scoped>
@font-face {
  font-family: 'TitleFont';
  src: url(./biaoti.ttf);
}
.current-time-wrapper {
  display: flex;
  align-items: center;
  color: #00d1ff;
  font-family: 'TitleFont';
  padding: 0 10px;
  font-size: 1rem;
  span {
    padding: 8px;
  }
}
</style>