import ProductService from "../../services/ProductService";

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
            const sortFilters = [];

            payload.map((filter, index) => {
                if (filter['id'] === 'category') {
                    sortFilters.unshift(payload[index]);
                    payload.splice(index, 1);
                    sortFilters.push(...payload);
                }
            });

            state.filters = sortFilters;
        },
        SET_PRODUCTS_SLIDERS(state, payload) {
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
                if (key === type) {
                    state[key] = s[key]
                }

            })
        }
    },
    actions: {
        GET_PRODUCTS: async (context, payload) => {
            return ProductService.getProducts(payload)
                .then((response) => {
                    context.commit('SET_PRODUCTS', response.data.result.search.documents);
                    context.commit('SET_TOTAL_PRODUCTS', response.data.result.search.total);
                    context.commit('SET_PAGINATION_LENGTH', response.data.result.search.paging.pageCount);
                    context.commit('SET_PAGINATION_CURRENT_PAGE', response.data.result.search.paging.currentPage);
                    context.commit('SET_PRODUCTS_FILTERS', response.data.result.search.facets);
                    context.commit('SET_PRODUCTS_SLIDERS', response.data.result.search.sliders);
                })
                .catch((error) => {
                    throw new Error(error);
                })
        },
        GET_SUGGESTS_PRODUCTS: async (context, payload) => {
            return ProductService.getSuggestsProducts(payload)
                .then((response) => {
                    context.commit('SET_SUGGEST_PRODUCTS', response.data.map((val) => val.suggest));
                })
                .catch((error) => {
                    throw new Error(error);
                })
        },
        POST_PRODUCT_DEPENDENCIES: async (contex, payload) => {

            console.log('payload', payload);

            return ProductService.postProductDependencies(payload)
                .then((response) => {
                    console.log('repsponse', response);
                })
                .catch((error) => {
                    throw new Error(error);
                })

        },
        GET_PRODUCT_DEPENDENCIES: async (context) => {
            return ProductService.getProductDependencies()
                .then((response) => {
                    console.log(context);
                    console.log('repsponse PRODUCT DEPENDIECIES', response);
                })
                .catch((error) => {
                    throw new Error(error);
                })

        },
        RESET: (context, payload) => {
            context.commit('RESET', payload.type);
        },
    }
}
