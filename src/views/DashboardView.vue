<template>
  <div class="wrapper" :class="{ click_collapse: sidebarCollapsed}">
    <div class="topbar">
      <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path
          d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z"
          style="fill:#039be5" />
        <path d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z"
          style="fill:#ff9a03" />
      </svg>
      <div class="menu">
        <div class="hamburger" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </div>
      </div>
    </div>

    <div class="sidebar" :style="{ width: sidebarWidth}">
      <div class="sidebar_container">
        <ul>
          <li>
            <a href="#">
              <span class="icon"><i class="fa fa-qrcode"></i></span>
              <span class="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span class="icon"><i class="fa fa-qrcode"></i></span>
              <span class="text">Link</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span class="icon"><i class="fa fa-qrcode"></i></span>
              <span class="text">Something else</span>
            </a>
          </li>
        </ul>
        <div class="logout">
          <button @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'DashboardView',

  data(){
    return {
      sidebarCollapsed : false,
    };
  },
  computed: {
    sidebarWidth(){
      return this.sidebarCollapsed ? '100px' : '250px';
    },
  },
  methods: {
    toggleSidebar(){
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }
  };

</script>

<style>

.topbar{
  position: fixed;
  top: 0;
  left: 0;
  height: 100px;
  background-color: darkcyan;
  display: flex;
  align-items: center;
  width: 100%;
}

.logo{
  width: 100px;
  margin: 20px;
  padding: 0 25px;
  border-right: 1px solid #f5f5f5
}

.topbar .menu{
  padding: 0 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

.topbar .hamburger{

  width: calc(100% - 250px);
  cursor: pointer;
  font-size: 25px;
  color: white;


}

.topbar .hamburger:hover{

  color: #007dc3;
}

.sidebar{
  position: fixed;
  top: 100px ;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: cyan;
  transition: width 0.2s;
}

.sidebar_container{
  display: flex;
  flex-direction: column;
}


.click_collapse .sidebar{
  width: 100px;
  padding-right: 20px;
  
}

.click_collapse .sidebar ul li a .text{
  display: none;
}

.sidebar ul li a{
  display: block;
  padding: 16px 25px;
  border-bottom: 1px solid #409f9d;
}

.logout{
  margin-top: auto;
  padding: 16px 25px;
  text-align: center;
}

.logout button{
  padding: 8px 16px;
  border: none;
  cursor: pointer
}






</style>
  