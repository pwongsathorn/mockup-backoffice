<template lang="pug">
.wrapper
  v-menu.refer-date-picker(
    v-model="menu"
    ref="DatePicker"
    min-width="auto"
    hide-details
    :close-on-content-click="!isRangePicker"
    :return-value.sync="date"
    transition="scale-transition"
    :disabled="isReadonly || isDisabled"
  )
    template(#activator="{ on, attrs }")
      v-text-field.refer-date-input(
        id="datepicker-trigger"
        :value="dateTransform"
        :label="inputLabel"
        :placeholder="placeholder"
        :readonly="isReadonly"
        :disabled="isDisabled"
        v-bind="attrs"
        :rules="rules"
        v-on="on"
        outlined
        dense
        :hide-details="isHideDetails"
        prepend-inner-icon="fas fa-calendar"
        @click:append="menu = !menu"
      )
    v-date-picker.refer-date-calendar(
      v-model="date"
      color="primary"
      :range='isRangePicker'
      locale="th-th"
      show-adjacent-months
      no-title
      :max="maxDate ? maxDate : DateNow"
      @change="compareDate"
      @input="setDate"
    )
</template>
<script>
import { DateTime } from 'luxon'

export default {
  name: 'DatePickerUiWidget',
  components: {},
  props: {
    locale: {
      type: String,
      default: 'th-th'
    },
    inputLabel: {
      type: String,
      default: 'วันที่'
    },
    placeholder: {
      type: String,
      default: 'เลือกวันที่'
    },
    minDate: {
      type: [Date, Array, String, Object],
      default: null
    },
    maxDate: {
      type: [Date, Array, String, Object],
      default: null
    },
    value: {
      type: [Date, Array, String, Object],
      default () {
        return null
      }
    },
    disableValue: {
      type: Array,
      default () {
        return []
      }
    },
    rules: {
      type: Array,
      default: () => []
    },
    isRangePicker: {
      type: Boolean,
      default: false
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoadingState: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: this.value ? this.value : this.isRangePicker ? [DateTime.now().toISODate(), DateTime.now().toISODate()] : DateTime.now().toISODate(),
      dateDisable: this.disableValue,
      menu: false
    }
  },
  computed: {
    dateTransform (newVal, oldVal) {
      if (this.isRangePicker) {
        const dates = Array.isArray(this.date) ? this.date : [this.date]
        const range = dates.map((each) => {
          return DateTime.fromISO(each).toLocaleString({ day: '2-digit', month: 'short', year: 'numeric' }, { locale: this.locale })
        })
        if (range[0] === range[1]) {
          // show only 1 date if both are the same date
          // EX: instead of '25 March  2022 to 25 March 2022'
          // return: '25 March 2022'
          return range[0]
        } else {
          // Return as '25 March  2022 to 25 March 2022'
          return range.join(' ถึง ')
        }
      } else {
        const singleDate = DateTime.fromISO(this.date).toLocaleString({ day: '2-digit', month: 'short', year: 'numeric' }, { locale: this.locale })
        return singleDate
      }
    },
    DateNow () {
      return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    }
  },
  watch: {
    disableValue (newVal, oldVal) {
      this.dateDisable = newVal
    },
    value (newVal, oldVal) {
      this.date = newVal
    },
    date (value) {
      if (this.isRangePicker && value.length === 2) {
        this.$emit('input', value)
      } else if (!this.isRangePicker) {
        this.$emit('input', value)
        // DateTime.fromISO(value).toISO()
      }
    }
  },
  methods: {
    setDate (date) {
      if (this.isRangePicker && date.length === 2) {
        this.$refs.DatePicker.save(date)
        this.menu = false
      } else if (!this.isRangePicker) {
        this.$refs.DatePicker.save(date)
      }
    },
    compareDate (data) {
      if (this.isRangePicker) {
        const dataTemp = JSON.parse(JSON.stringify(data))
        const i1 = DateTime.fromISO(dataTemp[0])
        const i2 = DateTime.fromISO(dataTemp[1])
        const check = i2.diff(i1, ['days']).toObject()
        if (!(check.days > 0)) {
          data[0] = dataTemp[1]
          data[1] = dataTemp[0]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
