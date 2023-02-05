<template lang="pug">
  v-card(elevation="0")
    v-card(elevation="0" rounded="lg" outlined)
      v-card-title.py-3.px-6.black.white--text.text-body-1 {{ title }}
      v-card-text(:class="noContentSpace ? 'pa-0':'pa-6'")
        slot
</template>

<script>
export default {
  name: 'MatchCardComponent',
  props: {
    title: {
      default: 'Match Card',
      type: String
    },
    noContentSpace: {
      default: false,
      type: Boolean
    }
  }
}
</script>
