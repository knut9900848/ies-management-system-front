import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/auth/login',
    component: () => import('pages/auth/UserLogin.vue'),
  },

  {
    path: '/admin/categories/:kinds',
    component: () => import('src/pages/admin/CategoryList.vue'),
  },

  {
    path: '/notices',
    name: 'notice.list',
    component: () => import('pages/NoticeList.vue'),
  },

  {
    path: '/users',
    name: 'user.list',
    component: () => import('pages/admin/UserList.vue'),
  },

  {
    path: '/companies',
    name: 'company.list',
    component: () => import('pages/CompanyList.vue'),
  },

  {
    path: '/user',
    name: 'user',
    component: () => import('pages/UserDetail.vue'),
  },

  {
    path: '/test',
    name: 'test',
    component: () => import('pages/TestPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
