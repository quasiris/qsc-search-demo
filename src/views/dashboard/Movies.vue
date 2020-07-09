<template>
    <v-card class="base-64-encoder tools-view-card">
        <v-toolbar dark color="grey lighten-5">
            <v-toolbar-title class="font-weight-light card-title">
                Base 64 Encode
            </v-toolbar-title>
            <v-spacer/>
            <v-icon color="primary"
                    @click="$router.push({name:'Tools'})">
                mdi-close
            </v-icon>
        </v-toolbar>
        <v-container>
            <section class="ma-5">
                test
            </section>
        </v-container>
    </v-card>
</template>
<script>
    import {mapGetters} from "vuex";

    export default {
        name: "Movies",
        computed: {
            ...mapGetters([
                'ENCODER',
            ]),
        },
        beforeMount() {
            this.$store.dispatch('GET_MOVIES');
        },
        created() {

        },
        data: () => ({}),
        methods: {}
    }
</script>

<style scoped>

</style>
