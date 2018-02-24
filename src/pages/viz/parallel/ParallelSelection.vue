<template lang="pug">

#page
  h1 Choose Candidates
  .v
  icon(name='check-square-o' scale=8)

  #text
    p <b>Select candidates to include in the plot.</b>
    p The plot can get cluttered, so you may not want to view all candidates.
    p Here you can specify a subset.
  .v

  #links
    router-link(to='/allPar')
      icon(name='arrows-v' scale=4)
      p select all ({{candL}} items)
    .h
    router-link(to='/manPar')
      icon(name='check-square-o' scale=4)
      p manual checkbox selection
    .v
    router-link(to='/paretoPar')
      icon(name='users' scale=4)
      p pareto front peers
    .h
    router-link(to='/fracPar')
      icon(name='percent' scale=4)
      p fractional selection


</template>


<script>


export default {
  computed: {
    candiData() {
      return this.$store.getters.getCandiData
    },
    candL() {
      return this.candiData.length
    },
  },
  methods: {
    // chooseAllCands() {
    //   var selection = Array.from(Array(this.candL).keys())
    //   this.$store.dispatch('setSelectedCands', selection)
    //   EventBus.$emit('typeSelected', 'AllParallel')      
    // }
  }
}
</script>


<style lang="stylus" scoped>

#links
  width 600px

a
  width 275px
  min-height 150px
  padding 1rem
  

</style>
