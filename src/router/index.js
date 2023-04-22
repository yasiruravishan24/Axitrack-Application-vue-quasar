import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from "../configs/firebase/index"
import routes from './routes'


export default route(function (/* { store, ssrContext } */) {

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory()
  })


  Router.beforeEach(async (to, from) => {

    const user = await getCurrentUser()

    if (to.meta.requiresAuth && !user) {
      return { name: 'login' };
    }

    if (user && (to.name == 'register' || to.name == 'login')) {
      return { name: 'home' };
    }

  })

  Router.afterEach((to, from) => {

  })

  return Router
})
