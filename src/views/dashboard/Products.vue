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
                                        @input="formSubmit"
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
                    <article class="products-facets">
                        <v-expansion-panels
                                v-model="panel"
                                hover
                        >
                            <v-expansion-panel v-for="(filter, i) in PRODUCTS_FILTERS" :key="i">
                                <v-expansion-panel-header>{{filter.name}}</v-expansion-panel-header>
                                <v-expansion-panel-content v-if="filter.id === 'category'">
                                    <v-treeview
                                            class="font-weight-light"
                                            open-all
                                            :dense="true"
                                            :items="[...filter]"
                                    ></v-treeview>
                                </v-expansion-panel-content>
                                <v-expansion-panel-content v-else>
                                    <FilterCheckbox v-for="(filterValue, i) in filter.children"
                                                    :key="i"
                                                    :filter-value="filterValue"
                                    />

                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </article>
                    <article class="products-sliders mt-10">
                        <div v-for="(sliderValue, i) in PRODUCTS_SLIDERS" :key="i">
                            <p class="products-sliders_title font-weight-light">
                                {{sliderValue.name}}: {{slider[0]}} - {{slider[1]}} €
                            </p>
                            <v-range-slider
                                    v-model="slider"
                                    :max="sliderValue.maxRange"
                                    :min="sliderValue.minRange"
                            />
                        </div>
                    </article>
                </aside>
                <article class="products-list">
                    <p class="products-list_total font-weight-light">
                        Total: {{TOTAL_PRODUCTS}} elements
                    </p>
                    <v-select
                            class="products-list_sorting"
                            :items="sorting"
                            label="Sortierung"
                    ></v-select>
                    <v-row no-gutters class="products-list_cards">
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
                    <v-pagination
                            class="products-list_pagination mt-6"
                            previous-aria-label="Previous"
                            @input="changePagination"
                            v-model="PAGINATION_CURRENT_PAGE"
                            :length="PAGINATION_LENGTH"
                            :total-visible="10"
                    ></v-pagination>
                </article>
            </section>
        </section>
    </v-card>
</template>
<script>
    import {mapGetters} from "vuex";
    import FilterCheckbox from "../../components/FilterCheckbox";

    const form = {
        query: ''
    };
    export default {
        name: "Products",
        components: {FilterCheckbox},
        beforeMount() {
            this.$store.dispatch('GET_PRODUCTS');
        },
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'SUGGEST_PRODUCTS',
                'TOTAL_PRODUCTS',
                'PAGINATION_LENGTH',
                'PRODUCTS_SLIDERS'
            ]),
            PAGINATION_CURRENT_PAGE: {
                get() {
                    return this.$store.state.products.paginationCurrentPage;
                },
                set(value) {
                    this.$store.commit('SET_PAGINATION_CURRENT_PAGE', value)
                }
            },
            PRODUCTS_FILTERS() {
                return this.mappFiltersFromEndpoint(this.$store.state.products.facets)
            },
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
            slider: [0, 14000],
            sorting: ['Prise', 'Marke Z-A', 'Bestseller', 'Relevanz', 'Title Z-A'],
            panel: [0, 1],
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
            mappFiltersFromEndpoint(value) {

                const filters = [];
                var filterHaveCategory = false;

                for (let i = 0; i < value.length; i++) {
                    const filter = {
                        id: value[i]['id'],
                        name: value[i]['name'],
                        children: value[i]['values'].map((val) => {
                            return {
                                id: val.filter,
                                name: `${val.value} (${val.count})`,
                                filter: val.filter
                            }
                        })
                    };

                    if (value[i]['id'] === 'category') {
                        filterHaveCategory = true;
                    }

                    filters.push(filter);

                }

                if (!filterHaveCategory) {
                    return filters;
                } else {
                    return this.sortFiltersAndReturnCategoryOnFirstPlace(filters);
                }
            },
            sortFiltersAndReturnCategoryOnFirstPlace(filters) {
                const sortFilters = [];
                filters.map((filter, index) => {
                    if (filter['id'] === 'category') {
                        sortFilters.unshift(filters[index]);
                        filters.splice(index, 1);
                        sortFilters.push(...filters);
                    }
                });
                return sortFilters;
            }
        }
    }
</script>

<style scoped>
    .products {
        width: 100%;
    }

    .products-list_sorting {
        width: 300px;
    }

    aside {
        float: left;
        width: 25%;
        padding-right: 30px;
    }

    @media (max-width: 800px) {
        aside {
            width: 100%;
            float: right;
        }
    }

</style>
