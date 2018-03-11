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
    // nCands: 0, nLit: 0, nFaded: 0, nDims: 0, 
    // candColors: [], candPalette: [],
    // dimsAll: [], candsAll: [], pathsAll: [],
    // superData: {dimsAll: [], candsAll: [], pathsAll: [] },  // computed?
    cands: [], candNames: [], 
  }
},

computed: {
  $SelectedData() {
    return this.$store.getters.getSelectedData    
  }
},

methods: {
  main() {
    this.setupCands()
  },

  setupCands() {
    this.cands = this.$SelectedData.cands
    this.candNames = this.cands.map(c => c.name)

    // d3-ize it
    d3.select('#candList')
        .selectAll('button')
        .data(this.cands)
        .enter()
          .append('div')
            .attr('class', 'pathButtons')
          .append('button')
            .html(d => d.name )
            .attr('id', (d, i) => 'cand' + i)
            .style('background', d => d.colour)
            .classed('buttonC', true) // ? has to be in main.styl
            .on('mouseover', (d, i) => this.fadeEye(i))
            .on('mouseout', (d, i) => this.lightEye(i))    
            .on('click', (d, i) => this.eyeClicked(i))

    // don't need data and enter, as we already have selectable nodes
    d3.select('#candList')                      
        .selectAll('div')
          .append('button')
            .html('S')
            .attr('id', (d, i) => 'bulb' + i)
            .style('background', d => d.colour)
            .style('opacity', '0.4')

  },

  eyeClicked(i) {
    this.fadeEye(i)
    // qq but lost in mouseout!
  },

  eyeClickedO(i) {
    if (this.unfaded[i]) {
      this.fadeEye(i)
      this.fadePath(i)
      this.unfaded[i] = false
      this.nFaded++
      // might have to unlite if in solo
      if (this.lit[i]) {
        this.unLightBulb(i)
        this.lit[i] = false
        this.nLit--
      }
    } else {
      // todo if all faded, should lightbulb etc
      this.lightEye(i)
      this.lightPath(i)
      this.unfaded[i] = true
      if (this.nFaded <= this.nCands) {
        this.lightBulb(i)
        this.nLit++
      }
      this.nFaded--
      // might have to light it if in solo mode
      if (this.nLit > 0) {
        this.lightBulb(i)
        this.lit[i] = true
        this.nLit++
      }
    }
  },

  bulbClicked(i) {
    // when do i fade all others?
    if (this.lit[i]) {
      this.unLightBulb(i)
      this.fadeEye(i)
      this.fadePath(i)
      this.lit[i] = false
      this.unfaded[i] = false
      this.nLit--
    } else {
      this.lightBulb(i)
      this.lightEye(i)
      this.lightPath(i)
      this.lit[i] = true
      this.unfaded[i] = true
      this.nLit++
      if (this.nLit < 2) {
        // need to fade all eyes/paths, apart from i of course!
        this.fadeAllEyes()
        this.lightEye(i)
        this.fadeAllPaths()
        this.lightPath(i)
        for (var j=0, l=this.nCands; j<l; j++) {
          this.unfaded[j] = true
        }
        this.unfaded[i] = true
        this.lit[i] = false
      }
    }
  },
  
  fadeEye(i) {
    this.changeButton(i, 0.5, true)  // dotted=true
  },

  lightEye(i) {
    this.changeButton(i, 1, false)  // dotted=false    
  },

  fadeAll() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadeEye(i)
      this.unfaded[i] = false
      this.fadePath(i)
      this.unLightBulb(i)
      this.lit[i] = false
    }
    this.nLit = 0
    this.nFaded = this.nCands
  },
    
  resetAll() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.lightEye(i)
      this.unfaded[i] = true
      this.lightPath(i)
      this.unLightBulb(i)
      this.lit[i] = false
    }
    this.nLit = 0
  },

  fadeAllEyes() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadeEye(i)
    }
  },

  fadeAllPaths() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadePath(i)
    }
  },

  lightPath(i) {
    var id = '#path' + i
    d3.select(id)
      .style('stroke-width', '4')    
      .style('stroke-dasharray', ('0, 0'))
      .style('opacity', '1')      
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

  flashPath(i, yesNo) {
    var id = '#path' + i
    d3.select(id).classed('flash', yesNo)
  },

  flashEye(i, yesNo) {
    var id = '#cand' + i
    d3.select(id).classed('flash', yesNo)
  },

  changeButton(i, opac, dotted) {
    var btn = 'cand' + i
    my.$(btn).style.opacity = opac
    my.$(btn).style.border = '3px solid transparent'         
    if (dotted) {
      my.$(btn).style.border = '3px dotted #567'    
    } 
  },

  lightBulb(i) {
    my.$('bulb'+i).style.opacity = '1'    
  },

  unLightBulb(i) {
    // my.$('bulb'+i).style.background = this.candColors[i]
    my.$('bulb'+i).style.opacity = '0.33'    
  },



} // end methods  

}
</script>


<style lang="stylus" scoped>


#payge
  margin 0
  display flex
  overflow hidden
  // height 100%
  // box-sizing border-box
  

#gfx
  // overflow-y auto
  // flex-grow 1

#list
  background $g5
  padding 1rem
  flex-shrink 0
  

.nameBtn
  width 160px
  font-size 1rem
  padding 0.5rem
  margin 0

button:hover
  background-color $g2

.eye, .bulb
  color $g0
  background none

.eye
  margin-left 0.5rem
  // margin-top 15px

.bulbBtn
  opacity 0.3

// need to refer to main.styl to change chart css!

</style>
