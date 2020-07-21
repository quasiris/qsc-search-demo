import Vue from 'vue'
import Vuex from 'vuex'
import Movies from './modules/movies.js';
import Products from './modules/products.js';
import Notification from './modules/notification.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        movies: Movies,
        products: Products,
        notification: Notification
    }
})
