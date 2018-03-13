<template lang="pug">
  
#payge
  ParallelPlot
  CandidateList


</template>


<script>

import ParallelPlot from './ParallelPlot'
import CandidateList from './CandidateList'

export default {

components: {
  ParallelPlot, CandidateList
},

}
</script>


<style lang="stylus" scoped>

#payge 
  display flex
  margin 0.5rem

</style>
