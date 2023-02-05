<template lang="pug">
v-hover
  template(v-slot:default="{ hover }")
    v-btn.rounded-md.transition-swing.grey--text.text--darken-3(:elevation="hover ? 4 : 0" color="grey lighten-2" @click="backward" :block="isBlock" :disabled="isDisabled" :loading="isLoadingState")
      span ย้อนกลับ
</template>
<script>
export default {
  name: 'BackwardButton',
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
    backward () {
      const paths = this.$route.path.split('/')
      if (paths.length > 1) {
        const query = this.$route.fullPath.split(paths[paths.length - 1])
        let newPath = ''
        paths.forEach((element, index) => {
          if (index && index !== paths.length - 1) {
            newPath += (`/${element}`)
          }
        })
        this.$router.push({ path: `${newPath}${query[1]}` })
      } else { this.$router.go(-1) }
    }
  }
}
</script>
