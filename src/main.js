import Vue from 'vue'
import App from './App.vue'

import VueFinger from './vue-finger'
Vue.use(VueFinger)

new Vue({
  el: 'body',
  components: { App }
})
