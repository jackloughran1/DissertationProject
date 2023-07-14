<template>
  <div>
    <TopbarComponent :firstName="firstName" :lastName="lastName" @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    <div class="wrapper" :class="{ click_collapse: sidebarCollapsed }">
      <SidebarComponent :isManager="isManager" :sidebarCollapsed="sidebarCollapsed"/>
      <div class="container" :class="{ click_collapse: sidebarCollapsed }">
        
        <h1 class="text-center my-4">CRUD Operations</h1>
        <div id="calendar"></div>
      </div>
    </div>
  </div>

</template>

<script>
import TopbarComponent from '../components/TopbarComponent.vue';
import SidebarComponent from '../components/SidebarComponent.vue';

export default{
    name: 'SchedularView',
    
    components: {
    TopbarComponent,
    SidebarComponent,
  },

  data(){
    return{
    sidebarCollapsed: false,
    isManager: false,
 } 

},

computed: {
        // ternary operator if true/false
        sidebarWidth() {
            return this.sidebarCollapsed ? "0" : "250px";
        },
    },

    methods: {
      toggleSidebar(collapsed) {
    this.sidebarCollapsed = collapsed;
  },
}

}

</script>

<style>

</style>