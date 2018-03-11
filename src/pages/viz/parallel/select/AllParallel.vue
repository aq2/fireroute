<template lang="pug">
  
#page  
  #text
    p You've chosen to view all the data candidates
    p There are {{candL}} of them in your dataset.
    p This may lead to a cluttered diagram.
    button(@click='selected') I can handle {{candL}} lines
    .h
    button(@click='goBack') let's go back
  ParallelBuilder

</template>

<script>

import ParallelBuilder from './../ParallelBuilder'
import {EventBus} from '../../../../main'

export default {

components: {
  ParallelBuilder
},

computed: {
    candL() {
      const cands = this.$store.getters.getCandMeta.candidates
      return cands.length
    },
    candiMeta() {
      return this.$store.getters.getCandiMeta
    },
  },
  methods: {
    selected() {
      var selectedCands = Array.from(Array(this.candL).keys())
      // makes [0,1,2,...n-1]

      // do we need to do this?
      // this.$store.dispatch('setSelectedCands', selectedCands)

      // send message to ParallelBuilder
      EventBus.$emit('candsSelected', selectedCands)

      // this.$router.push('/parViz')
    },
    goBack() {
      this.$router.push('/parallel')      
    }
  }
}
</script>
