<template>
  <div v-if="!isAdmin">
    <div class="dashboard">
      <h2>Upcoming Schedule <i class="fas fa-regular fa-calendar"></i></h2>
      <hr>
      <div class="event-list pt-3">
        <div v-for="(eventsOfDay, day) in eventsByDay" :key="day" class="day-segment">
          <div class="date-segment">{{ day }}</div>
          <div v-for="event in eventsOfDay" :key="event.id" class="event-item mb-5">
            <h2 class="my-3">{{ event.eventName }}</h2>
            <a :href="event.location" target="_blank" class="location-btn"><i class="fas fa-solid fa-map-pin"></i> View
              Location</a>
            <p><strong><i class="fas fa-regular fa-clock"></i> Time:</strong> {{ formatTime(event.timeStampStart) }} - {{
              formatTime(event.timeStampEnd) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="admin-dashboard">
    <h1 class="text-center my-3">Admin Dashboard</h1>
    <div class="card-grid">
      <div class="card">
        <div class="card-icon">
          <i class="icon fa-solid fa-users fa-2x"></i>
        </div>
        <div class="card-body">
          <h4 class="card-title">Users</h4>
          <a href="/userscrud" class="btn btn-sm btn-primary">
            <i class="fa-solid fa-eye" style="color: #ffffff;"></i>
            View
          </a>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <i class="icon fa-solid fa-calendar-days fa-2x"></i>
        </div>
        <div class="card-body">
          <h4 class="card-title">Events</h4>
          <a href="/eventscrud" class="btn btn-sm btn-primary">
            <i class="fa-solid fa-eye" style="color: #ffffff;"></i>
            View
          </a>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">
          <i class="icon fa-solid fa-people-group fa-2x"></i>
        </div>
        <div class="card-body">
          <h4 class="card-title">Groups</h4>
          <a href="/groupscrud" class="btn btn-sm btn-primary">
            <i class="fa-solid fa-eye" style="color: #ffffff;"></i>
            View
          </a>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { mapState } from 'vuex'
import { getFirestore, collection, where, orderBy, onSnapshot, query, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
export default {
  data() {
    return {
      events: []

    };
  },
  computed: {
    eventsByDay() {
      let eventsSorted = [...this.events].sort((a, b) => a.timeStampStart.seconds - b.timeStampStart.seconds);

      return eventsSorted.reduce((acc, event) => {
        // Converting Firestore timestamp to JavaScript Date
        let dateObj = new Date(event.timeStampStart.seconds * 1000);
        let dateKey = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

        (acc[dateKey] = acc[dateKey] || []).push(event);

        return acc;
      }, {});
    },

    ...mapState({
      userData: (state) => state.userData,
    }),

    isManager() {
      return this.$store.state.userData.isManager;

    },

    isAdmin() {
      return this.$store.state.userData.isAdmin;
    },
  },

  isAdmin() {
    return this.$store.state.userData.isAdmin;
  },

  methods: {
    fetchUserData() {
      this.$store.dispatch('fetchUserData');
    },


    async fetchEventsFromFirestore() {
      const db = getFirestore();
      const auth = getAuth();
      const userDocRef = doc(db, "users", auth.currentUser.uid);

      // Get the user document
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        console.error("User not found!");
        return;
      }

      const userGroupID = userDocSnap.data().groupId;

      let eventsQuery;

      if (this.isAdmin) {
        eventsQuery = collection(db, 'events'); // Fetch all events if admin (stops errors also)
      } else {
        // Construct the query for events with the user's groupId
        eventsQuery = query(
          collection(db, 'events'),
          where('groupId', '==', userGroupID),
          orderBy('timeStampStart')
        );
      }

      this.unsubscribeFromFirestore = onSnapshot(eventsQuery, snapshot => {
        let eventsArray = [];
        snapshot.forEach(doc => {
          let data = doc.data();
          data.id = doc.id;
          eventsArray.push(data);
        });
        this.events = eventsArray;
      });

    },

    formatDate(timestamp) {
      // Convert Firestore timestamp to JavaScript Date
      let dateObj = new Date(timestamp.seconds * 1000);  
      return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    },

    formatTime(timestamp) { 
      // Convert Firestore timestamp to JavaScript Date
      let dateObj = new Date(timestamp.seconds * 1000); 
      let hours = dateObj.getHours();
      let minutes = ("0" + dateObj.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
    },
  },

  created() {
    this.fetchUserData();
    this.fetchEventsFromFirestore();
  },
  unmounted() {
    // Important: Unsubscribe from Firestore updates when component is destroyed
    if (this.unsubscribeFromFirestore) {
      this.unsubscribeFromFirestore();
    }
  }

};

</script>

<style scoped>
.dashboard {
  padding: 3rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  font-weight: 600;
  margin-bottom: 2rem;
  color: #040404;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.date-segment {

  background-color: #2da829;
  /* Lime green color */
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  float: left;
}

.event-item {
  background-color: #d6d6d6;
  padding: 40px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s, box-shadow 0.25s;
  margin-top: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.event-item:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.09);
}

@media (min-width: 768px) {
  .dashboard {
    max-width: 840px;
    margin: 0 auto;
    padding: 20px;
  }
}

h2 {
  font-weight: 500;
  color: #040504;
  margin-bottom: 1.25rem;
}

p {
  margin-bottom: 0.75rem;
  color: #060606;
}

.admin-dashboard {
  padding: 4rem;
}

.card-grid {
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.card {
  background-color: #ffffff;
  color: #020202;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(19, 227, 12, 0.06);
  /* Lime green shadow */
  transition: transform 0.25s;
}

.card:hover {
  transform: translateY(-2px);
  background-color: #1e8e20;
}

.card-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.card-title {
  font-weight: 500;
  color: #030303;
  margin-bottom: 1.25rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-body .btn {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  background-color: #17a012;
  /* Lime green button */
  color: #f7f9fc;
  transition: background-color 0.25s;
}

.card-body .btn:hover {
  background-color: #131b13;
}</style>
