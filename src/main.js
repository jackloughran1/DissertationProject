// Vue and App related imports
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store.js';

// Bootstrap and related libraries
import 'jquery'
import  'popper.js'
import 'bootstrap/dist/js/bootstrap.min.js';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

// Firebase
import { initializeApp } from 'firebase/app';

// FontAwesome (if you are using it)
import '@fortawesome/fontawesome-free/css/all.css';

// Other CSS imports (organize them as needed)
import "@/assets/bootstrap/css/styles3.css";
import '@/css/bootstrap.css';
import '@/css/styles.css';
import '@/css/otherCss.css';


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

// Create the app instance
const app = createApp(App);

// Initialize authentication before mounting the app
store.dispatch('initializeAuth').then(() => {
  // Mount the app and start the router/store
  app
    .use(router)
    .use(store)
    .use(vuetify)
    .mount('#app');
});