<template>
    <v-chip
            class="mt-3"
            color="teal darken-3"
            text-color="white"
            @click="handleDeleteSelectedFiltersChip({
                                                       filterType: filterType,
                                                       filterIndex: filterIndex,
                                                       selectedValueIndex: null,
                                                       id: filterId })"
    >
        {{filterName}}: {{filterMinPrice| price}} - {{filterMaxPrice | price}} ({{filterCount}})
        <v-icon right>
            mdi-close
        </v-icon>
    </v-chip>
</template>

<script>
    export default {
        props: {
            filterIndex: {
                type: Number,
                required: true
            },
            filterType: {
                required: true
            },
            filterId: {
                type: String,
                required: true
            },
            filterName: {
                type: String,
                required: true
            },
            filterMinPrice: {
                type: Number,
                required: true,
            },
            filterMaxPrice: {
                type: Number,
                required: true
            },
            filterCount: {
                type: Number,
                required: true
            },
        },
        name: "BasicPriceChip",
        methods: {
            handleDeleteSelectedFiltersChip(filter) {
                this.$emit('handleDeleteSelectedFiltersChip', filter);
            }
        }
    }
</script>

<style scoped>

</style>
