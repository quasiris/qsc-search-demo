<template>
    <v-btn
            :disabled="!formOptions.valid"
            type="submit"
            color="teal darken-3"
            text-color="white"
            class="search-button mt-3 w-100"
    >
        Search
    </v-btn>
</template>

<script>
    export default {
        name: "SearchButton",
        props: {
            formOptions: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style scoped type="text/css">
    .search-button{
        color: white;
    }
</style>
