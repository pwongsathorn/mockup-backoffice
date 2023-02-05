<template lang="pug">
  #login-page.page-wrapper.black
    v-container.contents
      v-layout.flex-column.justify-center.align-center
        v-card(width="320" dark)
          v-card-text
            v-layout.pt-6.pb-2.px-6.black.rounded
              v-flex
                p.mt-2.mb-0.white--text.text-center BACK OFFICE
            .gradient-line
            v-form(v-model="formValid" ref="form" @submit.prevent="login")
              v-row
                v-col(cols="12")
                  v-text-field(
                    v-model="form.username"
                    :disabled="loading_state"
                    outlined
                    dense
                    prepend-inner-icon="mdi-account-circle"
                    placeholder="ระบุชื่อผู้ใช้ของคุณ..."
                    label="ชื่อผู้ใช้"
                    :rules="rules.usernameRules"
                  )
                  v-text-field(
                    v-model="form.password"
                    :disabled="loading_state"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dense
                    prepend-inner-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off': 'mdi-eye'"
                    placeholder="ระบุรหัสผ่านของคุณ..."
                    label="รหัสผ่าน"
                    :rules="rules.passwordRules"
                    @click:append="showPassword = !showPassword"
                  )
                v-col(cols="12")
                  Buttons-NormalAction(
                    :is-loading-state="loading_state"
                    btnText="เข้าสู่ระบบ"
                    button-type="submit"
                    is-block
                  )
          v-card-text
            p.text-center.mb-0.caption version {{ versionGB }}
</template>

<script>
// import jwt from 'jsonwebtoken'
export default {
  name: 'IndexPage',
  layout: 'blank',
  data: () => ({
    showPassword: false,
    formValid: true,
    form: {
      username: '',
      password: ''
    },
    rules: {
      usernameRules: [
        v => !!v || 'โปรดระบุชื่อผู้ใช้'
      ],
      passwordRules: [
        v => !!v || 'โปรดระบุรหัสผ่าน'
      ]
    }
  }),
  methods: {
    login () {
      this.$router.push({ name: 'manageMember' })
      // if (this.$refs.form.validate()) {
      //   this.$cookies.remove('token')
      //   await this.$api.authApi.login(this.form)
      //     .then(async (res) => {
      //       const hashedToken = jwt.sign(res.access_token, process.env.secretKey)
      //       this.$cookies.set('token', hashedToken, { path: '/', maxAge: 60 * 60 * 24 })
      //       await this.$store.dispatch('main/getProfile')
      //       this.$router.push({ name: 'manageMember' })
      //     })
      //     .catch((error) => {
      //       this.showAlert('error', error.message)
      //     })
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.gradient-line {
  height: 2px;
  width: 100%;
  // background: red;
  background-image: linear-gradient(to right, transparent, $primary 21%, $primary 80%, transparent 100%);
  margin: 24px 0;
}
#login-page {
  min-height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  .contents {
    height: 100%;
    .layout {
      height: 100%;
    }
  }
}
</style>
