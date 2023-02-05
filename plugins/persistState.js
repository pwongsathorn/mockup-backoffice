import VuexPersist from 'vuex-persist'
export default ({ store }) => {
  new VuexPersist({
    key: process.env.appName,
    // restoreState: (key, storage) => (),
    reducer: state => ({
      main: state.main
    })
  }).plugin(store)
}
