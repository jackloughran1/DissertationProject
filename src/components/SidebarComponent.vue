<template>

<div class="sidebar" :style="{ width: sidebarWidth }">
      <div class="sidebar_container">
        <ul>
          <li>
            <a href="/">
              <span class="icon"><i class="fa-solid fa-house" style="color: #fafafa;"></i></span>
              <span class="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span class="icon"><i class="fa-solid fa-message" style="color: #fafafa;"></i></span>
              <span class="text">Messenger Forum (if time)</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span class="icon"><i class="fa-solid fa-car" style="color: #ffffff;"></i></span>
              <span class="text">Car Share (if time)</span>
            </a>
          </li>
          <li>
            <a href="/schedular" v-if="isManager">
              <span class="icon"><i class="fa-solid fa-calendar-plus" style="color: #ffffff;"></i></span>
              <span class="text">Schedular</span>
            </a>
          </li>

        </ul>
        <div class="logout">
          <a href="/login">
            <span class="icon"><i class="fa-solid fa-right-from-bracket" style="color: #ffffff;"></i></span>
            <span class="text"><button  @logout="logout" style="border: none; background: none; color: white;">Log
                Out</button></span>
          </a>
        </div>
      </div>
    </div>


</template>

<script>
import {getAuth, signOut} from 'firebase/auth'
export default{
    name: 'SidebarComponent',

    props:{
        
        sidebarCollapsed: Boolean
    },

    computed: {

      isManager() {
      return this.$store.state.userData.isManager;
        
      },
    // ternary operator if true/false
    sidebarWidth() {
      return this.sidebarCollapsed ? '0' : '250px';
    },
  },

    emitLogout(){
        this.$emit('logout');
    },

    methods: {
      fetchUserData(){
        this.$store.dispatch('fetchUserData');
      },
        // logout method
  logout() {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                console.log("User has logged out!!");
                this.$router.push("/login");
            })
                .catch((error) => {
                console.log(error);
            });
        },
    },
    created() {
      this.fetchUserData();
    }
}

</script>

<style>

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  background-color: #1d546f;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 100;
}

.logo {
  width: 60px;
  margin: 10px;
  padding: 0 15px;
  border-right: 1px solid #f5f5f5;
}

.topbar .menu {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar .hamburger {
  cursor: pointer;
  font-size: 20px;
  color: white;
}

.topbar .hamburger:hover {
  color: #007dc3;
}

.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  height: 100%;
  height: calc(100% - 60px);
  background-color: #039be5;
  transition: width 0.2s;
  overflow-y: auto;
  width: 250px;
  z-index: 101;
}

.sidebar_container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li a {
  display: block;
  padding: 20px;
  border-bottom: 1px solid black;
  text-decoration: none;
  color: white;
  transition: background 0.3s;
}

.sidebar ul li a .icon {
  font-size: 18px;
  color: white;
  vertical-align: middle;
}

.sidebar ul li a .text {
  margin-left: 10px;
  color: white;
  font-family: sans-serif;
  font-size: 16px;
}

.sidebar ul li a:hover {
  background: navy;
}

.logout {
  margin-top: auto;
}

.logout a {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s;
}

.logout a:hover {
  background-color: navy;
}

.logout a .icon {
  font-size: 18px;
  color: white;
}

.logout a .text {
  margin-left: 10px;
  color: white;
  font-family: sans-serif;
  font-size: 16px;
}

.container {
  margin-top: 60px;
  padding: 20px;
}



/*Calendar-styling */
/* Calendar container */
#calendar {
  background-color: #ffffff;
}

/* Calendar header */
.fc-header-toolbar {
  background-color: #1d546f;
  color: #fff;
  padding: 10px;
}

.fc-header-toolbar .fc-button {
  background-color: #007dc3 !important;
  border-color: #000000 !important;
  color: #fff;
  font-weight: bold;
  margin: 0 5px;
}

.fc-header-toolbar .fc-button:hover {
  background-color: black !important;
}

/* Calendar views */
.fc-view {
  border-radius: 10px;
  background-color: #ffffff;
  padding: 10px;
}

/* Time slots */
.fc-timegrid-slot-label {
  font-weight: bold;
}

/* Event styles */
.fc-event {
  background-color: #d3a202;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
}

.fc-event:hover {
  background-color: #0d97d2;
}

.userProfile {
  color: white;
  font-family: sans-serif;
  font-size: 16px;
}

.userProfile:hover {
  color: rgb(24, 124, 216);
}

</style>