import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import SignUpView from '@/views/SignUpView.vue';
import LoginView from '@/views/LoginView.vue';
import SchedularView from '@/views/SchedularView.vue';
import UnauthorizedView from '@/views/UnauthorizedView';
import UsersCrud from '@/views/UsersCrud';
import EventsCrud from '@/views/EventsCrud';
import GroupsCrud from '@/views/GroupsCrud';
import CarPool from '@/views/CarPoolView';
import { getAuth } from 'firebase/auth';
import store from '../store/store.js'


// requires auth in route
function requiresAuth(to, from, next){
  const auth = getAuth();
  const user = auth.currentUser;
  
    if (user){
      next();
    } else {
      next('/login')
    }
}


const routes = [
  {
    path: '/',
    name: 'DashboardView',
    component: DashboardView,
    meta: {requiresAuth:true}, 
    beforeEnter: requiresAuth
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/schedular',
    name: 'schedular',
    component : SchedularView,
    meta: {requiresManager: true}, 
    
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: UnauthorizedView,
  },
  {
    path: '/userscrud',
    name: 'UsersCrud',
    component:  UsersCrud,
    meta: {requiresAuth:true}, 
    beforeEnter: requiresAuth,
  },
  {
    path: '/eventscrud',
    name: 'eventsCrud',
    component: EventsCrud,
    meta: {requiresAuth:true}, 
    beforeEnter: requiresAuth
  },
  {
    path: '/groupscrud',
    name: 'groupsCrud',
    component: GroupsCrud,
    meta: {requiresAuth:true}, 
    beforeEnter: requiresAuth
  },
  {
    path: '/carpool',
    name: 'carPool',
    component: CarPool,
    meta: {requiresAuth:true}, 
    beforeEnter: requiresAuth
  
  }
  
];

const router = createRouter({
  history: createWebHistory('/DissertationProject'),
  routes,
});

// route guard
router.beforeEach(async (to, from, next)=>{
  
  const authToken = store.state.authToken;

  if (!authToken && to.meta.requiresAuth) {
    next('/login');
    return;
  }
    
   await store.dispatch('fetchUserData');
    const userRole = store.state.userData.userRole

    if (to.meta.requiresManager && userRole!=='manager'){
      next('/unauthorized')
    } else {
      next();
    }
  });




export default router;
