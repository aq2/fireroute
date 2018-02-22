<template lang="pug">

#page
  h1 Choose vizType
  icon(name='bar-chart' scale=8)
  .h
  icon(name='line-chart' scale=8)
  .h
  icon(name='pie-chart' scale=8)
  .v

  #text
    p please choose a visualisation type
  .v

  #links
    //- button(id='pareto' @click='nextPage(7)')
    //-   icon(name='bicycle' scale=4)
    //-   p pareto dominance plot
    //- .h   
    //- button(id='parallel' @click='nextPage(8)')
    //-   icon(name='line-chart' scale=4)
    //-   p parallel plot
    router-link(to='/pareto' id='pareto')
      icon(name='bicycle' scale=4)
      p pareto dominance plot
    .h   
    router-link(to='/parallel' id='parallel')
      icon(name='line-chart' scale=4)
      p parallel plot
  

</template>


<script>

import {EventBus} from './../../main'

export default {

methods: {
  nextPage(newPage) {
    EventBus.$emit('changePage', newPage)
  }
},
 mounted() {
    EventBus.$emit('changePage', 6)
  }

}
</script>


<style lang="stylus" scoped>

#links
  width 600px

button
  min-width 275px
  min-height 200px


</style>
