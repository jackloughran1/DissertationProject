<template>
  <div>
    <nav class="navbar navbar-dark bg-danger justify-content-center">
      <a class="navbar-brand" href="/"><i class="fas fa-solid fa-arrow-left"></i>Admin Dashboard</a>
    </nav>

    <div class="container mt-5">
      <div class="card mb-5">
        <div class="card-header">
          Add a new group to the database
        </div>
        <div class="card-body">
          <form class="form-inline" @submit.prevent="addNewGroup">
            <div class="form-group">
              <label class="label">Access Code</label>
              <input v-model="newGroup.accessCode" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="col-sm-2">
            <button type="button" class="btn btn-danger" @click="generateAccessCode(6)">
              <i class="fa-solid fa-shuffle" style="color: #ffffff;"></i> 
            </button>
          </div>
            <div class="form-group">
              <label class="label">Group Name</label>
              <input v-model="newGroup.groupName" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="form-group">
              <label class="label">Team Name</label>
              <input v-model="newGroup.teamName" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="ml-auto text-right">
              <button type="submit" class="btn btn-success my-2">Add</button>
            </div>
          </form>
        </div>
      </div>

      <h2 class="text-center">All Groups</h2>
      <div class="table-responsive">
        <table class="table table-hover text-center">
          <thead>
            <tr>
              <th>Access Code</th>
              <th>Group Name</th>
              <th>Team Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groups" :key="group.id">
              <td v-if="selectedGroup && selectedGroup.id === group.id">
                <input v-model="selectedGroup.accessCode" type="text" class="form-control" required>
              </td>
              <td v-else>{{ group.accessCode }}</td>
              <td v-if="selectedGroup && selectedGroup.id === group.id">
                <input v-model="selectedGroup.groupName" type="text" class="form-control" required>
              </td>
              <td v-else>{{ group.groupName }}</td>
              <td v-if="selectedGroup && selectedGroup.id === group.id">
                <input v-model="selectedGroup.teamName" type="text" class="form-control" required>
              </td>
              <td v-else>{{ group.teamName }}</td>
              <td>
                <template v-if="selectedGroup && selectedGroup.id === group.id">
                  <button class="btn btn-sm btn-success mx-2" @click="updateGroup">
                    <i class="fa-solid fa-check" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="cancelEdit">
                    <i class="fa-solid fa-ban" style="color: #ffffff;"></i>
                  </button>
                </template>
                <template v-else>
                  <button class="btn btn-sm btn-warning mx-2" @click="editGroup(group)">
                    <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteGroup(group.id)">
                    <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
                  </button>
                </template>
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
import { getFirestore, collection, doc, updateDoc, deleteDoc, getDocs, addDoc } from 'firebase/firestore';

export default {
  name: "GroupsCrud",

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
.custom-table {
  background-color: #f2f2f2;
}

.custom-table th {
  background-color: #2c3e50;
  color: #ffffff;
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

  .btn {
  cursor: pointer;
  max-height: 40px;
}


}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
</style>