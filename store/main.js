export const state = () => ({
  alertType: 'info',
  alertDescription: '',
  isShowAlert: false,
  profile: null,
  // - Access Token Replaces by Cookie
  // access_token: null,
  // refresh_token: null,
  activeSidebarGroup: null,
  roleList: {},
  isMember: false,
  isAdmin: false,
  isSuperAdmin: false
})

export const mutations = {
  // - Access Token Replaces by Cookie
  // resetToken (state) {
  //   state.profile = null
  //   state.access_token = null
  //   state.refresh_token = null
  //   state.roleList = {}
  // },
  // - Access Token Replaces by Cookie
  // setToken (state, payload) {
  //   state.access_token = payload.access_token
  //   state.refresh_token = payload.refresh_token
  // },
  resetProfile (state) {
    state.profile = null
    state.roleList = {}
  },
  showAlert (state, payload) {
    state.alertType = !payload.type ? 'info' : payload.type
    state.alertDescription = payload.text
    state.isShowAlert = true
  },
  closeAlert (state) {
    state.alertDescription = ''
    state.isShowAlert = false
  },
  setProfile (state, payload) {
    state.profile = payload
    // state.isCaregiver = payload.role === config.CAREGIVERKEY
    // state.isDoctor = payload.role === config.DOCTORKEY
    // state.isManager = payload.role === config.MANAGERKEY
    // state.isSuperAdmin = payload.role === config.SUPERADMINKEY
  },
  setActiveGroup (state, payload) {
    state.activeSidebarGroup = payload
  },
  clearActiveGroup (state) {
    state.activeSidebarGroup = null
  },
  setRoleData (state, payload) {
    state.roleList = payload.reduce((result, obj) => {
      return Object.assign(result, { [obj.name]: obj })
    }, {})
  }
}

export const actions = {
  async getProfile ({ commit }) {
    await this.$api.authApi.getSelfProfile()
      .then((res) => {
        commit('setProfile', res.data)
      })
      .catch((error) => {
        this.$cookies.remove('token')
        commit('resetProfile')
        console.error('error', error)
      })
  }
}

export const getters = {
}
