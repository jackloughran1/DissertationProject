<template>
<div class="wrapper" :class="{ click_collapse: sidebarCollapsed }">
    <TopbarComponent :firstName="firstName" :lastName="lastName"/>
    <div class="container" :class="{ click_collapse: sidebarCollapsed }">
      <h1 class="text-center my-4">{{ firstName }}'s Calendar View</h1>
      <div id="calendar"></div>
    </div>
    <SidebarComponent :isManager="isManager" @logout="logout"/>
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


}

</script>

<style>

</style>