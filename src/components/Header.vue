<template>
    <div>
        <v-app-bar
                app
                color="grey lighten-5"
                height="50"
        >
            <v-avatar
                    size="100"
            >
                <v-img
                        contain
                        src="../../public/img/logo.png"
                ></v-img>
            </v-avatar>
            <v-spacer></v-spacer>
        </v-app-bar>
    </div>
</template>

<script>
    export default {
        name:'Header'
    }
</script>
