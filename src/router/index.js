import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/es5/services/goto'

Vue.use(VueRouter);

/* Views */
import Dashboard from "../views/dashboard/Dashboard";
import Movies from "../views/dashboard/Movies";
import Products from "../views/dashboard/Products";

const  scrollBehavior =  (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
    scrollTo = to.hash
} else if (savedPosition) {
    scrollTo = savedPosition.y
}

return goTo(scrollTo)
};

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        children: [
            {
                path: '/movies',
                name: 'Movies',
                component: Movies,
            },
            {
                path: '/products',
                name: 'Products',
                component: Products,
            }

        ]

    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior
});

export default router
