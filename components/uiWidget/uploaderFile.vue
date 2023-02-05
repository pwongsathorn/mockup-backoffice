<template lang="pug">
  v-layout#uploaderFile(wrap)
    v-flex(xs12 sm6 order-1)
      label.black--text.font-weight-bold.mr-3 Cover Image
    v-flex.d-flex.align-center.justify-end.flex-column-reverse.flex-sm-row(xs12 sm6 order-3 order-sm-1)
      Buttons-NormalAction#remove-btn.mr-0.mr-sm-2(
        v-if="files.length || existingImage"
        btn-text="Remove"
        btnWidth="108"
        btnColor="grey"
        textColor="grey--text"
        is-outlined
        :is-dense="$vuetify.breakpoint.smAndUp"
        :is-block="$vuetify.breakpoint.xsOnly"
        @onAction="clear"
      )
      Buttons-NormalAction#change-btn.mb-2.mb-sm-0(
        v-if="files.length || existingImage"
        btn-text="change"
        btnWidth="108"
        is-outlined
        textColor="primary--text"
        :is-dense="$vuetify.breakpoint.smAndUp"
        :is-block="$vuetify.breakpoint.xsOnly"
        @onAction="selectFile()"
      )
    v-flex(xs12 order-2 order-sm-3)
      v-form.d-block.mb-2.mt-2(ref='uploadForm')
        v-card.card-upload.overflow-hidden.mb-1(
          elevation='0'
          outlined
          @click='selectFile()'
          @drop.prevent='onDrop'
          @dragover.prevent='dragover = true'
          @dragenter.prevent='dragover = true'
          @dragleave.prevent='dragover = false'
        )
          input(ref='inputFiles' type='file' accept='.jpg,.jpeg,.png,.webp' hidden='' @change='onSelect($event)')
          v-card-text.caption.text-capitalize.pa-0(:class="`${dragover ? 'primary--text' : 'grey--text text--darken-3' }`")
            .file-wrapper#new-image(v-if="files.length > 0")
              v-img(contain :src="preview(files[0])" :height="height")
            .file-wrapper#existing-image(v-else-if="existingImage")
              v-img(contain :src="existingImage" :height="height")
            .d-flex.flex-column.justify-center.align-center.pa-4.text-center(v-else :style='`height: ${height}px`' :class="dragover ? 'grey--text' : 'grey--text text--darken-3'")
              v-icon.mb-6(
                :color="dragover ? 'grey' : 'grey darken-3'"
                size='48'
              ) {{ placeholderIcon }}
              strong.text-subtitle-2.font-weight-bold.mb-2(:class="{ 'error--text': fileExceedLimit}") {{ placeholderTitle }}
              span.text-caption(:class="{ 'error--text': fileExceedLimit}") {{ placeholderText }}
          p.mb-0.error--text(v-if="fileExceedLimit") {{ errorMessage }}
</template>

<script>
export default {
  name: 'ImageUploader',
  props: {
    maxFileSize: {
      default: 10000000,
      type: Number
    },
    existingImage: {
      default: null,
      type: String
    },
    height: {
      default: '252',
      type: String
    },
    placeholderIcon: {
      default: 'mdi-tray-arrow-up',
      type: String
    },
    placeholderTitle: {
      default: 'อัพโหลดไฟล์ภาพ',
      type: String
    },
    placeholderText: {
      default: 'JPG, PNG ขนาดไฟล์ภาพไม่เกิน 10MB',
      type: String
    },
    errorMessage: {
      default: 'ขนาดไฟล์ภาพต้องไม่เกิน 10MB',
      type: String
    }
  },
  data: () => ({
    dragover: false,
    files: [],
    progress: {},
    fileExceedLimit: false,
    accept: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  }),
  computed: {
    placeholder () {
      switch (this.placeholderType) {
        case 'avatar':
        default:
          return '/images/profile-placeholder.png'
      }
    }
  },
  methods: {
    clear () {
      this.files = []
      this.$emit('onRemove')
    },
    preview (file) {
      const fileUrl = URL.createObjectURL(file)
      return fileUrl
    },
    onDrop (e) {
      this.dragover = false
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const getFiles = [...e.dataTransfer.files]
        getFiles.forEach((item) => {
          if (item.size <= this.maxFileSize) {
            this.keepData(item)
            this.fileExceedLimit = false
          } else {
            this.fileExceedLimit = true
            this.showAlert('error', this.errorMessage)
          }
        })
      }
    },
    onSelect (e) {
      if (e.target.files && e.target.files.length > 0) {
        const getFiles = [...e.target.files]
        getFiles.forEach((item) => {
          if (item.size <= this.maxFileSize) {
            this.keepData(item)
            this.fileExceedLimit = false
          } else {
            this.fileExceedLimit = true
            this.showAlert('error', this.errorMessage)
          }
        })
      }
    },
    keepData (keepFile) {
      if (this.accept.includes(keepFile.type)) {
        this.files = [keepFile]
      } else {
        this.$refs.uploadForm.validate()
      }
    },
    selectFile () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.value = null
      fileInputElement.click()
    },
    validate () {
      // checking
      // Do we have new file to upload ?
      const checkUpload = new Promise((resolve, reject) => {
        if (this.files.length > 0) {
          // uploads required
          resolve(true)
        } else {
          // no file to upload
          resolve(false)
        }
      })

      return checkUpload
    },
    uploadImage () {
      // Create From Data
      const formData = new FormData()
      formData.append('file', this.files[0])
      // Do upload
      const promise = new Promise((resolve, reject) => {
        this.$uploadApi.upload(formData)
          .then((res) => {
            resolve(res.url)
          })
          .catch((error) => {
            reject(error)
          })
      })

      return promise
    }
  }
}
</script>

<style>
.card-upload {
  border: 1px dashed rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}
</style>
