import { createStore } from 'vuex'
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

// defining state of userData and auth token, auth token used for persistence
const store = createStore({
  state: {
    userData: {
      firstName: '',
      lastName: '',
      isManager: false,
      
    },
    authToken: '',
  },
  getters: {
    authToken: (state) => state.authToken
  },
  mutations: {
    setUserData(state, userData) {
      
      state.userData = userData;
    },
    setAuthToken(state, authToken){
      state.authToken=authToken;
    }
    
  },
  actions: {

// userData method
async fetchUserData({ commit }) {
  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser.uid;
  const userCollection = collection(db, 'users');
  const userDocRef = doc(userCollection, currentUser);

  try {
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      const user = snapshot.data();
      commit('setUserData', {
        firstName: user.firstName,
        lastName: user.lastName,
        userRole: user.role,
        isManager: user.role === 'manager',
      });
    } else {
      
      console.error('User document is not found');
    }
  } catch (error) {
   
    console.error('Error fetching user data:', error);
    
  }

},
    async setAuthToken({ commit }, authToken) {
      commit('setAuthToken', authToken);

      // Save auth token to local storage
      localStorage.setItem('authToken', authToken);
    },
    async initializeAuth({ dispatch }) {
      const auth = getAuth();
      const persistedAuthToken = localStorage.getItem('authToken');

      if (persistedAuthToken) {
        // Set persistence to browser session
        await setPersistence(auth, browserSessionPersistence);
        dispatch('setAuthToken', persistedAuthToken);
      }
    },
  },
});

export default store;
