<template>
    <div class="filter-checkbox">
        <form v-for="(filter, i) in filterValues"
              :key="i">
            <input type="checkbox"
                   :class="`filter-checkbox_input_${filterId.toLowerCase()}`"
                   :id="`filter-checkbox_input_${filter.value.toLowerCase()}`"
                   @change="handleFilterCheckboxChange(filter.value)"
                   :value="filter.value"
                   v-model="selected"/>
            <label
                    :for="`filter-checkbox_input_${filter.value.toLowerCase()}`"
                    :class="`filter-checkbox_label_${filterId.toLowerCase()}`">
                {{filter.value}} ({{filter.count}})
            </label>
        </form>
    </div>
</template>
<script>
    export default {
        name: "FilterCheckbox",
        props: {
            filterValues: {
                type: Array,
                required: true
            },
            filterId: {
                type: String,
                required: true
            }
        },
        data: () => (
            {
                selected: []
            }
        ),
        computed: {},
        watch: {},
        methods: {
            handleFilterCheckboxChange(value) {
                this.$emit('filterCheckboxChange', {
                    value: value,
                    id: this.filterId,
                    selected: this.selected
                });
            },
        }
    }
</script>

<style scoped>
    .filter-checkbox input {
        margin-right: 15px;
    }

    .filter-checkbox label:hover {
        cursor: pointer;
    }
</style>
