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
                    <v-form
                            v-model="formOptions.valid"
                            v-on:submit.prevent="formSubmit()"
                    >
                        <v-row justify="center">
                            <v-col cols="12"
                                   sm="12"
                                   md="6">
                                <v-text-field
                                        v-model="form.query"
                                        name="Query"
                                        :rules="formOptions.query"
                                        label="Search Movies"
                                />
                            </v-col>
                            <v-col cols="12"
                                   sm="12"
                                   md="2">
                                <v-btn
                                        :disabled="!formOptions.valid"
                                        type="submit"
                                        color="primary"
                                        class="mt-3 w-100"
                                >
                                    Search
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </article>
                <article class="movies-list">
                    <v-row no-gutters>
                        <v-col v-for="(movie, index) in MOVIES" :key="index" class="grid">
                            <v-card
                                    class="movies-list_card ma-5"
                            >
                                <v-img
                                        :src="movie.document.image"
                                        height="200px"
                                ></v-img>
                                <v-card-subtitle>
                                    {{movie.document.title}}
                                </v-card-subtitle>
                                <v-card-subtitle>
                                    {{movie.document.price}} $
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

    const form = {
        query: ''
    };


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
        data: () => ({
            form: Object.assign({}, form),
            formOptions: {
                valid: false,
                query: [
                    v => !!v || 'Query is required',
                ],
            }
        }),
        methods: {
            formSubmit() {
                console.log('query', this.form);
            }

        }
    }
</script>

<style scoped>

</style>
