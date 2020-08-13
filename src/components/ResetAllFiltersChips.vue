<template>
    <v-chip
            class="mt-3 reset-all-filters-chips"
            color="teal"
            text-color="white"
            @click="resetAllFiltersChips"
    >
        Reset All Filters
        <v-icon right>
            mdi-close
        </v-icon>
    </v-chip>
</template>

<script>
    export default {
        name: "ResetAllFiltersChips",
        methods: {
            resetAllFiltersChips() {
                this.$emit('resetAllFiltersChips')
            }
        }

    }
</script>

<style scoped>
    .reset-all-filters-chips {
        margin-left: 15px;
    }

    @media (max-width: 1000px) {
        .reset-all-filters-chips {
            margin: 0;
        }
    }
</style>
