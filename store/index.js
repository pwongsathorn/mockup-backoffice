export const state = () => ({
  LoadingState: false,
  sidebarToggle: true,
  miniVariant: false,
  roles: [],
  bank: [],
  orderStatus: [],
  matchLiveTypes: [],
  linkTypes: [],
  packageLiveTypes: [],
  orderPackageLiveTypes: []
})

export const actions = {
  nuxtServerInit ({ commit, state }, { $api, error, req }) {
    // console.log('init')
    // await $api.roleApi.findAll()
    //   .then((res) => {
    //     commit('setRoleData', res.result)
    //   })
    // await $api.configBankApi.findAll()
    //   .then((res) => {
    //     commit('setBankLists', res.result)
    //   })
    // await $api.packageLiveTypeApi.findAll()
    //   .then((res) => {
    //     commit('setPackageLiveTypes', res.result)
    //   })
    // await $api.orderStatusApi.findAll()
    //   .then((res) => {
    //     commit('setOrderStatus', res.result)
    //   })
    // await $api.matchLiveTypeApi.findAll()
    //   .then((res) => {
    //     commit('setMatchLiveTypes', res.result)
    //   })
    // await $api.linkTypeApi.findAll()
    //   .then((res) => {
    //     commit('setLinkTypes', res.result)
    //   })
    // await $api.orderPackageLiveTypeApi.findAll()
    //   .then((res) => {
    //     commit('setOrderPackageLiveType', res.result)
    //   })

    commit('menu/setMenu')
  }
}

export const mutations = {
  setLoading (state) {
    state.LoadingState = true
  },
  clearLoading (state) {
    state.LoadingState = false
  },
  setRoleData (state, payload) {
    state.roles = [...payload]
  },
  setBankLists (state, payload) {
    state.bank = [...payload]
  },
  setPackageLiveTypes (state, payload) {
    state.packageLiveTypes = [...payload]
  },
  setOrderStatus (state, payload) {
    state.orderStatus = [...payload]
  },
  setMatchLiveTypes (state, payload) {
    state.matchLiveTypes = [...payload]
  },
  setLinkTypes (state, payload) {
    state.linkTypes = [...payload]
  },
  setOrderPackageLiveType (state, payload) {
    state.orderPackageLiveTypes = [...payload]
  },
  toggleMenu (state) {
    state.sidebarToggle = !state.sidebarToggle
  },
  toggleMiniVariant (state) {
    state.miniVariant = !state.miniVariant
  }
}

export const getters = {
  filteredStatus: state => (statusId) => {
    const fileredStatus = state.orderStatus.filter(each => each.order_status_id !== statusId)
    return fileredStatus
  },
  getOrderStatusName: state => (statusId) => {
    const found = state.orderStatus.find(each => each.order_status_id === statusId)
    if (found) {
      return found.order_status_name_th
    } else {
      return 'ไม่ระบุ'
    }
  }
}
