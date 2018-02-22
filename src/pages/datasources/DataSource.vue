<template lang="pug">

#page
  h1 Choose a dataset
  .v
  icon(name='database' scale=8)
  .h
  icon(name='upload' scale=8)
  .h
  icon(name='tasks' scale=8)
  .v
  
  #text
    p First, you need to get some data.
    p Either by uploading a CSV file from your computer,
    p or you can pick from an exciting range of sources.
  .v
  
  #links 
    router-link(to='/csvsource')
      icon(name='folder-open' scale=4)
      p get data from CSV file
    .h
    router-link(to='/fbsource' id='firebase')
      icon(name='cloud' scale=4)
      p get data from firebase
    .h
 
  
</template>


<script>

import {EventBus} from './../../main'

export default {
  mounted() {
    EventBus.$emit('changePage', 1)
  }
}
</script>




<style lang="stylus" scoped>

#links
  width 600px

a
  width 275px

#firebase
  background $g3


</style>
