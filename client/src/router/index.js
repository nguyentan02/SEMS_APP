import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.store'
import { useAuthStore } from '@/stores/auth.store'
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { title: 'Quản lý thiết bị' },
        beforeEnter: async (to, from, next) => {
            const userStore = useUserStore()
            await  userStore.getMe()
            if (userStore.user?.role !== 1) next('manage')
            else next()
        },
        children: [
            {
                path: '/device',
                name: 'device',
                component: () => import('../components/manageDevice/device/DeviceManage.vue'),
                meta: { title: 'Danh sách thiết bị' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/device/:id',
                name: 'detailDeivce',
                component: () => import('../components/manageDevice/device/EditDevice.vue'),
                props: true,
                meta: { title: 'Thông tin device' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/device/import',
                name: 'import',
                component: () => import('../components/manageDevice/device/AddExcelDevice.vue'),
                props: true,
                meta: { title: 'Nhập một tệp' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/transfer',
                name: 'transfer',
                component: () => import('../components/manageDevice/transfer/test.vue'),
                meta: { title: 'Thông tin cá nhân' },
         
            },

        ]
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
            await  userStore.getMe()
            if (userStore.user?.role !== 0) next('login')
            else next()
        },
        children: [
            {
                path: '/profile/:id',
                name: 'profile',
                component: () => import('../components/common/ProfileView.vue'),
                meta: { title: 'Thông tin cá nhân' },
                // beforeEnter: async (to, from, next) => {
                //     const userStore = useUserStore()
                //     await  userStore.getMe()
                //     if (!userStore.user?.id) next('login')
                //     else next()
                // },
            },
            {
                path: 'users',
                name: 'user-manage',
        meta: { title: 'Quản lý thành viên' },
                component: () => import('../components/manage/user/Usermanage.vue'),
            },
            {
                path: 'dashboard',
                name: 'dashboard-manage',
        meta: { title: 'Thống kê' },
                component: () => import('../components/manage/dashboardmanage/DashboardManage.vue'),
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