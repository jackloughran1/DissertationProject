<template>
    <div>
        <!-- Topbar and Sidebar components for navigation -->
        <TopbarComponent :firstName="firstName" :lastName="lastName"
            @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
        <div class="wrapper d-flex flex-row flex-md-nowrap">
            <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />
        </div>

        <div class="container text-center">
            <!-- Quick Links section -->
            <div class=" mx-auto quick-links">
                <h5 class=" mb-3">Quick Links</h5>
                <ul>
                    <li>
                        <a href="#request-section">Request Car Pool</a>
                    </li>
                    <li>
                        <a href="#current-requests-section">Current Requests</a>
                    </li>
                    <li>
                        <a href="#accepted-requests">Accepted Requests</a>
                    </li>
                </ul>
            </div>
            <!-- Request Car Pool section -->
            <div class="form justify-content-center align-items-center mx-auto">
                <section id="request-section">
                    <h2 class="mb-4">Request Car Pool</h2>
                    <p class="text-danger my-3">Complete this form to request transport for your child</p>
                    <form @submit.prevent="submitForm">
                        <!-- Parent Contact Number -->
                        <div class="col mb-3">
                            <label for="parentContact" class="form-label">Parent Contact Number</label>
                            <input type="text" class="form-control" id="parentContact" v-model="parentContact" required>
                        </div>
                        <!-- Number of Children Needing Lift -->
                        <div class="col mb-3">
                            <label for="childrenCount" class="form-label">Number of Children Needing Lift</label>
                            <input type="number" class="form-control" id="childrenCount" v-model="childrenCount" required
                                @change="updateChildNames">
                        </div>
                        <!-- Child Names -->
                        <div v-for="(childName, index) in childNames" :key="index" class="col mb-3">
                            <label :for="'childName' + index" class="form-label">Child Name {{ index + 1 }}</label>
                            <input type="text" :id="'childName' + index" class="form-control" v-model="childNames[index]"
                                required>
                        </div>
                        <!-- Drop-off Postcode -->
                        <div class="col mb-3">
                            <label for="dropOffPostcode" class="form-label">Drop-off Postcode</label>
                            <input type="text" class="form-control" id="dropOffPostcode" v-model="dropOffPostcode" required>
                        </div>
                        <!-- Drop-off Street Number -->
                        <div class="col mb-3">
                            <label for="dropOffStreetNumber" class="form-label">Drop-off Street Number</label>
                            <input type="text" class="form-control" id="dropOffStreetNumber" v-model="dropOffStreetNumber"
                                required>
                        </div>
                        <!-- Event Selection Dropdown -->
                        <div class=" mb-3">
                            <label for="eventSelection" class="form-label">Select Event</label>
                            <select class="form-select" id="eventSelection" v-model="selectedEvent">
                                <!--need to order by date-->
                                <option v-for="event in events" :key="event.id" :value="event.id">{{ event.eventName }} - {{
                                    event.timeStampStart.toDate() }}</option>
                            </select>
                        </div>
                        <!-- Additional Details -->
                        <label for="details">More Details regarding Car Pool:</label>
                        <textarea class="form-control" rows="5" id="details" name="text" v-model="details"></textarea>
                        <div class="my-3">
                            <button type="submit" class="btn btn-primary">Submit Carpool Request</button>
                        </div>
                    </form>
                </section>


                <!-- Current Requests section -->
                <div class="row justify-content-center align-items-center">
                    <section id="current-requests-section">
                        <h3 class="my-4">Current Requests</h3>
                        <!-- Display conditional carpool requests that have not been accepted -->
                        <div v-if="conditionalCarpools.length > 0">
                            <p class="text-danger my-3">These are current requests for carpooling that have not yet been
                                accepted</p>
                            <div v-for="carpool in conditionalCarpools" :key="carpool.id" class="col-sm-6 card mx-2 my-3"
                                style="width: 45%; border-radius: 20px;">
                                <p class="py-2">{{ carpool.firstName + " " + carpool.lastName }}</p>
                                <p><b>Number needing lifted: </b>{{ carpool.childrenCount }}</p>
                                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                                    <i class="fa-solid fa-car-side fa-2xl my-3" style="color: #ff0026;"></i>
                                    <h4 class="card-title my-3"></h4>
                                    <span>
                                        <button class="btn btn-primary" @click="openModal()">View</button>
                                        <div id="myModal" class="modal">
                                            <div class="modal-content">
                                                <p><strong>Contact Number: {{ carpool.parentContact }}</strong></p>
                                                <p><strong>Children Needing Lift: {{ carpool.childrenCount }} - Names - {{
                                                    carpool.childNames.join(", ") }}</strong></p>
                                                <p><strong>Drop-off Postcode: {{ carpool.dropOffPostcode }}</strong></p>
                                                <p><strong>Drop-off Street Number: {{ carpool.dropOffStreetNumber
                                                }}</strong></p>
                                                <p><strong>Requested Event: {{ carpool.selectedEvent.eventName }} - {{
                                                    carpool.selectedEvent.timeStampStart.toDate() }} -
                                                        {{ carpool.selectedEvent.timeStampEnd.toDate() }}</strong></p>
                                                <p><strong>Details: {{ carpool.details }}</strong></p>
                                                <button class="btn btn-success" @click="acceptCarpool(carpool)">Accept
                                                    Request</button>
                                                <span class="close" @click="closeModal()">&times;</span>

                                            </div>
                                        </div>
                                    </span>
                                </div>

                            </div>
                        </div>
                        <!-- Display conditional v-else-->
                        <div v-else>
                            <h3 class="text-danger">No Requests</h3>
                            <hr>
                        </div>
                    </section>
                </div>
                <!-- Accepted Requests section -->
                <div class="justify-content-center">
                    <section id="accepted-requests">
                        <h3 class="my-4">Accepted Requests</h3>
                        <!-- Display accepted carpool requests (conditional) -->
                        <div v-if="acceptedCarpools.length > 0">
                            <p class="text-success my-3">These are carpool requests that have been accepted</p>
                            <div v-for="carpool in acceptedCarpools" :key="carpool.id" class="acceptCard mx-auto card my-3"
                                style="border-radius: 20px;">
                                <p><strong>This will contain parent information</strong></p>
                                <button class="btn btn-primary" @click="viewAcceptedCarpool(carpool)">View</button>
                            </div>
                        </div>
                        <div v-else>
                            <h3 class="text-success">No Accepted Requests</h3>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
