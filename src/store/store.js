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
      isAdmin: false,
      
    },
    authToken: '',
  },
  getters: {
    authToken: (state) => state.authToken,

    isAdmin: (state)=> state.userData.isAdmin
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

  console.log('Called')
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    
    return;
  }
  const db = getFirestore();
  const userCollection = collection(db, 'users');
  const userDocRef = doc(userCollection, user.uid);

  try {
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      const userData = snapshot.data();

     
      
      commit('setUserData', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userRole: userData.role,
        isAdmin: userData.role ==='admin',
        isManager: userData.role === 'manager',
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
