<template>
    <div>
        <TopbarComponent :firstName="firstName" :lastName="lastName"
            @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
        <div class="wrapper d-flex flex-row flex-md-nowrap">
            <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />
        </div>

        <div class="container text-center">
            
            <div class="justify-content-center align-items-center">
                <h2 class="mb-4">Request Car Pool</h2>
                <form @submit.prevent="submitForm">
                    <div class="row">
                    <div class="col mb-3">
                        <label for="parentContact" class="form-label">Contact Number</label>
                        <input type="text" class="form-control" id="parentContact" v-model="parentContact" required>
                    </div>
                    <div class="col mb-3">
                        <label for="childrenCount" class="form-label">Number of Children Needing Lift</label>
                        <input type="number" class="form-control" id="childrenCount" v-model="childrenCount" required>
                    </div>
                </div>
                <div class="row">
                    <div class="col mb-3">
                        <label for="dropOffPostcode" class="form-label">Drop-off Postcode</label>
                        <input type="text" class="form-control" id="dropOffPostcode" v-model="dropOffPostcode" required>
                    </div>
                    <div class="col mb-3">
                        <label for="dropOffStreetNumber" class="form-label">Drop-off Street Number</label>
                        <input type="text" class="form-control" id="dropOffStreetNumber" v-model="dropOffStreetNumber"
                            required>
                    </div>
                </div>
                    <div class=" mb-3">
                        <label for="eventSelection" class="form-label">Select Event</label>
                        <select class="form-select" id="eventSelection" v-model="selectedEvent">
                            <!--need to order by date-->
                            <option v-for="event in events" :key="event.id" :value="event.id">{{ event.eventName }} - {{
                                event.timeStampStart.toDate() }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <button type="submit" class="btn btn-primary">Submit Carpool Request</button>
                    </div>
                </form>

                <!-- Cards container -->
                <div class="row justify-content-center align-items-center">

                    <h3 class="my-4">Current Requests</h3>
                    <div v-for="carpool in carpools" :key="carpool.id" class="col-sm-6 card mx-2 my-3" style="width: 45%;">
                        <p>{{ carpool.firstName+ " " + carpool.lastName }}</p>
                        <div class="card-body d-flex flex-column align-items-center justify-content-center">
                            <i class="icon fa-solid fa-people-group fa-2xl my-3"></i>
                            <h4 class="card-title my-3"></h4>
                            <span>
                                <button @click="openModal()">View</button>
                                <div id="myModal" class="modal">
                                    <div class="modal-content">
                                        <p>Contact Number: {{ carpool.parentContact }}</p>
                                        <p>Children Needing Lift: {{ carpool.childrenCount }}</p>
                                        <p>Drop-off Postcode: {{ carpool.dropOffPostcode }}</p>
                                        <p>Drop-off Street Number: {{ carpool.dropOffStreetNumber }}</p>
                                        <p>Selected Event: {{ carpool.selectedEvent }}</p>
                                        <button @click="acceptCarpool(carpool)">Accept Request</button>
                                        <span class="close" @click="closeModal()">&times;</span>
                                        <h2>Modal Form</h2>
                                    </div>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue';
import TopbarComponent from '../components/TopbarComponent.vue';
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


export default {
    name: "CarPoolView",

    components: {
        SidebarComponent,
        TopbarComponent
    },

    data() {
        return {
            sidebarCollapsed: false,
            parentContact: "",
            childrenCount: "",
            dropOffPostcode: "",
            dropOffStreetNumber: "",
            selectedEvent: null,
            userId:"",
            acceptedCarPool: false,
            carPool: [],

        }
    },

    computed: {
        sidebarWidth() {
            return this.sidebarCollapsed ? "0" : "250px";
        },
    },

    methods: {
        toggleSidebar(collapsed) {
            this.sidebarCollapsed = collapsed;
        },
        openModal() {
            const modal = document.getElementById('myModal');
            modal.style.display = 'block';
        },

        // Function to hide the modal
        closeModal() {
            const modal = document.getElementById('myModal');
            modal.style.display = 'none';
        },
        

        async getEventData() {
            const db = getFirestore();
            const auth = getAuth();
            const userCollection = collection(db, "users");
            const userDocRef = doc(userCollection, auth.currentUser.uid);
            const eventsRef = collection(db, 'events');
            const carpoolRef = collection(db, 'carpool');

            try {

                const userSnapshot = await getDoc(userDocRef);
                const userData = userSnapshot.data();
                const userGroupId = userData.groupId;
                



                // Query events collection based on groupId matching
                const querySnapshot = await getDocs(query(eventsRef, where("groupId", "==", userGroupId)));
                this.events = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const carpoolSnapshot = await getDocs(carpoolRef);
                this.carpools = carpoolSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                    
                    
                }));
                
                
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        },

        async submitForm() {
        const auth = getAuth();
        this.userId = auth.currentUser.uid;

        // Get the user data from Firestore based on the userId
        const db = getFirestore();
        const userCollection = collection(db, "users");
        const userDocRef = doc(userCollection, this.userId);

        let userData;
        try {
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
                userData = userSnapshot.data();
            } else {
                console.log("User document not found for the provided userId:", this.userId);
                return;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return;
        }

        // Create the carpool request object
        const carpoolRequest = {
            parentContact: this.parentContact,
            childrenCount: this.childrenCount,
            dropOffPostcode: this.dropOffPostcode,
            dropOffStreetNumber: this.dropOffStreetNumber,
            selectedEvent: this.selectedEvent,
            userId: this.userId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            acceptedCarPool: this.acceptedCarPool,
        };

        // Add the carpool request to Firestore
        const carPoolCollection = collection(db, 'carpool');

        try {
            await addDoc(carPoolCollection, carpoolRequest);

            // Clear form inputs after successful submission
            this.parentContact = "";
            this.childrenCount = "";
            this.dropOffPostcode = "";
            this.dropOffStreetNumber = "";
            this.selectedEvent = null;
        } catch (error) {
            console.error('Error adding request', error);
        }

        // Refresh carpool data
        this.getEventData();
    },

    },

    created() {
        this.getEventData();
    }

}

</script>

<style scoped>
.container {
    margin-top: 100px;
}

.modal {
    display: none;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: red;
}

.card{
    padding: 60px;
}
</style>