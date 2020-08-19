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
                    color="teal darken-3"
                    ref="combobox"
                    @input="searchQueryFormSubmit"
                    v-on:keyup.enter="searchQueryFormSubmit"
                    hide-no-data
                    label="Search Query"
                />
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
                  <v-expansion-panel-header>{{ filter.name }}</v-expansion-panel-header>
                  <v-expansion-panel-content v-if="filter.id === 'category'">
                    <!--<v-treeview :items="categoryTreeItems" open-all>
                    </v-treeview>-->
                  </v-expansion-panel-content>
                  <v-expansion-panel-content v-else>
                    <form v-for="(filterValue, i) in filter.values"
                          class="filter-checkbox"
                          :key="i">
                      <label>
                        <input type="checkbox"
                               :class="`filter-checkbox_input_${filter.id.toLowerCase()}`"
                               :id="`filter-checkbox_input_${filterValue.value.toLowerCase()}`"
                               :value="filterValue.value"
                               @change="handleFilterCheckboxChange(filterValue, filter)"
                               v-model="filter.selected"/>
                      </label>
                      <label :for="`filter-checkbox_input_${filterValue.value.toLowerCase()}`"
                             :class="`filter-checkbox_label_${filter.id.toLowerCase()}`">
                        {{ filterValue.value }} ({{ filterValue.count }})
                      </label>
                    </form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </article>
          </v-skeleton-loader>
          <article v-if="!skeletonLoader.loading">
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
                      color="teal darken-3"
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
                      color="teal darken-3"
                  />
                </v-col>
              </v-row>
              <v-range-slider
                  @change="changeSlider(sliderValue)"
                  v-model="PRICE_SLIDER"
                  color="teal darken-3"
                  :max="sliderValue.maxRange"
                  :min="sliderValue.minRange"
              />
            </div>
          </article>
        </aside>
        <article class="products-list">
          <p class="products-list_total font-weight-light"
             v-if="!skeletonLoader.loading">
            Total: {{ PRODUCTS.total }} elements
          </p>
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
          <article v-if="!skeletonLoader.loading" class="products-list_filter_chips">
            <ul>
              <template v-for="(select, filterIndex) in productDependencies.searchFilters">
                <li :key="filterIndex">
                  <ul v-if="select.filterType === 'range'" style="display: inline-block">
                    <template>
                      <BasicPriceChip
                          :key="filterIndex"
                          :filter-index="filterIndex"
                          :filter-type="select.filterType"
                          :filter-id="select.id"
                          :filter-name="select.name"
                          :filter-min-price="select.minValue"
                          :filter-max-price="select.maxValue"
                          :filter-count="select.count"
                          @handleDeleteSelectedFiltersChip="deleteSelectedFiltersValues"
                      />
                    </template>
                  </ul>
                  <ul v-else style="display: inline-block">
                    <template v-for="(value, valueIndex) in select.values">
                      <li :key="valueIndex">
                        <BasicChip
                            :key="valueIndex"
                            :filter-index="filterIndex"
                            :filter-selected-value-index="valueIndex"
                            :filter-type="null"
                            :filter-id="select.id"
                            :filter-name="select.name"
                            :filter-value="value"
                            :filter-count="select.count"
                            @handleDeleteSelectedFiltersChip="deleteSelectedFiltersValues"
                        />
                      </li>
                    </template>
                  </ul>
                </li>
              </template>
              <template v-if="productDependencies.searchFilters.length >= 1">
                <li>
                  <ResetAllFiltersChips
                      @handleResetAllFiltersChips="resetProductDependencies"/>
                </li>
              </template>
            </ul>
          </article>
          <article v-if="skeletonLoader.loading">
            <v-skeleton-loader
                :loading="skeletonLoader.loading"
                type="card"
                :transition="skeletonLoader.transition"
                :style="skeletonLoader.style"
            />
          </article>
          <article>
            <v-row class="products-list_products">
              <v-col v-for="(product, index) in PRODUCTS.documents"
                     :key="index"
                     class="grid">
                <BasicProductCard :item="product"/>
              </v-col>
            </v-row>
          </article>
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
import SearchButton from "../../components/SearchButton";
import ToolbarHeader from "../../components/ToolbarHeader";
import {productsConstants} from '@/constants/productsConstants';
import BasicProductCard from "../../components/BasicProductCard";
import ResetAllFiltersChips from "../../components/ResetAllFiltersChips";
import BasicChip from "../../components/BasicChip";
import BasicPriceChip from "../../components/BasicPriceChip";


