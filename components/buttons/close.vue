<template lang="pug">
v-hover
  template(v-slot:default="{ hover }")
    //- :elevation="hover ? 4 : 0"
    v-btn.rounded-md.transition-swing(
      depressed
      plain
      :block="isBlock"
      :disabled="isDisabled"
      :loading="isLoadingState"
      @click="onRetrunValue"
    )
      v-icon.mr-2(small) fa fa-times-circle
      span ปิด
</template>
<script>
export default {
  name: 'CloseButton',
  props: {
    isDisabled: {
      default: false,
      type: Boolean
    },
    isLoadingState: {
      default: false,
      type: Boolean
    },
    isBlock: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    onRetrunValue () {
      this.$emit('onAction')
    }
  }
}
</script>
<style lang='scss' scoped>
button {
  // background-color: #E5E7EB;
  // border: 1px solid #D1D5DB !important;
  // color: #9CA3AF !important;
}
</style>
