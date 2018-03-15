<template lang="pug">
  
#list
  h1 candidates
  #candList
  button(id='fader' @click='fadeAll') fade all
  //- button(@click='fadeAll(false)') reset all
  //- button(@click='main') new palette


</template>


<script>

import * as d3 from 'd3'
import * as my from '../../../builders/my'
import {EventBus} from '../../../main'


export default {
mounted() {
   this.main()
},

data() {
  return {
    // nFaded: 0,
    // nCands: 0, nLit: 0, nFaded: 0, nDims: 0, 
    // candColors: [], candPalette: [],
    // dimsAll: [], candsAll: [], pathsAll: [],
    // superData: {dimsAll: [], candsAll: [], pathsAll: [] },  // computed?
    // cands: [], 
    candNames: [], dimmed: new Set(), allfaded: false
  }
},

computed: {
  $SelectedData() {
    return this.$store.getters.getSelectedData    
  },
  cands() {
    return this.$store.getters.getSelectedData.cands    
  }
},

methods: {
  main() {
    this.showCandList()
  },

  showCandList() {
    this.candNames = this.cands.map(c => c.name)

    // build cand list name/eye buttons
    d3.select('#candList')
        .selectAll('button')
        .data(this.cands)
        .enter()
          .append('div')
            .attr('class', 'pathButtons')
          .append('button')
            .text(d => d.name )
            .attr('id', (d, i) => 'name' + i)
            .style('background', d => d.colour)
            .classed('nameBtn', true) // ? has to be in main.styl
            .on('mouseover', (d, i) => this.flash(i, true))
            .on('mouseout', (d, i) => this.flash(i, false))
            // .on('click', (d, i) => this.dim2(i))
            .on('click', (d, i) => this.checkDimmed(i))
            // .on('click', (d, i) => this.nameClicked(i))
            .append('img')
              .attr('src', my.eye18)
              .classed('eye', 'true')
            
    // add bulbs, don't need data/enter, already have selectable nodes
    d3.select('#candList')                      
        .selectAll('div')
          .append('button')
            .style('background', d => d.colour)
            .classed('bulbBtn', true)
            .append('img')
              .attr('src', my.bulb18)
              .attr('id', (d, i) => 'bulb' + i)
  },

  flash(i, yesNo) {
    d3.select('#name' + i).classed('flash', yesNo)    
    EventBus.$emit('flashPath', i, yesNo)
    EventBus.$emit('fatPath', i, yesNo)
  },

  dim(i, yesNo) {    
    d3.select('#name' + i).classed('dimmedButton', yesNo)    
    EventBus.$emit('dimPath', i, yesNo)
  },

  checkDimmed(i) {
    const alreadyDimmed = this.dimmed.delete(i)
    if (!alreadyDimmed) {
      this.dimmed.add(i)
    }
    this.dim(i, !alreadyDimmed)
  },

  fadeAll() {
    if (this.allfaded) {
      d3.select('#fader').text('fadeAll')
      this.dimmed.clear()
    } else {
      d3.select('#fader').text('un fadeAll')
    }
    this.allfaded = !this.allfaded
    for (var i=0; i<this.candNames.length; i++) {
      this.dim(i, this.allfaded)
    }
  },

  


} // end methods  

}
</script>


<style lang="stylus" scoped>

#list
  background $g5
  padding 1rem
  flex-shrink 0
  
// need to refer to main.styl to change chart css!

</style>
