<template>
  <div>
    <TopbarComponent @toggle-sidebar="toggleSidebar(!sidebarCollapsed)" />
    <div class="wrapper" :class="{ click_collapse: sidebarCollapsed }">
      <SidebarComponent :is-manager="isManager" :sidebar-collapsed="sidebarCollapsed" />
      <div class="container" :class="{ click_collapse: sidebarCollapsed }">
        <div class="row mt-5">
          <div class="col-md-6 mx-auto">
            <h2 class="text-center mb-3">Adding Event</h2>
            <form class="eventForm text-center" @submit.prevent="addEvent">
              <div class="mb-3">
                <label for="eventName" class="form-label"><b>Event Name</b></label>
                <input type="text" class="form-control" id="eventName" v-model="newEvent.eventName"
                  placeholder="Enter event name" />
              </div>
              <div class="mb-3">
                <label for="locationLat" class="form-label"><b>Location (Lat)</b></label>
                <input type="text" class="form-control" id="locationLat" v-model="newEvent.lat"
                  placeholder="Enter Latitude" />
              </div>
              <div class="mb-3">
                <label for="locationLong" class="form-label"><b>Location (Long)</b></label>
                <input type="text" class="form-control" id="locationLong" v-model="newEvent.long"
                  placeholder="Enter Longitude" />
              </div>
              <div class="mb-3">
                <label for="timeStampStart" class="form-label"><b>Start Time</b></label>
                <input type="datetime-local" class="form-control" id="timeStampStart" v-model="newEvent.timeStampStart" />
              </div>
              <div class="mb-3">
                <label for="timeStampEnd" class="form-label"><b>End Time</b></label>
                <input type="datetime-local" class="form-control" id="timeStampEnd" v-model="newEvent.timeStampEnd" />
              </div>
              <button type="submit" class="btn btn-primary"><i class="fa-regular fa-square-plus"
                  style="color: #ffffff;"></i></button>
            </form>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-md-12 col-sm">
            <h2 class="text-center">All Events</h2>
            <table class="table table-striped text-center">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Location</th>
                  <th>Starts</th>
                  <th>Finishes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in events" :key="event.id">
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.location }}</td>
                  <td>{{ formatDateTime(event.timeStampStart) }}</td>
                  <td>{{ formatDateTime(event.timeStampEnd) }}</td>
                  <td>
                    <button class="btn btn-sm btn-warning mx-2" @click="editEvent(event)"><i class="fa-solid fa-pen"
                        style="color: #ffffff;"></i></button>
                    <button class="btn btn-sm btn-danger" @click="deleteEvent(event.id)"><i class="fa-solid fa-trash"
                        style="color: #ffffff;"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Conditional edit form after manager selects edit button - cwill componentise later-->
  <div v-if="isEditing" class="edit-form">
    <div class="row mt-5">
      <div class="col-md-6 mx-auto">
        <form class="eventForm text-center mx-auto" @submit.prevent="updateEvent">
          <div class="mb-3">
            <label for="eventName" class="form-label"><b>Event Name</b></label>
            <input type="text" class="form-control" id="eventName" v-model="changeEvent.eventName"
              placeholder="Enter event name" />
          </div>
          <div class="mb-3">
            <label for="locationLat" class="form-label"><b>Location (Lat)</b></label>
            <input type="text" class="form-control" id="locationLat" v-model="changeEvent.lat"
              placeholder="Enter Latitude" />
          </div>
          <div class="mb-3">
            <label for="locationLong" class="form-label"><b>Location (Long)</b></label>
            <input type="text" class="form-control" id="locationLong" v-model="changeEvent.long"
              placeholder="Enter Longitude" />
          </div>
          <div class="mb-3">
            <label for="timeStampStart" class="form-label"><b>Start Time</b></label>
            <input type="datetime-local" class="form-control" id="timeStampStart" v-model="changeEvent.timeStampStart" />
          </div>
          <div class="mb-3">
            <label for="timeStampEnd" class="form-label"><b>End Time</b></label>
            <input type="datetime-local" class="form-control" id="timeStampEnd" v-model="changeEvent.timeStampEnd" />
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-warning mx-2 my-2"><i class="fa-solid fa-check"
                style="color: #ffffff;"></i></button>
            <button type="button" class="btn btn-danger" @click="cancelEditEvent"><i class="fa-solid fa-ban"
                style="color: #ffffff;"></i></button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TopbarComponent from '../components/TopbarComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  where,
  query,
  setDoc,
  getDoc,
  Timestamp,
  GeoPoint,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import axios from 'axios';

