<template>
    <div>
        <v-checkbox
                @change="filterCheckboxChange(filterValue.value)"
                dense
                v-model="selected"
                :label="`${filterValue.value} (${filterValue.count})`"
                :value="filterValue.value"/>

      <!--  <pre>
            {{filterValue}}
        </pre>-->
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
        watch:{
            selected(val){
                console.log('val', val);
            }
        },
        methods: {
            filterCheckboxChange(value) {
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
