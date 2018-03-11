<template lang="pug">
  
#gfx(class='column')
  //- h1(class='top-right') gig    // todo filename?
  svg(id='mySvg')
  
</template>


<script>

import * as d3 from 'd3'
import {EventBus} from '../../../main'

export default {

created() {
  EventBus.$on('fadePath', i => {
    this.fadePath(i)
  })
},

mounted() {
  this.main()
},


data() {
  return {
    svgHeightRatio: 0.75, svgWidthRatio: 0.8,  // fractions of window 
    margin: 60, // 2*30
    windowW: window.innerWidth, windowH: window.innerHeight,
    dimNames: [],   // could be computed from superdata
    candNames: [],  // could be computed from superdata
    unfaded: [], lit: [],   // todo get rid of these and change fade(i)
    nCands: 0, nLit: 0, nFaded: 0, nDims: 0,
    svgHeight: 0, svgWidth: 0, 
    chartHeight: 0, chartWidth: 0,
    svg:{}, chartGrp: {},
    yAxes: [], yScales: [],
    dimsAll: [], candsAll: [], pathsAll: [],
    superData: {dimsAll: [], candsAll: [], pathsAll: [] },  // computed?
    
  }
},

computed: {
  $DimData() {
    return this.$store.getters.getDimData
  },
  $DimMeta() {
    return this.$store.getters.getDimMeta
  },
  $SelectedData() {
    return this.$store.getters.getSelectedData
  },
  $CandiData() {
    return this.$store.getters.getCandiData
  },
  
},

methods: {
  main() {
    this.initChart()
    // this.initDimsAll()
    const dims = this.calcDimsScales()
    const cands = this.calcCandsScales()
    const allData = {cands, dims}
    this.$store.dispatch('setSelectedData', allData)
    
    this.setupChart()
    // this.randomPalette(this.nCands)
    this.plotCircles()
    this.plotPaths()
    // this.setChartEvents()
  },

  initChart() {
    // set size of svg 
    this.svgHeight = Math.round((this.windowH - 100) * this.svgHeightRatio)  // 100 = headerHeight
    this.svgWidth = Math.round(this.windowW * this.svgWidthRatio)
    this.chartHeight = this.svgHeight - this.margin
    this.chartWidth = this.svgWidth - this.margin
    
    // the whole svg
    this.svg = d3.select('#mySvg')
                  .attr('height', this.svgHeight)
                  .attr('width', this.svgWidth)
    
    // drawable area of chart, inside the margin
    this.chartGrp = this.svg
                        .append('g')
                          .attr('class', 'chart')
                          .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },

  calcDimsScales() {
    const dims = this.$SelectedData.dims
    // const cands = this.$SelectedData.cands
    this.nDims = dims.length

    dims.forEach((dimD) => {  
        const {key, min, max} = dimD

        const xValue = this.chartWidth * key / (this.nDims - 1)

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        const yAxis = d3.axisLeft(yScale)

        this.yAxes.push(yAxis)
        this.yScales.push(yScale)

        dimD.xValue = xValue
        dimD.yScale = yScale
        dimD.yAxis = yAxis
    })
    
    // console.log('dims', dims)
    return dims
  },

  calcCandsScales() {
    // for each cand, calc x/y from scales and candScores
    const cands = this.$SelectedData.cands
    const dims = this.$SelectedData.dims

    cands.forEach((cand, i) => {
      const yVals = []
      const xVals = []

      cand.candScores.forEach((score,j) => {
        var valY = Math.round(dims[j].yScale(score))
        yVals.push(valY)
        var candX = Math.round(this.chartWidth * j / (this.nDims - 1))
        xVals.push(candX)        
      })

      cand.yVals = yVals
      cand.xVals = xVals
    })
    return cands
  },

  setupChart() {
    // setup axes
    this.axesGrp = this.chartGrp.append('g')
                        .attr('class', 'axes')
 
    // setup shared x scale and axis
    this.xScale = d3.scalePoint()
                      .domain(this.dimNames)
                      .range([0, this.chartWidth])

    this.xAxis = d3.axisBottom(this.xScale)
                    .tickPadding(5)
 
    this.axesGrp.append('g')
            .attr('id', 'xAxis')
            .call(this.xAxis)
            .attr('transform', this.myXY(0, this.chartHeight))

    this.yAxesGrp = this.axesGrp.append('g')
                    .attr('class', 'yAxes')

    const dims = this.$SelectedData.dims
    dims.forEach((dimObj) => {
       this.yAxesGrp.append('g')
              .attr('class', 'yAxis' + dimObj.key)
              .call(dimObj.yAxis)
              .attr('transform', this.myXY(this.chartWidth * dimObj.key / (this.nDims - 1), 0))
    })

    // add a new group for circles
    this.circlesGrp = this.chartGrp.append('g')
                              .attr('class', 'circles')

    // and then the paths
    this.pathsGrp = this.chartGrp.append('g')
                              .attr('class', 'paths')
  },

  plotCircles() {
    // for each dim, plot circles
    const dims = this.$SelectedData.dims
    
    dims.forEach((dimO, dimN) => {
      // plot points on axis for dimension scores
      var dimCircles = this.circlesGrp.append('g')
                        .attr('class', 'circle' + dimN)
      dimCircles.selectAll('circle.' + dimO.dimName)                        
        .data(dimO.scores)                           
        .enter()
          .append('circle')
          .attr('class', () => dimO.dimName)                
          .attr('id', (d, cand) => dimO.dimName + cand)                
          .attr('cx', () => this.chartWidth*dimN/(dims.length - 1.0))
          .attr('cy', (d) =>  dimO.yScale(d))
          .attr('r', '5')
          .attr('fill', dimO.dimColor)
    })
  },

  plotPaths() {

    //
    // need to build up candScores from dimScores
    let candScores = [] //, candNames = []
    let selectedCands = this.$SelectedData.cands

    // // get the candIDs for naming
    // selectedCands.forEach((c) => {
    //   this.candNames.push(this.$CandiData[c].candID)
    //   candScores.push([])
    //   // this.candColors.push(this.randomColor())     // qq
    // })
    
    // ok, what about the lines?
    // path generator to build line
    const line = d3.line()
                    .x((d, i) => (this.chartWidth*i/(this.nDims - 1)))
                    .y(d => d)
                    .curve(d3.curveMonotoneX)

    // append paths for each candidate - todo use enter() etc?
    selectedCands.forEach((cand, c) => {
      this.pathsGrp.append('path')
              .attr('d', line(cand.yVals))
              .attr('class', 'path')
              .attr('id', 'path' + c)
              .attr('fill', 'none')
              .attr('stroke', cand.colour)
              .attr('stroke-width', '4px')
    }) 
  }, 

  setChartEvents() {
    d3.selectAll('path')
      .on('mouseover', () => {
        const pathID = d3.event.srcElement.id
        var p = pathID.slice(4)
        this.flashEye(p, true)
        this.flashPath(p, true)
      })
      .on('mouseout', () => {
        const pathID = d3.event.srcElement.id
        var p = pathID.slice(4)
        this.flashEye(p, false)
        this.flashPath(p, false)
      })
      .on('click', () => {
        const pathID = d3.event.srcElement.id
        var p = pathID.slice(4)
        this.bulbClicked(p)
        // this.flashPath(p, false)
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
    this.$(btn).style.opacity = opac
    this.$(btn).style.border = '3px solid transparent'         
    if (dotted) {
      this.$(btn).style.border = '3px dotted #567'    
    } 
  },

  lightBulb(i) {
    this.$('bulb'+i).style.opacity = '1'    
  },

  unLightBulb(i) {
    // this.$('bulb'+i).style.background = this.candColors[i]
    this.$('bulb'+i).style.opacity = '0.33'    
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

  // make palette of n colors 'evenly' thru hue wheel
  randomPalette() {
    var n = this.nCands
    var slice = 360/n
    var h = [], s = [], l = []
    this.candColors = []

    // numbers to tweak - should s = f(l) or vv? qq
    const minS = 0.7, maxS = 1
    const minL = 0.2, maxL = 0.7

    for (var i=0; i<n; i++) {
      // h.push(slice * i * d3.randomUniform(0.9, 1.1)())
      h.push(slice * i * d3.randomUniform(0.9, 1.1)())
      s.push(d3.randomUniform(minS, maxS)() * 100)
      l.push(d3.randomUniform(minL, maxL)() * 100)
    }
    d3.shuffle(h)
    
    h.forEach((hue, i) => {
      // this.candColors.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
      this.superData.candsAll[i].colour = 'hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)'
    })
  },

  

  $(ID) {
    return document.getElementById(ID)
  },

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
  width 180px

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