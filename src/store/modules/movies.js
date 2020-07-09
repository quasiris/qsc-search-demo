import axios from 'axios';

function initialState() {
    return {
        movies: ''
    }
}

export default {
    state: initialState(),
    getters: {
        MOVIES: state => {
            return state.movies
        },
    },
    mutations: {
        SET_MOVIES(state, payload) {
            state.movies = payload;
        },
        RESET(state) {
            const s = initialState();
            Object.keys(s).forEach(key => {
                state[key] = s[key]
            })
        }
    },
    actions: {
        GET_MOVIES: async (context) => {
            try {
                const {data} = await axios.get(`search/hornbach-de/search?q=*`);
                console.log('data', data);
                context.commit('SET_MOVIES', data);
            } catch (e) {
                throw new Error(e);
            }
        },
        RESET_MOVIES: (context) => {
            context.commit('RESET', 'movies');
        },
    }
}
