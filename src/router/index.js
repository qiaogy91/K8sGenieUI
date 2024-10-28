import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/backend/dashboard/DashboardView.vue'
import {beforeEachHandler, afterEchHandler} from '@/router/permission.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/backend/user/UserLogin.vue')
    },
    {
      // 路由嵌套本质就是模板嵌套，父路由是母版，`router-view` 为嵌入的子模板，通常定义一个默认显示页面 default
      name: 'backend',
      path: '/backend',
      meta: { auth: true, title: 'backend' },
      component: () => import('@/views/backend/LayoutView.vue'),
      children: [
        {
          name: 'dashboard',
          path: 'dashboard',
          meta: { auth: true, title: '用户管理' },
          component: () => import('@/views/backend/dashboard/DashboardView.vue')
        },
        {
          name: 'user',
          path: 'user',
          meta: { auth: true, title: '用户管理' },
          component: () => import('@/views/backend/user/UserList.vue')
        },
        {
          name: 'project',
          path: 'project',
          meta: { auth: true, title: '项目管理' },
          component: () => import('@/views/backend/rancher/ProjectView.vue')
        },
        {
          name: 'workload',
          path: 'workload',
          meta: { auth: true, title: '负载管理' },
          component: () => import('@/views/backend/k8s/WorkLoad.vue')
        },
        {
          name: 'router',
          path: 'router',
          meta: { auth: true, title: '路由管理' },
          component: () => import('@/views/backend/Router/RouterView.vue')
        },
        {
          name: 'clusterRecord',
          path: 'clusterRecord',
          meta: { auth: true, title: '项目管理' },
          component: () => import('@/views/backend/record/ClusterView.vue')
        },
        {
          name: 'namespaceRecord',
          path: 'namespaceRecord',
          meta: { auth: true, title: '项目管理' },
          component: () => import('@/views/backend/record/NamespaceView.vue')
        },
        {
          name: 'projectRecord',
          path: 'projectRecord',
          meta: { auth: true, title: '项目管理' },
          component: () => import('@/views/backend/record/ProjectView.vue')
        },
      ]
    },

    {
      name: 'PermissionDeny',
      path: '/errors/403',
      component: () => import('@/views/errors/PermissionDeny.vue')
    },
    {
      name: 'NotFound', // 404 一定要在最下面
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/errors/NotFound.vue')
    }
  ]
})
router.beforeEach(beforeEachHandler)
router.afterEach(afterEchHandler)
export default router
