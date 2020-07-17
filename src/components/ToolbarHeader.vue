<template>
    <v-toolbar dark color="grey lighten-5">
        <v-toolbar-title class="font-weight-light card-title">
            {{name}}
        </v-toolbar-title>
        <v-spacer/>
        <BasicCloseIcon/>
    </v-toolbar>
</template>

<script>
    import BasicCloseIcon from "./BasicCloseIcon";
    export default {
        components: {BasicCloseIcon},
        props:{
            name: {
                required: true,
                type: String
            }
        },
        name: "ToolbarHeader"
    }
</script>

<style scoped>

</style>
