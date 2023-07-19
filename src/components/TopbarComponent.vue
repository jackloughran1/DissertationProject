<template>
  <div class="topbar">
    <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path
          d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z"
          style="fill:#039be5" />
        <path d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z"
          style="fill:#ff9a03" />
      </svg>
    <div class="menu">
      <div class="hamburger" @click="$emit('toggle-sidebar')">
        <i class="fas fa-bars"></i>
      </div>
    </div>
    <div class="userProfile ms-auto">
      <span class="notification"> <i class="fa-solid fa-bell fa-xl px-4" style="color: #ffffff;"> </i> </span>
      <span class="icon"> <i class="fa-solid fa-user fa-xl px-2" style="color: #ffffff;"></i></span>
      <span class="text px-2">{{ fullName }}</span>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {

name: 'TopbarComponent',
computed: {
// getting userData
  ...mapState({
    userData: (state)=> state.userData,
  }),

  fullName(){
    return `${this.userData.firstName} ${this.userData.lastName}`;
  }

},
methods: {
  emitToggleSidebar() {
    this.$emit('toggle-sidebar');
    
  },
},

};
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