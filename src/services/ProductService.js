import axios from 'axios'

export default {
    getProducts(payload) {
        return axios.get(`search/hornbach-de/search?q=${payload.query}&page=${payload.page}`)
    },
    getSuggestsProducts(payload){
        return axios.get(`search/suggest/hornbach-de/search?q=${payload.query}`)
    }
}
