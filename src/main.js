import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import globalConfig from "../public/config/config";

Vue.config.productionTip = false;
axios.defaults.baseURL = globalConfig.api_url;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
