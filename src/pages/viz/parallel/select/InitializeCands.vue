<template lang="pug">
  
  #inits

</template>


<script>

import {EventBus} from '../../../../main'
import * as d3 from 'd3'

export default {
  computed: {
    candiData() {
      return this.$store.getters.getCandiData
    }
  },
  methods: {
    main() {
      const candiData = this.candiData
      var miniCands = []
      var candiNitials = new Set()
      
      candiData.forEach((cand) => {
        const candID = cand.candID
        const candKey = cand.candKey
        const miniCand = {key:candKey, ID:candID}
        miniCands.push(miniCand)
        candiNitials.add(candID[0])
      })

      // need to sort the initials set
      // convert into array, sort it, convert to set
      const initialsArray = [...candiNitials]
      initialsArray.sort()
      // const sortedInitials = new Set(initialsArray.sort())
      // console.log(sortedInitials)
      
      d3.select('#inits')
        .selectAll('div')
        .data(initialsArray)
        .enter()
        .append('div')
        .attr('id', (d) => d)
        .text((d) => d)
        .attr('class', 'cap')

      miniCands.forEach((mC) => {
        const {key, ID} = mC
        // console.log(ID)
        const init = ID[0]
        d3.select('#'+init)
          .append('p')
          .classed('init', true)
          .append('label')
          .classed('plainlabel', true)
          .append('span')
          .text(ID)
          .classed('lay', true)
          .append('input')
          .attr('type', 'checkbox')
          .attr('name', 'checkedCands')
          .attr('value', key)
          .classed('check', true)
          // .select('label')
          // .append('span')
          // .classed('checkmark', true)
        
      })

      d3.selectAll('label')
        .insert('span')
        .classed('checkmark', true)

      // sortedInitials.forEach((initial) => {
      //   miniCands.forEach((mC) => {
      //     if (mc.ID[0] == initial) {

      //     }
      //   })
      // })
    }
  },
  mounted() {
    this.main()
  }
}
</script>


<style lang="stylus" scoped>

#inits
  display flex
  flex-wrap wrap


.init
  // font-size 3rem
  color white

.cap
  color orange
  background red

</style>
