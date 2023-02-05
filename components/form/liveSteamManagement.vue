<template lang="pug">
Muayded-MainLayout(
  hide-pagination
  :hide-back-button="$vuetify.breakpoint.mdAndUp"
  :page-title="title"
)
  template(#buttons)
    Buttons-Backward.mr-2
    Buttons-NormalAction#save-btn(btn-text="บันทึก" btnWidth="108" @onAction="validate" :is-disabled="!valid" :is-loading-state="loading" )
  template(#mobile-navigation)
    Buttons-NormalAction#save-bottom-navigation-btn.flex-row.rounded(btn-text="บันทึก" is-block :is-disabled="!valid" @onAction="validate" :is-loading-state="loading")
  template(#content)
    .live-stream-management
      v-row#match-containers
        v-col(cols="12")
          Muayded-MatchCard(title="รายละเอียด")
            v-row#program-selection
              //------------------ PROGRAN INFO ------------------
              v-col(v-if="loading" cols="12" md="5")
                v-skeleton-loader(tile type='list-item-two-line, text@2' )
              v-col(v-else cols="12" md="5")
                v-form(ref="LivestreamForm" v-model="valid")
                  Ui-Widget-Datepicker#program-date-picker(
                    :value="form.date"
                    @input="onDateInput"
                    :maxDate="maxDate"
                    :is-disabled="istheProgramRunning"
                    required
                    :rules="dateRules"
                  )
                  v-text-field#program-picker.mt-4(
                    v-model="form.videoName"
                    outlined
                    label="ชื่อวีดีโอ"
                    placeholder="โปรดระบุชื่อวีดีโอ"
                    dense
                    :disabled="loading_state || istheProgramRunning"
                    required
                    :rules="videoNameRules"
                  )
                  v-radio-group#link-type-radio-group.mt-0.mb-2(
                      v-model='form.linkFormat'
                      mandatory
                      required
                    )
                      p.font-weight-bold.mb-2.mr-3 ประเภท Link Livestream :
                      template(v-for="format in linkFormats")
                        v-radio(
                          v-if="format.is_active && !format.is_delete"
                          :id="`linktype-choice-${format.steam_link_type_id}`"
                          :label='format.steam_link_type_name'
                          :value="format.steam_link_type_id"
                          :key="`format-type-${format.steam_link_type_id}`"
                        )
                  v-text-field#streaming-url-input(
                    v-model="form.streamLink"
                    outlined
                    label="URL Livestream"
                    placeholder="ลิ้งก์สำหรับ Live สด ..."
                    dense
                    :disabled="loading_state"
                    required
                    :rules="liveRules"
                  )
                v-radio-group#link-type-radio-group.mt-0.mb-2(
                  v-model='form.liveStatus'
                  mandatory
                  required
                )
                  p.font-weight-bold.mb-2.mr-3 สถานะ :
                  template(v-for="format in statusLive")
                    v-radio(
                      :id="`linktype-choice-${format.status_live_id}`"
                      :label='format.status_live_name'
                      :value="format.status_live_id"
                      :key="`format-type-${format.status_live_id}`"
                    )
              //------------------ COVER IMAGE ------------------
              v-col(v-if="loading" cols="12" md="7")
                v-skeleton-loader(tile type='image' )
              v-col(v-else cols="12" md="7")
                UiWidget-uploaderFile(ref="coverImage" :existingImage="existingCover" @onRemove="existingCover = ''")
</template>

<script>
import { DateTime } from 'luxon'
import { mapState } from 'vuex'

