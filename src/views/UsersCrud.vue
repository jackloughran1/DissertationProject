<template>
  <div>
    <nav class="navbar navbar-dark bg-primary justify-content-center">
      <a class="navbar-brand" href="/"><i class="fas fa-solid fa-arrow-left"></i>Admin Dashboard</a>
    </nav>

    <div class="container mt-5">
      <div class="card mb-5">
        <div class="card-header">
          Add a new user to the database
        </div>
        <div class="card-body">
          <form class="form-inline" @submit.prevent="addNewUser">
            <div class="form-group">
              <label class="label">First Name</label>
              <input v-model="newUser.firstName" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="form-group">
              <label class="label">Last Name</label>
              <input v-model="newUser.lastName" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="form-group">
              <label class="label">Email</label>
              <input v-model="newUser.email" type="text" class="form-control ml-sm-2 mr-sm-4 my-2" required>
            </div>
            <div class="form-group">
              <label class="label mr-2">Role</label>
              <select v-model="newUser.role" class="form-control ml-sm-2 mr-sm-4 my-2" required>
                <option disabled value="">Select Role</option>
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="manager">manager</option>
              </select>
            </div>
            <div class="ml-auto text-right">
              <button type="submit" class="btn btn-success my-2">Add</button>
            </div>
          </form>
        </div>
      </div>

      <h2 class="text-center">All Users</h2>
      <div class="input-group mb-3">
        <input
          type="text"
          v-model="searchQuery"
          @input="searchUsers"
          class="form-control"
          placeholder="Search Users"
        />
        <button class="btn btn-primary" @click="searchUsers">
          <i class="fa-solid fa-magnifying-glass" style="color: #ffffff;"></i>
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover">
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
              <td v-if="selectedUser && selectedUser.id === user.id">
                <input v-model="selectedUser.firstName" type="text" class="form-control" required />
              </td>
              <td v-else>{{ user.firstName }}</td>
              <td v-if="selectedUser && selectedUser.id === user.id">
                <input v-model="selectedUser.lastName" type="text" class="form-control" required />
              </td>
              <td v-else>{{ user.lastName }}</td>
              <td v-if="selectedUser && selectedUser.id === user.id">
                <input v-model="selectedUser.email" type="text" class="form-control" required />
              </td>
              <td v-else>{{ user.email }}</td>
              <td v-if="selectedUser && selectedUser.id === user.id">
                <select v-model="selectedUser.role" class="form-select">
                  <option disabled value="">Select Role</option>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                </select>
              </td>
              <td v-else>{{ user.role }}</td>
              <td>
                <template v-if="selectedUser && selectedUser.id === user.id">
                  <button class="btn btn-sm btn-success mx-2" @click="updateUser">
                    <i class="fa-solid fa-check" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="cancelEdit">
                    <i class="fa-solid fa-ban" style="color: #ffffff;"></i>
                  </button>
                </template>
                <template v-else>
                  <button class="btn btn-sm btn-warning mx-2" @click="editUser(user)">
                    <i class="fa-solid fa-pen" style="color: #ffffff;"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
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
import { getFirestore, collection, doc, addDoc, updateDoc, where, query, deleteDoc, getDocs } from 'firebase/firestore';

export default {
  name: "UsersCrud",


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

/* Table styles */
.table {
  margin-top: 2rem;
}

.table th {
  font-weight: bold;
  background-color: #f4f4f4;
  color: #333;
}

.table-hover tbody tr:hover {
  background-color: #f2f2f2;
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