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
                                <v-autocomplete
                                        v-model="form.query"
                                        :loading="loading"
                                        :items="SUGGEST_PRODUCTS"
                                        :search-input.sync="search"
                                        :rules="formOptions.query"
                                        cache-items
                                        hide-no-data
                                        hide-details
                                        label="What state are you from?"
                                ></v-autocomplete>
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
                <article class="movies-list">
                    <p class="font-weight-light">
                        Total: {{TOTAL_PRODUCTS}} elements
                    </p>
                    <v-row no-gutters>
                        <v-col v-for="(product, index) in PRODUCTS" :key="index" class="grid">
                            <v-card
                                    color="accent"
                                    :href="product.document.url" target="_blank"
                                    class="movies-list_card ma-5"
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
                'TOTAL_PRODUCTS'
            ]),
        },
        beforeMount() {
            this.$store.dispatch('GET_PRODUCTS');

            console.log('products', this.PRODUCTS);
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
            items: [],
            search: null,
        }),
        watch: {
            search(val) {
                val && val !== this.select && this.querySelections(val)
            },
        },
        methods: {
            formSubmit() {
                console.log('query', this.form);
                this.$store.dispatch('GET_PRODUCTS_BY_QUERY', {form: this.form});
            },
            querySelections(query) {
                this.loading = true;
                this.$store.dispatch('GET_SUGGESTS_PRODUCTS', {form: {query: query}})
                    .then(() => {
                        this.loading = false;
                    })
            }
        }
    }
</script>

<style scoped>
    .movies-list_card:hover {
        cursor: pointer;
    }
</style>
