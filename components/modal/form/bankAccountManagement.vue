<template lang="pug">
  Modal-base(
    ref="baseFormModal"
    :header="!edit ? 'เพิ่มบัญชีธนาคาร': 'แก้ไขบัญชีธนาคาร' "
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
      p.text-h5.font-weight-bold.black--text รายละเอียด
      v-form(v-model="valid" ref="bankAccountForm")
        v-row(no-gutters)
          v-col(cols="12")
            v-autocomplete#bank.pb-1(
              v-model="form.config_bank_id"
              :items="bank"
              outlined
              dense
              item-text="config_bank_name"
              item-value="config_bank_id"
              placeholder="เลือกธนาคาร"
              :rules="rules.configฺBankId"
            )
              template(#selection="{ item }")
                .d-flex.align-center
                  Ui-Widget-Avatar.mr-2(
                    size="24"
                    bg-color="transparent"
                    :imageURL="item.config_image"
                    tile
                    aspect-ratio="1"
                  )
                  span.ml-2 {{ item.config_bank_name }}
              template(#item="{ item }")
                .bank.d-flex.align-center
                  Ui-Widget-Avatar.mr-2(
                    size="24"
                    bg-color="transparent"
                    :imageURL="item.config_image"
                    tile
                    aspect-ratio="1"
                  )
                  span.ml-2 {{ item.config_bank_name }}
              template(#label)
                span เลือกธนาคาร
                span.primary--text *
          v-col(cols="12")
            v-text-field#bank-account-name.pb-1(
              v-model="form.bank_account_name"
              :rules="rules.bankAccountName"
              outlined
              required
              placeholder="ชื่อบัญชี"
              dense
            )
              template(#label)
                span ชื่อบัญชี
                span.primary--text *
          v-col(cols="12")
            v-text-field#bank-account-number(
              v-model="form.bank_account_number"
              :rules="rules.bankAccountNumber"
              outlined
              required
              placeholder="เลขที่บัญชี"
              dense
              type="number"
              hide-spin-buttons
            )
              template(#label)
                span เลขที่บัญชี
                span.primary--text *
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'BankAccountManagementModal',
  props: {
  },
  data () {
    return {
      valid: false,
      edit: false,
      form: {
        config_bank_id: '',
        bank_account_name: '',
        bank_account_number: ''
      },
      // Rules
      rules: {
        configฺBankId: [v => !!v || 'โปรดเลือกธนาคาร'],
        bankAccountName: [
          v => !!v || 'โปรดระบุชื่อบัญชี',
          v => !v || (!!v && !(/((?!([\u0E00-\u0E7Fa-zA-Z0-9._ ])).)/.test(v))) || 'สามารถประกอบด้วยตัวอักษรไทย-อังกฤษ ตัวเลข 0-9 _ และ . เท่านั้น'
        ],
        bankAccountNumber: [
          v => !!v || 'โปรดระบุหมายเลขบัญชี',
          v => /^\d*\.?\d*$/.test(v) || 'กรอกได้แค่ตัวเลข 0 - 9',
          v => v.length >= 10 || 'โปรดกรอกเลขที่บัญชี อย่างน้อย 10 หลัก',
          v => v.length <= 15 || 'โปรดกรอกเลขที่บัญชี ไม่เกิน 15 หลัก'
        ]
      },
      // Promise
      promise: null
    }
  },
  computed: {
    ...mapState({
      bank: state => state.bank
    })
  },
  methods: {
    clearData () {
      this.form.config_bank_id = null
      this.form.bank_account_name = ''
      this.form.bank_account_number = ''
      this.$refs.bankAccountForm.resetValidation()
    },
    open (data) {
      if (data) {
        this.edit = true
        this.form = {
          config_bank_id: data.config_bank_id,
          bank_account_name: data.bank_account_name,
          bank_account_number: data.bank_account_number
        }
      }
      this.$refs.baseFormModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      // - Is this form valid?
      if (this.$refs.bankAccountForm.validate()) {
        const form = {
          config_bank_id: this.form.config_bank_id,
          bank_account_name: this.form.bank_account_name,
          bank_account_number: this.form.bank_account_number
        }
        this.promise.resolve(form)
        this.close()
      }
    },
    close () {
      this.$refs.baseFormModal.hide()
      this.clearData()
      this.edit = false
      this.$refs.bankAccountForm.resetValidation()
    }
  }
}
</script>
