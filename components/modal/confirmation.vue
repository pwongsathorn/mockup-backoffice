<template lang="pug">
  Modal-base(
    ref="baseFormModal"
    :hide-header="true"
    close-button
    btn-confirm-text="ยืนยัน"
    :is-loaded="!loading_state"
    @accept="validate"
    @close="close"
  )
    template(#body)
      v-card(elevation="0")
        v-card-text.text-center
          v-icon.mx-auto(
            size="120"
            :color="iconColor"
          ) {{ icon }}
          p.text-h6.mt-2.font-weight-bold {{ itemData }}
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    icon: {
      default: 'mdi-alert-decagram',
      type: String
    },
    iconColor: {
      default: 'error lighten-1',
      type: String
    }
  },
  data () {
    return {
      valid: false,
      itemData: {},
      promise: null
    }
  },
  methods: {
    open (itemData) {
      this.itemData = itemData
      this.$refs.baseFormModal.show()

      return new Promise((resolve, reject) => {
        this.promise = { resolve, reject }
      })
    },
    validate () {
      this.promise.resolve(true)
      this.$refs.baseFormModal.hide()
      this.itemData = null
      // - Do nothing if not valid
    },
    close () {
      this.$refs.baseFormModal.hide()
      this.itemData = null
    }
  }
}
</script>
