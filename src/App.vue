<template>
  <body class="sb-nav-fixed" id="page-top">
    <nav v-if="showMainContent" class="sb-topnav navbar navbar-expand navbar-dark bg-dark" id="upnavbar">
      <!-- Navbar Search-->
      <span class="navbar-brand d-none d-md-inline-block">Timetrackr
        <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="-10 2 200 30">
          <path
            d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z"
            style="fill:#039be5" />
          <path d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z"
            style="fill:#ff9a03" />
        </svg>
      </span>
      <button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#"
        style="border: 1px dotted #5cfa07">
        <i class="fas fa-bars"></i>
      </button>
      <div class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0"></div>
      <!-- Navbar-->
      <ul class="navbar-nav ml-auto ml-md-0">
        <li class="nav-item dropdown no-arrow mx-1 my-auto">
          <a class="dropdown-toggle nav-link"  href="#">
      <span class="badge badge-danger badge-counter">3+</span>
      <i class="fas fa-bell fa-fw"></i>
    </a>
          <div class="dropdown-menu dropdown-menu-right dropdown-list animated--grow-in">
            <h6 class="dropdown-header">Notifications</h6>
            <a class="d-flex align-items-center dropdown-item" href="#">
              <div class="mr-3">
                <div class="bg-primary icon-circle">
                  <i class="fas fa-file-alt text-white"></i>
                </div>
              </div>
              <div>
                <span class="small text-gray-500">Date Of Notification</span>
                <p>Change Made</p>
              </div>
            </a>
            <a class="text-center dropdown-item small text-gray-500" href="#">Show All Alerts</a>
          </div>
        </li>
        <div class="topbar-divider" style="border-right: 1px dashed #333;"></div>
        <li class="nav-item dropdown my-auto " role="presentation">
          <div class="nav-item dropdown ">
            <a class="dropdown-toggle nav-link" href="#">
      <span class="d-none d-lg-inline mr-2 text-green-600 small" :style="{ color: '#7cef06' }">{{ fullName }}</span>
      <img class="border rounded-circle img-profile" :src="userData.profilePhotoUrl" alt="Profile Photo" />
    </a>
            <div  class="dropdown-menu shadow dropdown-menu-right animated--grow-in " role="menu">
              <a class="dropdown-item userdrp " role="presentation" href="#">
                <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Profile
              </a>
              <a class="dropdown-item userdrp" role="presentation" href="#">
                <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Settings
              </a>
              <a class="dropdown-item userdrp" role="presentation" href="#">
                <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Activity log
              </a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item userdrp" role="presentation" href="#">
                <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Logout
              </a>
            </div>
          </div>
        </li>
      </ul>
    </nav>
    <div id="layoutSidenav">
      <div v-if="showMainContent" id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion sb-sidenav-dark bg-gradient-danger" id="sidenavAccordion">
          <div class="navbar-brand d-flex xalign-items-center sidebar-brand m-0">
          </div>
          <hr style="width:98%;background-color:#5cfa07; margin-top: 0.5em; margin-bottom: 0.5em;">
          <div class="sb-sidenav-menu">
            <div v-if="!isAdmin" class="nav">
              <a class="nav-link mysidenavlinks" href="/" id="dashboard">
                <div class="sb-nav-link-icodn">
                  <i class="fas fa-tachometer-alt"></i>&nbsp;Dashboard
                </div>
              </a>
              <a class="nav-link mysidenavlinks" href="/carpool">
                <div class="sb-nav-link-icson">
                  <i class="fas fa-solid fa-car"></i>&nbsp;Car Share
                </div>
              </a>
              <a v-if="isManager" class="nav-link mysidenavlinks" href="/schedular">
                <div class="sb-nav-link-icson">
                  <i class="fas fa-solid fa-calendar-plus"></i>&nbsp;Schedular
                </div>
              </a>
              <div class="sb-sidenav-menu-heading">Other</div>
              <a class="nav-link mysidenavlinks" href="#">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-chart-area"></i>&nbsp;Activity Logs
                </div>
              </a>
              <a class="nav-link mysidenavlinks" href="#">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-cogs"></i>&nbsp;Settings
                </div>
              </a>
              <a class="nav-link mysidenavlinks" href="#">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-address-card"></i><span>&nbsp;Profile</span>
                </div>
              </a>
              <hr style="width:98%;background-color:#5cfa07; margin-top: 0.5em; margin-bottom: 0.5em;">
              <a class="nav-link" href="login"  @logout="logout">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-door-open"></i>&nbsp;Log Out
                </div>
              </a>
            </div>
            <!--AdminSidebar-->
            <div v-else>
              <div class="nav">
                <a class="nav-link mysidenavlinks" href="/" id="dashboard">
                <div class="sb-nav-link-icodn">
                  <i class="fas fa-solid fa-database"></i>&nbsp;Database
                </div>
              </a>
              <!-- <a class="nav-link mysidenavlinks" href="/#">
                <div class="sb-nav-link-icson">
                  <i class="fas fa-solid fa-people-roof"></i>&nbsp;Manage User Data
                </div>
              </a> -->
              <div class="sb-sidenav-menu-heading">Other</div>
              <a class="nav-link mysidenavlinks" href="#">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-chart-area"></i>&nbsp;Activity Logs
                </div>
              </a>
              <a class="nav-link mysidenavlinks" href="#">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-cogs"></i>&nbsp;Settings
                </div>
              </a>
              <a class="nav-link mysidenavlinks" href="#">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-address-card"></i><span>&nbsp;Profile</span>
                </div>
              </a>
              <hr style="width:98%;background-color:#5cfa07; margin-top: 0.5em; margin-bottom: 0.5em;">
              <a class="nav-link" href="login"  @logout="logout">
                <div class="sb-nav-link-icxon">
                  <i class="fas fa-door-open"></i>&nbsp;Log Out
                </div>
              </a>
              </div>
            </div> 
          </div>
          <div class="sb-sidenav-footer">
            <div class="small">Logged in as:</div>
            <span style="color: #7cf900">{{ fullName }}</span>
          </div>
        </nav>
      </div>
      <div id="layoutSidenav_content">
        <main>

          <router-view></router-view>
          <div v-if="showMainContent" class="fixed-bottom" id="fixedbottom">
            <Footer></Footer>
          </div>
        </main>
      </div>
    </div>
  </body>
