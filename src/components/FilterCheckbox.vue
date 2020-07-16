<template>
    <div>
        <v-checkbox
                :label="filterValue.name"
                :value="filterValue.filter"/>
    </div>
</template>


<script>
    export default {
        name: "FilterCheckbox",
        props: {
            filterValue: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>
