<template lang="pug">
  
  #list
    h1 candidates
    #candList
      //- todo need to make this div scrollable
      .cand(v-for='(name,i) in candNames')
        button(:ID="'cand' + i" class='nameBtn'
                @click='eyeClicked(i)'
                @mouseover='flashPath(i, true)'
                @mouseout='flashPath(i, false)'
              ) {{name}}
          icon(name='eye' class='eye' scale=1.2)
         
        button(:ID="'bulb' + i" class='bulbBtn'
                @click='bulbClicked(i)'             
              )
          icon(name='lightbulb-o' class='bulb' scale=1.3)
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
  // this.colorCandButtons()
  this.main()
},

data() {
  return {
    unfaded: [], lit: [],   // todo get rid of these and change fade(i)
    nCands: 0, nLit: 0, nFaded: 0, nDims: 0, candColors: [], candPalette: [],
    dimsAll: [], candsAll: [], pathsAll: [],
    // superData: {dimsAll: [], candsAll: [], pathsAll: [] },  // computed?
  }
},

computed: {
  $DimData() {
    return this.$store.getters.getDimData
  },
  $DimMeta() {
    return this.$store.getters.getDimMeta
  },
  $SelectedCands() {
    return this.$store.getters.getSelectedCands
  },
  $CandiData() {
    return this.$store.getters.getCandiData
  },
  candNames() {
    return this.$SelectedCands.map(sC => sC.name)
  }
  
},

methods: {
  main() {
    this.setupCands()
    // this.setChartEvents()
  },

  setupCands() {
   this.$SelectedCands.forEach((c, i) => {
      my.$('cand' + i).style.background = c.colour
      my.$('bulb' + i).style.background = c.colour
    })
  },

  

  eyeClicked(i) {
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

  myXY(x, y) {
    return 'translate(' + x + ',' + y + ')'
  },

  randomColor() {
    // todo may be better to evenly distribute (with minor randomness),
    // then shuffle the colors throughout pallete,
    // so this function will either return whole pallete
    // or random unchosen one
    var h = d3.randomUniform()() * 360
    var myS = d3.randomUniform(0.2, 1)() * 100
    var myL = d3.randomUniform(0.3, 1)() * 100
    // console.log('hsv', Math.round(h), Math.round(myS), Math.round(myL))
    return 'hsl(' + h + ', ' + myS +'%, ' + myL + '%)'
    // }
  },

  // // make palette of n colors 'evenly' thru hue wheel
  // randomPalette(n) {
  //   // var n = this.nCands
  //   var slice = 360/n
  //   var h = [], s = [], l = []
  //   var palette = []

  //   // numbers to tweak - should s = f(l) or vv? qq
  //   const minS = 0.7, maxS = 1
  //   const minL = 0.2, maxL = 0.7

  //   for (var i=0; i<n; i++) {
  //     // h.push(slice * i * d3.randomUniform(0.9, 1.1)())
  //     h.push(slice * i * d3.randomUniform(0.9, 1.1)())
  //     s.push(d3.randomUniform(minS, maxS)() * 100)
  //     l.push(d3.randomUniform(minL, maxL)() * 100)
  //   }
  //   d3.shuffle(h)
    
  //   h.forEach((hue, i) => {
  //     // this.candColors.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
  //     palette.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
  //   })
  //   return palette
  // },

  // colorCandButtons() {
  //   this.candsAll.forEach((cand, c) => {
  //     let candBtn = my.$('cand' + c)
  //     let bulbBtn = my.$('bulb' + c)
  //     candBtn.style.background = this.candColors[c]
  //     bulbBtn.style.background = this.candColors[c]
  //   })
  // },

  // $(ID) {
  //   return document.getElementById(ID)
  // },

} // end methods  

}
</script>


<style lang="stylus" scoped>

// html 
//   height 100%

// body
//   height 100%
//   overflow hidden
//   display flex
//   margin 0

.column
  height 100%
  display flex
  flex-direction column

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
  

.bottom
  flex-grow 1
  overflow-y auto

.top-left {
    flex-shink: 0;
}

.top-right {
    flex-shrink: 0;
    display: inline-flex;
}
svg
  background-color $g3
  // position fixed


button
  color $g0
  margin-bottom 0.5rem
  border 3px solid transparent
  box-sizing border-box
  padding 0.5rem
  margin-right 0.25rem

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
