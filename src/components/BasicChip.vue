<template>
    <v-chip
            class="mt-3"
            color="teal darken-3"
            text-color="white"
            @click="handleDeleteSelectedFiltersChip({
                                                       filterType: filterType,
                                                       filterIndex: filterIndex,
                                                       selectedValueIndex: filterSelectedValueIndex,
                                                       id: filterId })"
    >
        {{filterName}}: {{filterValue}} ({{filterCount}})
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
            filterSelectedValueIndex: {
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
            filterValue: {
                type: String,
                required: true,
            },
            filterCount: {
                type: Number,
                required: true
            },
        },
        name: "BasicChip",
        methods: {
            handleDeleteSelectedFiltersChip(filter) {
                this.$emit('handleDeleteSelectedFiltersChip', filter);
            }
        }
    }
</script>

<style scoped>

</style>
