<template lang="pug">
Muayded-MainLayout(
  hide-pagination
  :hide-back-button="$vuetify.breakpoint.mdAndUp"
  :page-title="title"
)
  template(#buttons)
    Buttons-Backward.mr-2
    Buttons-NormalAction#save-btn(btn-text="บันทึก" btnWidth="108" @onAction="validate" :is-disabled="!valid" :is-loading-state="$fetchState.pending || loading")
  template(#mobile-navigation)
    Buttons-NormalAction#save-bottom-navigation-btn.flex-row.rounded(btn-text="บันทึก" is-block :is-disabled="!valid" @onAction="validate" :is-loading-state="$fetchState.pending || loading")
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
                  v-autocomplete#program-picker.mt-4(
                    v-model="form.program"
                    :items="programList"
                    outlined
                    dense
                    item-text="ProgramName"
                    item-value="ProgramName"
                    return-object
                    placeholder="เลือกศึก"
                    :disabled="istheProgramRunning || loading_state"
                    @change="onSelectPrograms"
                    no-data-text="ไม่พบรายการศึก"
                    required
                    :rules="programRules"
                  )
                    //- :rules="programRules"
                    template(#selection="data")
                      p.mb-0.text-truncate(
                        v-bind="data.attrs"
                      )
                        span {{ data.item.Time }}
                        span.px-1 -
                        span {{ data.item.ProgramName }}
                    template(#item="{ item }")
                      v-list-item-content
                        p.mb-0
                          span {{ item.Time }}
                          span.px-1 -
                          span {{ item.ProgramName }}
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
              //------------------ COVER IMAGE ------------------
              v-col(v-if="loading" cols="12" md="7")
                v-skeleton-loader(tile type='image' )
              v-col(v-else cols="12" md="7")
                UiWidget-uploaderFile(ref="coverImage" :existingImage="existingCover" @onRemove="existingCover = ''")
      v-row#match-containers
        v-col(v-if="form.matches.length === 0" cols="12")
          v-card(rounded="lg" elevation="0" outlined)
            v-card-text
              p.text-center.mb-0
                v-icon.mx-auto(
                  size="80"
                  color="grey lighten-2"
                ) mdi-alert-decagram
              p.text-center.mb-0.grey--text.text--lighten-2
                span กรุณาเลือกศึก
        template(
          v-else
          v-for="(match, matchIndex) in form.matches"
        )
          v-col(cols="12" md="6" :key="`match-${matchIndex}`")
            Muayded-MatchCard(:title="'คู่ที่ ' + match.match_no" no-content-space)
              v-row(no-gutters)
                v-col#red-info.text-center(cols="12" md="5")
                  p.mb-0.grey.darken-3.white--text ฝ่ายแดง
                  #red-boxer.boxer.font-weight-bold.px-2.py-2.py-md-4
                    p.mb-0 {{ match.red_name }}
                v-col#weight-info.text-center.greyLight(cols="12" md="2")
                  p.white--text.text-center.mb-0.grey.darken-3 พิกัด
                  .boxer.font-weight-bold.px-2.py-2.py-md-4
                    p.mb-0 {{ match.weight }}
                v-col#blue-info.text-center(cols="12" md="5")
                  p.mb-0.grey.darken-3.white--text ฝ่ายน้ำเงิน
                  #blue-boxer.boxer.font-weight-bold.px-2.py-2.py-md-4
                    p.mb-0 {{ match.blue_name }}
                v-col(cols="12").pb-0
                  v-divider.mb-3
                v-col(cols="12")
                  v-form.py-3.px-6
                    v-radio-group#match-type-radio-group.mt-0.mb-0(
                      v-model='match.match_live_type_id'
                      mandatory
                      :row="$vuetify.breakpoint.mdAndUp"
                      hide-details="auto"
                      @change="onUpdateMatch(match)"
                    )
                      span.font-weight-bold.mr-3 สถานะ :
                      template(v-for="matchType in matchTypes")
                        v-radio(
                          v-if="matchType.is_active && !matchType.is_delete"
                          :id="`match-type-choice-${matchType.match_live_type_id}`"
                          :label='matchType.match_live_type_name'
                          :value="matchType.match_live_type_id"
                          :key="`match-type-${matchType.match_live_type_id}`"
                        )
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
        time: null,
        program: null,
        linkFormat: null,
        streamLink: null,
        matches: []
      },
      existingCover: null,
      updateMatches: [],
      selectedPrograms: null,
      programList: []
    }
  },
  async fetch () {
    await this.getProgramList()
  },
  computed: {
    ...mapState({
      matchTypes: state => state.matchLiveTypes,
      linkFormats: state => state.linkTypes
    }),
    maxDate () {
      const now = DateTime.local()
      return now.plus({ year: 10 }).toISODate()
    },
    istheProgramRunning () {
      if (this.$route.params.id && this.form.program) {
        if (this.form.date && this.form.program.Time) {
          const checkDate = this.mergeDateAndTime(this.form.date, this.form.program.Time)
          const today = DateTime.local()
          return today.toMillis() >= checkDate.toMillis()
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // Rules
    liveRules () {
      return [
        v => !!v || 'โปรดระบุลิ้งก์สำหรับ Live สด',
        v => (!!v && v.includes('https://')) || 'รูปแบบไม่ถูกต้อง'
      ]
    },
    dateRules () {
      return [v => !!v || 'โปรดเลือกวันที่']
    },
    programRules () {
      return [v => !!v || 'โปรดเลือกศึก']
    }
  },
  async mounted () {
    if (this.$route.params.id) {
      await this.getLiveStreamInfo()
    }
  },
  methods: {
    onUpdateMatch (data) {
      if (this.updateMatches.length === 0) {
        this.updateMatches.push({ match_id: Number(data.match_id), match_live_type_id: data.match_live_type_id })
        return
      }
      const findMatch = this.updateMatches.findIndex(eachMatch => Number(eachMatch.match_id) === Number(data.match_id))
      if (findMatch !== -1) {
        this.updateMatches[findMatch].match_live_type_id = data.match_live_type_id
        return
      }
      this.updateMatches.push({ match_id: Number(data.match_id), match_live_type_id: data.match_live_type_id })
    },
    async getLiveStreamInfo () {
      await this.$api.programLiveApi.findOne(this.$route.params.id)
        .then(async (response) => {
          const data = response.result
          this.form.date = this.ToLocalDateTime(data.program_live_date_time)
          this.form.time = data.time
          this.form.linkFormat = data.steam_link_type_id
          this.form.streamLink = data.program_live_steam_link
          this.form.matches = [...data.match_live]
          this.form.program = {
            ProgramName: data.program_name,
            ProgramID: data.program_id,
            'ProgramNO.': data.program_no,
            Time: data.time
          }
          this.existingCover = data.program_live_cover_image
          await this.$fetch()
        })
        .catch((error) => {
          this.$router.push({ name: 'manageProgramLive' })
          this.showAlert('error', error.message)
        })
    },
    async getProgramList () {
      if (this.form.date) {
        await this.$muaydedApi.getPrograms(this.form.date)
          .then((response) => {
            const list = response.Program[0].ListProgram
            this.programList = list
          })
          .catch((error) => {
            this.showAlert('error', error.message)
          })
      }
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
          const date = this.mergeDateAndTime(this.form.date, this.form.program.Time, 'ISO')
          const editBody = {
            program_no: this.form.program['ProgramNO.'],
            program_id: this.form.program.ProgramID,
            time: this.form.program.Time,
            program_name: this.form.program.ProgramName,
            program_live_steam_link: this.form.streamLink,
            steam_link_type_id: this.form.linkFormat,
            program_live_date_time: DateTime.fromISO(date).toUTC(),
            program_live_cover_image: uploadedImage || this.existingCover,
            matches: [...this.updateMatches]
          }
          this.$emit('onSubmit', editBody)
        } else {
          const date = this.mergeDateAndTime(this.form.date, this.form.program.Time, 'ISO')
          const createBody = {
            program_no: this.form.program['ProgramNO.'],
            program_id: this.form.program.ProgramID,
            time: this.form.program.Time,
            program_name: this.form.program.ProgramName,
            program_live_steam_link: this.form.streamLink,
            steam_link_type_id: this.form.linkFormat,
            program_live_date_time: DateTime.fromISO(date).toUTC(),
            program_live_cover_image: uploadedImage,
            match_live: [...this.form.matches]
          }
          this.$emit('onSubmit', createBody)
        }
      }
    },
    mergeDateAndTime (ISODate, time, format) {
      if (ISODate && time) {
        const date = DateTime.fromISO(ISODate)
        const times = time.split(':')
        const mergedDate = date.set({ hours: times[0], minutes: times[1] })
        if (format === 'ISO') {
          return mergedDate.toISO()
        } else {
          return mergedDate
        }
      }
    },
    onSelectPrograms (event) {
      this.form.program = event
      this.selectedPrograms = event
      if (!this.selectedPrograms) {
        return []
      } else {
        const mapper = this.selectedPrograms.Match.map((each) => {
          return {
            match_live_type_id: null,
            red_id: each.RedID,
            red_name: each.RedName,
            blue_id: each.BlueID,
            blue_name: each.BlueName,
            match_live_score_json: JSON.stringify(each.Score),
            weight: each.Weight,
            match_no: each['MatchNO.'],
            match_id: each.MatchID
          }
        })
        this.form.matches = [...mapper]
      }
    },
    async onDateInput (date) {
      if (!this.firstloaded && this.$route.params.id) {
        this.form.date = date
        this.firstloaded = true
      } else {
        this.form.date = date
        this.form.program = null
        this.selectedPrograms = null
        this.programList = []
        await this.$fetch()
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
