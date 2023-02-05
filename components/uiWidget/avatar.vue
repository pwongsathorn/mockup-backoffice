<template lang="pug">
  v-avatar(:color="bgColor" :size="Number(size)" :rounded="rounded" :tile="tile")
    slot
      v-icon(v-if="icon" :color="iconColor") {{ icon }}
      v-img(v-else-if="imageURL" :src="imageURL" )
      v-icon(v-else :color="iconColor") fas fa-user
</template>
<script>
export default {
  name: 'AvatarImageUiWidget',
  props: {
    bgColor: { default: '#D1D5DB', type: String },
    iconColor: { default: 'white', type: String },
    imageURL: { default: '', type: String },
    icon: { default: '', type: String },
    size: { default: 40, type: [Number, String] },
    tile: { default: false, type: Boolean },
    rounded: { default: false, type: Boolean }
  },
  data () {
    return {}
  }
}
</script>
<style lang='scss' scoped></style>
