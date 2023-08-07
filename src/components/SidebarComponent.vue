<template>
        <div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav-dark bg-gradient-danger" id="sidenavAccordion">
                <div class="navbar-brand d-flex  xalign-items-center sidebar-brand m-0">
                </div>

                <hr style="width:98%;background-color:#fcfafa; margin-top: 0.5em; margin-bottom: 0.5em;">
                <div class="sb-sidenav-menu">
                    <div class="nav">

                        <a class="nav-link mysidenavlinks" href="#" id="dashboard" linkpageurl="calendar.html">
                            <div class="sb-nav-link-icodn"><i class="fas fa-tachometer-alt"></i>&nbsp;Dashboard</div>
                        </a>

                        <a class="nav-link mysidenavlinks" href="#" linkpageurl="carshare.html">
                            <div class="sb-nav-link-icson"><i class="fas fa-solid fa-car"></i>&nbsp;Car Share</div>
                        </a>


                        <div class="sb-sidenav-menu-heading">Other</div>
                        <a class="nav-link mysidenavlinks" href="#">
                            <div class="sb-nav-link-icxon"><i class="fas fa-chart-area"></i>&nbsp;Activity Logs</div>
                        </a>
                        <a class="nav-link mysidenavlinks" href="#">
                            <div class="sb-nav-link-icxon"> <i class="fas fa-cogs"></i>
                                &nbsp;Settings</div>
                        </a>

                        <a class="nav-link mysidenavlinks" href="#">
                            <div class="sb-nav-link-icxon">
                                <i class="fas fa-address-card"></i><span>&nbsp;Profile</span>
                            </div>
                        </a>

                        <hr style="width:98%;background-color:#fcfafa; margin-top: 0.5em; margin-bottom: 0.5em;">
                        <a class="nav-link" href="index.html">
                            <div class="sb-nav-link-icxon"><i class="fas fa-door-open"></i>&nbsp;Log Out</div>

                        </a>
                    </div>
                </div>
                <div class="sb-sidenav-footer">
                    <div class="small">Logged in as:</div>
                    <span style="color: #7cf900">User</span>
                </div>
            </nav>
        </div>

     
  </template>
  

<script>
import { getAuth, signOut } from 'firebase/auth'
import $ from 'jquery'

export default {
  name: 'SidebarComponent',


  methods: {


        // logout method
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

    mounted() {
  $('#sidebarToggle').on('click', (e) => {
    e.preventDefault();
    $('body').toggleClass('sb-sidenav-toggled');
  });

  $('#hidesidebar').on('click', (e) => {
    console.log('In Exit click');
    e.preventDefault();
    $('body').toggleClass('sb-sidenav-toggled');
  });
}


}

</script>

<style>


</style>