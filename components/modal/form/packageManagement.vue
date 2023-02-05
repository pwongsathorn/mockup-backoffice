<template lang="pug">
  Modal-base(
    ref="baseFormModal"
    :header="!edit ? 'เพิ่มแพ็คเกจ': 'อัพเดตแพ็คเกจ' "
    close-icon
    close-button
    btn-clear-text="รีเซ็ต"
    is-clearable
    btn-confirm-text="บันทึก"
    :is-disabled="!valid"
    :isFullscreen="!$vuetify.breakpoint.mdAndUp"
    :isTile="!$vuetify.breakpoint.mdAndUp"
    :is-loaded="!loading_state"
    @accept="validate"
    @close="close"
    @clear="clearData"
  )
    template(#body)
      p.text-h6.font-weight-bold.black--text.mb-2 รายละเอียด
      v-form(v-model="valid" ref="packageForm")
        v-row(no-gutters)
          v-col(cols="12")
            v-text-field#package-name.pb-1(
              v-model="form.package_live_name"
              :rules="rules.packageLiveNameRules"
              outlined
              required
              placeholder="แพ็คเกจ"
              dense
            )
              template(#label)
                span แพ็คเกจ
                span.primary--text *
          v-col(cols="12")
            v-textarea#package-detail.pb-1(
              v-model="form.package_live_description"
              :rules="rules.packageLiveDescriptionRules"
              outlined
              required
              placeholder="รายละเอียดแพ็คเกจ"
              dense
            )
              template(#label)
                span รายละเอียดแพ็คเกจ
                span.primary--text *
          v-col(cols="12")
            v-radio-group#radio-group.mt-0.pt-0.pb-1(v-model='form.package_live_type_id' mandatory row)
              span.font-weight-bold.mr-3 ประเภท :
              template(v-for="item in packageLiveTypes")
                v-radio(v-if="item.is_active && !item.is_delete" :label='item.package_live_type_name' :value="item.package_live_type_id" :key="`package-type-${item.package_live_type_id}`")
          v-col(cols="12" md="6")
            v-text-field#package-amount.pb-1.pr-0.pr-md-2(
              v-model="form.package_live_amount"
              :rules="rules.packageLiveAmountRules"
              outlined
              required
              placeholder="จำนวนแพ็คเกจ"
              dense
              type="number"
              hide-spin-buttons
            )
              template(#label)
                span จำนวนแพ็คเกจ
                span.primary--text *
          v-col(cols="12" md="6")
            v-text-field#package-price.pl-0.pl-md-2(
              v-model="form.package_live_price"
              :rules="rules.packageLivePriceRules"
              outlined
              required
              placeholder="ราคา/บาท"
              dense
              type="number"
              hide-spin-buttons
            )
              template(#label)
                span ราคา
                span.primary--text *
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PackageManagementModal',
  props: {},
  data () {
    return {
      valid: false,
      edit: false,
      form: {
        package_live_name: '',
        package_live_description: '',
        package_live_amount: 0,
        package_live_type_id: 1,
        package_live_price: ''
      },
      // Rules
      rules: {
        packageLiveNameRules: [
          v => !!v || 'โปรดระบุแพ็คเกจ',
          v => !v || (!!v && !(/((?!([\u0E00-\u0E7Fa-zA-Z0-9._])).)/.test(v))) || 'สามารถประกอบด้วยตัวอักษรไทย-อังกฤษ ตัวเลข 0-9 _ และ . เท่านั้น'
        ],
        packageLiveDescriptionRules: [
          v => !!v || 'โปรดระบุรายละเอียดแพ็คเกจ',
          v => !v || (!!v && !(/((?!([\u0E00-\u0E7Fa-zA-Z0-9.,<>%@&*-+/=!?"\s])).)/.test(v))) || 'สามารถประกอบด้วยตัวอักษรไทย-อังกฤษ ตัวเลข 0-9 .,<>%@&*-+/=!?" และเว้นวรรคเท่านั้น'
        ],
        packageLiveAmountRules: [v => !!v || 'โปรดระบุจำนวนแพ็คเกจ'],
        packageLivePriceRules: [v => !!v || 'โปรดระบุราคาแพ็คเกจ']
      },
      // Promise
      promise: null
    }
  },
  computed: {
    ...mapState({
      packageLiveTypes: state => state.packageLiveTypes
    })
  },
  methods: {
    clearData () {
      this.form.package_live_name = ''
      this.form.package_live_description = ''
      this.form.package_live_amount = 0
      this.form.package_live_type_id = 1
      this.form.package_live_price = ''
      this.$refs.packageForm.resetValidation()
    },
    open (data) {
      if (data) {
        this.edit = true
        this.form = {
          package_live_name: data.package_live_name,
          package_live_description: data.package_live_description,
          package_live_amount: data.package_live_amount,
          package_live_type_id: data.package_live_type_id,
          package_live_price: data.package_live_price
        }
      }
      this.$refs.baseFormModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      // - Is this form valid?
      if (this.$refs.packageForm.validate()) {
        const form = {
          package_live_name: this.form.package_live_name,
          package_live_description: this.form.package_live_description,
          package_live_amount: this.form.package_live_amount,
          package_live_type_id: this.form.package_live_type_id,
          package_live_price: this.form.package_live_price
        }
        this.promise.resolve(form)
        this.close()
      }
    },
    close () {
      this.clearData()
      this.edit = false
      this.$refs.packageForm.resetValidation()
      this.$refs.baseFormModal.hide()
    }
  }
}
</script>
