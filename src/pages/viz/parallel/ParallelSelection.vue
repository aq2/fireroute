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
    button(id='all' @click="choose('AllParallel')")
      icon(name='arrows-v' scale=4)
      p select all ({{candL}})
    .h
    button(id='manual' @click="choose('ManParallel')")
      icon(name='check-square-o' scale=4)
      p manual checkbox selection
    .v
    button(id='front' @click="choose('ParetoParallel')")
      icon(name='users' scale=4)
      p pareto front peers
    .h
    button(id='frac' @click="choose('FracParallel')")
      icon(name='percent' scale=4)
      p fractional selection


</template>


<script>

import {EventBus} from '../../../main'

export default {
  computed: {
    candiData() {
      return this.$store.getters.getCandiData
    },
    candL() {
      return this.candiData.length
    }

  },
  methods: {
    choose(selectionType) {
      EventBus.$emit('typeSelected', selectionType)
    }
  }
}
</script>




<style lang="stylus" scoped>

#links
  width 600px

button
  width 275px
  padding 1rem
  

</style>
