import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);


const vuetify = new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#2f3033',
                secondary: '#fcfcfc',
                accent: '#eeeeee',
                error: '#b71c1c',
            },
        },
    },
});


export default new Vuetify({
    vuetify
});
