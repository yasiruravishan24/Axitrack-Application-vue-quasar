
const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthorizedLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/auth/HomePage.vue')
      },
      {
        path: '/vehicles',
        name: 'vehicles',
        component: () => import('src/pages/auth/VehiclesPage.vue')
      }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/DefaultLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('src/pages/UserLogin.vue')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('src/pages/UserRegister.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/DefaultLayout.vue'),
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '',
        component: () => import('pages/ErrorNotFound.vue')
      }
    ]
  }
]

export default routes
