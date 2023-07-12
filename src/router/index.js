import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import SignUpView from '@/views/SignUpView.vue';
import LoginView from '@/views/LoginView.vue';
import SchedularView from '@/views/SchedularView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth';


function requiresAuth(to, from, next){
  const auth = getAuth();
  onAuthStateChanged(auth, (user)=>{
    if (user){
      next();
    } else {
      next('/login')
    }
  })
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
    beforeEnter: requiresAuth
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});




export default router;
