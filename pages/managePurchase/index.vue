<template lang="pug">
Muayded-MainLayout(
  pageTitle="การสั่งชื้อแพ็คเกจ"
  :totalPage="totalPage"
  @changePage="changePage"
)
  template(#modals)
    Modal-Form-PurchaseManagement(ref="formPurchaseManagement")
  template(#filter)
    v-col(cols="12" md="4")
      v-text-field#purchase-search-input(
        v-model="form.search"
        label="ค้นหา"
        placeholder="ชื่อผู้ดูแลระบบ"
        hide-details
        outlined
        dense
        prepend-inner-icon="mdi-magnify"
        :disabled="loading_state"
        @input="debounceSearch"
      )
    v-col(cols="12" md="3")
      //- v-select#purchase-search-select(
      //-   v-model="form.type"
      //-   :items="paymentTypes"
      //-   item-text="order_package_live_type_name"
      //-   item-value="order_package_live_type_id"
      //-   label="ประเภทการชำระเงิน"
      //-   placeholder="ประเภทการชำระเงิน"
      //-   hide-details
      //-   outlined
      //-   dense
      //-   :disabled="loading_state"
      //-   @input="debounceSearch"
      //- )
    v-spacer
    v-col(cols="12" md="4")
      //- Ui-Widget-Datepicker#purchase-date-picker-input(is-range-picker :is-disabled="loading_state" @input="setDate")
  template(#content)
    Ui-Widget-Flexible-Table(
      :headers="purchaseHeader"
      :items="purchaseList"
      outlined
      striped
      :loading="fullLoading"
      no-data-text="ไม่พบข้อมูลแพ็คเกจ"
    )
      template(#index="{ index }")
        span {{ calculateIndex(paginations.currentPage, index) }}
      template(#member="{ item }")
        span(v-if="!item.member.member_fname && !item.member.member_lname") ไม่ระบุ
        span(v-else) {{ !item.member.member_fname ? '': item.member.member_fname + ' ' }}{{ !item.member.member_lname ? '': item.member.member_lname }}
      template(#package_live_price="{ item }")
        span {{ numberFormat(item.package_live_price) }}
      template(#type="{ item }")
        span {{ item.order_package_live_type ? item.order_package_live_type.order_package_live_type_name : 'ไม่พบประเภทการชำระเงิน' }}
      template(#order_status_id="{ item }")
        .purchase-status-wrapper.d-inline-flex.justify-md-center
          v-chip.d-flex.justify-center(:color="statusColorMapper(item.order_status_id)" small style="width: 120px")
            p.white--text.text-truncate.mb-0 {{ item.order_status.order_status_name_th }}
      template(#order_package_live_create="{ item }")
        span {{ toThaiDate(item.order_package_live_create, 'Date') }}
      template(#manage="{ item }")
        .management-wrapper.pt-3.pt-md-0(v-if="item.order_status_id === 2")
          v-tooltip(top)
            template(#activator="{ on, attrs, value }")
              v-btn#purchase-manage-btn.mr-2.mb-2.mb-sm-0(
                :icon="$vuetify.breakpoint.mdAndUp"
                v-on="on"
                v-bind="attrs"
                :outlined="$vuetify.breakpoint.smAndDown"
                :block="$vuetify.breakpoint.smAndDown"
                :color="value || $vuetify.breakpoint.smAndDown ? 'primary' : 'grey'"
                :loading="loadingItem === item.order_package_live_id && loading_state"
                :disabled="loadingItem && loading_state"
                @click="editPurchase(item.order_package_live_id, item)"
              )
                v-icon mdi-pencil
                span(v-if="$vuetify.breakpoint.smAndDown") แก้ไขข้อมูล
            span แก้ไขข้อมูล
</template>

<script>
// import { mapState } from 'vuex'
import mockup from '~/mockupdata/purchase.json'
import status from '~/mockupdata/orderStatus.json'
export default {
  name: 'ManagePurchase',
  data: () => ({
    openRightDrawer: false,
    purchaseHeader: [
      { text: 'ลำดับ', value: 'index', width: '10%', truncate: true, hideDataOnMobile: true },
      { text: 'รหัสรายการ', value: 'order_package_live_number', width: '20%', truncate: true },
      { text: 'ชื่อสมาชิก', value: 'member', width: '20%', truncate: true },
      { text: 'ราคา/บาท', value: 'package_live_price', width: '10%', align: 'right', truncate: true },
      { text: 'ประเภท', value: 'type', width: '25%', align: 'center', truncate: true },
      { text: 'สถานะ', value: 'order_status_id', width: '20%', align: 'center', truncate: true },
      { text: 'วันที่ทำรายการ', value: 'order_package_live_create', width: '15%', align: 'center', truncate: true },
      { text: 'จัดการ', value: 'manage', width: '10%', align: 'center', hideHeaderOnMobile: true }
    ],
    purchaseList: [],
    startDate: '',
    endDate: '',
    loadingItem: null,
    fullLoading: true,
    paymentTypes: [],
    form: {
      search: null,
      type: null
    },
    paginations: {
      currentPage: 1,
      dataAmount: 10 // จำนวนข้อมูลทั้งหมด
    },
    debounce: null
  }),
  async fetch () {
    if (this.fullLoading) {
      await this.getPurchaseList()
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.paginations.dataAmount / this.itemsPerPageGB)
    }
    // ...mapState({
    //   orderPackageLiveTypes: state => state.orderPackageLiveTypes
    // })
  },
  methods: {
    statusColorMapper (id) {
      switch (id) {
        case 1:
          return 'success'
        case 2:
          return 'warning'
        case 3:
          return 'error'
        default:
          return 'grey'
      }
    },
    editPurchase (purchaseId, data) {
      this.fullLoading = false
      this.loadingItem = purchaseId
      this.$refs.formPurchaseManagement.open(data)
        .then((res) => {
          // if (res.order_status_id === 1) {
          //   this.$api.orderApi.approve(purchaseId)
          //     .then(async () => {
          //       await this.getPurchaseList()
          //       this.showAlert('success', 'แก้ไขข้อมูลสำเร็จ')
          //       this.loadingItem = null
          //     })
          //     .catch((error) => {
          //       this.showAlert('error', error.message)
          //       this.loadingItem = null
          //     })
          // } else {
          //   this.$api.orderApi.update(purchaseId, res)
          //     .then(async () => {
          //       await this.getPurchaseList()
          //       this.showAlert('success', 'แก้ไขข้อมูลสำเร็จ')
          //       this.loadingItem = null
          //     })
          //     .catch((error) => {
          //       this.showAlert('error', error.message)
          //       this.loadingItem = null
          //     })
          // }
        })
        .catch((error) => {
          this.showAlert('error', error.message)
          // this.loadingItem = null
        })
    },
    getPurchaseList () {
      // set payment type
      this.paymentTypes = [
        {
          order_package_live_type_id: null,
          order_package_live_type_name: 'ทั้งหมด'
        },
        ...status
      ]
      this.fullLoading = true
      setTimeout(() => {
        if (this.form.search) {
          const filteredMockup = mockup.filter((each) => {
            return each.order_package_live_number.toLowerCase().includes(this.form.search)
          })
          this.purchaseList = filteredMockup
        } else {
          this.purchaseList = mockup
        }
        this.fullLoading = false
      }, 500)
      // set searchParams
      // const searchParams = {
      //   search: this.form.search,
      //   order_package_live_type_id: this.form.type,
      //   startDate: this.startDate,
      //   endDate: this.endDate,
      //   page: this.paginations.currentPage,
      //   limit: this.itemsPerPageGB
      // }
      // call API
      // await this.$api.orderApi.findAndCount(searchParams)
      //   .then((res) => {
      //     this.fullLoading = false
      //     this.purchaseList = res.result
      //     this.paginations.dataAmount = res.totalCount
      //   })
      //   .catch((error) => {
      //     this.fullLoading = false
      //     this.showAlert('error', error.message)
      //   })
    },
    debounceSearch () {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.fullLoading = true
        this.$fetch()
      }, 800)
    },
    async setDate (event) {
      this.fullLoading = true
      this.startDate = event[0]
      this.endDate = event[1]
      await this.$fetch()
    },
    async changePage (event) {
      this.fullLoading = true
      this.paginations.currentPage = event
      await this.$fetch()
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
