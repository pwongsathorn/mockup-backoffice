export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - MauyDed789',
    title: 'MauyDed789 BackOffice',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.7.0/css/all.css' },
      { rel: 'preconnect', hre: 'https://fonts.gstatic.com', crossorigin: '' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100;200;300;400;500;600;700;800&family=Noto+Sans:wght@100;200;300;400;500;600;700;800&display=swap' }
    ]
  },
  // running port
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },

  router: {
    middleware: ['auth']
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/styles/default.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~/plugins/createInstances.js' },
    { src: '~/plugins/mixins.js' },
    // CLIENT ONLY ---------------------------------
    { src: '~/plugins/persistState.js', ssr: false }
  ],
  // loading: '~/components/loading.vue',
  loading: false,

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // env
    '@nuxtjs/dotenv',
    // style resources
    '@nuxtjs/style-resources'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
    // ['cookie-universal-nuxt', { alias: 'mauyded789BO' }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    host: process.env.API_URL,
    progress: true
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/styles/override.scss'],
    treeShake: true,
    icons: {
      iconfont: 'fa'
    },
    theme: {
      dark: false,
      options: {
        customProperties: true
      },
      themes: {
        light: {
          redside: '#84180E',
          blueside: '#5677FC',
          primary: '#E33122',
          warning: '#FFC400',
          success: '#7CB342',
          error: '#FF8A80',
          greyLight: '#F7F7F7'
        },
        dark: {
          redside: '#84180E',
          blueside: '#5677FC',
          primary: '#E33122',
          warning: '#FFC400',
          success: '#7CB342',
          error: '#FF8A80',
          greyLight: '#F7F7F7'
        }
      }
    }
  },

  styleResources: {
    scss: [
      './styles/override.scss',
      './styles/extends/*.scss',
      './styles/extends/_var.scss',
      './styles/extends/_mixins.scss',
      './styles/extends/_functions.scss'
    ]
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    loader: {
      vue: {
        prettify: false
      }
    }
  },
  // env config
  env: {
    appName: process.env.APP_NAME || 'BackOffice',
    version: process.env.VERSION || '0.0.0',

    secretKey: process.env.SECRET_KEY || '',

    apiUrl: process.env.API_URL || 'http://localhost:3000',
    uploadUrl: process.env.UPLOAD_URL || 'http://localhost:3000',

    itemPerPage: process.env.ITEMS_PER_PAGE || 10
  }
}
