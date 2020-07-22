<template>
    <div>
        <v-checkbox
                @change="filterCheckboxChange"
                dense
                :label="`${filterValue.value} (${filterValue.count})`"
                :value="filterValue.value"/>
    </div>
</template>


<script>
    export default {
        name: "FilterCheckbox",
        props: {
            filterValue: {
                type: Object,
                required: true
            },
            filterCount: {
                type: Number,
                required: true
            },
            filterId: {
                type: String,
                required: true
            }
        },
        methods: {
            filterCheckboxChange(value) {
                console.log('valueeeee', value);
                this.$emit('filterCheckboxChange', {
                    value: value,
                    id: this.filterId
                });
            }
        }
    }
</script>

<style scoped>
    .filter-checkbox {
        max-height: 30px;
    }
</style>
