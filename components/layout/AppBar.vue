<template lang="pug">
  v-app-bar#appbar(:clipped-left="clipped" fixed app elevation="0" color="white" height="72px")
    v-app-bar-nav-icon(@click.stop="toggleSidebar()")
      v-icon mdi-menu
    v-spacer
    v-menu(offset-y)
      template(#activator="{ on, attrs }")
        v-hover(v-slot="{ hover }")
          #user-profile.d-flex.pa-2.rounded-lg(
            v-bind="attrs"
            v-on="on"
            :class="hover ? 'grey lighten-3':''"
          )
            Ui-Widget-Avatar(
              bg-color="primary"
              rounded size="48"
              :imageURL="profile?.user_avatar"
            )
              template(#avatar)
                p.white--text.mb-0 PA
            .profile-name.ml-2
              #display-name.mb-0.text-h6.text-md-h5.text-truncate {{ profile?.user_fullname ?? '' }}
              #user-role.mb-0.subtitle-2.grey--text.text--darken-2.text-truncate {{ roleDisplayer(profile?.role_name) }}
      v-list
        //- v-list-item#profile-item(@click="openProfile")
        //-   v-list-item-icon
        //-     v-icon mdi-account-circle
        //-   v-list-item-content
        //-     v-list-item-title ข้อมูลส่วนตัว
        //- v-list-item#change-password-item(@click="changePassword")
        //-   v-list-item-icon
        //-     v-icon mdi-key
        //-   v-list-item-content
        //-     v-list-item-title เปลี่ยนรหัสผ่าน
        v-divider
        v-list-item#log-out-item(@click="logout")
          v-list-item-icon
            v-icon mdi-logout-variant
          v-list-item-content
            v-list-item-title ออกจากระบบ
    Modal-Form-AdminManagement(ref="profileModal")
    Modal-Form-changePassword(ref="changePassword" userType="self")
</template>

<script>
export default {
  props: {
    clipped: {
      type: Boolean,
      default: true
    },
    miniVariant: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    avatarPlaceholder () {
      const name = this.profile?.user_fullname ?? ''
      return name.charAt(0).toUpperCase()
    }
  },
  methods: {
    openProfile () {
      const profile = { ...this.profile }
      this.$refs.profileModal.open(profile)
        .then((modalResponse) => {
          this.$api.authApi.updateSelfProfile(modalResponse)
            .then(async (res) => {
              await this.$store.dispatch('main/getProfile')
              this.showAlert('success', 'แก้ไขข้อมูลสำเร็จ')
            })
            .catch((error) => {
              this.showAlert('error', error.message)
            })
        })
    },
    changePassword () {
      const profile = { ...this.profile }
      this.$refs.changePassword.open(profile)
        .then((modalResponse) => {
          // console.log('res', res)
          this.$api.authApi.changeSelfPassword(modalResponse)
            .then(async (response) => {
              this.showAlert('success', 'เปลี่ยนรหัสผ่านสำเร็จ')
              await this.$store.dispatch('main/getProfile')
            })
            .catch((error) => {
              this.showAlert('error', error.message)
            })
        })
    },
    toggleSidebar () {
      this.$emit('toggle')
      // this.$store.commit('menu/toggleMenu')
    }
  }
}
</script>
