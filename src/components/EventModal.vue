<template>
    <div>
      <div class="modal" v-if="event" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ event.title }}</h5>
            <button type="button" class="close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Start: {{ formatDate(event.start) }}</p>
            <p>End: {{ formatDate(event.end) }}</p>
            <p>Location: {{ event.location }}</p>
            <!-- Add other event details as needed -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    props: {
      event: {
        type: Object,
        required: true,
      },
    },
    methods: {
      closeModal() {
        this.$emit("close");
      },
      formatDate(date) {

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
}

return new Date(date).toLocaleString('en-UK', options)
    },

      
    },
  };
  </script>
  
  <style>
 .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
}

.modal-close {
  margin-top: 10px;
  cursor: pointer;
}
  </style>
  