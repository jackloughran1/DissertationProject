<template>
  <div>
    <!--admin only view-->
    <div v-if="isAdmin">
      <TopbarComponent v-if="isAdmin" :firstName="firstName" :lastName="lastName"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
      <SidebarComponent v-if="isAdmin" :isManager="isManager" :sidebarCollapsed="sidebarCollapsed"
        class="flex-shrink-0" />
      <div
        class="admin-container container-fluid mt-5 d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <h1 class="text-center my-3">Access Database</h1>
        <div class="row justify-content-center">
          <div class="col-sm-3">
            <div class="card mb-4">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <i class="icon fa-solid fa-users fa-2xl my-3"></i>
                <h4 class="card-title my-3">User's</h4>
                <span>
                  <a href="/userscrud">
                    <button class="btn btn-sm btn-primary"><i class="fa-solid fa-eye"
                        style="color: #ffffff;"></i></button>
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="card">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <i class="icon fa-solid fa-calendar-days fa-2xl my-3"></i>
                <h4 class="card-title my-3">Event's</h4>
                <span>
                  <a href="/eventscrud">
                    <button class="btn btn-sm btn-primary"><i class="fa-solid fa-eye"
                        style="color: #ffffff;"></i></button>
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="card">
              <div class="card-body d-flex flex-column align-items-center justify-content-center">
                <i class="icon fa-solid fa-people-group fa-2xl my-3"></i>
                <h4 class="card-title my-3">Group's</h4>
                <span>
                  <a href="/groupscrud">
                    <button class="btn btn-sm btn-primary"><i class="fa-solid fa-eye"
                        style="color: #ffffff;"></i></button>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <TopbarComponent :firstName="firstName" :lastName="lastName"
        @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
      <div class="wrapper d-flex flex-row flex-md-nowrap">
        <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />
        <div class="container-fluid mt-5 mt-md-0">
          <h1 class="text-center pt-5 my-4">{{ firstName }}'s Calendar View</h1>
          <div id="calendar">
          </div>
          <div class="modal" v-if="selectedEvent">
            <div class="modal-content text-center text-white">
              <span class="close" @click="closeModal">&times;</span>
              <h2>Event Details</h2>
              <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
              <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
              <p><strong>End:</strong> {{ selectedEvent.end }}</p>
              <p><strong>Location:</strong> {{ selectedEvent.location }}</p>
            </div>
          </div>
        </div>
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
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, where, query } from 'firebase/firestore';
import axios from 'axios';


export default {
  name: "DashboardView",

  // bringing in components
  components: {
    TopbarComponent,
    SidebarComponent,

  },

  data() {
    return {
      sidebarCollapsed: false,
      events: [],
      firstName: "",
      lastName: "",
      isManager: false,
      isAdmin: false,
      selectedEvent: null,

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

    closeModal() {
      this.selectedEvent = null;
    },

    formatDate(date) {

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }

      return new Date(date).toLocaleString('en-UK', options)
    },
    // for user to see event info formatted nicer
    async handleEventClick(eventInfo) {
      const apiKey = '482c2d29fb6a4cdbb046f187833039b5';
      const clickedEvent = eventInfo.event;

      try {
        const response = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${clickedEvent.extendedProps.location.latitude}&lon=${clickedEvent.extendedProps.location.longitude}&apiKey=${apiKey}`
        );
        const result = response.data;
        if (result.features.length) {
          const locationFormatted = result.features[0].properties.formatted;

          this.selectedEvent = {
            title: clickedEvent.title,
            start: this.formatDate(clickedEvent.start),
            end: this.formatDate(clickedEvent.end),
            location: locationFormatted,
          };
        } else {
          console.log('No address found');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    // console.log('clicked')
  },
  // vue lifecycle hook - used for fullcalendar
  mounted() {
    const db = getFirestore();
    const auth = getAuth();
    const userCollection = collection(db, "users");
    const userDocRef = doc(userCollection, auth.currentUser.uid);
    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) {
      console.error("Calendar element not found");
      return;
    }

    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      timeZone: 'local',
      initialView: "dayGridMonth",
      nowIndicator: true,
      selectable: true,
      views: {
        timeGridFourDay: {
          type: 'timeGrid',
          duration: { days: 4 }
        },
      },
      headerToolbar: {
        left: "prev,next,today",
        center: "title",
        right: "timeGridWeek,timeGridDay"
      },
      events: this.events,

      eventClick: this.handleEventClick,
    });

    calendar.render();
    // for event pulling onto full calander
    onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.data();
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.isAdmin = user.role === "admin";
        this.isManager = user.role === "manager";

        const eventsCollection = collection(db, "events");
        let groupQuery;

        if (this.isAdmin) {
          groupQuery = eventsCollection
        } else {
          groupQuery = query(eventsCollection, where("groupId", "==", user.groupId));
        }

        onSnapshot(groupQuery, (snapshot) => {
          const events = snapshot.docs.map((event) => {
            const eventData = event.data();
            // toDate() causing error without this as problem adding timeStamp on manager
            if (!eventData.timeStampStart || !eventData.timeStampEnd) {
              console.warn("Event data does not have a valid timeStamp field:", eventData);
              return null;
            }
            return {
              title: eventData.eventName,
              start: eventData.timeStampStart.toDate(),
              end: eventData.timeStampEnd.toDate(),
              extendedProps: { location: eventData.location, },
              groupId: eventData.groupId,
            };
          });
          this.events = events.filter(Boolean);
          // console.log(events)
          calendar.setOption("events", this.events);
        });
      } else {
        console.log("User Document does not exist");
      }
    });
  },
}


</script>

<style scoped>
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

.event-details {
  margin-top: 20px;
  padding: 20px;
  background-color: #007dc3;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-details h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
  text-decoration: solid;

}

.event-details p {
  font-size: 16px;
  margin-bottom: 5px;
  color: white;

}

.event-details i {
  font-size: 50px;
  color: white;
}

.admin-container {
  padding-top: 60px;

}

.card {
  margin: 50px;
  padding: 80px;

}

.icon {
  font-size: 36px;
}


.btn {
  margin-top: 20px;
  font-size: 20px;
  width: 70px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #039be5;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
  border-radius: 10px;

}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
}
</style>
