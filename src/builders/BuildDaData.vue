<template lang="pug">
  
#buildDaData 
  //- button(class='saveFB') save to firebase?
  //- .v
  //- button(id='built' class='throb' @click='nextPage(6)') choose Viz Type
  #instructions
    p you can save this dataset for future use, or continue to choosing a visualisation
    .tooltip
      span(class='tooltiptext tooltip-under')
        | you can save both the CSV and metadata to use later
      router-link(to='/save2fb' class='throb' id='save2fb') save data?
    .h
    router-link(to='/chooseviz' class='throb' id='built') choose Viz Type

</template>


<script>

import {EventBus} from './../main'
import * as d3 from 'd3'

export default {

methods: {

  main(allDaMeta) {
    const {dimMeta, candMeta} = allDaMeta

    const dimData = this.buildAllDimData(dimMeta, candMeta)
    const candiData = this.buildCandiData(candMeta, dimData, dimMeta)

    // store em
    this.$store.dispatch('setDimData', dimData)
    this.$store.dispatch('setCandiData', candiData)

    document.getElementById('idd').setAttribute('disabled', 'disabled')
   
  },

  buildAllDimData(dimMeta, candMeta) {
    const {alphas, crits, dimNames, ID, maxis} = dimMeta
    const {candidates, ignores} = candMeta

    let allDimData = {}

    dimNames.forEach((dimName, d) => {
      const alpha = alphas.includes(d)
      const crit = crits.includes(d)
      const maxi = maxis.includes(d)
      const isID = (d == ID)

      // need scores from each cand
      let scores = []
      candidates.forEach((cand, c) => {
        let score = cand[d]
        if (ignores.includes(c)) {
          score = false
        }
        scores.push(score)
      })

      let stats = false
      let rankings = false
      let norm = false
      if (!alphas.includes(d)) {
        stats = this.calcStats(scores)
        rankings = this.calcRankings(scores)
        norm = this.normaliseScores(scores)
      }

      const dimData = {
        dimName, alpha, crit, maxi, isID, scores, norm, rankings, stats
      }
      allDimData[d] = dimData
    })

    return allDimData
  },

  calcStats(scores) {
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const mean = d3.mean(scores)
    const stdDev = d3.deviation(scores)

    return {min, max, mean, stdDev}
  },

  calcRankings(scores) {
    let rankings = []
    const sorted = [...scores].sort((a,b) => a-b)
    
    scores.forEach((score, i) => {
      let rank = sorted.indexOf(scores[i])
      rankings.push(rank)
    })
    
    return rankings
  },
  
  normaliseScores(scores) {
    // what about maxis??? need to reverse something
    if (!this.alpha) {
      let normScores = []
      const min = Math.min(...scores)
      const max = Math.max(...scores)
      const range = max - min
      
      scores.forEach((score) => {
        const norm = (score - min)/range
        normScores.push(norm)
      })
      return normScores
    }
    return false
  },

  buildCandiData(candMeta, dimData, dimMeta) {
    const {candidates, ignores} = candMeta
    const {ID} = dimMeta

    let candiData = []
    candidates.forEach((cand, c) => {
      const candKey = c
      const candID = cand[ID]
      const scores = cand
      const ignored = (ignores.includes(c))

      // build rankings, for each dimension
      let rankings = []
      let norm = []
      Object.entries(dimData).forEach(([d, dimObj]) => {
        let rankForDim = false
        let normForDim = false
        if (dimObj.crit) {
          rankForDim = dimObj.rankings[c]
          normForDim = dimObj.norm[c]
        }
        rankings.push(rankForDim)
        norm.push(normForDim)
      })

      const meanRank = d3.mean(rankings)
      const meanNorm = d3.mean(norm)

      const candObj = {candKey, candID, scores, rankings, meanRank, norm, meanNorm, ignored, paretoFront:-1, sups:[], peers:[], infs:[]}
      candiData.push(candObj)
    })
    return candiData
  },

  // mean(arr) {
  //   let length = 0
  //   arr.forEach((a) => {
  //     if (a !== false) {    // ignore false elements
  //       length++
  //     }
  //   })
  //   const total = arr.reduce((total, e) => {
  //     return total + e
  //   }, 0)
  //   const mean = total / length
  //   return mean
  // },

  nextPage(newPage) {
    EventBus.$emit('changePage', newPage)
  }
},

created() {
  EventBus.$on('catMetaBuilt', (allDaMeta) => {
    this.main(allDaMeta)
  })
}
}
</script>


<style lang="stylus" scoped>

.saveFB
  background $g3
  color blue

#instructions
  margin 0.5rem 0
  background $g7
  padding 0.25rem 1rem
  width 600px
  // height 400px

</style>
