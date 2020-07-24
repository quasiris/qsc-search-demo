<template>
    <v-card class="products-card">
        <ToolbarHeader :name="'Product'"/>
        <section class="pa-5">
            <header>
                <article class="products-search-query">
                    <v-form
                            v-model="formOptions.valid"
                            v-on:submit.prevent="searchQueryFormSubmit()"
                    >
                        <v-row justify="center">
                            <v-col cols="12"
                                   sm="12"
                                   md="6">
                                <v-combobox
                                        v-model="form.query"
                                        :loading="autosuggest.loading"
                                        :items="SUGGEST_PRODUCTS"
                                        :search-input.sync="autosuggest.search"
                                        :rules="formOptions.query"
                                        flat
                                        @input="searchQueryFormSubmit"
                                        v-on:keyup.enter="searchQueryFormSubmit"
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
                                            @filterCheckboxChange="setFilterValues"
                                            :key="i"
                                            :filter-id="filter.id"
                                            :filter-values="filter.values"
                                    />
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </article>
                    <article class="products-sliders mt-10">
                        <div v-for="(sliderValue, i) in PRODUCTS.sliders" :key="i">
                            <p class="products-sliders_title font-weight-light">
                                {{sliderValue.name}}: {{priceSliderValue[0] | price}} - {{priceSliderValue[1] | price}}
                            </p>
                            <v-range-slider
                                    @change="changeSlider(sliderValue)"
                                    v-model="priceSlider"
                                    :max="sliderValue.maxRange"
                                    :min="sliderValue.minRange"
                            />
                        </div>
                    </article>
                </aside>
                <article class="products-list">
                    <p class="products-list_total font-weight-light">
                        Total: {{PRODUCTS.total}} elements
                    </p>
                    <v-select
                            class="products-list_sorting"
                            :items="sortValues"
                            item-text="name"
                            @change="changeSort"
                            label="Sortierung"
                    ></v-select>
                    <v-row no-gutters class="products-list_cards">
                        <v-col v-for="(product, index) in PRODUCTS.documents" :key="index" class="grid">
                            <BasicProductCard :item="product"/>
                        </v-col>
                    </v-row>
                    <v-pagination
                            v-if="pagination"
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
    import BasicProductCard from "../../components/BasicProductCard";
    import ToolbarHeader from "../../components/ToolbarHeader";

    import {productsConstants} from '../../constants/productsConstants';

    const form = {
        query: ''
    };

    export default {
        name: "Products",
        components: {
            BasicProductCard,
            ToolbarHeader,
            SearchButton,
            FilterCheckbox
        },
        beforeMount() {
            this.$store.dispatch('GET_PRODUCTS', {
                query: '*',
                page: 1
            })
                .then(() => {
                    this.setExpansionPanelsValueInFirstTouch();
                    this.setSlidersInFirstTouch();
                    this.pagination = true;
                });

        },
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'SUGGEST_PRODUCTS'
            ]),
            priceSlider: {
                get() {
                    return [this.$store.state.products.products.sliders[0].minRange, this.$store.state.products.products.sliders[0].maxRange]
                },
                set(value) {
                    this.priceSliderValue = value;
                }
            }
        },
        data: () => ({
            form: Object.assign({}, form),
            formOptions: {
                valid: false,
                query: [
                    v => !!v || 'Query is required',
                ],
            },
            autosuggest: {
                loading: false,
                search: null
            },
            priceSliderValue: [],
            pagination: false,
            sortValues: productsConstants.sortValues,
            expansionPanels: {
                panel: [],
                items: null
            },
            productDependencies: {
                "page": 1,
                "q": "*",
                "searchFilters": [],
                "sort": {
                    "sort": ""
                },
                "sliders": []
            }

        }),
        watch: {
            'priceSliderValue': function (val) {
                console.log('value', val);
            },
            'autosuggest.search': function (val) {
                val && val && this.getSuggestProducts(val)
            }
        },
        methods: {
            searchQueryFormSubmit() {
                this.productDependencies.q = this.form.query;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
                    .then(() => {
                        this.resetProductDependencies();
                    })
            },
            getSuggestProducts(query) {
                this.autosuggest.loading = true;
                this.$store.dispatch('GET_SUGGESTS_PRODUCTS', {
                    query: query
                })
                    .then(() => {
                        this.autosuggest.loading = false;
                    })
            },
            changePagination(page) {
                this.productDependencies.page = page;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);


                this.$vuetify.goTo(0, {
                    duration: 1300
                });
            },
            changeSort(sortValue) {
                this.productDependencies.sort.sort = sortValue;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
            },
            changeSlider({id}) {
                this.setSliderValues(id, this.priceSliderValue);
            },
            setSlidersInFirstTouch() {
                this.priceSliderValue = [...this.priceSlider];
            },
            setSliderValues(id, sliderValues) {

                this.productDependencies.searchFilters.push({
                    "filterType": "range",
                    "id": id,
                    "minValue": sliderValues[0],
                    "maxValue": sliderValues[1]
                });

                // console.log('dependiencies', this.productDependencies);
                // this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
            },
            setFilterValues(filterValue) {
                if (this.productDependencies.searchFilters.length <= 0) {
                    this.addNewFilterValue(filterValue);
                    return;
                }

                if (this.checkIfFilterValueIsAlreadyExist(filterValue)) {
                    this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
                    return;
                }

                this.addNewFilterValue(filterValue);

            },
            checkIfFilterValueIsAlreadyExist(filterValue) {
                var filterAvailableStatus = false;
                this.productDependencies.searchFilters
                    .map((val, index) => {
                        if (val.id === filterValue.id) {
                            this.setFilterValueIfIsAlreadyExist(index, filterValue.selected);
                            filterAvailableStatus = true;
                        }
                    });

                return filterAvailableStatus;
            },
            setFilterValueIfIsAlreadyExist(index, filterValue) {
                this.productDependencies.searchFilters[index]['values'] = [...filterValue];
            },
            addNewFilterValue(filterValue) {
                this.productDependencies.searchFilters.push({
                    "id": filterValue.id,
                    "values": [filterValue.value]
                });
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
            },
            setExpansionPanelsValueInFirstTouch() {
                this.expansionPanels.items = this.$store.state.products.products.facets.length + 1;
                if (this.expansionPanels.panel <= this.expansionPanels.items) {
                    for (let i = 0; i < this.expansionPanels.items; i++) {
                        this.expansionPanels.panel.push(i);
                    }
                }
            },
            resetProductDependencies() {
                const defaultProductDependencies = {
                    "page": 1,
                    "q": this.form.query,
                    "searchFilters": [],
                    "sort": {
                        "sort": ""
                    },
                    "sliders": []
                };

                this.productDependencies = {...defaultProductDependencies};
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
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
