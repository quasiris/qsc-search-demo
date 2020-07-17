import axios from 'axios';
import store from '../index';


function initialState() {
    return {
        products: [],
        totalProducts: '',
        suggestProducts: [],
        paginationLength: null,
        paginationCurrentPage: null,
        filters: [],
        sliders: []
    }
}

export default {
    state: initialState(),
    getters: {
        PRODUCTS: state => {
            return state.products;
        },
        PRODUCTS_FILTERS: state => {
          return state.filters;
        },
        PRODUCTS_SLIDERS: state => {
          return state.sliders
        },
        TOTAL_PRODUCTS: state => {
            return state.totalProducts;
        },
        SUGGEST_PRODUCTS: state => {
            return state.suggestProducts;
        },
        PAGINATION_LENGTH: state => {
            return state.paginationLength;
        },
        PAGINATION_CURRENT_PAGE: state => {
            return state.paginationCurrentPage;
        }
    },
    mutations: {
        SET_PRODUCTS(state, payload) {
            state.products = payload;
        },
        SET_PRODUCTS_FILTERS(state, payload) {
          state.filters = payload;
        },
        SET_PRODUCTS_SLIDERS(state, payload){
          state.sliders = payload;
        },
        SET_TOTAL_PRODUCTS(state, payload) {
            state.totalProducts = payload;
        },
        SET_SUGGEST_PRODUCTS(state, payload) {
            state.suggestProducts = payload;
        },
        SET_PAGINATION_LENGTH(state, payload) {
            state.paginationLength = payload;
        },
        SET_PAGINATION_CURRENT_PAGE(state, payload) {
            state.paginationCurrentPage = payload;
        },
        RESET(state, type) {
            const s = initialState();
            Object.keys(s).forEach(key => {
                 if(key === type){
                     state[key] = s[key]
                 }

             })
        }
    },
    actions: {
        GET_PRODUCTS: async (context) => {
            try {
                const {data} = await axios.get(`search/hornbach-de/search?q=*`);
                context.commit('SET_PRODUCTS', data.result.search.documents);
                context.commit('SET_TOTAL_PRODUCTS', data.result.search.total);
                context.commit('SET_PAGINATION_LENGTH', data.result.search.paging.pageCount);
                context.commit('SET_PAGINATION_CURRENT_PAGE', data.result.search.paging.currentPage);
                context.commit('SET_PRODUCTS_FILTERS', data.result.search.facets);
                context.commit('SET_PRODUCTS_SLIDERS', data.result.search.sliders);

            } catch (e) {
                throw new Error(e);
            }
        },
        GET_PRODUCTS_BY_QUERY: async (context, payload) => {
            try {
                const {data} = await axios.get(`search/hornbach-de/search?q=${payload.form.query}`);
                context.commit('SET_PRODUCTS', data.result.search.documents);
                context.commit('SET_TOTAL_PRODUCTS', data.result.search.total);
                context.commit('SET_PAGINATION_LENGTH', data.result.search.paging.pageCount);
                context.commit('SET_PAGINATION_CURRENT_PAGE', data.result.search.paging.currentPage);
                context.commit('SET_PRODUCTS_FILTERS', data.result.search.facets);
                context.commit('SET_PRODUCTS_SLIDERS', data.result.search.sliders);

            } catch (e) {
                throw new Error(e);
            }
        },
        GET_PRODUCTS_BY_QUERY_AND_PAGINATION: async (context, payload) => {
            try {
                if (!payload.form.query) {
                    payload.form.query = '*';
                }

                const {data} = await axios.get(`search/hornbach-de/search?q=${payload.form.query}&page=${payload.form.page}`);
                context.commit('SET_PRODUCTS', data.result.search.documents);
                context.commit('SET_TOTAL_PRODUCTS', data.result.search.total);
                context.commit('SET_PAGINATION_LENGTH', data.result.search.paging.pageCount);
                context.commit('SET_PAGINATION_CURRENT_PAGE', data.result.search.paging.currentPage);
                context.commit('SET_PRODUCTS_FILTERS', data.result.search.facets);
                context.commit('SET_PRODUCTS_SLIDERS', data.result.search.sliders);


            } catch (e) {
                if (e.response.status === 500) {
                    store.dispatch('RESET', {type: 'products'});
                }

                throw new Error(e);
            }
        },
        GET_SUGGESTS_PRODUCTS: async (context, payload) => {
            try {
                const {data} = await axios.get(`search/suggest/hornbach-de/search?q=${payload.form.query}`);
                context.commit('SET_SUGGEST_PRODUCTS', data.map((val) => val.suggest));
            } catch (e) {
                throw new Error(e);
            }
        },
        RESET: (context, payload) => {
            context.commit('RESET', payload.type);
        },
    }
}
