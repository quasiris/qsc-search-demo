import axios from 'axios'

export default {
    getProducts(payload) {
        return axios.get(`https://qsc.quasiris.de/api/v1/search/hornbach-de/search?q=${payload.query}&page=${payload.page}`)
    },
    getSuggestsProducts(payload){
        return axios.get(`https://qsc.quasiris.de/api/v1/search/suggest/hornbach-de/search?q=${payload.query}`)
    },
    postProductDependencies(payload) {
        return axios.post(`http://dev05.quasiris.de:8087/api/v1/search/hornbach-de/search`, payload)

    },
    getProductDependencies() {
        return axios.get(`http://dev05.quasiris.de:8087/api/v1/search/hornbach-de/search`)

    }
}
