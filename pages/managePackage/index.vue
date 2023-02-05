<template lang="pug">
Muayded-MainLayout(
  pageTitle="จัดการแพ็คเกจ"
  :totalPage="totalPage"
  @changePage="changePage"
)
  template(#modals)
    Modal-Form-PackageManagement(ref="formPackageManagement")
  template(#buttons)
    Buttons-NormalAction#package-add-btn(btn-text="เพิ่มรายการแพ็คเกจ" btn-icon="mdi-plus" @onAction="openForm")
  template(#mobile-navigation)
    Buttons-NormalAction#package-add-bottom-navigation-btn.d-flex.flex-row.rounded(btn-text="เพิ่มรายการแพ็คเกจ" btn-icon="mdi-plus" is-block @onAction="openForm")
  template(#filter)
    v-col(cols="12" md="4")
      v-text-field#package-search-input(
        v-model="form.search"
        label="ค้นหา"
        placeholder="รหัสรายการ"
        hide-details
        outlined
        dense
        prepend-inner-icon="mdi-magnify"
        :disabled="loading_state"
        @input="debounceSearch"
      )
    v-col(cols="12" md="3")
      //- v-select#package-search-select(
      //-   v-model="form.type"
      //-   :items="packageTypes"
      //-   item-text="package_live_type_name"
      //-   item-value="package_live_type_id"
      //-   label="ประเภทแพ็คเกจ"
      //-   placeholder="ประเภทแพ็คเกจ"
      //-   hide-details
      //-   outlined
      //-   dense
      //-   :disabled="loading_state"
      //-   @input="debounceSearch"
      //- )
    v-spacer
    v-col(cols="12" md="4")
      //- Ui-Widget-Datepicker#package-date-picker-calendar(is-range-picker :is-disabled="loading_state" @input="setDate")
  template(#content)
    Ui-Widget-Flexible-Table(
      :headers="packageHeader"
      :items="packageList"
      outlined
      striped
      :loading="fullLoading"
      no-data-text="ไม่พบข้อมูลแพ็คเกจ"
    )
      template(#index="{ index }")
        span {{ calculateIndex(paginations.currentPage, index) }}
      template(#type="{ item }")
        span {{ item.package_live_type.package_live_type_name }}
      template(#price="{ item }")
        span {{ numberFormat(item.package_live_price) }}
      template(#is_active="{ item }")
        .package-active-status-wrapper.d-inline-flex
          v-switch#package-active-status-switch.toggler.mt-0(
            :input-value="item.is_active"
            inset
            dense
            :ripple="false"
            hide-details
            :true-value="1"
            :false-value="0"
            :loading="loadingItem === item.package_live_id && loading_state"
            :disabled="loadingItem && loading_state"
            @change="event => packageStatusToggler(item.package_live_id, event)"
          )
      template(#create_at="{ item }")
        span {{ toThaiDate(item.package_live_create, 'Date') }}
      template(#manage="{ item }")
        .package-management-wrapper.pt-3.pt-md-0
          v-tooltip(top)
            template(#activator="{ on, attrs, value }")
              v-btn#package-manage-btn.mr-2.mb-2.mb-sm-0(
                :icon="$vuetify.breakpoint.mdAndUp"
                v-on="on"
                v-bind="attrs"
                :outlined="$vuetify.breakpoint.smAndDown"
                :block="$vuetify.breakpoint.smAndDown"
                :color="value || $vuetify.breakpoint.smAndDown ? 'primary' : 'grey'"
                :loading="loadingItem === item.package_live_id && loading_state"
                :disabled="loadingItem && loading_state"
                @click="editPackage(item.package_live_id, item)"
              )
                v-icon mdi-pencil
                span(v-if="$vuetify.breakpoint.smAndDown") แก้ไขข้อมูล
            span แก้ไขข้อมูล
</template>

<script>
import { mapState } from 'vuex'
import mockup from '~/mockupdata/packages.json'
export default {
  name: 'ManagePackage',
  data: () => ({
    packageHeader: [
      { text: 'ลำดับ', value: 'index', width: '10%', truncate: true, hideDataOnMobile: true },
      { text: 'แพ็คเกจ', value: 'package_live_name', width: '20%', truncate: true },
      { text: 'ประเภท', value: 'type', width: '20%', truncate: true },
      { text: 'รายละเอียดแพ็คเกจ', value: 'package_live_description', width: '30%', truncate: true, hideDataOnMobile: true },
      { text: 'ราคา/บาท', value: 'price', width: '20%', align: 'center', truncate: true },
      { text: 'สถานะ', value: 'is_active', width: '10%', truncate: true },
      { text: 'วันที่สร้าง', value: 'create_at', width: '15%', truncate: true },
      { text: 'จัดการ', value: 'manage', width: '10%', hideHeaderOnMobile: true }
    ],
    packageList: [],
    startDate: '',
    endDate: '',
    loadingItem: null,
    fullLoading: true,
    packageTypes: [],
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
      await this.getPackageList()
    }
  },
  computed: {
    totalPage () {
      return Math.ceil(this.paginations.dataAmount / this.itemsPerPageGB)
    },
    ...mapState({
      packageLiveTypes: state => state.packageLiveTypes
    })
  },
  methods: {
    openForm () {
      this.fullLoading = true
      this.$refs.formPackageManagement.open()
        .then((res) => {
          this.$api.packageLiveApi.create(res)
            .then(async () => {
              await this.$fetch()
            })
        })
        .catch((error) => {
          this.showAlert('error', error.message)
        })
    },
    editPackage (packageId, data) {
      this.fullLoading = false
      this.loadingItem = packageId
      this.$refs.formPackageManagement.open(data)
        .then((res) => {
          this.$api.packageLiveApi.update(packageId, res)
            .then(async () => {
              await this.getPackageList()
              this.showAlert('success', 'แก้ไขข้อมูลสำเร็จ')
              this.loadingItem = null
            })
            .catch((error) => {
              this.showAlert('error', error.message)
              this.loadingItem = null
            })
        })
        .catch((error) => {
          this.showAlert('error', error.message)
          this.loadingItem = null
        })
    },
    getPackageList () {
      // set package type
      this.packageTypes = [
        {
          package_live_type_id: null,
          package_live_type_name: 'ทั้งหมด'
        },
        ...this.packageLiveTypes
      ]
      this.fullLoading = true
      setTimeout(() => {
        if (this.form.search) {
          const filteredMockup = mockup.filter((each) => {
            return each.package_live_name.toLowerCase().includes(this.form.search) || (each.package_live_description.toLowerCase().includes(this.form.search))
          })
          this.packageList = filteredMockup
        } else {
          this.packageList = mockup
        }
        this.fullLoading = false
      }, 500)
      // set params
      // const searchParams = {
      //   search: this.form.search,
      //   package_live_type_id: this.form.type,
      //   startDate: this.startDate,
      //   endDate: this.endDate,
      //   page: this.paginations.currentPage,
      //   limit: this.itemsPerPageGB
      // }
      // call API
      // await this.$api.packageLiveApi.findAndCount(searchParams)
      //   .then((res) => {
      //     this.fullLoading = false
      //     this.packageList = res.result
      //     this.paginations.dataAmount = res.totalCount
      //   })
      //   .catch((error) => {
      //     this.fullLoading = false
      //     this.showAlert('error', error.message)
      //   })
    },
    packageStatusToggler (packageId, status) {
      let message = null
      if (status === 1) {
        message = 'เปิดใช้งานแพ็คเกจแล้ว'
      } else if (status === 0) {
        message = 'ปิดใช้งานแพ็คเกจแล้ว'
      }
      this.loadingItem = packageId
      this.$api.packageLiveApi.updateStatus(packageId, status)
        .then(async () => {
          await this.$fetch()
          this.loadingItem = null
          this.showAlert('success', message)
        })
        .catch((error) => {
          this.loadingItem = null
          this.showAlert('error', error.message)
        })
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
