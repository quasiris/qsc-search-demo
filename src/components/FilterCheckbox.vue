<template>
    <div>
     <v-checkbox
                dense
                :label="filterValue.name"
                :value="filterValue.filter"/>

    </div>
</template>


<script>
    export default {
        name: "FilterCheckbox",
        props: {
            filterValue: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style scoped>
    .filter-checkbox{
        max-height: 30px;
    }
</style>
