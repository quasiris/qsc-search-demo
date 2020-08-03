import ProductService from "../../services/ProductService";
import errorParser from "../../utils/errorParser";


function initialState() {
    return {
        products: '',
        suggestProducts: [],
    }
}

export default {
    state: initialState(),
    getters: {
        PRODUCTS: state => {
            return state.products;
        },
        SUGGEST_PRODUCTS: state => {
            return state.suggestProducts;
        }
    },
    mutations: {
        SET_PRODUCTS(state, payload) {
            for (let i = 0; i < payload['facets'].length; i++) {
                payload['facets'][i]['selected'] = [];
            }
            state.products = payload;
        },
        SET_SUGGEST_PRODUCTS(state, payload) {
            state.suggestProducts = payload;
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
                    context.commit('SET_PRODUCTS', response.data.result.search);
                })
                .catch((error) => {
                    errorParser.parse(error);
                    throw new Error(error);
                })
        },
        GET_SUGGESTS_PRODUCTS: async (context, payload) => {
            return ProductService.getSuggestsProducts(payload)
                .then((response) => {
                    context.commit('SET_SUGGEST_PRODUCTS', response.data.map((val) => val.suggest));
                })
                .catch((error) => {
                    errorParser.parse(error);
                    throw new Error(error);
                })
        },
        POST_PRODUCT_DEPENDENCIES: async (context, payload) => {
            return ProductService.postProductDependencies(payload)
                .then((response) => {
                    console.log('response', response.data.result.search);
                    context.commit('SET_PRODUCTS', response.data.result.search);
                })
                .catch((error) => {
                    errorParser.parse(error);
                    throw new Error(error);
                })

        },
        RESET: (context, payload) => {
            context.commit('RESET', payload.type);
        },
    }
}
