import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/sessions',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '',
        component: () => import('pages/Index.vue'),
        children: [
          { path: '', component: () => import('components/SessionDefault.vue') },
          { path: 'new', component: () => import('components/NewMeeting.vue') },
          { path: ':id', component: () => import('components/Meeting.vue') }
        ]
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Welcome.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
