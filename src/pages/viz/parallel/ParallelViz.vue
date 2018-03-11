<template lang="pug">
  
#payge
  ParallelPlot
  CandidateList


</template>


<script>

// import * as my from '../../../builders/my'
import ParallelPlot from './ParallelPlot'
import CandidateList from './CandidateList'

export default {

mounted() {
  // this.main()
},

components: {
  ParallelPlot, CandidateList
},

// computed: {
//   $DimData() {
//     return this.$store.getters.getDimData
//   },
//   $DimMeta() {
//     return this.$store.getters.getDimMeta
//   },
//   $SelectedCandsData() {
//     return this.$store.getters.getSelectedCandsData
//   },
//   $CandiData() {
//     return this.$store.getters.getCandiData
//   },
//   candNames() {
//     return this.$SelectedCands.map(sC => sC.name)
//   }
// },

// data() {
//   return {
//     stuffCalculated: false,
//     dimsAll: [], dimNames: [], dimScores: [],
//     candsAll: []
//   }
// },

// methods: {
//   main() {
//     // calculateStuff
//     // this.setupDims()
//     // this.setupCands()
    
//     // this.storeAllData()
//     // this.stuffCalculated = true
//   },
  
//   setupDims() {
//     const nDims = this.$DimMeta.crits.length
//     const dimsPalette = my.randomPalette(nDims)

//     let key = 0
//     Object.values(this.$DimData).forEach((dimD) => {  
//       if (dimD.crit) {
//         const {dimName, scores} = dimD
//         this.dimScores.push(scores)
//         const {min, max} = dimD.stats
//         const dimColor = dimsPalette[key]

//         //    scales and axes
//           // const xValue = this.chartWidth * key / (this.nDims - 1)

//           // const yScale = d3.scaleLinear()
//           //                   .domain([min, max])
//           //                   .range([this.chartHeight, 0])
          
//           // const yAxis = d3.axisLeft(yScale)

//           // this.yAxes.push(yAxis)
//           // this.yScales.push(yScale)

//           // const candYs = []
//         //

//         const dimObj = {key, dimName, scores, min, max, dimColor}
//         this.dimsAll.push(dimObj)
//         this.dimNames.push(dimName)
//         key++
//       }
//     })  
//   },

//   setupCands() {
//     const selectedCands = this.$SelectedCands
//     const nCands = selectedCands.length
//     const candiData = this.$CandiData
//     const candsPalette = my.randomPalette(nCands)
    
//     Object.values(selectedCands).forEach((cand, i) => {
//       const key = i
//       const name = candiData[cand].candID
//       const candScores = []
      
//       Object.values(this.dimsAll).forEach((dimObj, d) => {
//         dimObj.scores.forEach((score, n) => {
//           if (i == n) {
//             candScores.push(score)
//           }
//         })
//       })
//       const lit = true
//       const hidden = false
//       const colour = candsPalette[i]

//       const candObj = {key, name, candScores, colour, lit, hidden}
//       this.candsAll.push(candObj)
//     })
    
//   },

//   storeAllData() {
//     const selectedCandsData = {dims: this.dimsAll, cands: this.candsAll}
//     this.$store.dispatch('setSelectedCandsData', selectedCandsData)
//   }

// }  // end methods
}
</script>


<style lang="stylus" scoped>

#payge 
  display flex
  margin 0.5rem

</style>
