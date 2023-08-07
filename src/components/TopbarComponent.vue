<template>
   <body class="sb-nav-fixed" id="page-top">
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark" id="upnavbar">
        <!-- Navbar Search-->
        <Span class="navbar-brand d-none d-md-inline-block">Timetrackr <svg class="logo"
                xmlns="http://www.w3.org/2000/svg" viewBox="-10 2 200 30">
                <path
                    d="M16 1a14.86 14.86 0 0 0-9.33 3.26L6 4.83V2a1 1 0 0 0-2 0v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.71l.23-.2A12.86 12.86 0 0 1 16 3 13 13 0 1 1 3 16a1 1 0 0 0-2 0A15 15 0 1 0 16 1z"
                    style="fill:#039be5" />
                <path d="m19.79 21.21-4.5-4.5A1 1 0 0 1 15 16V7a1 1 0 0 1 2 0v8.59l4.21 4.2a1 1 0 0 1-1.42 1.42z"
                    style="fill:#ff9a03" />
            </svg></span>
        <button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#"
            style="border: 1px dotted #01fddd;"><i class="fas fa-bars"></i></button>

        <div class="d-none d-md-inline-block form-inline ml-auto mr-0 mr-md-3 my-2 my-md-0"></div>


        <!-- Navbar-->
        <ul class="navbar-nav ml-auto ml-md-0">
            <li class="nav-item dropdown no-arrow mx-1 my-auto" role="presentation">
                <div class="nav-item dropdown no-arrow"><a class="dropdown-toggle nav-link" data-toggle="dropdown"
                        aria-expanded="false" href="#"><span class="badge badge-danger badge-counter">3+</span><i
                            class="fas fa-bell fa-fw"></i></a>
                    <div class="dropdown-menu dropdown-menu-right dropdown-list dropdown-menu-right animated--grow-in"
                        role="menu">
                        <h6 class="dropdown-header">Notifications</h6>
                        <a class="d-flex align-items-center dropdown-item" href="#">
                            <div class="mr-3">
                                <div class="bg-primary icon-circle"><i class="fas fa-file-alt text-white"></i></div>
                            </div>
                            <div><span class="small text-gray-500">Date Of Notification</span>
                                <p>Change Made</p>
                            </div>
                        </a>
                        <a class="text-center dropdown-item small text-gray-500" href="#">Show All Alerts</a>
                    </div>
                </div>
            </li>
            
            <div class="shadow dropdown-list dropdown-menu dropdown-menu-right" aria-labelledby="alertsDropdown"></div>
            
            <div class="topbar-divider" stxyle="border-right: 1px dashed #333;"></div>
            <li class="nav-item dropdown my-auto " role="presentation">
                <div class="nav-item dropdown "><a class="dropdown-toggle nav-link" data-toggle="dropdown"
                        aria-expanded="false" href="#"><span class="d-none d-lg-inline mr-2 text-green-600 small"
                            style="color: #7cef06">User</span>UserImg</a>
                    <div class="dropdown-menu shadow dropdown-menu-right animated--grow-in " role="menu">
                        <a class="dropdown-item userdrp " role="presentation" href="#"><i
                                class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Profile</a>
                        <a class="dropdown-item userdrp" role="presentation" href="#"><i
                                class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Settings</a>
                        <a class="dropdown-item userdrp" role="presentation" href="#"><i
                                class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Activity log</a>
                        <div class="dropdown-divider"></div><a class="dropdown-item userdrp" role="presentation"
                            href="#"><i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>&nbsp;Logout</a>
                    </div>
                </div>
            </li>
        </ul>
    </nav>
  </body>
</template>

<script>

export default {


 
  
}
</script>

<style >
/* CSS styles go here */
</style>
