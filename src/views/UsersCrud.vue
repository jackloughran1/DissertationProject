<template>
  <div>
    <div v-if="isAdmin">
      <TopbarComponent :firstName="firstName" :lastName="lastName" @toggle-sidebar="toggleSidebar(!sidebarCollapsed)" />
      <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed" class="flex-shrink-0" />
    </div>

    <div class="row mt-5">
      <div class="col-md-12">
        <h2 class="text-center mt-4">All Users</h2>
        <div class="input-group mb-3">
          <input type="text" v-model="searchQuery" @input="searchUsers" class="form-control" placeholder="Search Users" />
          <button class="btn btn-primary" @click="searchUsers">
            <i class="fa-solid fa-magnifying-glass" style="color: #ffffff;"></i>
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-striped text-center">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.firstName }}</td>
                <td>{{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button class="btn btn-sm btn-warning mx-2 mt-2" @click="editUser(user)">
                    <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger mt-2" @click="deleteUser(user.id)">
                    <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
                  </button>
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
    <div v-if="selectedUser">
      <div class="row mt-5">
        <div class="col-md-6 mx-auto text-center">
          <h3 class="text-center">Edit</h3>
          <form @submit.prevent="updateUser">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input class="form-control" type="text" v-model="selectedUser.firstName" required />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" class="form-control" v-model="selectedUser.lastName" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="text" class="form-control" v-model="selectedUser.email" required />
            </div>
            <div class="form-group my-3">
              <label for="role">Role</label>
              <select v-model="selectedUser.role" class="form-select">
                <option disabled value="">Select Role</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="manager">manager</option>
              </select>
            </div>
            <div class="text-center mx-2">
              <button type="submit" class="btn btn-success mx-2"><i class="fa-solid fa-check"
                style="color: #ffffff;"></i></button>
              <button type="button" class="btn btn-danger" @click="cancelEdit"><i class="fa-solid fa-ban"
                style="color: #ffffff;"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
<!--Form for adding-->
    <div v-if="showForm">
      <div class="row mt-5">
        <div class="col-md-6 mx-auto">
          <h3 class="text-center">Add</h3>
          <form class="text-center mx-auto" @submit.prevent="addNewUser">
            <div class="form-group">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" class="form-control" v-model="newUser.firstName" required />
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" v-model="newUser.lastName" required />
            </div>
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input type="text" class="form-control" v-model="newUser.email" required />
            </div>
            <div class="form-group my-3">
              <label for="role" class="form-label">Role</label>
              <select v-model="newUser.role" class="form-select">
                <option disabled value="">Select Role</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="manager">manager</option>
              </select>
            </div>
            <div class="text-center mx-2">
              <button type="submit" class="btn btn-success mx-2">Add User</button>
              <button type="button" class="btn btn-danger" @click="closeForm">Cancel</button>
            </div>
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
import { getFirestore, collection, doc, addDoc, updateDoc, where, query, deleteDoc, getDocs } from 'firebase/firestore';

export default {
  name: "UsersCrud",

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
      users: [], // storage for users
      firstName: "",
      lastName: "",
      isManager: false,
      showForm: false,
      selectedUser: null,
       searchQuery: "",
      newUser: {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      },
     
    };
  },

  methods: {
    toggleSidebar(collapsed) {
      this.sidebarCollapsed = collapsed;
    },


    // Fetch users from Firestore
    async fetchUsers() {
      const db = getFirestore();
      const usersRef = collection(db, 'users');

      try {
        const querySnapshot = await getDocs(usersRef);
        this.users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    // Method to open user document for editing
    editUser(user) {
      this.selectedUser = { ...user };
    },

    // Method to update user document
    async updateUser() {
      const db = getFirestore();
      const { id, ...userData } = this.selectedUser;
      const userRef = doc(db, 'users', id);

      try {
        await updateDoc(userRef, userData);
        console.log('User updated successfully!');
        this.selectedUser = null;
      } catch (error) {
        console.error('Error updating user:', error);
      }

      this.fetchUsers();
    },

    // Method to delete user document
    async deleteUser(userId) {
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);

      try {
        await deleteDoc(userRef);
        console.log('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
      }

      this.fetchUsers();
    },
// search bar method
    async searchUsers() {
      const db = getFirestore();
      const usersRef = collection(db, 'users');

      try {
        const search = this.searchQuery.trim();

        const querySnapshot = await getDocs(query(usersRef, where('firstName', '==', search), where('lastName', '==', search)));

        this.users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error){
        console.error(error);
      }

      
    },

    // Method to cancel editing and clear the selected user
    cancelEdit() {
      this.selectedUser = null;
    },

    openForm() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;

      this.newUser = {
        firstName: "",
        lastName: "",
        email: "",
        role: "",

      }
    },


    async addNewUser() {
      const db = getFirestore();
      const usersRef = collection(db, 'users')

      try {

        await addDoc(usersRef, this.newUser);
        // console.log('Group added')
        this.closeForm();

        this.fetchGroups();
      } catch (error) {
        console.error('Error adding the user:', error)
      }
    },

  },


  created() {
    this.$store.dispatch('fetchUserData');
    this.fetchUsers();
  }
};
</script>

<style scoped>
.table {
  margin: 20px;

}
</style>