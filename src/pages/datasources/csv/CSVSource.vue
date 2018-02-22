<template lang="pug">

#page
  h1 get data from csv
  .v
  icon(name='file-text-o' scale=8)
  .v
  #text
    p You've opted to load data from a file.
    p File must be in CSV format, with criteria headers as first row, eg:
    pre
      | city,state,population,land area<br>
      | seattle,WA,652405,83.9
      | new york,NY,8405837,302.6
      | boston,MA,645966,48.3
      | kansas city,MO,467007,315.0
  .v

  #button
    ReadCSV


</template>


<script>

import ReadCSV from './ReadCSV.vue'
import {EventBus} from '../../../main'

export default {
  components: {
    ReadCSV,
  },
  mounted() {
    EventBus.$emit('changePage', 2)
},
}
</script>
