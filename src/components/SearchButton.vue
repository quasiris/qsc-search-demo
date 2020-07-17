<template>
    <v-btn
            :disabled="!formOptions.valid"
            type="submit"
            color="primary"
            class="mt-3 w-100"
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
