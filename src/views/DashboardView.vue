<template>
  <div>
    <TopbarComponent :firstName="firstName" :lastName="lastName" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    <div class="wrapper" :class="{ click_collapse: sidebarCollapsed }">
      <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" @logout="logout" />
      <div class="container" :class="{ click_collapse: sidebarCollapsed }">
        <!-- Content area -->
        <h1 class="text-center my-4">{{ firstName }}'s Calendar View</h1>
        <div id="calendar"></div>
      </div>
    </div>
  </div>
</template>


<script>

// imports
import SidebarComponent from '../components/SidebarComponent.vue';
import TopbarComponent from '../components/TopbarComponent.vue';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { signOut, getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, where, query } from 'firebase/firestore';


export default {
    name: "DashboardView",

    components: {
      TopbarComponent,
      SidebarComponent,
    },

    data() {
        return {
            sidebarCollapsed: false,
            // storage for events
            events: [],
            firstName: "",
            lastName: "",
            isManager: false,
           
        };
    },
    computed: {
        // ternary operator if true/false
        sidebarWidth() {
            return this.sidebarCollapsed ? "0" : "250px";
        },
    },

    methods: {
      toggleSidebar(collapsed) {
    this.sidebarCollapsed = collapsed;
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
   // vue lifecycle hook - used for fullcalendar
    mounted() {
        console.log("Component mounted");
        // pullig user data to dunamically populate dashboard
        const db = getFirestore();
        const auth = getAuth();
        const currentUser = auth.currentUser.uid;
        const userCollection = collection(db, "users");
        const userDocRef = doc(userCollection, currentUser);
        const calendarEl = document.getElementById("calendar");
        const calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            initialView: "timeGridWeek",
            nowIndicator: true,
            selectable: true,
            headerToolbar: {
                left: "prev,next",
                center: "title",
                right: "timeGridWeek,timeGridDay"
            },
            events: this.events,
        });
        calendar.render();        //loading  logged in user's name
        onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const user = snapshot.data();
                this.firstName = user.firstName;
                this.lastName = user.lastName;
                // check for manager role
                this.isManager = user.role === "manager";
                console.log(snapshot.data());
                console.log(currentUser);
                // pulling event data from firestore
                const eventsCollection = collection(db, "events");
                const groupQuery = query(eventsCollection, where("groupId", "==", user.groupId));
                onSnapshot(groupQuery, (snapshot) => {
                    const events = snapshot.docs.map((event) => {
                        const eventData = event.data();
                        return {
                            title: eventData.eventName,
                            start: eventData.timeStamp.toDate(),
                            end: eventData.timeStamp.toDate(),
                            location: eventData.location,
                            groupId: eventData.groupId,
                        };
                    });
                    this.events = events;
                    calendar.setOption("events", events);
                    console.log("Events:", events);
                });
                // if (this.events.length===0){
                //   console.log('No events found');
                // //   return;
                // }
            }
            else {
                console.log("User Document does not exist");
                console.log(currentUser);
                console.log(snapshot.data());
            }
        });
    },

   
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