export default {
  name: 'LiveStreamManageForm',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      default: 'จัดการ Live สด ศึกมวยไทย',
      type: String
    }
  },
  data () {
    return {
      firstloaded: false,
      valid: false,
      form: {
        date: DateTime.local().toISODate(),
        linkFormat: null,
        streamLink: null,
        videoName: null,
        liveStatus: null,
        liveType: 2
      },
      statusLive: [
        { status_live_id: 0, status_live_name: 'ยังไม่ดำเนินการ' },
        { status_live_id: 1, status_live_name: 'กำลัง Live' },
        { status_live_id: 2, status_live_name: 'สิ้นสุดการ Live' }
      ],
      existingCover: null
    }
  },
  computed: {
    ...mapState({
      linkFormats: state => state.linkTypes
    }),
    maxDate () {
      const now = DateTime.local()
      return now.plus({ year: 10 }).toISODate()
    },
    // Rules
    liveRules () {
      return [
        v => !!v || 'โปรดระบุลิ้งก์สำหรับ Live สด',
        v => (!!v && v.includes('https://')) || 'รูปแบบไม่ถูกต้อง'
      ]
    },
    videoNameRules () {
      return [
        v => !!v || 'โปรดระบุชื่อวีดีโอ',
        v => !v || (!!v && !(/((?!([\u0E00-\u0E7Fa-zA-Z0-9._ -])).)/.test(v))) || 'สามารถประกอบด้วยตัวอักษรไทย-อังกฤษ ตัวเลข 0-9 _ และ . เท่านั้น'
      ]
    },
    dateRules () {
      return [v => !!v || 'โปรดเลือกวันที่']
    },
    istheProgramRunning () {
      if (this.$route.params.id) {
        if (this.form && this.form.liveStatus === 2) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  async mounted () {
    if (this.$route.params.id) {
      await this.getLiveStreamInfo()
    }
  },
  methods: {
    async getLiveStreamInfo () {
      await this.$api.programLiveApi.findOne(this.$route.params.id)
        .then((response) => {
          const data = response.result
          this.form.date = this.ToLocalDateTime(data.program_live_date_time)
          this.form.linkFormat = data.steam_link_type_id
          this.form.streamLink = data.program_live_steam_link
          this.form.videoName = data.program_name
          this.form.liveStatus = data.program_live_status
          this.existingCover = data.program_live_cover_image
        })
        .catch((error) => {
          this.$router.push({ name: 'manageLiveStream' })
          this.showAlert('error', error.message)
        })
    },
    ruleTrigger () {
      this.$refs.LivestreamForm.validate()
    },
    async validate () {
      if (this.$refs.LivestreamForm.validate()) {
        let uploadedImage = ''
        await this.$refs.coverImage.validate()
          .then(async (res) => {
            if (res === true) {
              await this.$refs.coverImage.uploadImage().then((res) => {
                uploadedImage = res
              })
            }
          })
        if (this.$route.params.id) {
          const editBody = {
            program_name: this.form.videoName,
            program_live_steam_link: this.form.streamLink,
            steam_link_type_id: this.form.linkFormat,
            program_live_date_time: `${DateTime.fromISO(this.form.date).toISODate().toString()}T17:00:00.000Z`,
            program_live_cover_image: uploadedImage || this.existingCover,
            program_live_status: this.form.liveStatus,
            program_live_type: this.form.liveType
          }
          this.$emit('onSubmit', editBody)
        } else {
          const createBody = {
            program_name: this.form.videoName,
            program_live_steam_link: this.form.streamLink,
            steam_link_type_id: this.form.linkFormat,
            program_live_date_time: `${DateTime.fromISO(this.form.date).toISODate().toString()}T17:00:00.000Z`,
            program_live_cover_image: uploadedImage,
            program_live_status: this.form.liveStatus,
            program_live_type: this.form.liveType
          }
          this.$emit('onSubmit', createBody)
        }
      }
    },
    onDateInput (date) {
      if (!this.firstloaded && this.$route.params.id) {
        this.form.date = date
        this.firstloaded = true
      } else {
        this.form.date = date
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.boxer {
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    line-height: 1.5em;
    vertical-align: middle;
    height: calc(1.5em * 2);
  }
  &#red-boxer {
    background-image: linear-gradient(360deg, rgba(136, 50, 36, 0.4) 0%, rgba(136, 50, 36, 0) 100%);
  }
  &#blue-boxer {
    background-image: linear-gradient(360deg, rgba(49, 70, 113, 0.4) 0%, rgba(45, 62, 97, 0) 100%);
  }
}
</style>
