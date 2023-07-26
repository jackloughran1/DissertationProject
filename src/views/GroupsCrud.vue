<template>
  <div>
    <div v-if="isAdmin">
      <TopbarComponent :firstName="firstName" :lastName="lastName" @toggle-sidebar="toggleSidebar(!sidebarCollapsed)" />
      <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />

    </div>

    <div class="row mt-5">
      <div class="col-md-12">
        <h2 class="text-center mt-4">All Groups</h2>
        <div class="table-responsive">
          <table class="table table-striped text-center">
            <thead>
              <tr>
                <th>Access Code</th>
                <th>Group</th>
                <th>Team</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="group in groups" :key="group.id">
                <td>{{ group.accessCode }}</td>
                <td>{{ group.groupName }}</td>
                <td>{{ group.teamName }}</td>
                <td>
                  <button class="btn btn-sm btn-warning mx-2" @click="editGroup(group)"><i class="fa-solid fa-pen"
                      style="color: #ffffff;"></i></button>
                  <button class="btn btn-sm btn-danger" @click="deleteGroup(group.id)"><i class="fa-solid fa-trash"
                      style="color: #ffffff;"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="text-center">
      <button type="button" class="btn btn-primary btn-lg" @click="openForm()">
        Add
      </button>
    </div>

    <!-- Form to edit user fields -->
    <div v-if="selectedGroup">
      <div class="row mt-5">
        <div class="col-md-6 mx-auto text-center">
          <h3 class="text-center">Edit</h3>
          <form @submit.prevent="updateGroup">
            <label for="accessCode">Access Code</label>
            <input class="form-control" type="text" v-model="selectedGroup.accessCode" required />

            <label for="groupName">Group Name</label>
            <input type="text" class="form-control" v-model="selectedGroup.groupName" required />

            <label for="teamName">Team Name</label>
            <input type="text" class="form-control" v-model="selectedGroup.teamName" required />

            <button type="submit" class="btn btn-success mx-2 my-2"><i class="fa-solid fa-check"
                style="color: #ffffff;"></i></button>
            <button type="button" class="btn btn-danger" @click="cancelEdit"><i class="fa-solid fa-ban"
                style="color: #ffffff;"></i></button>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showForm">
      <div class="row mt-5">
        <div class="col-md-6 mx-auto">
          <h3 class="text-center">Add</h3>
          <form class="text-center mx-auto" @submit.prevent="addNewGroup">
            <div class="form-group row">
              <label for="accessCode" class="col-sm-2 col-form-label">Access Code:</label>
              <div class="col-sm-6">
                <input type="text" class="form-control" v-model="newGroup.accessCode" required />
              </div>
              <div class="col-sm-2">
                <button type="button" class="btn btn-primary" @click="generateAccessCode(6)">
                  <i class="fa-solid fa-shuffle" style="color: #ffffff;"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="groupName" class="form-label">Group Name:</label>
              <input type="text" class="form-control" v-model="newGroup.groupName" required />
            </div>

            <div class="form-group">
              <label for="teamName" class="form-label">Team Name:</label>
              <input type="text" class="form-control" v-model="newGroup.teamName" required />
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
  </div>
</template>
  
<script>
import SidebarComponent from '../components/SidebarComponent.vue';
import TopbarComponent from '../components/TopbarComponent.vue';
import { mapGetters } from 'vuex';
import { getFirestore, collection, doc, updateDoc, deleteDoc, getDocs, addDoc } from 'firebase/firestore';

export default {
  name: "GroupsCrud",

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
      groups: [], // storage for users
      firstName: "",
      lastName: "",
      isManager: false,
      selectedGroup: null,
      showForm: false,
      newGroup: {
        accessCode: "",
        groupName: "",
        teamName: ""
      }
    };
  },

  methods: {
    toggleSidebar(collapsed) {
      this.sidebarCollapsed = collapsed;
    },

    // Fetch users from Firestore
    async fetchGroups() {
      const db = getFirestore();
      const groupsRef = collection(db, 'groups');

      try {
        const querySnapshot = await getDocs(groupsRef);
        this.groups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    },

    // Method to open user document for editing
    editGroup(group) {
      this.selectedGroup = { ...group };
    },

    // Method to update user document
    async updateGroup() {
      const db = getFirestore();
      const { id, ...groupData } = this.selectedGroup;
      const groupRef = doc(db, 'groups', id);

      try {
        await updateDoc(groupRef, groupData);
        console.log('group updated successfully!');
        this.selectedGroup = null;
      } catch (error) {
        console.error('Error updating group:', error);
      }

      this.fetchGroups();
    },

    // Method to delete user document
    async deleteGroup(groupId) {
      const db = getFirestore();
      const groupRef = doc(db, 'groups', groupId);

      try {
        await deleteDoc(groupRef);
        console.log('groups deleted successfully!');
      } catch (error) {
        console.error('Error deleting group:', error);
      }

      this.fetchGroups();
    },

    // Method to cancel editing and clear the selected user
    cancelEdit() {
      this.selectedGroup = null;
    },

    openForm() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;

      this.newGroup = {
        accessCode: "",
        groupName: "",
        teamName: "",

      }
    },
    // adding method
    async addNewGroup() {
      const db = getFirestore();
      const groupsRef = collection(db, 'groups')

      try {

        await addDoc(groupsRef, this.newGroup);
        // console.log('Group added')
        this.closeForm();

        this.fetchGroups();
      } catch (error) {
        console.error('Error adding the group:', error)
      }
    },
    // need to make it so only one access code can be made, no repeats
    generateAccessCode(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      this.newGroup.accessCode = result;
    }
  },

  created() {
    this.$store.dispatch('fetchUserData');
    this.fetchGroups();
  }
};
</script>

<style scoped>
.table {
  margin: 20px;

}
</style>