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
                                        :disabled="skeletonLoader.loading"
                                        v-model="form.query"
                                        :loading="autosuggest.loading"
                                        :items="SUGGEST_PRODUCTS"
                                        :search-input.sync="autosuggest.search"
                                        :rules="formOptions.query"
                                        flat
                                        ref="combobox"
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
                    <v-skeleton-loader
                            :loading="skeletonLoader.loading"
                            :transition="skeletonLoader.transition"
                            type="article"
                    >
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
                                                :filter-name="filter.name"
                                                :filter-values="filter.values"
                                                :filter-selected="filterSelected"
                                        />
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </article>
                    </v-skeleton-loader>
                    <v-skeleton-loader
                            :loading="skeletonLoader.loading"
                            :transition="skeletonLoader.transition"
                            type="article"
                    >
                        <article class="products-sliders mt-10">
                            <div v-for="(sliderValue, i) in PRODUCTS.sliders" :key="i">
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                                @change="changeSlider(sliderValue)"
                                                class="products-sliders_input"
                                                type="number"
                                                v-model="priceSliderValue[0]"
                                                label="Minimum price"
                                                required
                                        />
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                                @change="changeSlider(sliderValue)"
                                                class="products-sliders_input"
                                                type="number"
                                                v-model="priceSliderValue[1]"
                                                label="Maximum price"
                                                required
                                        />
                                    </v-col>
                                </v-row>
                                <v-range-slider
                                        @change="changeSlider(sliderValue)"
                                        v-model="PRICE_SLIDER"
                                        :max="sliderValue.maxRange"
                                        :min="sliderValue.minRange"
                                />
                            </div>
                        </article>
                    </v-skeleton-loader>
                </aside>
                <article class="products-list">
                    <!-- TODO QSC-331 BUG!-->
                    <!-- <v-skeleton-loader
                             :loading="skeletonLoader.loading"
                             :transition="skeletonLoader.transition"
                             type="text"
                             max-width="300"
                     >-->
                    <p class="products-list_total font-weight-light">
                        Total: {{PRODUCTS.total}} elements
                    </p>
                    <!--  </v-skeleton-loader>-->
                    <v-skeleton-loader
                            :loading="skeletonLoader.loading"
                            :transition="skeletonLoader.transition"
                            type="text"
                            max-width="300"
                    >
                        <v-select
                                class="products-list_sorting"
                                :items="sortValues"
                                item-text="name"
                                @change="changeSort"
                                label="Sortierung"
                        />
                    </v-skeleton-loader>
                    <article class="products-list_filter_chips w-100">
                        <ul>
                            <li v-for="(select, filterIndex) in productDependencies.searchFilters" :key=" filterIndex">
                                <div v-if="select.filterType === 'range'">
                                    <v-chip
                                            class="mr-3 mt-3"
                                            color="teal darken-3"
                                            text-color="white"
                                            @click="deleteSelectedFiltersValues({
                                                    filterType: select.filterType,
                                                    filterIndex: filterIndex,
                                                    selectIndex: null,
                                                     id: select.id,

                               })"
                                    >
                                        {{select.name}}: {{select.minValue | price}} - {{select.maxValue | price}}
                                        <v-icon right>
                                            mdi-close
                                        </v-icon>
                                    </v-chip>
                                </div>
                                <div v-else>
                                    <ul>
                                        <li v-for="(value, valueIndex) in select.values" :key="valueIndex">
                                            <v-chip

                                                    :key="valueIndex"
                                                    class="mr-3 mt-3"
                                                    color="teal darken-3"
                                                    text-color="white"
                                                    @click="deleteSelectedFiltersValues({
                                                             filterType: null,
                                                            filterIndex: filterIndex,
                                                            selectedValueIndex: valueIndex,
                                                            id: select.id,

                                                        })"
                                            >
                                                {{select.name}}: {{value}}
                                                <v-icon right>
                                                    mdi-close
                                                </v-icon>
                                            </v-chip>
                                        </li>
                                    </ul>

                                </div>
                            </li>
                            <li v-if="productDependencies.searchFilters.length >= 1">
                                <v-chip
                                        class="mr-3 mt-3"
                                        color="teal"
                                        text-color="white"
                                        @click="resetProductDependencies"
                                >
                                    Reset All Filters
                                    <v-icon right>
                                        mdi-close
                                    </v-icon>
                                </v-chip>
                            </li>
                        </ul>
                        <!-- <div v-for="(select, filterIndex) in productDependencies.searchFilters"
                              :key=" filterIndex">
                             <div v-if="select.filterType === 'range'">
                                 <v-chip
                                         class="mr-3 mt-3"
                                         color="teal darken-3"
                                         text-color="white"
                                         @click="deleteSelectedFiltersValues({
                                                     filterType: select.filterType,
                                                     filterIndex: filterIndex,
                                                     selectIndex: null,
                                                      id: select.id,

                                })"
                                 >
                                     {{select.name}}: {{select.minValue | price}} - {{select.maxValue | price}}
                                     <v-icon right>
                                         mdi-close
                                     </v-icon>
                                 </v-chip>
                             </div>
                             <div v-else>
                                 <v-chip
                                         v-for="(value, valueIndex) in select.values"
                                         :key="valueIndex"
                                         class="mr-3 mt-3"
                                         color="teal darken-3"
                                         text-color="white"
                                         @click="deleteSelectedFiltersValues({
                                                              filterType: null,
                                                             filterIndex: filterIndex,
                                                             selectedValueIndex: valueIndex,
                                                             id: select.id,

                                                         })"
                                 >
                                     {{select.name}}: {{value}}
                                     <v-icon right>
                                         mdi-close
                                     </v-icon>
                                 </v-chip>
                             </div>
                         </div>
                         <div v-if="productDependencies.searchFilters.length >= 1">
                             <v-chip
                                     class="mr-3 mt-3"
                                     color="teal"
                                     text-color="white"
                                     @click="resetProductDependencies"
                             >
                                 Reset All Filters
                                 <v-icon right>
                                     mdi-close
                                 </v-icon>
                             </v-chip>
                         </div>-->
                    </article>
                    <!-- TODO QSC-331 BUG!-->
                    <v-skeleton-loader
                            :loading="skeletonLoader.loading"
                            :transition="skeletonLoader.transition"
                            type="card"
                            :style="skeletonLoader.style"
                    >
                        <v-row no-gutters>
                            <v-col v-for="(product, index) in PRODUCTS.documents" :key="index" class="grid">
                                <BasicProductCard :item="product"/>
                            </v-col>
                        </v-row>
                    </v-skeleton-loader>
                    <v-pagination
                            v-if="!skeletonLoader.loading"
                            class="products-list_pagination mt-6"
                            previous-aria-label="Previous"
                            @input="changePagination"
                            v-model="PRODUCTS.paging.currentPage"
                            :length="PRODUCTS.paging.pageCount"
                            :total-visible="10"
                    />
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
                    this.resetSkeletonStyle();
                    this.skeletonLoader.loading = false;
                });

        },
        computed: {
            ...mapGetters([
                'PRODUCTS',
                'SUGGEST_PRODUCTS'
            ]),
            PRICE_SLIDER: {
                get() {
                    return [this.$store.state.products.products.sliders[0].minRange, this.$store.state.products.products.sliders[0].maxRange]
                },
                set(value) {
                    this.priceSliderValue = value;
                }
            },
            categoryTreeItems() {
                const facets = {...this.$store.state.products.products.facets[4]};

                const treeViewObject = [];
                treeViewObject.push({
                    children: facets['values'].map((val) => {
                        return {
                            name: `${val.value} (${val.count})`,
                            filter: val.filter,
                        }
                    })
                });
                return treeViewObject;
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
            },
            filterSelected: [],
            skeletonLoader: {
                loading: true,
                transition: 'scale-transition',
                style: {
                    'marginTop': `${60}px`
                }
            },
        }),
        watch: {
            'autosuggest.search': function (val) {
                val && val && this.getSuggestProducts(val)
            },
            'filterSelected': function (val) {
                console.log('valueeeeee', val);
            }
        },
        methods: {
            searchQueryFormSubmit() {
                if (!this.form.query) {
                    return;
                }
                this.productDependencies.q = this.form.query;
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
                    .then(() => {
                        this.resetProductDependencies();
                        this.$refs.combobox.isMenuActive = false;
                    })
            },
            getSuggestProducts(query) {
                if (!query) {
                    return;
                }

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
            changeSlider({id, name}) {
                this.setSliderValues(id, name, this.priceSliderValue);
            },
            setSlidersInFirstTouch() {
                this.priceSliderValue = [...this.PRICE_SLIDER];
            },
            setSliderValues(id, name, sliderValues) {
                if (this.productDependencies.searchFilters.length <= 0) {
                    this.addNewSliderValue(id, name, sliderValues);
                    return;
                }

                if (this.checkIfSliderValueIsAlreadyExist(id, sliderValues)) {
                    this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
                    return;
                }

                this.addNewSliderValue(id, name, sliderValues);
            },
            addNewSliderValue(id, name, sliderValues) {
                this.productDependencies.searchFilters.push({
                    "filterType": "range",
                    "id": id,
                    name: name,
                    "minValue": parseFloat(sliderValues[0]),
                    "maxValue": parseFloat(sliderValues[1])
                });
                console.log('this.productDependencies.searchFilters', this.productDependencies.searchFilters);
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
            },
            checkIfSliderValueIsAlreadyExist(id, sliderValues) {
                let filterAvailableStatus = false;
                this.productDependencies.searchFilters
                    .map((val, index) => {
                        if (val.filterType === "range" && val.id === id) {
                            this.setSliderValueIfIsAlreadyExist(index, sliderValues);
                            filterAvailableStatus = true;
                        }
                    });
                return filterAvailableStatus;
            },
            setSliderValueIfIsAlreadyExist(index, sliderValues) {
                this.productDependencies.searchFilters[index]['minValue'] = sliderValues[0];
                this.productDependencies.searchFilters[index]['maxValue'] = sliderValues[1];
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
                let filterAvailableStatus = false;
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
                    "name": filterValue.name,
                    "id": filterValue.id,
                    "values": [filterValue.value]
                });
                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
            },
            deleteSelectedFiltersValues({filterType, filterIndex, selectValueIndex, id}) {
                try {

                    if (filterType && filterType === 'range') {
                        this.productDependencies.searchFilters.splice(filterIndex, 1);
                        return;
                    }

                    this.productDependencies.searchFilters
                        .map((filter, index) => {
                            if (filter.id === id) {
                                const searchFiltersArrayLength = this.productDependencies.searchFilters[index]['values'].length;
                                if (searchFiltersArrayLength <= 1) {
                                    this.productDependencies.searchFilters.splice(filterIndex, 1);
                                } else {
                                    this.productDependencies.searchFilters[index]['values'].splice(selectValueIndex, 1)
                                }
                            }
                        });

                    this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);

                } catch (e) {
                    this.$store
                        .dispatch('SHOW_NOTIFICATION',
                            {
                                time: 3000,
                                content: 'Error with deleting filters. Please try again later',
                                color: 'error'
                            });
                    throw new Error(e);
                }
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
                    "q": this.form.query || '*',
                    "searchFilters": [],
                    "sort": {
                        "sort": ""
                    },
                    "sliders": []
                };

                this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', defaultProductDependencies)
                    .then(() => {
                        this.productDependencies = {
                            ...defaultProductDependencies
                        };
                        this.setSlidersInFirstTouch();
                    })


            },
            resetSkeletonStyle() {
                this.skeletonLoader.style = '';
            }
        }
    }
</script>

<style scoped type="scss">
    ul li {
        display: inline;
    }

    .products-card {
        min-height: 90vh;
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
