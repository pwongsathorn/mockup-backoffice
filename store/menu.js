export const state = () => ({
  menuList: [
    {
      text: 'จัดการสมาชิก',
      icon: 'mdi-account-circle',
      route: 'manageMember'
    },
    {
      text: 'จัดการแพ็คเกจ',
      icon: 'mdi-format-list-bulleted',
      route: 'managePackage'
    },
    {
      text: 'การสั่งซื้อแพ็คเกจ',
      icon: 'mdi-cart',
      route: 'managePurchase'
    },
    {
      text: 'จัดการผู้ดูแลระบบ',
      icon: 'mdi-account-plus',
      route: 'manageAdmin'
    }
  ]
})

export const mutations = {
  setMenu (state) {
    const menu = [
      {
        text: 'จัดการสมาชิก',
        icon: 'mdi-account-circle',
        route: 'manageMember'
      },
      {
        text: 'จัดการแพ็คเกจ',
        icon: 'mdi-format-list-bulleted',
        route: 'managePackage'
      },
      {
        text: 'การสั่งซื้อแพ็คเกจ',
        icon: 'mdi-cart',
        route: 'managePurchase'
      },
      {
        text: 'จัดการบัญชีธนาคารของระบบ',
        icon: 'mdi-credit-card-outline',
        route: 'manageBankAccount'
      },
      {
        text: 'จัดการ Live สด ศึกมวยไทย',
        icon: 'mdi-access-point',
        route: 'manageProgramLive'
      },
      {
        text: 'จัดการ Live สด',
        icon: 'mdi-television',
        route: 'manageLiveStream'
      },
      {
        text: 'จัดการผู้ดูแลระบบ',
        icon: 'mdi-account-plus',
        route: 'manageAdmin'
      }
    ]
    state.menu = [...menu]
  }
}
