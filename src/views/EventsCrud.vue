<template>
  <div>
    <div v-if="isAdmin">
      <TopbarComponent :firstName="firstName" :lastName="lastName" @toggle-sidebar="toggleSidebar(!sidebarCollapsed)" />
      <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />
      
    </div>

    <div class="row mt-5">
      <div class="col-md-12">
        <h2 class="text-center mt-4">All Events</h2>
        <div class="input-group mb-3">
          <input type="text" v-model="searchQuery" @input="searchEvents" class="form-control" placeholder="Search Events" />
          <button class="btn btn-primary" @click="searchEvents">
            <i class="fa-solid fa-magnifying-glass" style="color: #ffffff;"></i>
          </button>
        </div>
        <div class="table-responsive">
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
                    <button class="btn btn-sm btn-warning mx-2" @click="editEvent(event)"><i class="fa-solid fa-pen" style="color: #ffffff;"></i></button>
                    <button class="btn btn-sm btn-danger mt-2" @click="deleteEvent(event.id)"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>

      <div class="text-center">
      <button type="button" class="btn btn-primary btn-lg" @click="openForm()">
        Add </button>
    </div>
   
  <!--Conditional edit form after manager selects edit button - cwill componentise later if time permits-->
  <div v-if="selectedEvent" class="edit-form">
    <div class="row mt-5">
      <div class="col-md-6 mx-auto">
        <form class="eventForm text-center mx-auto">
          <div class="mb-3">
            <label for="eventName" class="form-label"><b>Event Name</b></label>
            <input type="text" class="form-control" id="eventName" v-model="selectedEvent.eventName"
              placeholder="Enter event name" />
          </div>
          <div class="mb-3">
            <label for="locationLat" class="form-label"><b>Location (Lat)</b></label>
            <input type="text" class="form-control" id="locationLat" v-model="selectedEvent.lat"
              placeholder="Enter Latitude" />
          </div>
          <div class="mb-3">
            <label for="locationLong" class="form-label"><b>Location (Long)</b></label>
            <input type="text" class="form-control" id="locationLong" v-model="selectedEvent.long"
              placeholder="Enter Longitude" />
          </div>
          <div class="mb-3">
            <label for="timeStampStart" class="form-label"><b>Start Time</b></label>
            <input type="datetime-local" class="form-control" id="timeStampStart" v-model="selectedEvent.timeStampStart" />
          </div>
          <div class="mb-3">
            <label for="timeStampEnd" class="form-label"><b>End Time</b></label>
            <input type="datetime-local" class="form-control" id="timeStampEnd" v-model="selectedEvent.timeStampEnd" />
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-success mx-2 my-2"><i class="fa-solid fa-check" style="color: #ffffff;"></i></button>
            <button type="button" class="btn btn-danger" @click="cancelEditEvent"><i class="fa-solid fa-ban" style="color: #ffffff;"></i></button>
          </div>
        </form>
      </div>
    </div>
    </div>

    <div v-if="showForm">
      <div class="row mt-5">
        <div class="col-md-6 mx-auto">
          <h3 class="text-center">Add</h3>
          <form class="text-center mx-auto" @submit.prevent="addNewEvent">
            <div class="form-group">
              <label for="eventName" class="form-label">Event Name</label>
              <input type="text" class="form-control" v-model="newEvent.eventName" required />
            </div>
            <div class="form-group">
              <label for="lat" class="form-label">Latitude</label>
              <input type="text" class="form-control" v-model="newEvent.lat" required />
            </div>
            <div class="form-group">
              <label for="long" class="form-label">Longtitude</label>
              <input type="text" class="form-control" v-model="newEvent.long" required />
            </div>
            <div class="mb-3">
            <label for="timeStampStart" class="form-label"><b>Start Time</b></label>
            <input type="datetime-local" class="form-control" id="timeStampStart" v-model="newEvent.timeStampStart" />
          </div>
          <div class="mb-3">
            <label for="timeStampEnd" class="form-label"><b>End Time</b></label>
            <input type="datetime-local" class="form-control" id="timeStampEnd" v-model="newEvent.timeStampEnd" />
          </div>

            <button type="submit" class="btn btn-success mx-2 my-2">
              <i class="fa-solid fa-check" style="color: #ffffff;"></i>
            </button>
            <button type="button" class="btn btn-danger" @click="closeForm">
              <i class="fa-solid fa-ban" style="color: #ffffff;"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  
</template>
  
<script>
import SidebarComponent from '../components/SidebarComponent.vue';
import TopbarComponent from '../components/TopbarComponent.vue';
import { mapGetters } from 'vuex';
import { getAuth} from 'firebase/auth'
import { getFirestore, collection, doc, deleteDoc, getDocs, getDoc, GeoPoint, Timestamp, setDoc, updateDoc} from 'firebase/firestore';


export default {
  name: "EventsCrud",

  components: {
    TopbarComponent,
    SidebarComponent,
  },

  computed: {
    ...mapGetters(['isAdmin']),
    sidebarWidth() {
      return this.sidebarCollapsed ? "0" : "250px";
    },
  },

  data() {
    return {
      sidebarCollapsed: false,
      isManager: false,
      showForm: false,
      selectedEvent: null,
      newEvent: {
        eventName: '',
        lat: '',
        long: '',
        timeStampStart: '',
        timeStampEnd: '',
      },    
      events: [],
    };
  },

  methods: {
    toggleSidebar(collapsed) {
      this.sidebarCollapsed = collapsed;
    },

    async fetchEvent(){

      const db = getFirestore();
      const eventsRef = collection(db, 'events');

      try {
        const querySnapshot = await getDocs(eventsRef);
        this.events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
      }

    },



    async deleteEvent(eventId) {
      const db = getFirestore();
      const eventRef = doc(db, 'events', eventId);

      try {
        await deleteDoc(eventRef);
        console.log('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
      }

      this.fetchEvents();
    },
    // edit event method for the form
    editEvent(event) {
      this.selectedEvent = event;
    },

    // closes form if no changes need to be made
    cancelEditEvent() {

      this.selectedEvent=false;

    },


    // updates database
    async updateUser() {
      const db = getFirestore();
      const { id, ...eventData } = this.selectedEvent;
      const eventRef = doc(db, 'events', id);

      try {
        await updateDoc(eventRef, eventData);
        console.log('Event updated successfully!');
        this.selectedEvent = null;
      } catch (error) {
        console.error('Error updating Event:', error);
      }

      this.fetchEvent();
    },

    formatDateTime(date) {
      return date.toDate();
    },

    
    openForm() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;

      this.newEvent = {
        eventName: '',
        lat: '',
        long: '',
        timeStampStart: '',
        timeStampEnd: '',

      }
    },

    // edding event method to database
    addNewEvent() {
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
  },

  created(){

    this.fetchEvent();
  }
}
</script>

<style scoped>
.list-group-item {

  background-color: orange;
  border-radius: 15px;


}

.eventForm {

  position: relative;
}
</style>