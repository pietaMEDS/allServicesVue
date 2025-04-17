import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'


import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
  components: {
    ...components,
    ...labs,
  },
  directives,
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
