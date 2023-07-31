<template>
    <div>
        <TopbarComponent :firstName="firstName" :lastName="lastName"
            @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
        <div class="wrapper d-flex flex-row flex-md-nowrap">
            <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />
        </div>

        <div class="container text-center">
            <div class="mx-auto">
                <button @click="openModal()">Open Modal</button>
                <div id="myModal" class="modal">
                    <div class="modal-content">
                        <span class="close" @click="closeModal()">&times;</span>
                        <h2>Modal Form</h2>
                    </div>
                </div>
            </div>
            <div>

                <!--Requests within cards, with contact button-->

                <h1>This will show all requests from other parents in group</h1>


            </div>

            <div>

                <!--Contact Modal-->

                <h1>This will be v-if Contact</h1>

            </div>
        </div>
    </div>
</template>

<script>
import SidebarComponent from '../components/SidebarComponent.vue';
import TopbarComponent from '../components/TopbarComponent.vue';

export default {
    name: "CarPoolView",

    components: {
        SidebarComponent,
        TopbarComponent
    },

    data() {
        return {
            sidebarCollapsed: false,

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
    },

}

</script>

<style scoped>
.container {
    margin-top: 60px;
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
</style>