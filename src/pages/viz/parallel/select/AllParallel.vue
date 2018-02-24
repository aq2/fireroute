<template lang="pug">
  
#page  
  #text
    p You've chosen to view all the data candidates
    p There are {{candL}} of them in your dataset.
    p This may lead to a cluttered diagram.
    button(@click='doViz()') I can handle {{candL}} lines
    .h
    button(@click='goBack()') let's go back


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
    doViz() {
      // store array of all candidate indices
      var selection = Array.from(Array(this.candL).keys()) // makes [0,1,2,...n-1]
      this.$store.dispatch('setSelectedCands', selection)
      this.$router.push('/parViz')
    },
    goBack() {
      this.$router.push('/parallel')      
    }
  }
}
</script>
