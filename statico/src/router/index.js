import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //HOME PAGE ROUTES
    {
      path: '/',
      name: 'neutro',
      component: () => import('../views/nothing.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
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
