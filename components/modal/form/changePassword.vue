<template lang="pug">
  Modal-base(
    ref="baseFormModal"
    header="แก้ไขรหัสผ่าน"
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
      v-form(v-model="valid" ref="passwordForm")
        v-row(no-gutters)
          v-col(cols="12")
            .d-flex.justify-center
              Ui-Widget-Avatar#avatarImage.mb-2(
                ref="avatarImage"
                size="164"
                :imageURL="userInfo.user_avatar"
              )
            p.text-center.font-weight-bold.mb-6 {{ userInfo.user_fullname }}
          v-col(v-if="userType === 'self'" cols="12" md="12")
            v-text-field#old_password.pb-4(
              v-model="form.oldPassword"
              label="รหัสผ่านเก่า"
              outlined
              hide-details="auto"
              dense
              :type="showOldPassword ? 'text' : 'password'"
              :append-icon="showOldPassword ? 'mdi-eye-off': 'mdi-eye'"
              :rules="rules.oldPasswordRules"
              @click:append="showOldPassword = !showOldPassword"
            )
              template(#label)
                span รหัสผ่านเก่า
                span.primary--text *
          v-col(cols="12" :md="userType === 'self' ? 12 : 6")
            v-text-field#user_password.pb-4.pr-0(
              v-model="form.password"
              label="รหัสผ่าน"
              :class="userType === 'self' ? 'pr-md-0' : 'pr-md-2'"
              outlined
              hide-details="auto"
              dense
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off': 'mdi-eye'"
              :rules="rules.passwordRules"
              @click:append="showPassword = !showPassword"
            )
              template(#label)
                span รหัสผ่าน
                span.primary--text *
          v-col(cols="12" :md="userType === 'self' ? 12 : 6")
            v-text-field#confirm_password.pb-4.pl-0(
              v-if="form"
              v-model="passwordConfirmation"
              label="ยืนยันรหัสผ่าน"
              :class="userType === 'self' ? 'pl-md-0' : 'pl-md-2'"
              hide-details="auto"
              outlined
              dense
              :disabled="!form.password"
              :type="showConfirmPassword ? 'text' : 'password'"
              :append-icon="showConfirmPassword ? 'mdi-eye-off': 'mdi-eye'"
              :rules="rules.confirmPasswordRules"
              @click:append="showConfirmPassword = !showConfirmPassword"
            )
              template(#label)
                span ยืนยันรหัสผ่าน
                span.primary--text *
</template>

<script>
export default {
  props: {
    userType: {
      default: 'admin',
      type: String
    }
  },
  data () {
    return {
      valid: true,
      userInfo: {},
      form: {
        password: null,
        oldPassword: null
      },
      passwordConfirmation: null,
      // Rules
      rules: {
        oldPasswordRules: [
          v => !!v || 'โปรดระบุพาสเวิร์ด',
          v => !v || (!!v && /^([a-zA-Z0-9]){6,}$/.test(v)) || 'พาสเวิร์ดที่มีความยาว 6 ตัวขึ้นไป สามารถประกอบด้วยตัวอักษร a-z A-Z และตัวเลข 0-9 เท่านั้น'
        ],
        passwordRules: [
          v => !!v || 'โปรดระบุพาสเวิร์ด',
          v => !v || (!!v && /^([a-zA-Z0-9]){6,}$/.test(v)) || 'พาสเวิร์ดที่มีความยาว 6 ตัวขึ้นไป สามารถประกอบด้วยตัวอักษร a-z A-Z และตัวเลข 0-9 เท่านั้น'
        ],
        confirmPasswordRules: [
          v => !!v || 'โปรดยืนยันพาสเวิร์ด',
          v => !v || (!!v && /^([a-zA-Z0-9]){6,}$/.test(v)) || 'พาสเวิร์ดที่มีความยาว 6 ตัวขึ้นไป สามารถประกอบด้วยตัวอักษร a-z A-Z และตัวเลข 0-9 เท่านั้น',
          v => !this.form.password || (!!this.form.password && v === this.form.password) || 'รหัสผ่านไม่ตรงกัน'
        ]
      },
      showOldPassword: false,
      showPassword: false,
      showConfirmPassword: false,
      promise: null
    }
  },
  methods: {
    clearData () {
      this.userInfo = {}
      this.form = {
        password: null
      }
      this.passwordConfirmation = null
      this.valid = true
      this.showOldPassword = false
      this.showPassword = false
      this.showConfirmPassword = false
    },
    open (userData) {
      this.userInfo = { ...userData }
      this.$refs.baseFormModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      // - Is this form valid?
      if (this.$refs.passwordForm.validate()) {
        let form = null
        if (this.userType === 'admin') {
          form = { password: this.form.password }
        } else {
          form = {
            oldPassword: this.form.oldPassword,
            newPassword: this.form.password
          }
        }
        // - Resolve
        this.promise.resolve(form)
        this.clearData()
        this.$refs.baseFormModal.hide()
      }
      // - Do nothing if not valid
    },
    close () {
      this.clearData()
      this.$refs.passwordForm.resetValidation()
      this.$refs.baseFormModal.hide()
    }
  }
}
</script>
