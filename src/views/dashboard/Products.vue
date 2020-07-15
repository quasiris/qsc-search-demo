<template>
    <v-card class="products-card">
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
        <section class="pa-5">
            <header>
                <article class="products-search-query">
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
                                        :loading="pagination.loading"
                                        :items="SUGGEST_PRODUCTS"
                                        :search-input.sync="pagination.search"
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
            </header>
            <section class="products">
                <aside>
                    <article class="products-category">
                        <p class="products-facets_name font-weight-light">
                            Facets
                        </p>
                        <div v-for="(facet, i) in PRODUCTS_FACETS" :key="i" >
                            <v-treeview
                                    v-if="facet.id === 'category'"
                                    open-all
                                    :items="[...facet]"
                            ></v-treeview>
                        </div>
                    </article>
                </aside>
                <article>
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
                                @input="changePagination"
                                v-model="PAGINATION_CURRENT_PAGE"
                                :length="PAGINATION_LENGTH"
                                :total-visible="10"
                        ></v-pagination>
                    </div>
                </article>

            </section>
        </section>
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
                'PAGINATION_LENGTH',
            ]),
            PAGINATION_CURRENT_PAGE: {
                get() {
                    return this.$store.state.products.paginationCurrentPage;
                },
                set(value) {
                    this.$store.commit('SET_PAGINATION_CURRENT_PAGE', value)
                }
            },
            PRODUCTS_FACETS() {
                return this.mappFacetsValue(this.$store.state.products.facets)
            },
            /*PRODUCTS_CATEGORY: {
                get() {
                    return this.mappFacetsValue(this.$store.state.products.facets)

                },
                set() {

                }
            }*/

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
            pagination: {
                loading: false,
                search: null
            },
            items: ''
        }),
        watch: {
            'pagination.search': function (val) {
                val && val !== this.select && this.querySelections(val)
            },
        },
        methods: {
            formSubmit() {
                this.$store.dispatch('GET_PRODUCTS_BY_QUERY', {
                    form: this.form
                });
            },
            querySelections(query) {
                this.pagination.loading = true;
                this.$store.dispatch('GET_SUGGESTS_PRODUCTS', {
                    form: {
                        query: query
                    }
                })
                    .then(() => {
                        this.pagination.loading = false;
                    })
            },
            changePagination(page) {
                this.$store.dispatch('GET_PRODUCTS_BY_QUERY_AND_PAGINATION', {
                    form: {
                        query: this.form.query,
                        page: page
                    }
                })
            },
            mappFacetsValue(value) {
                const treeViewObject = [];

                for (let i = 0; i < value.length; i++) {
                    treeViewObject.push({
                        id: value[i]['id'],
                        name: value[i]['name'],
                        children: value[i]['values'].map((val) => {
                            return {name: `${val.value} (${val.count})`, filter: val.filter}
                        })
                    })

                }

                console.log('treee view object', treeViewObject);
                return treeViewObject;
            }
        }
    }
</script>

<style scoped>
    .products-card{
        min-height: 100vh;
    }
    .products-_card:hover {
        cursor: pointer;
    }
    .products{

        width: 100%;

    }
    aside {
        float: left;
        width: 30%;
    }
</style>
