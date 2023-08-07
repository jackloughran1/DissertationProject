<template>

<div class="container">
        <div class="header">
            <h1>Parent Carpool Central</h1>
            <p>Safe & Reliable Rides for Your Kids to Events</p>
            <button class="btn" onclick="showOfferForm()">Offer a Ride</button>
            <button class="btn" onclick="showRequestForm()">Request a Ride</button>
        </div>
        <div class="listings">
            <!-- Example listing card -->
            <div class="listing-card">
                <h3>Jane Smith</h3>
                <p><strong>Event:</strong> Soccer Match</p>
                <p><strong>From:</strong> Park Street</p>
                <p><strong>To:</strong> Greenfield Stadium</p>
                <p><strong>Date:</strong> 15th August 2023</p>
                <p><strong>Time:</strong> 4:00 PM</p>
                <p><strong>Seats Available:</strong> 3</p>
                <button class="btn">Book a Seat</button>
            </div>
            <!-- Additional listing cards will be added dynamically -->
        </div>
    </div>
</template>

<script>

import { getFirestore, collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


export default {
    name: "CarPoolView",

    //Data properties
    data() {
        return {
            

        }
    },
    //computed properties
    computed: {
       

    },
    //methods
    methods: {
       

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

    },
    // lifecycle hook, using it to fetch event data once the component i
    created() {
        this.getEventData();
    }

}

</script>

<style scoped>
.container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .header {
            text-align: center;
            padding: 40px 0;
            background-color: #4CAF50;
            color: white;
            border-bottom: 3px solid #388E3C;
        }

        .header h1 {
            margin: 0;
        }

        .btn {
            display: inline-block;
            padding: 12px 25px;
            margin: 10px;
            border: none;
            border-radius: 5px;
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #388E3C;
        }

        .listings {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .listing-card {
            border: 1px solid #e0e0e0;
            border-radius: 7px;
            padding: 15px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }

        .listing-card:hover {
            transform: translateY(-5px);
        }

        @media (max-width: 768px) {
            .btn {
                display: block;
                width: 100%;
            }
        }
</style>