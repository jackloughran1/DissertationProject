import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import { initializeApp} from 'firebase/app'
import 'firebase/auth'
import '@fortawesome/fontawesome-free/css/all.css'
import store from './store/store.js'


const firebaseConfig = {
    apiKey: "AIzaSyACibJGcsqELQUEk2U3lxjsJcPRxSc6jX8",
    authDomain: "dissertation-5d2f3.firebaseapp.com",
    projectId: "dissertation-5d2f3",
    storageBucket: "dissertation-5d2f3.appspot.com",
    messagingSenderId: "587022965445",
    appId: "1:587022965445:web:dd909c1d1c1fa8c05f2eac",
    measurementId: "G-79S2J6QXJT"
  };
  
  // Initialize Firebase
  initializeApp(firebaseConfig);

createApp(App)
.use(router)
.use(store)
.mount('#app')
