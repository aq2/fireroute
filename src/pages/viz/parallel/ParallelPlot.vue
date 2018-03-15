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
  EventBus.$on('dimPath', (i, yesNo) => {
    this.dimPath(i, yesNo)
  }),
  EventBus.$on('flashPath', (i, yesNo) => {
    this.flashPath(i, yesNo)
  }),
  EventBus.$on('fatPath', (i, yesNo) => {
    this.fatPath(i, yesNo)
  })
},

mounted() {
  this.main()
},


data() {
  return {
    // unfaded: [], lit: [],   // todo get rid of these and change fade(i)
    // nCands: 0, nLit: 0, nFaded: 0,
    
    dimNames: [],   // could be computed from superdata
    nDims: 0,
    svg:{}, chartGrp: {},
    svgHeightRatio: 0.99, svgWidthRatio: 0.8,  // fractions of window 
    margin: 60, // 2*30, 
    headerHeight: 100,
    windowW: window.innerWidth, windowH: window.innerHeight,
    chartHeight: 0, chartWidth: 0,
  
  }
},

computed: {
  $SelectedData() {
    return this.$store.getters.getSelectedData
  },
},

methods: {
  main() {
    this.initChart()
    
    const dims = this.calcDimsScales()
    const cands = this.calcCandsScales()
    const allData = {cands, dims}
    this.$store.dispatch('setSelectedData', allData)
    
    this.setupChart()
    this.plotCircles()
    this.plotPaths()
    // this.setChartEvents()
  },

  initChart() {
    // set size of svg 
    const svgHeight = Math.round((this.windowH - this.headerHeight) * this.svgHeightRatio)
    const svgWidth = Math.round(this.windowW * this.svgWidthRatio)
    this.chartHeight = svgHeight - this.margin
    this.chartWidth = svgWidth - this.margin
    
    // the whole svg
    this.svg = d3.select('#mySvg')
                  .attr('height', svgHeight)
                  .attr('width', svgWidth)
    
    // drawable area of chart, inside the margin
    this.chartGrp = this.svg
                        .append('g')
                          .attr('class', 'chart')
                          .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },

  calcDimsScales() {
    const dims = this.$SelectedData.dims
    this.nDims = dims.length

    dims.forEach((dimD) => {  
        const {key, min, max} = dimD

        const xValue = this.chartWidth * key / (this.nDims - 1)

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        const yAxis = d3.axisLeft(yScale)
      
        dimD.xValue = xValue
        dimD.yScale = yScale
        dimD.yAxis = yAxis
    })
    
    return dims
  },

  calcCandsScales() {
    // for each cand, calc x/y from scales and candScores
    const cands = this.$SelectedData.cands
    const dims = this.$SelectedData.dims

    cands.forEach((cand) => {
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
    const axesGrp = this.chartGrp.append('g')
                        .attr('class', 'axes')
 
    // setup shared x scale and axis
    this.xScale = d3.scalePoint()
                      .domain(this.dimNames)
                      .range([0, this.chartWidth])

    const xAxis = d3.axisBottom(this.xScale)
                    .tickPadding(5)
 
    axesGrp.append('g')
            .attr('id', 'xAxis')
            .call(xAxis)
            .attr('transform', this.myXY(0, this.chartHeight))

    const yAxesGrp = axesGrp.append('g')
                    .attr('class', 'yAxes')

    const dims = this.$SelectedData.dims
    dims.forEach((dimObj) => {
       yAxesGrp.append('g')
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
    
    dims.forEach((dimO, i) => {
      // plot points on axis for dimension scores
      var dimCircles = this.circlesGrp.append('g')
                        .attr('class', 'circle' + i)
      dimCircles.selectAll('circle.' + dimO.dimName)                        
        .data(dimO.scores)                           
        .enter()
          .append('circle')
          .attr('class', () => dimO.dimName)                
          .attr('id', (d, cand) => dimO.dimName + cand)                
          .attr('cx', () => this.chartWidth * i / (dims.length - 1))
          .attr('cy', d =>  dimO.yScale(d))
          .attr('r', '5')
          .attr('fill', dimO.dimColor)
    })
  },

  plotPaths() {
    let selectedCands = this.$SelectedData.cands

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


  flashPath(i, yesNo) {
    d3.select('#path' + i).classed('flash', yesNo)
  },

  fatPath(i, yesNo) {
    d3.select('#path' + i).classed('fatPath', yesNo)
  },

  dimPath(i, yesNo) {
    d3.select('#path' + i).classed('dimmedPath', yesNo)
  },




  lightPath(i) {
    var id = '#path' + i
    d3.select(id)
      .style('stroke-width', '4')    
      .style('stroke-dasharray', ('0, 0'))
      .style('opacity', '1')      
  },

  


 







  setChartEvents() {  // for paths!
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
  
  
  
  
  fadeAllPaths() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadePath(i)
    }
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

  $(ID) {
    return document.getElementById(ID)
  },

} // end methods  

}
</script>


<style lang="stylus" scoped>

#payge
  margin 0
  display flex
  overflow hidden

svg
  background-color $g3
  // position fixed



// need to refer to main.styl to change chart css!

</style>
