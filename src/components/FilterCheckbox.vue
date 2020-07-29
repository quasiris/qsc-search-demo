<template>
    <div class="filter-checkbox">
        <form v-for="(filter, i) in filterValues"
              :key="i">
            <input type="checkbox"
                   class="filter-checkbox_input"
                   @change="filterCheckboxChange(filter.value)"
                   :value="filter.value"
                   v-model="selected">
            <label class="filter-checkbox_label">
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
            filterCheckboxChange(value) {
                this.$emit('filterCheckboxChange', {
                    value: value,
                    id: this.filterId,
                    selected: this.selected
                });
            }
        }
    }
</script>

<style scoped>
    .filter-checkbox input {
        margin-right: 15px;
    }
</style>
