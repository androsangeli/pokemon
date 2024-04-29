import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Pokemon from '@/components/Pokemon.vue'
import PokemonDetails from '@/components/PokemonDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Pokemon,
      meta: { 
        title: 'Pokemon'
      }
    },
    { 
      path: '/pokemon/:name',
      name: 'PokemonDetails',
      component: PokemonDetails,
      meta: { 
        title: 'Pokemon Details'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
