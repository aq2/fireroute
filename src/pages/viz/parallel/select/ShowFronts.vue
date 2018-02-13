<template lang="pug">
  
#page
  #buttons
    button(v-for='(front, i) in fronts' @click='front(i)' @mouseover='showCands(i)') front {{i}}
      p ({{front.length}} candidates)
    .v
  
  #search
    button search for candidate
  
  #candidates(v-if='f != null')
    p Candidates in front {{f}}:
    span(v-for='cand in selectedFront') {{candiData[cand].candID}},&nbsp;


</template>


<script>

export default {
  
computed: {
  candMeta() {
    return this.$store.getters.getCandMeta
  },
  candiData() {
    return this.$store.getters.getCandiData
  },
  fronts() {
    return this.candMeta.fronts
  },
  selectedFront() {
    return this.fronts[this.f]
  }
},

data() {
  return {
    f: null
  }
},


methods: {
  showCands(f) {
    this.f = f
    
  }
}

}
</script>


<style lang="stylus" scoped>

#buttons
  max-width 800px
  display flex
  flex-wrap wrap
  // background red

button
  min-width 200px
  margin-right 1rem
  margin-bottom 1rem

#candidates
  max-width 400px
  // display flex

</style>