//imports neccessary
import SidebarComponent from '../components/SidebarComponent.vue';
import TopbarComponent from '../components/TopbarComponent.vue';
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


export default {
    name: "CarPoolView",

    components: {
        SidebarComponent,
        TopbarComponent
    },
    //Data properties
    data() {
        return {
            sidebarCollapsed: false, // for state of sidebar
            parentContact: "", // parent's contact inpit
            childrenCount: "", // input 
            childNames: [], // array for child number for names
            dropOffPostcode: "", // input
            dropOffStreetNumber: "", // input
            selectedEvent: null, // dropdown inout
            details: "", // input
            userId: "", // may remove
            acceptedCarPool: false, //flad to determined boolean
            acceptedBy: "", //userId storage for account retrieval
            carpools: [], // array to store requests

        }
    },
    //computed properties
    computed: {
        // Computed width based of state
        sidebarWidth() {
            return this.sidebarCollapsed ? "0" : "250px";
        },
        // filter for non-accepted carpools
        conditionalCarpools() {
            return this.carpools.filter((carpool) => !carpool.acceptedCarPool)
        },
        // filter for accepted carpools
        acceptedCarpools() {

            const auth = getAuth();
            const currentUser = auth.currentUser;
            const userId = currentUser.uid;

            return this.carpools.filter((carpool) => carpool.acceptedBy === userId);
        }

    },
    //methods
    methods: {
        //toggle
        toggleSidebar(collapsed) {
            this.sidebarCollapsed = collapsed;
        },
        //opens myModal
        openModal() {
            const modal = document.getElementById('myModal');
            modal.style.display = 'block';
        },

        // Function to hide the modal
        closeModal() {
            const modal = document.getElementById('myModal');
            modal.style.display = 'none';
        },

        //not added fully yet - 
        viewAcceptedCarpool(carpool) {
            this.acceptedCarpoolDetails = carpool;
            const modal = document.getElementById('acceptedModal');
            modal.style.display = 'block';
        },

        //fetching from firestore
        async getEventData() {
            const db = getFirestore();
            const auth = getAuth();
            const userCollection = collection(db, "users");
            //references to collections
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

                // getting at carpool data
                const carpoolSnapshot = await getDocs(carpoolRef);
                this.carpools = carpoolSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()

                }));

                console.log("Carpool data:", this.carpools);


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
                childNames: this.childNames,
                dropOffPostcode: this.dropOffPostcode,
                dropOffStreetNumber: this.dropOffStreetNumber,
                selectedEvent: this.events.find(event => event.id === this.selectedEvent),
                details: this.details,
                userId: this.userId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                acceptedCarPool: false,
                acceptedBy: null,
            };

            // Add the carpool request to Firestore
            const carPoolCollection = collection(db, 'carpool');

            try {
                await addDoc(carPoolCollection, carpoolRequest);

                // Clear form inputs after successful submission
                this.parentContact = "";
                this.childrenCount = "";
                this.childNames = [];
                this.dropOffPostcode = "";
                this.dropOffStreetNumber = "";
                this.selectedEvent = null;
                this.details = ""
            } catch (error) {
                console.error('Error adding request', error);
            }

            // Refresh carpool data
            this.getEventData();
        },

        // placeholders for child names
        updateChildNames() {
            this.childNames = new Array(parseInt(this.childrenCount)).fill("").map((name, index) => `Enter Child ${index + 1} Name`);
        },

        // fro accepted carpool requests
        async acceptCarpool(carpool) {

            const auth = getAuth();
            const currentUser = auth.currentUser;
            const userId = currentUser.uid;

            carpool.acceptedCarPool = true;
            carpool.acceptedBy = userId;

            const db = getFirestore();
            const carpoolDocRef = doc(db, 'carpool', carpool.id);

            try {
                await updateDoc(carpoolDocRef, { acceptedCarPool: true, acceptedBy: userId });
            } catch (error) {
                console.error('Error updating carpool:', error);
            }


        },



    },
    // lifecycle hook, using it to fetch event data once the component i
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
    background-color: lightcyan;
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



.form {
    width: 70%;
}

.quick-links {
    width: 50%;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    margin-bottom: 50px;

}

.quick-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.quick-links li {
    margin-bottom: 5px;
}

.quick-links a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
}

.quick-links a:hover {
    color: #0056b3;
}

.acceptCard {
    padding: 40px;
    width: 50%;
}
</style>