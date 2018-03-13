<template lang="pug">
  
  #build data builder

</template>


<script>

import {EventBus} from '../../../main'
import * as my from './../../../builders/my'

export default {

created() {
  EventBus.$on('candsSelected', candIndices => {
    this.selectedIndices = candIndices
    this.main()
  })
},

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
},


data() {
  return {
    selectedIndices: [], 
    cands: [], dims: []
  }
},

methods: {

main() {
  this.buildDims()
  this.buildSelectedCands()
  this.storeAllData()
},

buildDims() {
  const nDims = this.dimMeta.crits.length
  const dimsPalette = my.randomPalette(nDims)

  let key = 0
  Object.values(this.dimData).forEach((dimD) => {  
    if (dimD.crit) {
      const {dimName, scores} = dimD
      // this.dimScores.push(scores)
      const {min, max} = dimD.stats
      const dimColor = dimsPalette[key]

      const dimObj = {key, dimName, scores, min, max, dimColor}
      this.dims.push(dimObj)
      // this.dimNames.push(dimName)
      key++
    }
  })
},

buildSelectedCands() {
  const candIndices = this.selectedIndices
  const nCands = candIndices.length
  const palette = my.randomPalette(nCands)
  
  candIndices.forEach((cI, i) => {
    const selKey = i
    const cand = this.candiData[cI]
    const name = cand.candID
    const candKey = cand.candKey

    const candScores = []
    this.dims.forEach(dim => {
      dim.scores.forEach((dimScore, n) => {
        if (i == n) {
          candScores.push(dimScore)
        }
      })
    })

    const colour = palette[i]
    const lit = false
    const faded = false
    const candObj = {selKey, name, candKey, candScores, colour, lit, faded}
    this.cands.push(candObj)
  }) 
},



storeAllData() {
    const selectedData = {dims: this.dims, cands: this.cands}
    this.$store.dispatch('setSelectedData', selectedData)
    this.$router.push('/parViz')
}

}  // end methods


}
</script>
