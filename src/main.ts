import { createApp } from 'vue'
// Vuex is replaced with Pinia see@https://github.com/posva/pinia
// Pinia has a much better TypeScript support,
// also it's a much simpler State Management setup
import { createPinia } from 'pinia'

import '@/styles/index.scss'

import App from './App.vue'
import router from './router'
import i18n from './locales'
import VueClickAway from 'vue3-click-away'
import VueLazyLoad from 'vue3-lazyload'

import './router/guard' // router guards

import 'virtual:svg-icons-register'
import { registerObSkeleton } from '@/components/LoadingSkeleton'
import { registerScrollSpy } from 'vue3-scroll-spy'
import defaultCover from '@/assets/default-cover.webp'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(VueClickAway)
  .use(VueLazyLoad, {
    loading: defaultCover,
    error: defaultCover
  })

registerObSkeleton(app)
registerScrollSpy(app)

app.mount('#app')
