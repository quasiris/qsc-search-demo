<template>
    <v-footer
            color="primary lighten-2"
            padless
    >
        <v-row
                justify="center"
                no-gutters
        >
            <v-btn
                    color="primary"
                    text
                    rounded
                    class="my-2"
            >
                <a  target="_blank" href="https://www.quasiris.de/de/impressum/">
                    Impressum
                </a>
            </v-btn>
            <v-btn
                    color="primary"
                    text
                    rounded
                    class="my-2"
            >
                <a target="_blank" href="https://www.quasiris.de/de/datenschutz/">
                    Datenschutz
                </a>
            </v-btn>
        </v-row>
    </v-footer>
</template>

<script>
    export default {
        name:'Footer'
    }
</script>
