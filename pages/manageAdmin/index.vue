<template lang="pug">
Muayded-MainLayout(
  pageTitle="จัดการผู้ดูแลระบบ"
  :totalPage="totalPage"
  @changePage="changePage"
)
  template(#modals)
    Modal-Form-AdminManagement(ref="formManangement")
    Modal-Form-changePassword(ref="changePassword")
  template(#buttons)
    Buttons-NormalAction#admin-add-btn(btn-text="เพิ่มผู้ดูแลระบบ" btn-icon="mdi-plus" @onAction="createAdmin")
  template(#mobile-navigation)
    Buttons-NormalAction#admin-add-bottom-navigation-btn.flex-row.rounded(btn-text="เพิ่มผู้ดูแลระบบ" btn-icon="mdi-plus" is-block @onAction="createAdmin")
  template(#filter)
    v-col(cols="12" sm="4")
      v-text-field(
        v-model="form.search"
        outlined
        label="ค้นหา"
        placeholder="ชื่อผู้ดูแลระบบ"
        hide-details
        dense
        prepend-inner-icon="mdi-magnify"
        :disabled="loading_state"
        @input="debounceSearch"
      )
  template(#content)
    Ui-Widget-Flexible-Table(
      :headers="adminHeader"
      :items="adminList"
      outlined
      striped
      :loading="fullLoading"
      no-data-text="ไม่มีข้อมูลสมาชิก"
    )
      template(#index="{ index }")
        span {{ calculateIndex(paginations.currentPage, index) }}
      template(#user_fullname="{ item }")
        .user-wrapper.d-flex.align-center
          Ui-Widget-Avatar.mr-2(
            size="48"
            bg-color="primary"
            :imageURL="item?.user_avatar"
          )
          #user-detail
            #fullname.d-block.mb-1.font-weight-bold {{ item.user_fullname }}
            #username.d-block.caption.mb-0
              v-icon.mr-2(small) mdi-card-account-details
              span {{ item.username }}
      template(#contact="{ item }")
        .contact-wrapper
          #email.mb-1
            v-icon.mr-2(small) mdi-email
            span {{ !item.user_email ? '-' : item.user_email }}
          #phone
            v-icon.mr-2(small) mdi-phone
            span {{ !item.user_phone ? '-' : phoneNumberHyphen(item.user_phone) }}
      template(#role_name="{ item }")
        .value.d-inline
          span {{ roleDisplayer(item.role_name) }}
      template(#is_active="{ item }")
        .value.d-inline-flex.text-center.active-status-wrapper(v-if="item")
          v-switch#admin-switch.toggler.mt-0(
            v-if="SuperAdminAccess(item.role_id)"
            :input-value="item.is_active"
            inset
            dense
            :ripple="false"
            hide-details
            :true-value="1"
            :false-value="0"
            :loading="loadingItem === item.user_id && loading_state"
            :disabled="loadingItem && loading_state"
            @change="event => userStatusToggler(item.user_id, event)"
          )
      template(#manage="{ item }")
        .management-wrapper.pt-3.pt-md-0(v-if="SuperAdminAccess(item.role_id)")
          v-tooltip(top)
            template(#activator="{ on, attrs, value }")
              v-btn#admin-edit-btn.mr-2.mb-2.mb-sm-0(
                :icon="$vuetify.breakpoint.mdAndUp"
                v-on="on"
                v-bind="attrs"
                :outlined="$vuetify.breakpoint.smAndDown"
                :block="$vuetify.breakpoint.smAndDown"
                :color="value || $vuetify.breakpoint.smAndDown ? 'primary' : 'grey'"
                :loading="loadingItem === item.user_id && loading_state"
                :disabled="loadingItem && loading_state"
                @click="editAdmin(item.user_id, item)"
              )
                v-icon mdi-pencil
                span(v-if="$vuetify.breakpoint.smAndDown") แก้ไขข้อมูล
            span แก้ไขข้อมูล
          v-tooltip(top)
            template(#activator="{ on, attrs, value }")
              v-btn#admin-change-password-btn.mb-2.mb-sm-0(
                :icon="$vuetify.breakpoint.mdAndUp"
                v-on="on"
                v-bind="attrs"
                :outlined="$vuetify.breakpoint.smAndDown"
                :block="$vuetify.breakpoint.smAndDown"
                :color="value ? 'primary' : 'grey'"
                :loading="loadingItem === item.user_id && loading_state"
                :disabled="loadingItem && loading_state"
                @click="changePassword(item.user_id, item)"
              )
                v-icon mdi-key
                span(v-if="$vuetify.breakpoint.smAndDown") เปลี่ยนรหัสผ่าน
            span เปลี่ยนรหัสผ่าน
</template>

<script>
import { mapState } from 'vuex'
import mockup from '~/mockupdata/admin.json'
export default {
  name: 'ManageAdmin',
  data: () => ({
    adminHeader: [
      { text: 'ลำดับ', value: 'index', width: '8%', truncate: true, hideDataOnMobile: true },
      { text: 'ผู้ดูแลระบบ', value: 'user_fullname', width: '30%', truncate: true, hideHeaderOnMobile: true },
      { text: 'ข้อมูลติดต่อ', value: 'contact', width: '20%', truncate: true, hideHeaderOnMobile: true },
      { text: 'สิทธิ์การใช้งาน', value: 'role_name', width: '20%', align: 'center', truncate: true },
      { text: 'สถานะ', value: 'is_active', width: '10%', truncate: true },
      { text: 'จัดการ', value: 'manage', width: '10%', hideHeaderOnMobile: true }
    ],
    adminList: [],
    loadingItem: null,
    fullLoading: true,
    form: {
      search: null
    },
    paginations: {
      currentPage: 1,
      dataAmount: 10 // จำนวนข้อมูลทั้งหมด
    },
    debounce: null
  }),
  // async fetch () {
  //   if (this.fullLoading) {
  //     await this.getAdminList()
  //   }
  // },
  computed: {
    ...mapState({
      profile: state => state.main.profile,
      userRole: state => state.main.profile.role_id
    }),
    totalPage () {
      return Math.ceil(this.paginations.dataAmount / this.itemsPerPageGB)
    }
  },
  mounted () {
    this.getAdminList()
  },
  methods: {
    createAdmin () {
      this.fullLoading = true
      this.$refs.formManangement.open()
        .then((res) => {
          this.$api.userApi.create(res)
            .then(async (res) => {
              await this.$fetch()
            })
            .catch((error) => {
              this.showAlert('error', error.message)
            })
        })
        .catch((error) => {
          this.showAlert('error', error.message)
        })
    },
    SuperAdminAccess (roleId = 0) {
      // is current user is SuperAdmin?
      // if (this.userRole && this.userRole !== 3) {
      // this is not SuperAdmin
      // is the item is super admin
      // if (Number(roleId) === 3) {
      // yes, this require SuperAdmin's Access
      // return true
      // }
      // nope, not require SuperAdmin's Access
      // return false
      // }
      // yes this is SuperAdmin's Access
      return true
    },
    editAdmin (userId, data) {
      this.loadingItem = userId
      this.$refs.formManangement.open(data)
        .then((res) => {
          this.showAlert('success', 'แก้ไขข้อมูลสำเร็จ')
          this.loadingItem = null
          // this.$api.userApi.update(userId, res)
          //   .then(async (res) => {
          //     // is updating self profile?
          //     if (userId === this.profile.user_id) {
          //       // dispatch getProfile to update local storage
          //       await this.$store.dispatch('main/getProfile')
          //     }
          //     // fetch data
          //     await this.getAdminList()
          //   })
          //   .catch((error) => {
          //     this.showAlert('error', error.message)
          //     this.loadingItem = null
          //   })
        })
        .catch((error) => {
          this.showAlert('error', error.message)
          // this.loadingItem = null
        })
    },
    changePassword (userId, data) {
      this.loadingItem = userId
      this.$refs.changePassword.open(data)
        .then((res) => {
          this.showAlert('success', 'เปลี่ยนรหัสผ่านสำเร็จ')
          this.loadingItem = null
          // const body = {
          //   user_id: userId,
          //   password: res.password
          // }
          // this.$api.authApi.resetUserPassword(body)
          //   .then(async (res) => {
          //     await this.getAdminList()
          //   })
          //   .catch((error) => {
          //     this.showAlert('error', error.message)
          //     this.loadingItem = null
          //   })
        })
        .catch((error) => {
          this.showAlert('error', error.message)
          // this.loadingItem = null
        })
    },
    debounceSearch () {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.fullLoading = true
        this.getAdminList()
      }, 800)
    },
    getAdminList () {
      // const searchParams = {
      //   search: this.form.search,
      //   page: this.paginations.currentPage,
      //   limit: this.itemsPerPageGB
      // }
      // await this.$api.userApi.findAndCount(searchParams)
      //   .then((res) => {
      //     this.fullLoading = false
      //     this.adminList = res.result
      //     this.paginations.dataAmount = res.totalCount
      //   })
      //   .catch((error) => {
      //     this.fullLoading = false
      //     this.showAlert('error', error.message)
      //   })
      this.fullLoading = true
      setTimeout(() => {
        if (this.form.search) {
          const filteredMockup = mockup.filter((each) => {
            return each.user_fullname.toLowerCase().includes(this.form.search)
          })
          this.adminList = filteredMockup
        } else {
          this.adminList = mockup
        }
        this.fullLoading = false
      }, 500)
    },
    userStatusToggler (userId, status) {
      // console.log('user', userId, '| toggler event', status)
      let message = null
      if (status === 1) {
        message = 'เปิดใช้งานผู้ดูแลแล้ว'
      } else if (status === 0) {
        message = 'ปิดใช้งานผู้ดูแลแล้ว'
      }
      this.loadingItem = userId
      this.showAlert('success', message)
      // this.$api.userApi.toggleActiveStatus(userId, status)
      //   .then(async (res) => {
      //     await this.$fetch()
      //     this.loadingItem = null
      //     this.showAlert('success', message)
      //   })
      //   .catch((error) => {
      //     this.loadingItem = null
      //     this.showAlert('error', error.message)
      //   })
    },
    changePage (event) {
      this.fullLoading = true
      this.paginations.currentPage = event
      this.$fetch()
    }
  }
}
</script>

<style lang="scss" scoped>
.active-status-wrapper {
  .toggler {
    width: 56px;
  }
}
</style>