export default {
  name: 'SchedulerView',

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
        lat: '',
        long: '',
        timeStampStart: '',
        timeStampEnd: '',
      },
      isEditing: false,

      changeEvent: {
        eventName: '',
        lat: '',
        long: '',
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
    // adding event method to database
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
              location: new GeoPoint(Number(this.newEvent.lat), Number(this.newEvent.long)),
              timeStampStart: Timestamp.fromDate(new Date(this.newEvent.timeStampStart)),
              timeStampEnd: Timestamp.fromDate(new Date(this.newEvent.timeStampEnd)),
            };

            setDoc(doc(eventsCollection), newEvent);

            this.newEvent.eventName = '';
            this.newEvent.lat = '';
            this.newEvent.long = '';
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

    deleteEvent(id) {
      const db = getFirestore();
      deleteDoc(doc(db, 'events', id))

    },
    // edit event method for the form
    editEvent(event) {
      this.isEditing = true;


      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const userCollection = collection(db, 'users');
      const userDocRef = doc(userCollection, currentUser.uid);

      getDoc(userDocRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.data();

            // need user to access groupId - store user data in state??
            this.changeEvent.id = event.id;
            this.changeEvent.eventName = event.eventName;
            this.changeEvent.lat = event.location.lat;
            this.changeEvent.long = event.location.long;
            this.changeEvent.timeStampStart = event.timeStampStart.toISOString().slice(0, 16);
            this.changeEvent.timeStampEnd = event.timeStampEnd.toISOString().slice(0, 16);
            this.changeEvent.groupId = user.groupId;
          } else {
            console.log('User not found');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    },

    // closes form if no changes need to be made
    cancelEditEvent() {

      this.changeEvent = {
        id: '',
        eventName: '',
        lat: '',
        long: '',
        timeStampStart: '',
        timeStampEnd: '',
      };
      this.isEditing = false;

    },
    // updates database
    updateEvent() {

      const db = getFirestore();
      const eventsCollection = collection(db, 'events');




      // Update the event with the edited data
      const updatedEvent = {
        eventName: this.changeEvent.eventName,
        location: new GeoPoint(Number(this.changeEvent.lat), Number(this.changeEvent.long)),
        groupId: this.changeEvent.groupId,
        timeStampStart: Timestamp.fromDate(new Date(this.changeEvent.timeStampStart)),
        timeStampEnd: Timestamp.fromDate(new Date(this.changeEvent.timeStampEnd)),
      };

      try {

        const eventDocRef = doc(eventsCollection, this.changeEvent.id);
        setDoc(eventDocRef, updatedEvent);


        this.changeEvent = {
          id: '',
          eventName: '',
          lat: '',
          long: '',
          timeStampStart: '',
          timeStampEnd: '',
        };
        this.isEditing = false;
      } catch (error) {
        console.error('Error updating event:', error);

      }

    },

    formatDateTime(date) {
      return date.toLocaleString();
    },
  },
  // created() useful for API
  created() {
    const apiKey = '482c2d29fb6a4cdbb046f187833039b5';

    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser.uid;
    const userCollection = collection(db, 'users');
    const userDocRef = doc(userCollection, currentUser);

    onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const user = snapshot.data();

        const eventsCollection = collection(db, 'events');
        const groupQuery = query(eventsCollection, where('groupId', '==', user.groupId), orderBy('timeStampStart'));
        onSnapshot(groupQuery, async (snapshot) => {
          this.events = [];
          // for loop through events needed for API
          console.log(groupQuery)
          for (const event of snapshot.docs) {
            const eventData = event.data();

            try {
              const response = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${eventData.location.latitude}&lon=${eventData.location.longitude}&apiKey=${apiKey}`
              );
              const result = response.data;
              if (result.features.length) {
                const location = result.features[0].properties.formatted;
                eventData.location = location;
              } else {
                console.log('No address found');
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
  },
};
</script>

<style scoped>
.list-group-item {

  background-color: orange;
  border-radius: 15px;


}

.eventForm {

  position: relative;
}</style>
