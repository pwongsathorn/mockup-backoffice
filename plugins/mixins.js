import Vue from 'vue'
import { mapState } from 'vuex'
import { DateTime } from 'luxon'
// external dependencies
import numberToString from '~/utils/convertNumberToString'

Vue.mixin({
  components: {
  },
  data () {
    return {
      // GB: Global
      versionGB: process.env.version,
      itemsPerPageGB: process.env.itemPerPage,
      elapse: 0
    }
  },
  computed: {
    ...mapState({
      alertType: state => state.main.alertType,
      alertDescription: state => state.main.alertDescription,
      isShowAlert: state => state.main.isShowAlert,
      profile: state => state.main.profile,
      // - Access Token Replaces by Cookie
      // access_token: state => state.main.access_token,
      loading_state: state => state.LoadingState
    })
  },
  methods: {
    // ===== Formatting =====

    // to String text
    numberToString,
    // Add Hyphen to Bank Account (EX: ###-#-#####-#+)
    bankAccountHyphen (number) {
      const origin = number.toString()
      const newFormat = origin.replace(/(\d{3})(\d{1})(\d{5})(\d{1,})/, '$1-$2-$3-$4')

      return newFormat
    },
    // Add Hyphen to Phone Number (EX: ###-###-####)
    phoneNumberHyphen (number) {
      const origin = number.toString()
      const newFormat = origin.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3')

      return newFormat
    },
    // comma and digit handler
    numberFormat (num, digitOptions = 2) {
      if (typeof num === 'number') {
        return new Intl.NumberFormat('th-TH', { minimumFractionDigits: digitOptions, maximumFractionDigits: digitOptions }).format(num)
      } else {
        return '-'
      }
    },
    ToLocalDateTime (date, local = 'Asia/Bangkok') {
      if (date) {
        const localized = DateTime.fromISO(date)
        console.log('localized:', localized.setZone(local).toISO())
        return localized.setZone(local).toISO()
      }
    },
    // Change Date to Thai format
    toThaiDate (date, selector = 'DateTime') {
      if (selector === 'DateTime') {
        return DateTime.fromISO(date).toLocaleString(
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: 'Asia/Bangkok'
          },
          { locale: 'th-th' }
        )
      } else if (selector === 'Date') {
        return DateTime.fromISO(date).toLocaleString(
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          },
          { locale: 'th-th' }
        )
      } else if (selector === 'Time') {
        return DateTime.fromISO(date).toLocaleString(
          {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: 'Asia/Bangkok'
          },
          { locale: 'th-th' }
        )
      }
    },
    // Calculate index of table
    calculateIndex (currentPage, index) {
      return ((currentPage * this.itemsPerPageGB) - this.itemsPerPageGB) + (index + 1)
    },
    // Display role in Thai
    roleDisplayer (roleName) {
      switch (roleName) {
        case 'superAdmin':
          return 'Super Admin'
        case 'admin':
          return 'ผู้ดูแลระบบ'
        case 'member':
          return 'สมาชิก'
        default:
          return '-'
      }
    },
    // ===== End Formatting =====

    // ===== Functions ==========
    showAlert (typeData, textData) {
      const item = {
        type: typeData,
        text: textData
      }
      this.$store.commit('main/showAlert', item)

      const timer = this.showAlert.timer
      if (timer) {
        clearTimeout(timer)
      }
      this.showAlert.timer = setTimeout(() => {
        if (this.isShowAlert) {
          this.$store.commit('main/closeAlert')
        }
      }, 4000)
      this.elapse = 1
      const t = this.showAlert.t
      if (t) {
        clearInterval(t)
      }
    },
    async logout () {
      this.$cookies.remove('token')
      this.$store.commit('main/resetProfile')
      await this.$router.push({ path: '/' })
    },
    checkObjectIsEmpty (objectKey) {
      return (objectKey && Object.keys(objectKey).length === 0 && Object.getPrototypeOf(objectKey) === Object.prototype)
    }
  }
})
