<template lang="pug">

#pViz
  #vizz
    .front(v-for='front in fronts') 
      .node(v-for='node in front' :ID='node'
            @mouseover='showInfo(node)' @click='select(node)') {{candName(node)}}
        .value(:ID="'nodeSpan'+node")

</template>


<script>

import {EventBus} from '../../../main'

export default {

computed: {
  candiData() {
    return this.$store.getters.getCandiData
  },
  candMeta() {
    return this.$store.getters.getCandMeta
  },
  fronts() {
    return this.candMeta.fronts
  },
  dimMeta() {
    return this.$store.getters.getDimMeta
  },
  dimData() {
    return this.$store.getters.getDimData
  }
},

data() {
  return {
    orderMethod: "rank",
    colourMethod: "rank"
  }
},

methods: {
  main() {
    // set height of #viz or pViz?
    let vizz = this.$('vizz')

    let mainH = this.$('main').offsetHeight
    let headerH = this.$('header').offsetHeight
    let articleH = mainH - headerH - 20

    // pViz.style.height = articleH + 'px'
    vizz.style.height = articleH + 'px'

    this.orderAllNodes()
    this.colourAllNodes()
  },

  $(ID) {
    return document.getElementById(ID)
  },
    
  orderAllNodes() {
    this.candiData.forEach(cand => {
      this.orderANode(cand.candKey)
    })
  },

  colourAllNodes() {
    this.candiData.forEach(cand => {
      this.colourANode(cand.candKey)
    })
  },
  
  candName(c) {
    return this.candiData[c].candID
  },

  colourANode(c) {
    let candiData = this.candiData
    const candsL = candiData.length

    let cand = candiData[c]
    let score, normScore

    if (this.colourMethod == 'rank') {
      score = cand.meanRank
      // aveRanking spreads from 0 to 100 ??
      normScore = score * 100 / candsL
    } else 
    if (this.colourMethod == 'score') {
      score = cand.meanNorm
      // norm ranking spreads from 0 to 100?
      normScore = score * 100
      console.log(c, normScore)
    }

    let nodeEl = this.$(c)
    // magic numbers = arbitrary 'nice' colour
    nodeEl.style.background = 'hsla(214, 60%, ' + (100-normScore) + '%, 0.9'
    nodeEl.style.opacity = 1

  },

  orderANode(c) {
    let candiData = this.candiData
    const candsL = candiData.length
    let cand = candiData[c]
    // console.log('c', cand)
    let score, normScore

    if (this.orderMethod == 'rank') {
      score = cand.meanRank
      // aveRanking spreads from 0 to 113 ??
      normScore = (score * 100 / candsL)
    } else 
    if (this.orderMethod == 'score') {
      score = cand.meanNorm * 100
      // norm ranking spreads from 0 to 100?
      normScore = score
    }
    let nodeEl = this.$(c)
    nodeEl.style.order = parseInt(normScore) //qq
    // need some sort of ranking

    nodeEl.style.opacity = 1
    
    // show value of each candidate
    const nodeSpan = this.$('nodeSpan'+c)
    nodeSpan.style.width = (score * 1) + '%'
    // nodeSpan.innerHTML = this.orderMethod + ' ' + score.toFixed(1)
    nodeSpan.innerHTML = score.toFixed(1)
  },

  showDimValues(d) {
    // show dim stats for each node
    const candiData = this.candiData
    candiData.forEach((cand) => {
      // get normalised score for dimension for candidate
      const myNorm = cand.norm[d]
      const node = this.$(cand.candKey)
      node.style.opacity = 1

      // change span width of each candidate
      const nodeSpan = this.$('nodeSpan'+cand.candKey)
      nodeSpan.style.width = (myNorm*100) + '%'
      
      nodeSpan.innerHTML = cand.scores[d]
    })
  },

  // todo - yuck?
  orderBy(meth) {
    this.orderMethod  = meth
    this.orderAllNodes()
  },

  colourBy(meth) {
    this.colourMethod  = meth
    this.colourAllNodes()
  },

  select(candID) {
    //todo unhighlight previously clicked node

    // show dominances - functionate?
    const cand = this.candiData[candID]
    
    const inferiors = cand.infs
    const superiors = cand.sups

    // go through all candidates
    this.candiData.forEach((cand,c) => {
      c = Number(c)
      const node = this.$(c)
      if (inferiors.includes(c)) {
        // node.style.background = 'red'
        // node.classList.add('red')
        node.style.opacity = '1'
      } 
      else
      if (superiors.includes(c)) {
        // node.style.background = 'green'
        node.style.opacity = '1'
                
      } 
      else
      if (candID == c) {
        // it's this
        // node.style.background = 'white'
        node.style.opacity = '1'

      } 
      else {
        // it's other
        node.style.opacity = '0.3'
      }
    })

    // send message
    EventBus.$emit('nodeSelected', ([cand, this.candiData.length]))
  },

  showInfo(candID) {
    const cand = this.candiData[candID]    
    EventBus.$emit('showCandInfo', ([cand, this.candiData.length]))
  }

},

created() {
  EventBus.$on('showDimValues', (d) => {
      this.showDimValues(d)
  }),

  EventBus.$on('orderBy', (meth) => {
      this.orderBy(meth)
  }),

  EventBus.$on('colourBy', (meth) => {
      this.colourBy(meth)
  })
},

mounted() {
  this.main()
}

}

</script>


<style lang="stylus" scoped>

#pViz
  display flex  // expands sideways
  margin-top 1rem

#vizz
  flex-grow 1
  display flex  // makes fronts fill screen
  background $g45
  flex-direction column
  justify-content space-between
  // transition 2s all ease
  

.front
  display flex // run sideways
  flex-wrap wrap
  background $g5
  min-height 1rem
  padding 0.25rem 0
  justify-content space-evenly
  // transition 2s all ease

.node
  width 140px
  height 2.75rem
  font-size 1rem
  padding 0.05rem
  text-align center
  border 2px solid $g3
  border-radius 0.5rem
  margin 0.4rem 0.75rem 0.25rem 0
  transition .51s all ease
  color black
  // text-shadow 0.5px 0.5px blue  
  // font-weight bold
  // background #992

.value
  // color #aa0
  color yellow 
  background green


.node:hover
  cursor pointer
  animation flash linear 2s infinite


.red 
  // background red(#000, 255)
  background blend(rgba(red, 0.5))

</style>
