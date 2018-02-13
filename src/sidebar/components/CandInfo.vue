<template lang="pug">

#candInfo
  #info(v-show='candL > 0')
    .data
      .name {{cand1.candID}}
      .rank mean Rank {{cand1.meanRank}}  / {{candL}}
      .score mean Norm Score {{meanNorm(1)}}
    .databar
      .bar(v-for='(crit, c) in crits')
        .top(:id="'topA'+c") {{critInit(c)}}
        .bottom(:id="'bottA'+c")
    .databar2
      .bar(v-for='(crit, c) in crits')
        .top(:id="'topB'+c") {{critInit(c)}}
        .bottom(:id="'bottB'+c")
    .data2
      .name {{cand2.candID}}
      .rank mean Rank {{cand2.meanRank}}  / {{candL}}
      .score mean Norm Score {{meanNorm(2)}}
  
  #instr(v-show='candL < 1')
    p Hover over a node for info
    p Click on a node for dominance

</template>


<script>

import {EventBus} from './../../main'

export default {

computed: {
  dimMeta() {
    return this.$store.getters.getDimMeta
  },
  crits() {
    return this.dimMeta.crits
  },
  
  
},
methods: {
  $(ID) {
    return document.getElementById(ID)
  },

  meanNorm(cand) {
    let thisCand = this.cand1
    if (cand == 2) {
      thisCand = this.cand2
    }
    return thisCand.meanNorm.toFixed(3)
  },

  databar(cand) {
    let thisCand = this.cand1
    let letter = 'A'
    if (cand == 2) {
      thisCand = this.cand2
      letter = 'B'
    }
      let x = 0
    thisCand.norm.forEach((n, i) => {
      if (n) {
        let topID = 'top' + letter + x
        let top = this.$(topID)
        // console.log('top', topID)
      
        top.style.height = 80 * n + 'px'
        x++
      }
    })
  }
},


data() {
  return {
    critInit(c) {
      return this.dimMeta.dimNames[this.crits[c]][0]
    },
    candL: 0,
    cand2: {meanNorm:-1},
    cand1: {candID: 'click on a node', meanRank: -1, meanNorm: -1}
  }
},

// listen to click on node event to change candKeyloop[]
mounted() {
  EventBus.$on('nodeSelected', ([cand, length]) => {
    this.cand1 = cand
    // this.candL = length
    this.databar(1)   
  })
  
  EventBus.$on('showCandInfo', ([cand, length]) => {
    this.cand2 = cand
    this.candL = length
    this.databar(2)
  })  
}

}
</script>


<style lang="stylus" scoped>

#info
  width 800px
  height 80px
  display flex
  margin 0 0 0 1rem

.data, .data2
  max-width 230px
  min-width 230px

.name
  color $g9
  font-size 1.25rem

.databar, .databar2
  height 80px
  display flex

.databar2, .data2
  padding-left 0.5rem

.bar
  width 20px   // should be set according to critsL
  background blue

.top
  background green
  height 20px
  text-align center

  
#instr p
  margin 0
  color $g9
  font-size 1.52rem
  padding 0.5rem 0 0 1rem
  animation flash linear 2s infinite

</style>
