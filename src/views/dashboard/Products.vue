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
                                <SearchButton :form-options="formOptions"/>
                            </v-col>
                        </v-row>
                    </v-form>
                </article>
            </header>
            <section class="products">
                <aside>
                    <article class="products-facets">
                        <v-expansion-panels
                                 v-model="expansionPanels.panel"
                                 hover
                                 multiple
                         >
                             <v-expansion-panel   v-for="(filter, i) in PRODUCTS_FILTERS" :key="i">
                                 <v-expansion-panel-header>{{filter.name}}</v-expansion-panel-header>
                                 <v-expansion-panel-content v-if="filter.id === 'category'">
                                     <ul>
                                         <li v-for="(filterValue, i) in filter.values"
                                             :key="i">
                                             {{filterValue.value}}
                                         </li>
                                     </ul>
                                 </v-expansion-panel-content>
                                 <v-expansion-panel-content v-else>
                                     <FilterCheckbox v-for="(filterValue, i) in filter.values"
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
                           <BasicCard :item="product"/>
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
    import SearchButton from "../../components/SearchButton";
    import BasicCard from "../../components/BasicCard";

    const form = {
        query: ''
    };

    export default {
        name: "Products",
        components: {BasicCard, SearchButton, FilterCheckbox},
        beforeMount() {
            this.$store.dispatch('GET_PRODUCTS')
                .then(()=>{
                    this.setExpansionPanelsValue();
                })
        },
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'SUGGEST_PRODUCTS',
                'TOTAL_PRODUCTS',
                'PAGINATION_LENGTH',
                'PRODUCTS_SLIDERS',
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
                return this.sortFiltersAndReturnCategoryOnFirstPlace(this.$store.state.products.filters)
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
            expansionPanels: {
                panel: [],
                items: null
            }
        }),
        watch: {
            'pagination.search': function (val) {
                val && val !== this.select && this.querySelections(val)
            }
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
                });
                this.$vuetify.goTo(0, {duration: 1300})
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
            },
            setExpansionPanelsValue() {
                this.expansionPanels.items = this.$store.state.products.filters.length + 1;
                if (this.expansionPanels.panel <= this.expansionPanels.items) {
                    for (let i = 0; i < this.expansionPanels.items; i++) {
                        this.expansionPanels.panel.push(i);
                    }
                }
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
        width: 20%;
        padding-right: 40px;
    }

    @media (max-width: 1000px) {
        aside {
            width: 100%;
            float: right;
            padding-right: 0;
        }
    }

</style>
