export default function ({ app, store, req, route, redirect }) {
  // declare public routes
  // const publicRoutes = ['index']
  // login page
  const loginPath = '/'
  // declare landing page
  const landingPath = '/manageMember'
  // is there access_token
  const hashedtoken = app.$cookies.get('token')
  // if has session but not login
  if (!hashedtoken) {
    // is one of public route?
    // if (!publicRoutes.includes(route.name)) {
    //   // redirect to login path if not
    //   redirect('/')
    // }
  } else if (hashedtoken) {
    if (route.path === loginPath) {
      redirect(landingPath)
    }
    if (!store.state.main.profile) {
      store.dispatch('main/getProfile')
    }
  }
};
