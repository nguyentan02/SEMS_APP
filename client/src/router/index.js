import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.store'

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Trang Chủ' },
        beforeEnter: async (to, from, next) => {
            const userStore = useUserStore()
            userStore.getMe()
            if (!userStore.user?.id) next('login')
            if (userStore.user?.role == 0) next('manage')
            else next()
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { title: 'Đăng Nhập' },
        // beforeEnter: (to, from, next) => {
        //     const userStore = useUserStore()
        //     if ()
        // }
    }
    , 
    {
        path: '/manage',
        name: 'manage',
        component: () => import('../views/ManageView.vue'),
        meta: { title: 'Quản lý' },
        beforeEnter: async (to, from, next) => {
            const userStore = useUserStore()
            userStore.getMe()
            if (userStore.user?.role != 0) next('home')
            else next()
        },
        children: [
            {
                path: '/profile/:id',
                name: 'profile',
                component: () => import('../components/common/ProfileView.vue'),
                meta: { title: 'Thông tin cá nhân' },
                beforeEnter: async (to, from, next) => {
                    const userStore = useUserStore()
                    userStore.getMe()
                    if (!userStore.user?.id) next('login')
                    else next()
                },
            },
            {
                path: 'users',
                name: 'user-manager',
        meta: { title: 'Quản lý thành viên' },
                component: () => import('../components/manage/user/Usermanage.vue'),
            },
            {
                path: 'category',
                name: 'category-manage',
                 meta: { title: 'Quản lý danh muc' },
                component: () => import('../components/manage/category/ManageCategory.vue'),
            },
            {
                path: 'location',
                name: 'location-manage',
                 meta: { title: 'Quản lý danh muc' },
                component: () => import('../components/manage/location/ManageLocation.vue'),
            }
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});


export default router