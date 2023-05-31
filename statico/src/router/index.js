import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    //LOGIN ROUTES

    {
      path: '/login',
      name: 'LogIn',
      component: () => import('../components/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/Register.vue')
    },

    //HOME PAGE ROUTES

    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/gruppi',
      name: 'gruppi',
      component: () => import('../views/GroupsView.vue')
    },
    {
      path: '/personaggi',
      name: 'personaggi',
      component: () => import('../views/CharactersView.vue')
    },
    
    //CHARACTER ROUTES

    {
        path: '/personaggi/crea',
        name: 'personaggiCrea',
        component: () => import('../components/CharactersComponents/CreateCharacter.vue')
    },
    {
        path: '/personaggi/mostra',
        name: 'personaggiMostra',
        component: () => import('../components/CharactersComponents/MyCharacters.vue')
    },

    //GROUPS ROUTES

    {
        path: '/gruppi/crea',
        name: 'gruppiCrea',
        component: () => import('../components/GroupsComponents/CreateGroup.vue')
    },
    {
        path: '/gruppi/cerca',
        name: 'gruppiCerca',
        component: () => import('../components/GroupsComponents/FindGroup.vue')
    },
    {
        path: '/gruppi/modifica',
        name: 'gruppiModifica',
        component: () => import('../components/GroupsComponents/ModifyGroup.vue')
    },
    {
        path: '/gruppi/mostraTutti',
        name: 'gruppiMostraTutti',
        component: () => import('../components/GroupsComponents/ShowAllGroups.vue')
    },
    {
        path: '/gruppi/mostraMiei',
        name: 'gruppiMostraMiei',
        component: () => import('../components/GroupsComponents/MyGroups.vue')
    }
  ]
})

export default router
