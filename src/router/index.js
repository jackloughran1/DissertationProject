import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import SignUpView from '@/views/SignUpView.vue';
import LoginView from '@/views/LoginView.vue';
import SchedularView from '@/views/SchedularView.vue'
import { getAuth } from 'firebase/auth';
import store from '../store/store.js'


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
    meta: {requiresAuth:true}, 
    
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next)=>{
  
  const authToken = store.state.authToken;

  if (!authToken && to.meta.requiresAuth) {
    next('/login');
  } else {
    next();
  }
  })




export default router;
