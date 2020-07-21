<template>
    <div class="dashboard">
        <v-app>
            <v-navigation-drawer
                    v-model="drawer"
                    app
            >
                <v-list dense>
                    <v-list-item
                            v-for="(item, i) in list"
                            :key="i"
                            :style="{
                                backgroundColor: $route.name === item.name ? '#eeeeee' : 'white'
                            }"
                            link
                            @click="$router.push({name:item.name})">
                        <v-list-item-action>
                            <v-icon>{{item.icon}}</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{item.name}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-app-bar
                    app
                    color="grey lighten-5"
                    dark
                    height="50"
            >
                <v-app-bar-nav-icon
                        color="primary"
                        @click="changeDrawer"/>
                <v-avatar
                        size="100"
                >
                    <v-img
                            contain
                            src="../../../public/img/logo.png"
                    ></v-img>
                </v-avatar>
                <v-spacer/>
            </v-app-bar>
            <v-content>
                <router-view class="ma-5"/>
            </v-content>
            <NotificationSnackbar/>
            <Footer/>
        </v-app>
    </div>
</template>

<script>
    import Footer from "../../components/Footer";
    import {toolsListConstants} from '../../constants/toolsListConstants';
    import NotificationSnackbar from "../../components/NotificationSnackbar";


    export default {
        name: 'Dashboard',
        components: {NotificationSnackbar, Footer},
        data: () => ({
            drawer: false,
            list: toolsListConstants
        }),
        methods: {
            changeDrawer() {
                this.drawer = !this.drawer;
            },
        },
    }
</script>
