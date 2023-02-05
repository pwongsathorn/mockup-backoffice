<template lang="pug">
v-dialog(
  v-model="view"
  persistent
  :max-width="maxWidth"
  :fullscreen="isFullscreen"
  transition="dialog-bottom-transition"
)
  v-card.d-flex.d-md-block.flex-column(:color="color" :tile="isTile")
    v-card-title.black.d-flex.justify-space-between.white--text(v-if="!hideHeader")
      span {{header}}
      v-btn(v-if="closeIcon" icon @click="closeModal" color="white")
        v-icon(small) fas fa-times
    v-card-text.pt-5.overflow-auto(:class="viewer ? 'pb-0 pb-md-6' : '' ")
      slot(name="body")
    v-spacer
    v-card-actions.d-block.px-6(v-if="!noAction")
      Buttons-NormalAction(
        v-if="!viewer"
        isBlock
        btn-color="primary"
        :isDisabled="!isLoaded || isDisabled"
        :isLoadingState="!isLoaded"
        depressed :btnText="btnConfirmText"
        @onAction="confirmed()"
      )
      Buttons-NormalAction.mt-2.ml-0(
        v-if="!viewer && isClearable"
        isBlock
        btn-color="grey lighten-2"
        text-color="grey--text text--darken-2"
        :isDisabled="!isLoaded" :isLoadingState="!isLoaded"
        depressed
        isOutlined
        :btnText="btnClearText"
        @onAction="clear()"
      )
      Buttons-NormalAction.mt-2.ml-0(
        v-if="!viewer && closeButton"
        plain
        isBlock
        btn-color="grey"
        text-color="grey--text text--darken-2"
        :isDisabled="!isLoaded"
        :isLoadingState="!isLoaded"
        depressed
        btnText="ปิด"
        @onAction="closeModal()"
      )
</template>

<script>
export default {
  name: 'FormBaseModal',
  components: {},
  props: {
    header: {
      default: '',
      type: String
    },
    noAction: {
      default: false,
      type: Boolean
    },
    isFullscreen: {
      default: false,
      type: Boolean
    },
    closeIcon: {
      default: false,
      type: Boolean
    },
    closeButton: {
      default: false,
      type: Boolean
    },
    isClearable: {
      default: false,
      type: Boolean
    },
    btnClearText: {
      default: 'ล้างข้อมูล',
      type: String
    },
    btnConfirmText: {
      default: 'ตกลง',
      type: String
    },
    isLoaded: {
      default: true,
      type: Boolean
    },
    maxWidth: {
      default: 500,
      type: Number
    },
    isDisabled: {
      default: false,
      type: Boolean
    },
    isTile: {
      default: false,
      type: Boolean
    },
    hideHeader: {
      default: false,
      type: Boolean
    },
    color: {
      default: 'white',
      type: String
    }
  },
  data () {
    return {
      view: false,
      viewer: false
    }
  },
  methods: {
    show (viewer = false) {
      this.view = true
      this.viewer = viewer
    },
    hide () {
      this.view = false
    },
    confirmed () {
      this.$emit('accept')
    },
    clear () {
      this.$emit('clear')
    },
    closeModal () {
      this.view = false
      this.$emit('close')
    }
  }
}
</script>

<style lang='scss' scoped>
.v-card__title {
  // background: $modal-gradient !important;
}
.-actions-box {
  position: sticky;
  bottom: 0px;
}
</style>
