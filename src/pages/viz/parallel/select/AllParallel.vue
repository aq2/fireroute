<template lang="pug">
  
#page  
  #text
    p You've chosen to view all the data candidates
    p There are {{candL}} of them in your dataset.
    p This may lead to a cluttered diagram.
    button(@click='selected') I can handle {{candL}} lines
    .h
    button(@click='goBack()') let's go back


</template>

<script>
// import * as my from './../../../../builders/my'

export default {

computed: {
    // candiData() {
    //   return this.$store.getters.getCandiData
    // },
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
      // var palette = my.randomPalette(this.candL)

      var selectedCands = Array.from(Array(this.candL).keys())
      console.log(selectedCands)
      // makes [0,1,2,...n-1]

      // var selectedCands = []
      // for (var selKey=0, l=this.candL; selKey<l; selKey++) {
      //   var name = this.candiData[selKey].candID
      //   var candKey = this.candiData[selKey].candKey
      //   var colour = palette[selKey]
      //   var lit = false
      //   var faded = false
      //   var candObj = {selKey, name, candKey, colour, lit, faded}
      //   selectedCands.push(candObj)
      // }

      this.$store.dispatch('setSelectedCands', selectedCands)
      this.$router.push('/parViz')
    },
    goBack() {
      this.$router.push('/parallel')      
    }
  }
}
</script>
