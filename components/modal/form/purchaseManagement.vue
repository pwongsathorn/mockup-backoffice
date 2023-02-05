<template lang="pug">
  Modal-base(
    ref="baseFormModal"
    :header="!edit ? 'เพิ่มสลิป': 'อัพเดตสลิป'"
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
    @clear="resetForm"
  )
    template(#body)
      p.text-h6.font-weight-bold.black--text.mb-2 รายละเอียด
      v-form(v-model="valid" ref="purchaseForm")
        v-row(no-gutters)
          v-col.text-center.pt-4.pb-6(cols="12")
            v-sheet.d-inline-block.img-style.rounded-lg.pa-4(max-width="400")
              v-img(:src="form.img")
          v-col(cols="12" md="6")
            p.font-weight-bold.mb-0 รหัสรายการ
            p {{ form.orderNumber }}
          v-col(cols="12" md="12")
            p.font-weight-bold.mb-0 ชื่อผู้ใช้
            p
              span(v-if="!form.member.member_fname && !form.member.member_lname") ไม่ระบุ
              span(v-else) {{ !form.member.member_fname ? '': form.member.member_fname + ' ' }}{{ !form.member.member_lname ? '': form.member.member_lname }}

          v-col(cols="12")
            p.font-weight-bold.mb-0 แพ็คเกจที่เลือก
            p {{ form.package.package_live_name }} ({{ numberFormat(form.package.package_live_price) }} บาท)

          v-col(cols="12")
            v-radio-group#purchase-modal-status-radio-group.mt-0.pt-0.mb-2(
              v-model='form.status_id'
              row
              mandatory
              :rules="rules.requireStatus"
            )
              span.font-weight-bold.mr-3 สถานะ :
              template(v-for="item in orderStatus(2)")
                v-radio(
                  v-if="item.is_active && !item.is_delete"
                  :id="`purchase-status-choice-${item.order_status_id}`"
                  :label='item.order_status_name_th'
                  :value="item.order_status_id"
                  :key="`package-type-${item.order_status_id}`"
                )
          v-col(cols="12")
            v-textarea#purchase-modal-purchase-note(
              v-model="form.note"
              outlined
              required
              label="รายละเอียด"
              placeholder="รายละเอียด"
              dense
            )
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PurchaseManagementModal',
  props: {},
  data () {
    return {
      valid: true,
      edit: false,
      form: {
        id: '',
        member: '',
        img: null,
        package: {},
        status_id: {},
        note: ''
      },
      rules: {
        requireStatus: [
          v => !!v || 'โปรดระบุสถานะของการสั่งซื้อ'
        ]
      },
      // Promise
      promise: null
    }
  },
  computed: {
    ...mapGetters({
      orderStatus: 'filteredStatus'
    })
  },
  methods: {
    resetForm () {
      this.form.status_id = null
      this.form.note = ''
    },
    clearData () {
      this.form.id = ''
      this.form.member = {}
      this.form.img = null
      this.form.package = {}
      this.form.status_id = null
      this.form.note = ''
      this.$refs.purchaseForm.resetValidation()
    },
    open (data) {
      if (data) {
        this.edit = true
        this.form = {
          id: data.order_package_live_id,
          orderNumber: data.order_package_live_number,
          member: { ...data.member },
          img: data.order_package_live_image_slip,
          package: data.package_live
        }
      }
      this.$refs.baseFormModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      // - Is this form valid?
      if (this.$refs.purchaseForm.validate()) {
        const form = {
          // user_id: this.profile.user_id,
          order_status_id: this.form.status_id,
          order_package_live_note: this.form.note
        }
        this.promise.resolve(form)
        this.close()
      }
    },
    close () {
      this.clearData()
      this.edit = false
      this.$refs.purchaseForm.resetValidation()
      this.$refs.baseFormModal.hide()
    }
  }
}
</script>
<style lang="scss" scoped>
  .img-style{
    border: 1px dashed grey;
  }
</style>
