<script lang="tsx">
import { watchEffect } from 'vue'
export default defineComponent({
  name: 'BigscreenCalendar',
  props: {
    remind: {
      type: Array<any>,
      default: []
    }
  },
  emits: ['select', 'change'],
  setup(props, { emit, slots }) {
    const checkStatus = ref<any[]>([])
    watch(props, () => {
      const { remind } = props
      if (Array.isArray(remind)) {
        checkStatus.value = remind
      }
    })
    const dateArr = ['一', '二', '三', '四', '五', '六', '日']
    const curYear = ref(0), curMonth = ref(0), curDay = ref(0)
    const initCalendar = () => {
      const date = new Date()
      curYear.value = date.getFullYear()
      curMonth.value = date.getMonth() + 1
      curDay.value = date.getDate()
      buildCalendar()
    }

    const todayCheck = (year, month, day) => {
      const date = new Date()
      if (
        date.getFullYear() === year
        &&
        date.getMonth() + 1 === month
        &&
        date.getDate() === day
      ) return true
    }

    const buildCalendar = (date = new Date()):Array<string> => {
      date.setDate(1)
      const buildArr = date.getDay() > 0 ? Array(date.getDay() - 1).fill('') : []
      
      if (date.getMonth() < 11) {
        date.setMonth(date.getMonth() + 1)
      } else {
        date.setFullYear(date.getFullYear() + 1)
        date.setMonth(0)
        date.setDate(1)
      }
      date.setTime(date.getTime() - 1000 * 60 * 60 * 24)
      curYear.value = date.getFullYear()
      curMonth.value = date.getMonth() + 1
      curDay.value = date.getDate()
      for (let i = 0; i < date.getDate(); i++) {
        buildArr.push({
          date: i + 1,
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          selected: false
        })
      }
      return buildArr
    }
    initCalendar()

    const showedDate = ref<Date>(new Date())
    const setLastMonth = () => {
      const _date = new Date();
      _date.setFullYear(curYear.value)
      _date.setMonth(curMonth.value - 1)
      _date.setDate(1)
      _date.setTime(_date.getTime() - 1000 * 60 * 60 * 24 * 2)
      curMonth.value = _date.getMonth() + 1
      showedDate.value = _date;
      emit('change', _date)
    }
    const setNextMonth = () => {
      const _date = new Date();
      _date.setFullYear(curYear.value)
      _date.setMonth(curMonth.value + 1)
      _date.setDate(1)
      _date.setTime(_date.getTime() - 1000 * 60 * 60 * 24 * 2)
      curMonth.value = _date.getMonth() + 1
      showedDate.value = _date;
      emit('change', _date)
    }

    const formatMonthDay = (val) => val > 9 ? val : ('0' + val)

    const activeDay = ref<string>('')
    const dayList = ref<Array<any>>([])
    watchEffect(() => {
      dayList.value = buildCalendar(showedDate.value)
    })
    const curSelectIdx = ref<number>(-1)

    window.addEventListener('click', () => {
      dayList.value.forEach((ele) => {
        if (!ele) return
        ele.selected = false
      })
    })
    return () => (
      <div class="w-full h-full">
        <div class="calendar-header">
          <div class="calendar-header-btn select-none cursor-pointer">{curYear.value + '年'}</div>
          <div class="flex items-center space-x-2">
            <div class="p-1 text-[#42d56e] font-bold select-none cursor-pointer" onClick={() => setLastMonth()}>{'<'}</div>
            <div class="calendar-header-btn select-none cursor-pointer">
              <span>{curMonth.value + '月'}</span>
            </div>
            <div class="p-1 text-[#42d56e] font-bold select-none cursor-pointer" onClick={() => setNextMonth()}>{'>'}</div>
          </div>
          
          <div class="calendar-header-btn select-none cursor-pointer" onClick={() => {
            const _date = new Date()
            curMonth.value = _date.getMonth() + 1
            showedDate.value = _date;
            emit('change', _date)
          }}>今天</div>
        </div>
        <div class="calendar-body p-2 grid grid-cols-7 gap-1">
          { dateArr.map(item => (<div class="text-center py-1 text-[#a2adae]" key={item}>{item}</div>)) }
          {
            dayList.value.map((item:any, index: number) => (
              <div
                class={[
                  activeDay.value === `${item.year}-${item.month}-${item.date}` ? "active-day" : '',
                  "text-center py-2 cursor-pointer text-white font-bold day-item relative",
                  "" !== item && todayCheck(item.year, item.month, item.date)
                  ? "circle-bg"
                  : checkStatus.value.indexOf(item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date)) !== -1
                  ? 'warn-tag'
                  : '',
                ]}
                key={item.date}
                onClick={(e) => {
                  if (!item) return
                  e.stopPropagation()
                  if (curSelectIdx.value >= 0) {
                    dayList.value[curSelectIdx.value].selected = false
                  }
                  dayList.value[index].selected = true
                  curSelectIdx.value = index
                  activeDay.value = `${item.year}-${item.month}-${item.date}`
                  if (checkStatus.value.indexOf(item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date)) !== -1) {
                    emit("select", item)
                  }
                }}
              >
                {item.date}
                <div class={`tip-bg cursor-default ${ item.selected && checkStatus.value.indexOf(item.year + '-' + formatMonthDay(item.month) + '-' + formatMonthDay(item.date)) !== -1 ? 'block' : 'hidden'}`}>
                  { slots.tip() }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss" scoped>
.calendar-header {
  background: linear-gradient(to top, #1f503f8c, #1bf79877);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: .3rem .3rem 0 0;
  padding: .4rem 1.2rem;
  .calendar-header-btn {
    padding: .3rem 1rem;
    width: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #3AB296;
    background-color: #133d35;
    color: white;
    border-radius: .3rem;
  }
}

.calendar-body {
  border-radius: 0 0 .3rem .3rem;
  background-color: #0F2F3190;
}

.circle-bg {
  color: #01F892;
}

.active-day {
  background-image: url(./circle.png);
  background-size: 2.2rem 2.2rem;
  background-repeat: no-repeat;
  background-position: center center;
}

.day-item:hover {
  background: #ffffff20;
  border-radius: 999px;
}

.warn-tag { position: relative; }
.warn-tag::after {
  content: "";
  display: block;
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #3AB296;
  left: calc(50% - 2px);
  top: calc(88% - 2px);
}

.tip-bg {
  background: {
    image: url(../assets/tip-bg.png);
    size: 100% 100%;
  }
  position: absolute;
  left: 50%;
  top: -10px;
  width: 150px;
  height: 160px;
  transform: translate(-50%, -100%);
}
</style>
