import '@resources/css/global.css'
import '@resources/css/bulma/bulma.min.css'
import '@resources/css/scrollbar.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Startup from '@app/Startup.vue'
import router from '@app/router'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

createApp(Startup)
  .use(createPinia())
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
