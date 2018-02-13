<template lang="pug">

#paretoSidebar
  #dims
    h3 dimensions
    .dim(v-for='(dim,d) in dimNames' :ID="'dim'+d" v-if='dimCrit(d)'
      @click='showDim(d)') {{dim}}
      .stats(:ID="'span'+d")
        p range: {{stats(d).min}} - {{stats(d).max}}
        p mean:{{(stats(d).mean)}} sd:{{stats(d).stdDev}}
  hr
  #order
    h3 order by
    //- radio buttons? - or
    label mean rank
      input(type='radio' value=1 @click="orderBy('rank')" v-model='ordBy')
      span(class='checkmark radio')
    label mean score
      input(type='radio' value=2 @click="orderBy('score')" v-model='ordBy')
      span(class='checkmark radio')
  hr
  #colour
    h3 colour by
    label mean rank
      input(type='radio' value=1 @click="colourBy('rank')" v-model='colBy')
      span(class='checkmark radio')
    label mean score
      input(type='radio' value=2 @click="colourBy('score')" v-model='colBy')
      span(class='checkmark radio')
    //- radio buttons?
  hr
  //- #search
    h3 search
    | insert search here

</template>


<script>

import {EventBus} from '../../../main'

export default {
computed: {
  candiData() {
    return this.$store.getters.getCandiData
  },
  dimMeta() {
    return this.$store.getters.getDimMeta
  },
  dimData() {
    return this.$store.getters.getDimData
  },
  dimNames() {
    return this.dimMeta.dimNames
  },
  crits() {
    return this.dimMeta.crits
  }
},

data() {
  return {
    ordBy: 1,      // sets default radio for orderBy
    colBy: 1,      // sets default radio for orderBy
    candName: 'click a node',
    aveRank: -1,
    aveScore: -1,
    currentNode: -1,
    oldNode: -1
  }
},

methods: {
  showDim(d) {
    // reset color for t'others
    const allDims = [...document.getElementsByClassName('dim')]
    allDims.forEach(d => {
      d.style.color = '#111'
    })

    // set color for clicked dim
    const dim = document.getElementById('dim' + d)
    dim.style.color = '#780'

    // change span widths in viz
    EventBus.$emit('showDimValues', d)
  },

  dimCrit(d) {
    return (this.crits.includes(d))
  },

  stats(d) {
    const stats = this.dimData[d].stats
    let roundStats = {}
    Object.entries(stats).forEach(([k,v]) => {
      roundStats[k] = Math.round(v)
    })
    return roundStats
  },

  orderBy(meth) {
    // emit event to viz
    EventBus.$emit('orderBy', meth)
  },

  colourBy(meth) {
    // emit event to viz
    EventBus.$emit('colourBy', meth)
  },

  showCandInfo(candInfo) {
    this.candName = candInfo.candID
    this.aveRank = candInfo.meanRank.toFixed(5)
    this.aveScore = candInfo.meanNorm.toFixed(5)
  }

},

created() {
  EventBus.$on('nodeClicked', candInfo => {
    this.showCandInfo(candInfo)
  })
}
}

</script>


<style lang="stylus" scoped>

#paretoSidebar
  display flex
  flex-direction column

label 
  margin 0
  width 120px

label span
  margin-left 105px

.checkmark
  background-color $g4

.dim
  // color green
  margin-bottom 0.5rem

.stats p
  color $g7

p 
  margin 0
  padding 0
  font-size 0.95rem

h3  
  margin 0
  padding 0
  margin-bottom 0.25rem

hr 
  border 0
  width 100px
  margin 0.5rem auto
  border-top 2px dotted $g5

button
  padding 0.25rem 
  font-size 0.75rem

#candName
  color $g8

.dim:hover
  cursor pointer
  color white

</style>
