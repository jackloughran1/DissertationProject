import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import SignUpView from '@/views/SignUpView.vue';
import LoginView from '@/views/LoginView.vue';
import SchedularView from '@/views/SchedularView.vue';
import UnauthorizedView from '@/views/UnauthorizedView';
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
    name: 'Dashboard',
    component: DashboardView,
    meta: {requiresAuth:true}, 
    beforeEnter: requiresAuth
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
  },
  {
    path: '/login',
    name: 'Login',
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
    component: UnauthorizedView
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

    console.log(userRole)

    if (to.meta.requiresManager && userRole!=='manager'){
      next('/unauthorized')
    } else {
      next();
    }
  });




export default router;
