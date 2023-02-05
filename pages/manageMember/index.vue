<template lang="pug">
Muayded-MainLayout(
  pageTitle="จัดการสมาชิก"
  :totalPage="totalPage"
  @changePage="changePage"
)
  template(#filter)
    v-col(cols="12" sm="4")
      v-text-field(
        v-model="form.search"
        outlined
        label="ค้นหา"
        placeholder="ชื่อสมาชิก"
        hide-details
        dense
        prepend-inner-icon="mdi-magnify"
        :disabled="loading_state"
        @input="debounceSearch"
      )
  template(#content)
    Ui-Widget-Flexible-Table(
      :headers="memberHeader"
      :items="memberList"
      outlined
      striped
      :loading="fullLoading"
      no-data-text="ไม่มีข้อมูลสมาชิก"
    )
      template(#index="{ index }")
        span {{ calculateIndex(paginations.currentPage, index) }}
      template(#member="{ item }")
        .user-wrapper.d-flex.align-center
          Ui-Widget-Avatar.mr-2(
            size="48"
            bg-color="primary"
            :imageURL="item?.member_avatar"
          )
          p.mb-0 {{ item.member_fname }} {{ item.member_lname }}
      template(#member_phone="{ item }")
        .contact-wrapper
          #phone
            v-icon.mr-2(small) mdi-phone
            span {{ !item.member_phone ? '-' : item.member_phone }}
      template(#member_email="{ item }")
        .contact-wrapper
          #email.mb-1
            v-icon.mr-2(small) mdi-email
            span {{ !item.member_email ? '-' : item.member_email }}
</template>

<script>
import mockup from '~/mockupdata/member.json'
export default {
  name: 'ManageMember',
  data: () => ({
    memberHeader: [
      { text: 'ลำดับ', value: 'index', width: '8%', truncate: true, hideDataOnMobile: true },
      { text: 'สมาชิก', value: 'member', width: '30%', truncate: true, hideHeaderOnMobile: true },
      { text: 'เบอร์โทรศัพท์', value: 'member_phone', width: '20%', truncate: true, hideHeaderOnMobile: true },
      { text: 'อีเมล', value: 'member_email', width: '20%', truncate: true, hideHeaderOnMobile: true }
    ],
    memberList: [],
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
  async fetch () {
    // if (this.fullLoading) {
    //   await this.getMemberList()
    // }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.paginations.dataAmount / this.itemsPerPageGB)
    }
  },
  mounted () {
    this.getMemberList()
  },
  methods: {
    debounceSearch () {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.fullLoading = true
        this.getMemberList()
      }, 800)
    },
    getMemberList () {
      this.fullLoading = true
      setTimeout(() => {
        if (this.form.search) {
          const filteredMockup = mockup.filter((each) => {
            return each.member_fname.toLowerCase().includes(this.form.search) || (each.member_lname.toLowerCase().includes(this.form.search))
          })
          this.memberList = filteredMockup
        } else {
          this.memberList = mockup
        }
        this.fullLoading = false
      }, 500)
      // const searchParams = {
      //   search: this.form.search,
      //   page: this.paginations.currentPage,
      //   limit: this.itemsPerPageGB
      // }
      // this.$api.memberApi.findAndCount(searchParams)
      //   .then((res) => {
      //     console.log('res', res)
      //     this.fullLoading = false
      //     this.memberList = res.result
      //     this.paginations.dataAmount = res.totalCount
      //   })
      //   .catch((error) => {
      //     this.fullLoading = false
      //     this.showAlert('error', error.message)
      //   })
    },
    userStatusToggler (userId, status) {
      // console.log('user', userId, '| toggler event', status)
      this.loadingItem = userId
      this.$api.userApi.toggleActiveStatus(userId, status)
        .then(async (res) => {
          await this.$fetch()
          this.loadingItem = null
          this.showAlert('success', 'ปรับสถานะสำเร็จ')
        })
        .catch((error) => {
          this.loadingItem = null
          this.showAlert('error', error.message)
        })
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
