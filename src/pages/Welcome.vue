<template lang="pug">

#page
  h1 Welcome to HyperDViz
  .v
  
  icon(name='bar-chart' scale=8)
  icon(name='area-chart' scale=8)
  icon(name='line-chart' scale=8)
  icon(name='pie-chart' scale=7)
  .v

  #text
    p It's better to run this app in full-screen mode, either:
    ul
      li toggled with F11, or 
      
      li with the 
        span(id='restore')
          icon(name='window-restore' scale=1.25)
        | button at top-right
      
      li or the nice big button below
        .v2
        button(@click='fullScreen') let's go fullscreen
    
    p press the 'next page' button below to continue
  .v

  router-link(to='/datasource') next page


</template>


<script>

import {EventBus} from './../main'

export default {
mounted() {
  EventBus.$emit('changePage', 0)
},
methods: {
  fullScreen() {
    EventBus.$emit('fullScreen')
  }
}

}

</script>


<style lang="stylus" scoped>

#restore
  margin 0 0.25rem 0 0.15rem

li 
  margin-bottom 0.5rem

.v2
  height .5rem

</style>
