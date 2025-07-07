import {createWebHistory, createRouter} from 'vue-router'
import SimpleAnalysis from "@/views/SimpleAnalysis.vue";

const routes = [
    {
        path: '/',
        name: 'Simple',
        component: SimpleAnalysis
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;