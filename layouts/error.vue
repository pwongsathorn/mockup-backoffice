<template lang="pug">
  v-app.black(dark)
    v-container.ma-auto.text-center
      v-card.mx-auto(max-width="600" dark)
        v-card-text
          v-row
            v-col.pb-0(cols="12")
              v-img.ma-auto(src="/images/boxing-gloves.svg" min-width="200" min-height="200" max-width="35%" alt="Boxing-Gloves")
            v-col( cols="12")
              h1.body-1 ERROR
              h2.primary--text.text-h2(v-if="error?.statusCode") {{ error.statusCode }}
            v-col.pt-0.text-center(cols="12")
              .text-h6.text-sm-h5.font-weight-medium(v-if="error.message")
                span.grey--text.text--darken-1.mr-2.mr-sm-4 {{ error.message }}
              .text-h6.text-sm-h5.font-weight-medium(v-else-if="Number(error.statusCode) === 404")
                span.grey--text.text--darken-1.mr-2.mr-sm-4 ไม่พบหน้าที่ต้องการ
              .text-h6.text-sm-h5.font-weight-medium(v-else)
                span.grey--text.text--darken-1.mr-2.mr-sm-4 เกิดข้อผิดพลาด
            v-col(cols="12")
                Buttons-NormalAction(btn-text="ย้อนกลับ" isBlock @onAction="backward")
</template>

<script>
export default {
  name: 'ErrorPage',
  layout: 'blank',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  methods: {
    backward () {
      const paths = this.$route.path.split('/')
      if (Number(this.error.statusCode) === 404) {
        this.$router.go(-1)
      } else if (paths.length > 1) {
        console.log('path:0', paths)
        this.$router.go({ path: `/${paths[1]}`, force: true })
      } else { this.$router.go(-1) }
    }
  }
}
</script>

<style scoped>
.-h-100 {
  height: 100% !important;
}
.text-404 {
  text-align: center;
  font-size: gap(32)
}
.description {
  font-size: gap(2)
}
</style>
