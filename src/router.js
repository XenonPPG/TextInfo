import {createWebHistory, createRouter} from 'vue-router'
import SimpleAnalysis from "@/views/SimpleAnalysis/SimpleAnalysis.vue";

const routes = [
    {
        path: '/',
        name: 'Analysis',
        component: SimpleAnalysis
    },
    {
        path: '/tools',
        name: 'Tools',
        component: () => import('@/views/Tools/Tools.vue')
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