<template>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-xl-10">
        <div class="card rounded-3 text-black">
          <div class="row g-0">
            <div class="col-lg-6">
              <div class="card-body p-md-5 mx-md-4">

                <div class="text-center">
                  <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <path
                      d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z"
                      style="fill:#039be5" />
                    <path d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z"
                      style="fill:#ff9a03" />
                  </svg>
                  <h4 class="mt-2 mb-5 pb-1">We are TimeTrackr</h4>
                </div>

                <form class="user" @submit.prevent="signup">
                  <p class="text-center"><b>Create a new account</b></p>

                  <div class="form-outline text-center mb-4">
                    <input type="text" id="firstName" class="form-control" v-model="firstName" />
                    <label class="form-label"><b>First Name</b></label>
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="text" id="lastName" class="form-control" v-model="lastName" />
                    <label class="form-label"><b>Last Name</b></label>
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="email" id="email" class="form-control" v-model="email" />
                    <label class="form-label"><b>Email</b></label>
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="password" id="password" class="form-control" v-model="password" />
                    <label class="form-label" for="form2Example22"><b>Password</b></label>
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="password" id="confirm" class="form-control" v-model="confirmPassword" />
                    <label class="form-label" for="form2Example22"><b>Confirm Password</b></label>
                  </div>

                  <div class="text-danger text-center mb-3">
                    {{errorMessage}}
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="accesscode" id="access" class="form-control" v-model="accessCode" />
                    <label class="form-label" for="form2Example22"><b>Access Code</b></label>
                  </div>

                  <div class="text-center pt-1 mb-5 pb-1">
                    <button class="btn btn-warning btn-block fa-lg mb-3 mx-3" type="submit"><b>Sign up</b></button>
                  </div>

                  <div class="d-flex align-items-center justify-content-center pb-4">
                    <p class="mb-0 me-2"><b>Already have an account?</b></p>
                    <a href="/login"><button type="button" class="btn btn-outline-warning">Log in</button></a>
                  </div>

                </form>

              </div>
            </div>
            <div class="col-lg-6 d-flex align-items-center signup-color">
              <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                <h4 class="mb-4 text-center">We are TimeTrackr</h4>
                <p class="small">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {getFirestore, collection, doc, setDoc, query, where, getDocs} from 'firebase/firestore'

export default {
  name: 'SignUpView',
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      accessCode: '',
      errorMessage:'',

    };
  },
  methods: {
    async signup() {

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';

        return;
      }

      const auth = getAuth();

      try{

     const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password)
     const user = userCredential.user;

     const firestore = getFirestore();

     const groupsRef = collection(firestore, 'groups');
     const q = query(groupsRef, where('accessCode', '==', this.accessCode));
     const querySnapshot = await getDocs(q);

     if (querySnapshot.empty){
      this.errorMessage = 'Invalid access code'
      return;
     }

     const usersRef = collection(firestore, 'users');
     const userData = {

      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      groupId : querySnapshot.docs[0].id

     };

     await setDoc(doc(usersRef, user.uid), userData);

        console.log(user, 'has signed in');

        this.$router.push('/login');

        this.firstName = '';
          this.lastName = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
          this.accessCode = '';

      } catch(error) {

    const errorCode = error.code;
    const errorMessage = error.message;

    console.error('Signup error: ', errorMessage);

    this.errorMessage = errorMessage;
    this.errorCode = errorCode;

      }



      


    },
  },
};
</script>

<style scoped>
.signup-color {
  background-color: lightseagreen;
}

.user {
  max-width: 300px;
  margin: 0 auto;
}

.logo {
  width: 100px;
}</style>