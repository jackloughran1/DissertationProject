<template>
  <div>
    <nav class="navbar navbar-dark bg-success justify-content-center">
      <a class="navbar-brand" href="/"><i class="fas fa-solid fa-arrow-left"></i>Admin Dashboard</a>
    </nav>
    <div class="container mt-3">
      <div class="card mb-5">
        <div class="card-header">
          Add a new event to the database
        </div>
        <div class="card-body">
          <form class="form-inline" @submit.prevent="addNewEvent">
            <div class="form-group">
              <label class="label">Event Name</label>
              <input v-model="newEvent.eventName" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="form-group">
              <label class="label">Location</label>
              <input v-model="newEvent.location" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="form-group">
              <label class="label">Start Time</label>
              <input v-model="newEvent.timeStampStart" type="datetime-local" class="form-control ml-sm-2 mr-sm-4 my-2"
                required>
            </div>
            <div class="form-group">
              <label class="label">End Time</label>
              <input v-model="newEvent.timeStampEnd" type="datetime-local" class="form-control ml-sm-2 mr-sm-4 my-2"
                required>
            </div>
            <div class="ml-auto text-right">
              <button type="submit" class="btn btn-success my-2">Add</button>
            </div>
          </form>
        </div>
      </div>
      <div class="table-responsive mt-3">
        <table class="table table-striped text-center custom-table">
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
              <td v-if="selectedEvent !== event">{{ event.eventName }}</td>
              <td v-else>
                <input type="text" class="form-control" v-model="selectedEvent.eventName" />
              </td>
              <td v-if="selectedEvent !== event">{{ event.location }}</td>
              <td v-else>
                <input type="text" class="form-control" v-model="selectedEvent.location" />
              </td>
              <td v-if="selectedEvent !== event">{{ formatDate(event.timeStampStart) }}</td>
              <td v-else>
                <input type="datetime-local" class="form-control" v-model="selectedEvent.timeStampStart" />
              </td>
              <td v-if="selectedEvent !== event">{{ formatDate(event.timeStampEnd) }}</td>
              <td v-else>
                <input type="datetime-local" class="form-control" v-model="selectedEvent.timeStampEnd" />
              </td>
              <td>
                <div v-if="selectedEvent !== event">
                  <button class="btn btn-sm btn-primary mx-2" @click="editEvent(event)">
                    <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger mt-2" @click="deleteEvent(event.id)">
                    <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-sm btn-success mx-2" @click="updateEvent">
                    <i class="fa-solid fa-check" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="cancelEditEvent">
                    <i class="fa-solid fa-ban" style="color: #ffffff;"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
  
<script>
import { mapGetters } from 'vuex';
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc, deleteDoc, getDocs, getDoc, GeoPoint, Timestamp, setDoc, updateDoc } from 'firebase/firestore';


export default {
  name: "EventsCrud",

  computed: {
    //store
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

    // Convert a JavaScript Date object to a Firestore Timestamp
    toFirestoreTimestamp(date) {
      return Timestamp.fromDate(date);
    },

    // Convert a Firestore Timestamp to a JavaScript Date object
    fromFirestoreTimestamp(timestamp) {
      return timestamp.toDate();
    },

    formatDate(timestamp) {
      // Check if timestamp is a Firestore Timestamp
      if (timestamp instanceof Timestamp) {
        // Convert Firestore timestamp to JavaScript Date
        let dateObj = timestamp.toDate();

        // Get the date components
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();

        // Get the time components
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();

        // Format the date and time strings
        let formattedDate = `${day}/${month}/${year}`;
        let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return `${formattedDate} ${formattedTime}`;
      } else {
        // If it's already a valid Date object, simply format it
        let dateObj = new Date(timestamp);
        let formattedDate = dateObj.toLocaleString();
        return formattedDate;
      }
    },

    // getting data
    async fetchEvent() {

      const db = getFirestore();
      const eventsRef = collection(db, 'events');

      try {
        const querySnapshot = await getDocs(eventsRef);
        this.events = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert the Firestore Timestamps to JavaScript Date objects
          timeStampStart: this.fromFirestoreTimestamp(doc.data().timeStampStart),
          timeStampEnd: this.fromFirestoreTimestamp(doc.data().timeStampEnd),
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
      }

    },


    // delete method
    async deleteEvent(eventId) {
      const db = getFirestore();
      const eventRef = doc(db, 'events', eventId);

      try {
        await deleteDoc(eventRef);
        console.log('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
      }

      this.fetchEvent();
    },
    // edit event method for the form
    editEvent(event) {
      this.selectedEvent = event;
    },

    // closes form if no changes need to be made
    cancelEditEvent() {

      this.selectedEvent = false;

    },


    // updates database
    async updateUser() {
      const db = getFirestore();

      try {
        const { id, ...eventData } = this.selectedEvent;
        const eventRef = doc(db, 'events', id);

        // Convert the date fields to Firestore Timestamps before updating
        eventData.timeStampStart = this.toFirestoreTimestamp(new Date(eventData.timeStampStart));
        eventData.timeStampEnd = this.toFirestoreTimestamp(new Date(eventData.timeStampEnd));

        await updateDoc(eventRef, eventData);

      } catch (error) {
        console.error('Error updating Event:', error);
      }

      this.fetchEvent();
    },

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
            timeStampStart: this.toFirestoreTimestamp(new Date(this.newEvent.timeStampStart)),
            timeStampEnd: this.toFirestoreTimestamp(new Date(this.newEvent.timeStampEnd)),
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


  created() {

    this.fetchEvent();
  }

}
</script>

<style scoped>
/* Table styles */
.custom-table {
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.custom-table th {
  background-color: #17a2b8;
  color: #fff;
}

.custom-table tbody tr:hover {
  background-color: #e0e0e0;
}

/* Button styles */
.btn {
  cursor: pointer;
}

/* Container styles */
.container {
  max-width: 800px;
  padding-bottom: 80px;
}

/* Input styles */
.input-group {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.input-group input {
  border-radius: 0;
}

.input-group button {
  border-radius: 0;
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: bold;
}

.form-control {
  border-radius: 0;
}

/* Responsive styles */
@media (max-width: 576px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
</style>