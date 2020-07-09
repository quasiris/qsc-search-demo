import Vue from 'vue'
import Vuex from 'vuex'
import Movies from './modules/movies.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        movies: Movies
    }
})
