<template lang="pug">
  Modal-base(
    ref="baseFormModal"
    :header="!edit ? 'เพิ่มข้อมูลผู้ดูแลระบบ': 'อัพเดตข้อมูลผู้ดูแลระบบ' "
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
      v-form(v-model="valid" ref="adminForm")
        Ui-Widget-UploaderAvatar#avatarImageUploader.mb-6(
          ref="avatarImage"
          size="164px"
          :existing-image="form.user_avatar"
        )
        v-row(no-gutters)
          v-col(cols="12" md="6")
            v-text-field#username.pb-4.pr-0.pr-md-2(
              v-model="form.username"
              outlined
              required
              hide-details="auto"
              placeholder="ระบุชื่อผู้ใช้"
              :rules="rules.usernameRules"
              dense
            )
              template(#label)
                span ชื่อผู้ใช้
                span.primary--text *
          v-col(cols="12" md="6")
            v-text-field#user_email.pb-4.pl-0.pl-md-2(
              v-model="form.user_email"
              outlined
              required
              hide-details="auto"
              placeholder="youremail@mail.com"
              dense
              :rules="rules.emailRules"
            )
              template(#label)
                span อีเมล
                span.primary--text *
          v-col(cols="12" md="6")
            v-text-field#user_fullname.pb-4.pr-0.pr-md-2(
              v-model="form.user_fullname"
              label="ชื่อ-สกุล"
              outlined
              hide-details="auto"
              placeholder="ระบุชื่อ-สกุล"
              dense
              :rules="rules.nameRules"
            )
          v-col(cols="12" md="6")
            v-text-field#user_phone.pb-4.pl-0.pl-md-2(
              v-model="form.user_phone"
              label="เบอร์โทรศัพท์"
              outlined
              hide-details="auto"
              placeholder="0123456789"
              dense
              :rules="rules.phoneRules"
            )
          v-col(v-if="!edit" cols="12" md="6")
            v-text-field#user_password.pb-4.pr-0.pr-md-2(
              v-if="!edit"
              v-model="form.password"
              label="รหัสผ่าน"
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
          v-col(v-if="!edit" cols="12" md="6")
            v-text-field#confirm_password.pb-4.pl-0.pl-md-2(
              v-if="!edit"
              v-model="passwordConfirmation"
              label="ยืนยันรหัสผ่าน"
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
  name: 'AdminManagementModal',
  props: {
  },
  data () {
    return {
      valid: false,
      edit: false,
      form: {
        username: null,
        user_email: null,
        user_avatar: null,
        user_fullname: null,
        user_phone: '',
        password: null,
        role_id: 1
      },
      showPassword: false,
      showConfirmPassword: false,
      passwordConfirmation: null,
      // Rules
      rules: {
        usernameRules: [
          v => !!v || 'โปรดระบุชื่อผู้ใช้งาน',
          v => !v || (!!v && !(/((?!([a-zA-Z0-9._])).)/.test(v))) || 'สามารถประกอบด้วยตัวอักษร a-z A-Z ตัวเลข 0-9 _ และ . เท่านั้น'
        ],
        emailRules: [
          v => !!v || 'โปรดระบุอีเมล',
          v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'อีเมลไม่ถูกต้อง'
        ],
        nameRules: [
          v => !!v || 'โปรดระบุชื่อ-สกุล',
          v => !v || (!!v && !(/((?!([\u0E00-\u0E7Fa-zA-Z0-9._])).)/.test(v))) || 'สามารถประกอบด้วยตัวอักษรไทย-อังกฤษ ตัวเลข 0-9 _ และ . เท่านั้น'
        ],
        phoneRules: [
          v => /^\d*\.?\d*$/.test(v) || 'กรอกได้แค่ตัวเลข 0 - 9',
          v => v.length >= 9 || 'เบอร์โทรอย่างน้อย 9 ตัวอักษร',
          v => v.length <= 10 || 'เบอร์โทรต้องไม่เกิน 10 ตัวอักษร'
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
      // Promise
      promise: null
    }
  },
  methods: {
    clearData () {
      this.form.username = null
      this.form.user_email = null
      this.form.user_fullname = null
      this.form.user_phone = ''
      this.form.user_avatar = null
      this.form.password = null
      this.passwordConfirmation = null
      this.valid = false
      this.$refs.avatarImage.clear()
    },
    open (data) {
      if (data) {
        this.edit = true
        this.form = { ...data }
      }
      this.$refs.baseFormModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      // - Is this form valid?
      if (this.$refs.adminForm.validate()) {
        // - Do we need to upload?
        this.$refs.avatarImage.validate()
          .then((res) => {
            if (res === true) {
              // - Required Upload File
              this.$refs.avatarImage.uploadImage()
                .then((res) => {
                  // set Avatar URL before Resolve
                  this.form.user_avatar = res
                  const form = {
                    username: this.form.username,
                    user_email: this.form.user_email,
                    user_avatar: res,
                    user_fullname: this.form.user_fullname,
                    user_phone: this.form.user_phone,
                    role_id: this.form.role_id,
                    password: this.form.password
                  }
                  if (!this.edit) {
                    form.password = this.form.password
                  }
                  this.promise.resolve(form)
                  this.clearData()
                  this.$refs.baseFormModal.hide()
                })
                .catch((error) => {
                  this.showAlert('error', error.message)
                })
            } else {
              // - Not Required Upload File
              const form = {
                username: this.form.username,
                user_email: this.form.user_email,
                user_fullname: this.form.user_fullname,
                user_phone: this.form.user_phone,
                role_id: this.form.role_id,
                password: this.form.password
              }
              // Resolve without avatar
              this.promise.resolve(form)
              this.clearData()
              this.$refs.baseFormModal.hide()
            }
          })
          .catch((res) => {
            console.log('catch the response', res)
          })
          // - Do nothing if not valid
      }
      // - Do nothing if not valid
    },
    close () {
      this.clearData()
      this.edit = false
      this.$refs.adminForm.resetValidation()
      this.$refs.baseFormModal.hide()
    }
  }
}
</script>
