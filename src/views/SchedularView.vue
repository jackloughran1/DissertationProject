<template>
  <div class="events p-5">
    <h3>Events</h3>
    <div class="card">
      <div class="card-header">
        Add a new event
      </div>
      <div class="card-body">
        <form class="form-inline" @submit.prevent="onSubmit">
          <div class="form-group">
            <label class="label">Event Name</label>
            <input v-model="eventData.eventName" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
          </div>
          <div class="form-group">
            <label class="label">Location (Google Maps Url)</label>
            <input v-model="eventData.location" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
          </div>
          <div class="form-group">
            <label class="label mr-2">Start Time</label>
            <input v-model="eventData.timeStampStart" type="datetime-local" class="form-control ml-sm-2 mr-sm-4 my-2 mr-2"
              required>
          </div>
          <div class="form-group">
            <label class="label">End Time</label>
            <input v-model="eventData.timeStampEnd" type="datetime-local" class="form-control ml-sm-2 mr-sm-4 my-2"
              required>
          </div>
          <div class="ml-auto text-right">
            <button type="submit" class="btn btn-success my-2">Add</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card mt-5">
      <div class="card-header">
        Event List
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" class="table-header">
                  Event Name
                </th>
                <th class="table-header">
                  Location (Google Maps URL)
                </th>
                <th class="table-header">
                  Start Time
                </th>
                <th class="table-header">
                  End Time
                </th>
                <th class="table-header">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in events" :key="event.id" class="table-row">
                <template v-if="editId === event.id">
                  <td><input v-model="editEventData.eventName" class="form-control" type="text"></td>
                  <td><input v-model="editEventData.location" class="form-control" type="text"></td>
                  <td><input v-model="editEventData.timeStampStart" class="form-control" type="datetime-local"></td>
                  <td><input v-model="editEventData.timeStampEnd" class="form-control" type="datetime-local"></td>
                  <td>
                    <span class="icon">
                      <i @click="onEditSubmit(event.id)" class="fas fa fa-check mt-2"></i>
                    </span>
                    <span class="icon">
                      <i @click="onCancel" class="fas fa fa-ban mt-2"></i>
                    </span>
                  </td>
                </template>
                <template v-else>
                  <td>{{ event.eventName }}</td>
                  <td>{{ event.location }}</td>
                  <td>{{ formatDate(event.timeStampStart) }}</td>
                  <td>{{ formatDate(event.timeStampEnd) }}</td>
                  <td>
                    <a href="#" class="icon">
                      <i @click="onDelete(event.id)" class="fa fa-trash"></i>
                    </a>
                    <a href="#" class="icon">
                      <i @click="onEdit(event)" class="fa fa-pencil"></i>
                    </a>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, onSnapshot, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'EventView',
  data() {
    return {
      eventData: {
        eventName: '',
        location: '',
        timeStampStart: '',
        timeStampEnd: '',
      },
      editEventData: {
        eventName: '',
        location: '',
        timeStampStart: '',
        timeStampEnd: '',
      },
      events: [],
      editId: null, // ID of the event being edited
    };
  },
  methods: {
    async onSubmit() {
      // Fetch the current user's document to get the groupId
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser.uid;
        const db = getFirestore();
        const userCollection = collection(db, 'users');
        const userDocRef = doc(userCollection, currentUser);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const user = userDoc.data();
          // Set the groupId from the user's document to eventData
          this.eventData.groupId = user.groupId;
          // Convert date strings to Timestamp objects
          this.eventData.timeStampStart = Timestamp.fromDate(new Date(this.eventData.timeStampStart));
          this.eventData.timeStampEnd = Timestamp.fromDate(new Date(this.eventData.timeStampEnd));

          // Add the new event to Firestore
          const eventsCollection = collection(db, 'events');
          const docRef = await addDoc(eventsCollection, this.eventData);
          console.log('Event added with ID: ', docRef.id);

          // Clear the form data after submission
          this.eventData.eventName = '';
          this.eventData.location = '';
          this.eventData.timeStampStart = null;
          this.eventData.timeStampEnd = null;
        } else {
          console.error('Current user document not found!');
        }
      } catch (error) {
        console.error('Error adding event: ', error);
      }
    },
    onEdit(event) {
      // Set the event data to editEventData for the event being edited
      this.editEventData.eventName = event.eventName;
      this.editEventData.location = event.location;
      this.editEventData.timeStampStart = event.timeStampStart;
      this.editEventData.timeStampEnd = event.timeStampEnd;
      this.editId = event.id;
    },
    onEditSubmit(eventId) {
      // Update the event data in Firestore
      const db = getFirestore();
      const eventsCollection = collection(db, 'events');
      const docRef = doc(eventsCollection, eventId);

      this.editEventData.timeStampStart = Timestamp.fromDate(new Date(this.editEventData.timeStampStart));
      this.editEventData.timeStampEnd = Timestamp.fromDate(new Date(this.editEventData.timeStampEnd));

      // Update the document using the provided data
      updateDoc(docRef, this.editEventData)
        .then(() => {
          console.log('Event updated successfully!');
          // Clear the editEventData and reset editId
          this.editEventData.eventName = '';
          this.editEventData.location = '';
          this.editEventData.timeStampStart = null;
          this.editEventData.timeStampEnd = null;
          this.editId = null;
        })
        .catch((error) => {
          console.error('Error updating event:', error);
        });
    },
    onCancel() {
      // Clear the editEventData and reset editId
      this.editEventData.eventName = '';
      this.editEventData.location = '';
      this.editEventData.timeStampStart = '';
      this.editEventData.timeStampEnd = '';
      this.editId = null;
    },
    async onDelete(eventId) {
      try {
        const db = getFirestore();
        const eventsCollection = collection(db, 'events');
        const docRef = doc(eventsCollection, eventId);

        // Delete the event from Firestore
        await deleteDoc(docRef);
        console.log('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event: ', error);
      }
    },

    formatDate(timestamp) {
      // Convert Firestore timestamp to JavaScript Date
      let dateObj = new Date(timestamp.seconds * 1000);

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
    }

  },
  created() {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser.uid;
      const userCollection = collection(db, 'users');
      const userDocRef = doc(userCollection, currentUser);

      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const user = snapshot.data();

          const eventsCollection = collection(db, 'events');
          const groupQuery = query(eventsCollection, where('groupId', '==', user.groupId));

          // Listen for real-time updates on the events collection
          onSnapshot(groupQuery, (querySnapshot) => {
            const events = [];
            querySnapshot.forEach((doc) => {
              events.push({
                id: doc.id,
                ...doc.data(),
              });
            });
            // sorting events
            events.sort((a, b) => a.timeStampStart - b.timeStampStart);

            // Update the events array in the component's state or wherever it's stored
            this.events = events;
          });
        }
      });
    } catch (error) {
      console.error('Error loading events: ', error);
    }
  },
};
</script>

<style scoped>
.events {
  font-family: Arial, sans-serif;
}

.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 10px 15px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ccc;
}

.card-body {
  padding: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-control {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
}

.table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

.table-header {
  background-color: #f7f7f7;
  padding: 8px 15px;
  border-bottom: 1px solid #ccc;
}

.table-row {
  border-bottom: 1px solid #ccc;
}


.fa {
  font-size: 16px;
}

.label {
  font-weight: bold;
}

/* Media Queries for Responsiveness for the small screens */

@media screen and (max-width: 768px) {

  /* Adjust the layout for small screens */
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-control {
    width: 100%;
  }

  .ml-auto.text-right {
    margin-left: 0;
    text-align: center;
  }

  .btn {
    width: 100%;
  }

  .label {
    font-size: 14px;
  }

  .table {
    font-size: 14px;
  }
}
</style>
