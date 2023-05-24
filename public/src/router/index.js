import { createRouter, createWebHistory } from 'vue-router'
import accueilView from '../views/AccueilView.vue'
import connexionView from '../views/ConnexionView.vue'
import inscriptionView from '../views/InscriptionView.vue'
import tableauView from '../views/TableauView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: accueilView,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) {
          next()
        } else {
          alert('Vous devez être connecté pour accéder à cette page')
          next('/connexion')
        }
      }
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: connexionView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: inscriptionView
    },
    {
      path: '/tableaux/:id',
      name: 'tableau',
      component: tableauView,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('token')) {
          next()
        } else {
          alert('Vous devez être connecté pour accéder à cette page')
          next('/connexion')
        }
      }
    },
    {
      //403
      path: '/403',
      name: '403',
      component: () => import('../views/403.vue')
    },
    {
      // catch all 404 - define at the very end
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
