import axios from 'axios';

function initialState() {
    return {
        products: ''
    }
}

export default {
    state: initialState(),
    getters: {
        PRODUCTS: state => {
            return state.products
        },
    },
    mutations: {
        SET_PRODUCTS(state, payload) {
            state.products = payload;
        },
        RESET(state) {
            const s = initialState();
            Object.keys(s).forEach(key => {
                state[key] = s[key]
            })
        }
    },
    actions: {
        GET_PRODUCTS: async (context) => {
            try {
                const {data} = await axios.get(`search/hornbach-de/search?q=*`);
                context.commit('SET_PRODUCTS', data.result.search.documents);
            } catch (e) {
                throw new Error(e);
            }
        },
        GET_PRODUCTS_BY_QUERY: async (context, payload) => {
            try {
                const {data} = await axios.get(`search/hornbach-de/search?q=${payload.form.query}`);
                context.commit('SET_PRODUCTS', data.result.search.documents);
            } catch (e) {
                throw new Error(e);
            }
        },
        RESET_PRODUCTS: (context) => {
            context.commit('RESET', 'products');
        },
    }
}
