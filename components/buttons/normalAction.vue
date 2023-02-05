<template lang="pug">
v-hover
  template(v-slot:default="{ hover }")
    v-btn.rounded-md.transition-swing(
      :elevation="!plain && hover ? 4 : 0"
      :color="btnColor"
      depressed
      :plain="plain"
      :rounded="isRounded"
      :outlined="isOutlined"
      :block="isBlock"
      :disabled="isDisabled"
      :loading="isLoadingState"
      :type="buttonType"
      :width="btnWidth"
      :small="isDense"
      @click="onRetrunValue"
    )
      .d-flex.align-center
        v-icon.mr-2.white--text(small v-if="btnIcon") {{btnIcon}}
        span.text-capitalize(:class="textColor ? textColor : 'white--text'" ) {{btnText}}
</template>
<script>
export default {
  name: 'NormalButton',
  props: {
    btnColor: {
      default: 'primary',
      type: String
    },
    btnWidth: {
      default: undefined,
      type: String
    },
    buttonType: {
      default: 'button',
      type: String
    },
    isDisabled: {
      default: false,
      type: Boolean
    },
    plain: {
      default: false,
      type: Boolean
    },
    isLoadingState: {
      default: false,
      type: Boolean
    },
    btnText: {
      default: 'ดำเนินการ',
      type: String
    },
    isDense: {
      default: false,
      type: Boolean
    },
    isBlock: {
      default: false,
      type: Boolean
    },
    isOutlined: {
      default: false,
      type: Boolean
    },
    btnIcon: {
      default: '',
      type: String
    },
    textColor: {
      default: '',
      type: String
    },
    isRounded: {
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
