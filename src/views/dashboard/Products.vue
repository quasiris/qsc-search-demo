<template>
    <v-card class="products-card">
        <ToolbarHeader :name="'Product'"/>
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
                            <v-expansion-panel v-for="(filter, i) in PRODUCTS.facets" :key="i">
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
                                    <FilterCheckbox
                                            @filterCheckboxChange="changeFilterCheckboxReceived"
                                            v-for="(filterValue, i) in filter.values"
                                            :key="i"
                                            :filter-id="filter.id"
                                            :filter-value="filterValue"
                                    />
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </article>
                    <article class="products-sliders mt-10">
                        <div v-for="(sliderValue, i) in PRODUCTS.sliders" :key="i">
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
                   <!-- <p class="products-list_total font-weight-light">
                        Total: {{TOTAL_PRODUCTS}} elements
                    </p>-->
                    <v-select
                            class="products-list_sorting"
                            :items="sortValues"
                            item-text="name"
                            @change="changeSort"
                            label="Sortierung"
                    ></v-select>
                    <v-row no-gutters class="products-list_cards">
                        <v-col v-for="(product, index) in PRODUCTS.documents" :key="index" class="grid">
                            <BasicCard :item="product"/>
                        </v-col>
                    </v-row>
                    <v-pagination
                            class="products-list_pagination mt-6"
                            previous-aria-label="Previous"
                            @input="changePagination"
                            v-model="PRODUCTS.paging.currentPage"
                            :length="PRODUCTS.paging.pageCount"
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
    import ToolbarHeader from "../../components/ToolbarHeader";

    import {productsConstants} from '../../constants/productsConstants';

    const form = {
        query: ''
    };

    export default {
        name: "Products",
        components: {ToolbarHeader, BasicCard, SearchButton, FilterCheckbox},
        beforeMount() {
            this.$store.dispatch('GET_PRODUCTS', {
                query: '*',
                page: 1
            })
                .then(() => {
                    this.setExpansionPanelsValue();
                });
        },
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'SUGGEST_PRODUCTS'
            ]),
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
            sortValues: productsConstants.sortValues,
            expansionPanels: {
                panel: [],
                items: null
            },
            postProductDependencies: {
                "page": 1,
                "q": "*",
                "searchFilters": [
                ],
                "sort": {
                    "sort": ""
                }
            }

        }),
        watch: {
            'pagination.search': function (val) {
                val && val !== this.select && this.querySelections(val)
            }
        },
        methods: {
            formSubmit() {
                this.postProductDependencies.q = this.form.query;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.postProductDependencies);
            },
            querySelections(query) {
                this.pagination.loading = true;
                this.$store.dispatch('GET_SUGGESTS_PRODUCTS', {
                    query: query
                })
                    .then(() => {
                        this.pagination.loading = false;
                    })
            },
            changePagination(page) {
                this.postProductDependencies.page = page;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.postProductDependencies);

                this.$vuetify.goTo(0, {
                    duration: 1300
                });
            },
            changeSort(sortValue) {
                this.postProductDependencies.sort.sort = sortValue;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.postProductDependencies);
            },
            changeFilterCheckboxReceived(filterValue) {
                this.postProductDependencies.searchFilters.push({
                    "id": filterValue.id,
                    "values":[{
                        ...filterValue.value
                    }]
                });

                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.postProductDependencies);

            },
            setExpansionPanelsValue() {
                this.expansionPanels.items = this.$store.state.products.filters.length + 1;
                if (this.expansionPanels.panel <= this.expansionPanels.items) {
                    for (let i = 0; i < this.expansionPanels.items; i++) {
                        this.expansionPanels.panel.push(i);
                    }
                }
            },

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