const form = {
  query: ''
};

export default {
  name: "Products",
  components: {
    BasicPriceChip,
    BasicChip,
    ResetAllFiltersChips,
    BasicProductCard,
    ToolbarHeader,
    SearchButton
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
          this.setCategoryTree(this.$store.state.products.products.facets[4]);
        })
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
      /* const facets = {...this.$store.state.products.products.facets[4]};
       const treeViewObject = [];
       treeViewObject.push({
         children: facets['values'].map((val) => {
           return {
             name: `${val.value} (${val.count})`,
             filter: val.filter,
           }
         })
       });
       return treeViewObject;*/
      const facets = {...this.$store.state.products.products.facets[4]};
      this.setCategoryTree(facets);

      return null;
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
    chips: {
      isLast: false
    }
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
    /* TODO QSC-325 */
    setCategoryTree(filter) {

      if (filter.values.length <= 0) {
        return;
      }

      console.log('filter values: ', filter.values);
      for (let i = 0; i < filter.values.length; i++) {
        const children = filter.values[i]['children'];
        if (children) {
          children['values'].forEach((val) => {
            this.setCategoryTree(val.children);
          })
        }

      }

    },
    searchQueryFormSubmit() {
      if (!this.form.query) {
        return;
      }
      this.productDependencies.q = this.form.query;

      this.skeletonLoader.loading = true;
      this.$store.dispatch('RESET', {
        type: 'products'
      });

      this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
          .then(() => {
            this.resetProductDependencies();
            this.$refs.combobox.isMenuActive = false;
            this.skeletonLoader.loading = false;
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

      this.$store.dispatch('RESET', {
        type: 'products'
      });

      this.skeletonLoader.loading = true;
      this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
          .then(() => {
            this.skeletonLoader.loading = false;
          })
      this.$vuetify.goTo(0, {
        duration: 1300
      });
    },
    changeSort(sortValue) {
      this.productDependencies.sort.sort = sortValue;

      this.$store.dispatch('RESET', {
        type: 'products'
      });

      this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
    },
    changeSlider(slider) {
      this.setSliderValues(slider, this.priceSliderValue);
    },
    setSlidersInFirstTouch() {
      this.priceSliderValue = [...this.PRICE_SLIDER];
    },
    setSliderValues(slider, sliderValues) {
      if (this.productDependencies.searchFilters.length <= 0) {
        this.addNewSliderValue(slider, sliderValues);
        return;
      }
      if (this.checkIfSliderValueIsAlreadyExist(slider.id, sliderValues)) {
        this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies);
        return;
      }
      this.addNewSliderValue(slider, sliderValues);
    },
    addNewSliderValue(slider, sliderValues) {
      this.productDependencies.searchFilters.push({
        "filterType": "range",
        "id": slider.id,
        "name": slider.name,
        "count": slider.count,
        "minValue": parseFloat(sliderValues[0]),
        "maxValue": parseFloat(sliderValues[1])
      });

      this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
          .then((res) => {
            console.log('response: ', res);
          })
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
    handleFilterCheckboxChange(filterValue, filter) {
      const newFilter = {
        name: filter.name,
        id: filter.id,
        value: filterValue.value,
        count: filterValue.count,
        selected: filter.selected
      };

      this.setFilterValues(newFilter);
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
        "count": filterValue.count,
        "values": [filterValue.value]
      });

      this.$store.dispatch('RESET', {
        type: 'products'
      });

      this.skeletonLoader.loading = true;
      this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
          .then(() => {
            this.skeletonLoader.loading = false;
          })
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


        this.$store.dispatch('POST_PRODUCT_DEPENDENCIES', this.productDependencies)
            .then(() => {
              console.log('prodcttttt', this.productDependencies.searchFilters);
              if (this.productDependencies.searchFilters.length <= 0) {
                this.chips.isLast = true;
              }
            })

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

.filter-checkbox input {
  margin-right: 15px;
}

.filter-checkbox label:hover {
  cursor: pointer;
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

  .products-list_filter_chips ul {
    padding: 0;
  }


}
</style>
