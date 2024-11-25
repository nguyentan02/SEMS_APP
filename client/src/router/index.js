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
                path: 'device',
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
                path: 'test',
                name: 'test',
                component: () => import('../components/manageDevice/device/Test.vue'),
                meta: { title: 'Danh sách thiết bị' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: 'chat',
                name: 'chat-home',
                component: () => import('../views/ChatView.vue'),
                meta: { title: 'Nhắn tin' },
                
            },
            {
                path: 'profile/:id',
                name: 'home1-profile',
                component: () => import('../components/common/ProfileView.vue'),
                meta: { title: 'Thông tin cá nhân' },
                beforeEnter: async (to, from, next) => {
                    const userStore = useUserStore()
                    await  userStore.getMe()
                    if (!userStore.user?.id) next('login')
                    else next()
                },
            },
            {
                path: '/device/:id',
                name: 'detailDeivce',
                component: () => import('../components/manageDevice/device/EditDevice.vue'),
              
                meta: { title: 'Thông tin thiết bị' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: 'usage',
                name: 'usage',
                props:true,
                component: () => import('../components/manageDevice/usage/ManageUsage.vue'),
                meta: { title: 'Quản lí sử dụng' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/usageroom/:id',
                name: 'detailUsage',
                component: () => import('../components/manageDevice/usage/DetailUsageRoom.vue'),
                meta: { title: 'Danh sách thiết bị sử dụng' },
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
                path: '/maintenance',
                name: 'maintenance',
                component: () => import('../components/maintenance/MaintenanceManage.vue'),
                props: true,
                meta: { title: 'Bảo trì' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/maintenance/new',
                name: 'newmaintenance',
                component: () => import('../components/maintenance/NewMaintanceManage.vue'),
                props: true,
                meta: { title: 'Bảo trì' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/maintenance/:id',
                name: 'editmaintenance',
                component: () => import('../components/maintenance/EditMaintenance.vue'),
                meta: { title: '{d}' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token === null)  next('login')
                    else next()
                },
            },
            {
                path: '/transfer',
                name: 'transfer',
                component: () => import('../components/manageDevice/transfer/RotationDevice.vue'),
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
    },
    {
        path: '/forgotpassword',
        name: 'forgotpassword',
        component: () => import('../components/common/ForgotPassword.vue'),
        meta: { title: 'Quên mật khẩu' },
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
                name: 'manage-profile',
                component: () => import('../components/common/ProfileViewAdmin.vue'),
                meta: { title: 'Thông tin cá nhân' },
                // beforeEnter: async (to, from, next) => {
                //     const userStore = useUserStore()
                //     await  userStore.getMe()
                //     if (!userStore.user?.id) next('login')
                //     else next()
                // },
            },
            {
                path: 'chat',
                name: 'chat-view',
                component: () => import('../views/ChatView.vue'),
                meta: { title: 'Nhắn tin' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token == null)  next('login')
                    else next()
                },
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
    },
    {
        path: '/techno',
        name: 'techno',
        component: () => import('../views/TechView.vue'),
        meta: { title: 'Quản lý' },
        // beforeEnter: async (to, from, next) => {
        //     const userStore = useUserStore()
        //     await  userStore.getMe()
        //     if (userStore.user?.role !== 2) next('login')
        //     else next()
        // },
        children:[
            {
                path: '/profile/:id',
                name: 'home-profile',
                component: () => import('../components/common/ProfileView.vue'),
                meta: { title: 'Thông tin cá nhân' },
                beforeEnter: async (to, from, next) => {
                    const userStore = useUserStore()
                    await  userStore.getMe()
                    if (!userStore.user?.id) next('login')
                    else next()
                },
            },
            {
                path: 'chat',
                name: 'chat',
                component: () => import('../views/ChatView.vue'),
                meta: { title: 'Nhắn tin' },
            },
            {
                path: '/calendar',
                name: 'calendar',
                component: () => import('../components/maintenance/techno/CalendarMaintance.vue'),
                meta: { title: 'Lịch bảo trì' },
                beforeEnter: async (to, from, next) => {
                    const authStore = useAuthStore()
                    if (authStore.token == null)  next('login')
                    else next()
                },
            },
            {
                path: '/viewmaintenance',
                name: 'view-maintenance',
                component: () => import('../components/maintenance/techno/MaintenaceView.vue'),
                meta: { title: 'Yêu cầu bảo trì' },
                beforeEnter: async (to, from, next) => {
                    const userStore = useUserStore()
                    await  userStore.getMe()
                    if (!userStore.user?.id) next('login')
                    else next()
                },
            },
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