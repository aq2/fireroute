<template lang="pug">
  
#payge
  ParallelPlot(v-if='stuffCalculated')
  CandidateList(v-if='stuffCalculated')


</template>


<script>

// import * as d3 from 'd3'
import ParallelPlot from './ParallelPlot'
import CandidateList from './CandidateList'

export default {

mounted() {
  this.main()
},

components: {
  ParallelPlot, CandidateList
},

computed: {
  $DimData() {
    return this.$store.getters.getDimData
  },
  $DimMeta() {
    return this.$store.getters.getDimMeta
  },
  $SelectedCands() {
    return this.$store.getters.getSelectedCands
  },
  $CandiData() {
    return this.$store.getters.getCandiData
  },
  candNames() {
    return this.$SelectedCands.map(sC => sC.name)
  }
},

data() {
  return {
    stuffCalculated: false
  }
},

methods: {
  main() {

  }
}


}
</script>


<style lang="stylus" scoped>

#payge 
  display flex

</style>
