<template lang='pug'>

#sidebar
  ParetoSidebar(v-show='open')
  //- todo should be dynamic! ie if page=pareto 


</template>


<script>

import {EventBus} from './../main'
// todo - generalise!
import ParetoSidebar from './../pages/viz/pareto/ParetoSidebar'

export default {

components: {
  ParetoSidebar
},

data() {
  return {
    open: false,
  }
},

methods: {
  main() {
  },

  $(ID) {
    return document.getElementById(ID)
  },

  toggle: function() {
    this.open = !this.open
    let sid = this.$('sidebar')
    sid.style.width = sid.offsetWidth >= 50 ? '0px' : '150px'
    sid.style.padding = 0
  }
},

created() {
  EventBus.$on('sidebarToggled', () => {
    this.toggle()
  })

  EventBus.$on('sidebarOpen', () => {
    this.openUp()
    let sid = this.$('sidebar')
    sid.style.paddingLeft = '0.5rem'    
  })
},

mounted() {
  this.main()
}

}
</script>


<style lang='stylus' scoped>

#sidebar
  width 0px
  background $g3
  padding-top 0.25rem
  padding-left 0.5rem
  border-right 2px solid $g2

</style>
