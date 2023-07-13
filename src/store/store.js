import { createStore } from 'vuex'
import { getFirestore, doc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const store = createStore({
  state: {
    userData: {
      firstName: '',
      lastName: '',
    },
  },
  getters: {},
  mutations: {
    setUserData(state, userData) {
      state.userData = userData;
    },
  },
  actions: {
    fetchUserData({ commit }) {
      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser.uid;
      const userCollection = collection(db, 'users');
      const userDocRef = doc(userCollection, currentUser);

      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const user = snapshot.data();
          commit('setUserData', {
            firstName: user.firstName,
            lastName: user.lastName,
          });
        }
      });
    },
  },
});

export default store;
