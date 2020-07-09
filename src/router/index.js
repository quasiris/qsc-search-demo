import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

/* Views */
import Dashboard from "../views/dashboard/Dashboard";
import Movies from "../views/dashboard/Movies";
import Products from "../views/dashboard/Products";


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
    routes
});

export default router
