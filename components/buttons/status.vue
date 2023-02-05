<template lang="pug">
v-hover
  template(v-slot:default="{ hover }")
    v-btn.rounded-md.transition-swing(:elevation="hover ? 4 : 0" :class="{'-status-approval-bg': type === 'approval', '-status-reject-bg': type === 'reject'}"
      :block="isBlock" depressed :disabled="isDisabled" :loading="isLoadingState" @click="onRetrunValue")
      span {{btnText}}
</template>
<script>
export default {
  name: 'StatusButton',
  props: {
    isDisabled: {
      default: false,
      type: Boolean
    },
    isLoadingState: {
      default: false,
      type: Boolean
    },
    btnText: {
      default: 'อนุมัติ',
      type: String
    },
    type: {
      // TYPE approval, reject
      default: 'approval',
      type: String
    },
    isBlock: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    onRetrunValue () {
      this.$emit('onStatus', this.type === 'approval')
    }
  }
}
</script>
<style lang='scss' scoped>
.-status-approval-bg {
  background-color: #00D09E !important;
  color: #fff !important;
}
.-status-reject-bg {
  background-color: #FF3566 !important;
  color: #fff !important;
}
</style>
