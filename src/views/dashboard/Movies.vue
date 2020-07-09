<template>
    <v-card class="base-64-encoder tools-view-card">
        <v-toolbar dark color="grey lighten-5">
            <v-toolbar-title class="font-weight-light card-title">
                Movies
            </v-toolbar-title>
            <v-spacer/>
            <v-icon color="primary"
                    @click="$router.push({name:'Dashboard'})">
                mdi-close
            </v-icon>
        </v-toolbar>
        <v-container>
            <section class="ma-5">
                <article class="movies-search-query ma-5">
                    eeee

                </article>
                <article class="movies-list">
                    <v-row no-gutters>
                        <v-col v-for="(movie, index) in MOVIES" :key="index" class="grid">
                            <v-card
                                    class="movies-list_card ma-5"
                            >
                                <v-img
                                        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                                        height="200px"
                                ></v-img>
                                <v-card-title>
                                    {{movie.id}}
                                </v-card-title>
                                <v-card-subtitle>
                                    1,000 miles of wonder
                                </v-card-subtitle>
                            </v-card>
                        </v-col>
                    </v-row>
                </article>
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
                'MOVIES',
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