</template>

<script>
import $ from 'jquery'
import Footer from '@/components/FooterComponent.vue'
import { mapState} from 'vuex'
import {getAuth, signOut} from 'firebase/auth'

export default {
  data(){
    return{
      showNotifications: false,
      showUserProfile: false,
    }
  },

  components: {
    Footer
  },


  computed: {
    // getting userData
    ...mapState({
      userData: (state) => state.userData,
    }),

    isManager() {
      return this.$store.state.userData.isManager;
        
      },

      isAdmin(){
        return this.$store.state.userData.isAdmin;
      },

    fullName() {
      return `${this.userData.firstName} ${this.userData.lastName}`;
    },
    showMainContent() {

      return this.$route.name !== 'login' && this.$route.name !== 'signup';
    }

  },


  methods: {

      fetchUserData(){
        this.$store.dispatch('fetchUserData');
      },

      logout() {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                console.log("User has logged out!!");
                this.$router.push("/login");
            })
                .catch((error) => {
                console.log(error);
            });
        },

    },

    created() {
      this.fetchUserData();
    },


    mounted() {
  // Use jQuery's ready function to make sure the DOM is fully loaded
  $(document).ready(() => {

    // Toggle the side navigation for sidebarToggle
    $("#sidebarToggle").on("click", function (e) {
      e.preventDefault();
      $("body").toggleClass("sb-sidenav-toggled");
    });

    // Toggle the side navigation for hidesidebar (if it exists)
    $("#hidesidebar").on("click", function (e) {
      console.log('In Exit click');
      e.preventDefault();
      $("body").toggleClass("sb-sidenav-toggled");
    });

    // Toggle dropdowns
    $(".nav-link.dropdown-toggle, .nav-item.dropdown .dropdown-toggle").on('click', function (e) {
      e.preventDefault();
      $(this).next('.dropdown-menu').toggle();
    });

    // Close dropdowns if clicked outside
    $(document).on('click', function (event) {
      if (!$(event.target).closest('.dropdown').length) {
        $('.dropdown-menu').hide();
      }
    });
  });
}

}



</script>

<style></style>





