<template>
  <div>
    <TopbarComponent @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    <div class="wrapper" :class="{ click_collapse: sidebarCollapsed }">
      <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" />
      <div class="container" :class="{ click_collapse: sidebarCollapsed }">
        <h1 class="text-center my-4">CRUD Operations</h1>
        <div class="row">
          <div class="col-md-6">
            <h2>Add Event</h2>
            <form @submit.prevent="addEvent">
              <div class="mb-3">
                <label for="eventName" class="form-label">Event Name</label>
                <input type="text" class="form-control" id="eventName" v-model="newEvent.eventName"
                  placeholder="Enter event name" />
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location (Lat)</label>
                <input type="text" class="form-control" id="location" v-model="newEvent.lat"
                  placeholder="Enter Latitude" />
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location (Long)</label>
                <input type="text" class="form-control" id="location" v-model="newEvent.long"
                  placeholder="Enter Longitude" />
              </div>
              <div class="mb-3">
                <label for="timeStampStart" class="form-label">Start Time</label>
                <input type="datetime-local" class="form-control" id="timeStampStart" v-model="newEvent.timeStampStart" />
              </div>
              <div class="mb-3">
                <label for="timeStampEnd" class="form-label">End Time</label>
                <input type="datetime-local" class="form-control" id="timeStampEnd" v-model="newEvent.timeStampEnd" />
              </div>
              <button type="submit" class="btn btn-primary">Add Event</button>
            </form>
          </div>
          <div class="col-md-6">
            <h2>All Events</h2>
            <ul class="list-group ">
              <li class="list-group-item my-3" v-for="event in events" :key="event.id">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ event.eventName }}</strong>
                    <br />
                    Location: {{ event.location }}
                    <br />
                    Starts: {{ event.timeStampStart.toLocaleString()}}
                    <br />
                    Finishes: {{ event.timeStampEnd.toLocaleString() }}
                  </div>
                  <div>
                    <button class="btn btn-sm btn-danger" @click="deleteEvent(event.id)">Delete</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopbarComponent from '../components/TopbarComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, where, query, setDoc, getDoc, Timestamp, GeoPoint } from 'firebase/firestore';
import axios from 'axios';

export default {
  name: 'SchedularView',

  components: {
    TopbarComponent,
    SidebarComponent,
  },

  data() {
    return {
      sidebarCollapsed: false,
      isManager: false,
      newEvent: {
        eventName: '',
        location: '',
        timeStampStart: '',
        timeStampEnd: '',
      },
      events: [],
    };
  },

  computed: {
    sidebarWidth() {
      return this.sidebarCollapsed ? '0' : '250px';
    },
  },

  methods: {
    toggleSidebar(collapsed) {
      this.sidebarCollapsed = collapsed;
    },
// add event
addEvent() {
  const db = getFirestore();
  const eventsCollection = collection(db, 'events');
  const auth = getAuth();
  const currentUser = auth.currentUser;

  try {
    const userCollection = collection(db, 'users');
    const userDocRef = doc(userCollection, currentUser.uid);
    
    getDoc(userDocRef).then((snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.data();
        console.log(user.groupId);

        const newEvent = {
          eventName: this.newEvent.eventName,
          groupId: user.groupId,
          location: new GeoPoint(Number(this.newEvent.lat), Number(this.newEvent.long)), // lat and long conversion
          timeStampStart: Timestamp.fromDate(new Date(this.newEvent.timeStampStart)), // firestore conversion
          timeStampEnd: Timestamp.fromDate(new Date(this.newEvent.timeStampEnd)),
        };

        setDoc(doc(eventsCollection), newEvent);

        this.newEvent.eventName = '';
        this.newEvent.lat = '';
        this.newEvent.long='';
        this.newEvent.timeStampStart = '';
        this.newEvent.timeStampEnd = '';
      } else {
        console.log('User not found');
      }
    });
  } catch (error) {
    console.error('Error', error);
  }
},


    deleteEvent() {
      
    },

    updateEvent() {
      
    },

  },

  created() {
  const apiKey = '482c2d29fb6a4cdbb046f187833039b5';

  const db = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser.uid;
  const userCollection = collection(db, "users");
  const userDocRef = doc(userCollection, currentUser);

  onSnapshot(userDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.data();

      const eventsCollection = collection(db, "events");
      const groupQuery = query(eventsCollection, where("groupId", "==", user.groupId));
      onSnapshot(groupQuery, async (snapshot) => {
        this.events = [];

        // for loop through events
        for (const event of snapshot.docs) {
          const eventData = event.data();

          // use of reverse geocode API - geoaptify
          try {
            const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${eventData.location.latitude}&lon=${eventData.location.longitude}&apiKey=${apiKey}`);
            const result = response.data;
            if (result.features.length) {
              const location = result.features[0].properties.formatted;
              eventData.location = location;
            } else {
              console.log("No address found");
            }
          } catch (error) {
            console.error('Error:', error);
          }

          this.events.push({
            id: event.id,
            eventName: eventData.eventName,
            location: eventData.location,
            timeStampStart: eventData.timeStampStart.toDate(),
            timeStampEnd: eventData.timeStampEnd.toDate(),
          });
        }
      });
    }
  });
}
}
</script>

<style>

</style>
