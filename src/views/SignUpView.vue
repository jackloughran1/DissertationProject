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
                    <path d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z" style="fill:#039be5" />
                    <path d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z" style="fill:#ff9a03" />
                  </svg>
                  <h4 class="mt-2 mb-5 pb-1">We are TimeTrackr</h4>
                </div>

                <form class="user" @submit.prevent="signup">
                  <p class="text-center"><b>Create a new account</b></p>

                  <div class="form-outline text-center mb-4">
                    <input type="email" class="form-control" v-model="email" />
                    <label class="form-label"><b>Email</b></label>
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="password" id="form2Example22" class="form-control" v-model="password" />
                    <label class="form-label" for="form2Example22"><b>Password</b></label>
                  </div>

                  <div class="form-outline text-center mb-4">
                    <input type="accesscode" id="form2Example22" class="form-control" v-model="accesscode" />
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
                <p class="small">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignUpView',
  data() {
    return {
      email: '',
      password: '',
      accesscode:'',
      
    };
  },
  methods: {
    signup() {
      // Handle the signup logic here
    },
  },
};
</script>

<style scoped>
.signup-color {
  background-color: lightseagreen;
}

.logo {
  width: 100px;
}
</style>