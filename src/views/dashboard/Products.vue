<template>
    <v-card class="base-64-encoder tools-view-card">
        <v-toolbar dark color="grey lighten-5">
            <v-toolbar-title class="font-weight-light card-title">
                Products
            </v-toolbar-title>
            <v-spacer/>
            <v-icon color="primary"
                    @click="$router.push({name:'Dashboard'})">
                mdi-close
            </v-icon>
        </v-toolbar>
        <v-container>
            <section class="ma-5">
                <article class="movies-search-query ma-5">
                    <v-form
                            v-model="formOptions.valid"
                            v-on:submit.prevent="formSubmit()"
                    >
                        <v-row justify="center">
                            <v-col cols="12"
                                   sm="12"
                                   md="6">
                                <v-combobox
                                        v-model="form.query"
                                        :loading="loading"
                                        :items="SUGGEST_PRODUCTS"
                                        :search-input.sync="search"
                                        :rules="formOptions.query"
                                        flat
                                        v-on:keyup.enter="formSubmit"
                                        hide-no-data
                                        label="Search Query"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="12"
                                   sm="12"
                                   md="2">
                                <v-btn
                                        :disabled="!formOptions.valid"
                                        type="submit"
                                        color="primary"
                                        class="mt-3 w-100"
                                >
                                    Search
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </article>
                <article class="products">
                    <p class="products_total font-weight-light">
                        Total: {{TOTAL_PRODUCTS}} elements
                    </p>
                    <v-row no-gutters class="products_list_cards">
                        <v-col v-for="(product, index) in PRODUCTS" :key="index" class="grid">
                            <v-card
                                    color="accent"
                                    :href="product.document.url" target="_blank"
                                    class="products_card ma-5"
                            >
                                <v-img
                                        :src="product.document.image"
                                        height="200px"
                                ></v-img>
                                <v-card-subtitle class="font-weight-bold">
                                    {{product.document.title}}
                                </v-card-subtitle>
                                <v-card-subtitle class="font-weight-bold text-center">
                                    {{product.document.price}} €
                                </v-card-subtitle>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="products_pagination mt-6">
                        <v-pagination
                                previous-aria-label="Previous"
                                @input="productsPaginationChange"
                                v-model="PAGINATION_CURRENT_PAGE"
                                :length="PAGINATION_LENGTH"
                                :total-visible="10"
                        ></v-pagination>
                    </div>
                </article>
            </section>
        </v-container>
    </v-card>
</template>
<script>
    import {mapGetters} from "vuex";

    const form = {
        query: ''
    };


    export default {
        name: "Products",
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'SUGGEST_PRODUCTS',
                'TOTAL_PRODUCTS',
                'PAGINATION_LENGTH'
            ]),
            PAGINATION_CURRENT_PAGE: {
                get() {
                    return this.$store.state.products.paginationCurrentPage;
                },
                set(value) {
                    this.$store.commit('SET_PAGINATION_CURRENT_PAGE', value)
                }
            }
        },
        beforeMount() {
            this.$store.dispatch('GET_PRODUCTS');
        },
        data: () => ({
            form: Object.assign({}, form),
            formOptions: {
                valid: false,
                query: [
                    v => !!v || 'Query is required',
                ],
            },
            loading: false,
            search: null
        }),
        watch: {
            search(val) {
                val && val !== this.select && this.querySelections(val)
            },
        },
        methods: {
            formSubmit() {
                this.$store.dispatch('GET_PRODUCTS_BY_QUERY', {form: this.form});
            },
            querySelections(query) {
                this.loading = true;
                this.$store.dispatch('GET_SUGGESTS_PRODUCTS', {form: {query: query}})
                    .then(() => {
                        this.loading = false;
                    })
            },
            productsPaginationChange(page) {
                this.$store.dispatch('GET_PRODUCTS_BY_QUERY_AND_PAGINATION', {
                    form: {
                        query: this.form.query,
                        page: page
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .products-_card:hover {
        cursor: pointer;
    }

    .products_list_cards {
        max-height: 90vh;
        overflow-y: auto;
    }


</style>
