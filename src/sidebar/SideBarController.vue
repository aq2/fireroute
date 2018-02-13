<template lang="pug">

//- aside 

SideBar(v-if='currentPage == 7 || currentPage == 9')

</template>


<script>

import {EventBus} from './../main'
import SideBar from './Sidebar'

export default {

components: {
  SideBar
},

data() {
  return {
    currentPage: 0
  }
},

created() {
  // need to listen to changePage event
  EventBus.$on('changePage', page => {
    this.currentPage = page
  })
}

}

</script>

<style lang="stylus" scoped>

// aside
//   background blue
//   max-height 100vh
//   min-height 99.999vh

</style>
