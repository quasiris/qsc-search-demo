import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import globalConfig from "../public/config/config";
Vue.config.productionTip = false;
axios.defaults.baseURL = globalConfig.api_url;
/*
import SearchDataPicker from "@quasiris/search-data-picker/src";

const url = "https://qsc-dev.quasiris.de/api/v1/admin/config/hornbach-de/merge/qsc-search-demo";
SearchDataPicker.initPicker.fromUrl(url);
*/



new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
