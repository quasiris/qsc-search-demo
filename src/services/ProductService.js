import axios from 'axios'

export default {
    getProducts(payload) {
        return axios.get(`search/hornbach-de/search?q=${payload.query}&page=${payload.page}`)
    },
    getSuggestsProducts(payload){
        return axios.get(`search/suggest/hornbach-de/search?q=${payload.query}`)
    },
    postProductDependencies(payload) {
        return axios.post(`search/hornbach-de/search`, payload)

    },
    getProductDependencies() {
        return axios.get(`search/hornbach-de/search`)

    }
}
