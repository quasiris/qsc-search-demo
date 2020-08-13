<template>
    <v-chip
            class="mt-3"
            color="teal"
            text-color="white"
            @click="resetAllFiltersChips"
    >
        Reset All Filters1
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

</style>
