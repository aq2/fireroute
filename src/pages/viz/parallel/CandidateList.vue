<template lang="pug">
  
#list
  h1 candidates
  #candList
  button(@click='fadeAll') fade all 
  button(@click='resetAll') reset all 
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
    nFaded: 0,
    // nCands: 0, nLit: 0, nFaded: 0, nDims: 0, 
    // candColors: [], candPalette: [],
    // dimsAll: [], candsAll: [], pathsAll: [],
    // superData: {dimsAll: [], candsAll: [], pathsAll: [] },  // computed?
    // cands: [], 
    candNames: [], 
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
            .attr('id', (d, i) => 'cand' + i)
            .style('background', d => d.colour)
            .classed('nameBtn', true) // ? has to be in main.styl
            .on('mouseover', (d, i) => this.flashPath(i, true))
            .on('mouseout', (d, i) => this.flashPath(i, false))
            // .on('mouseout', (d, i) => this.lightEye(i))    
            .on('click', (d, i) => this.nameClicked(i))
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

   flashPath(i, yesNo) {
    EventBus.$emit('flashPath', i, yesNo)
  },

   nameClicked(i) {
    const cand = this.cands[i]
    const faded = cand.faded
    if (faded) {
      this.unfadeName(i)
      this.unfadePath(i)
      this.unfaded--
    } else {
      this.fadeName(i)
      this.fadePath(i)
      this.unfaded++      
    }
  },

  fadeName(i) {
    const cand = this.cands[i]
    cand.faded = true
    this.changeButton(i, 0.5, true)  // dotted=true
  },

  changeButton(i, opac, dotted) {
    var btn = my.$('cand' + i)
    btn.style.opacity = opac
    btn.style.border = '3px solid transparent'         
    if (dotted) {
      btn.style.border = '3px dotted #567'    
    } 
  },


  fadePath(i) {
    // should send a message
    EventBus.$emit('fadePath', i)

    var id = '#path' + i
    d3.select(id)
      .style('stroke-width', '3')
      .style('stroke-dasharray', ('8, 8'))
      .style('opacity', '0.5')
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
