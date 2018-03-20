<template lang="pug">
  
#gfx(class='column')
  //- h1(class='top-right') gig    // todo filename?
  svg(id='mySvg')
  
</template>


<script>

import * as d3 from 'd3'
import {EventBus} from '../../../main'

export default {

mounted() {
  this.main()
},

data() {
  return {
    dimNames: [],   // could be computed from superdata
    nDims: 0, nCands: 0,
    svg:{}, chartGrp: {},
    svgHeightRatio: 0.99, svgWidthRatio: 0.83,  // fractions of window
    margin: 60, // 2*30, 
    headerHeight: 100,
    windowW: window.innerWidth, windowH: window.innerHeight,
    chartHeight: 0, chartWidth: 0,
    myLine: {}
  }
},

computed: {
  $SelectedData() {
    return this.$store.getters.getSelectedData
  },
},

methods: {
  main() {
    this.setupEventBus()
    this.setChartSize()
    
    this.calcDimsScales()    
    this.calcCandsXYs()
    
    // const allData = {cands, dims}
    // // this.$store.dispatch('setSelectedData', allData)  // ??
    
    this.plotAxes()
    this.plotDimLabels()
    this.plotPaths()
    this.plotCircles()

    this.makeAxesDraggable()
  },

  setupEventBus() {
    EventBus.$on('dimPath', (i, yesNo) => {
      this.dimPath(i, yesNo)
    })

    EventBus.$on('flashPath', (i, yesNo) => {
      this.flashPath(i, yesNo)
    })

    EventBus.$on('fatPath', (i, yesNo) => {
      this.fatPath(i, yesNo)
    })

    EventBus.$on('axisDragged', (i) => {
      this.axisDragged(i)
    })
  },

  // set svg and chart size
  setChartSize() {  // todo chart factory?
    const svgHeight = Math.round((this.windowH - this.headerHeight) * this.svgHeightRatio)
    const svgWidth = Math.round(this.windowW * this.svgWidthRatio)
    
    this.chartHeight = svgHeight - this.margin
    this.chartWidth = svgWidth - this.margin
    
    // the whole svg
    this.svg = d3.select('#mySvg')
                  .attr('height', svgHeight)
                  .attr('width', svgWidth)
    
    // drawable area of chart, inside the margin
    this.chartGrp = this.svg.append('g')
                        .attr('class', 'chart')
                        .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },

  // for each dim, make scale, axis and x/y values
  calcDimsScales() {
    const dims = this.$SelectedData.dims
    this.nDims = dims.length

    dims.forEach((dimD, i) => {  
        const {key, dimName, min, max, scores} = dimD
        this.dimNames.push(dimName)

        const xValue = this.chartWidth * key / (this.nDims - 1)

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        // seems best place to store y=yScale(score)
        var yVals = scores.map(c => Math.round(yScale(c)))

        const yAxis = d3.axisLeft(yScale)
      
        dimD.xValue = xValue
        dimD.yScale = yScale
        dimD.yAxis = yAxis
        dimD.yVals = yVals
    })
    
    return dims
  },

  // for each cand, calc x/y values 
  calcCandsXYs() {
    const cands = this.$SelectedData.cands
    this.nCands = cands.length
    const dims = this.$SelectedData.dims

    cands.forEach((cand) => {
      cand.points = []
      const yVals = []
      const xVals = []

      cand.candScores.forEach((score,j) => {
        var valY = Math.round(dims[j].yScale(score))
        yVals.push(valY)
        var candX = Math.round(this.chartWidth * j / (this.nDims - 1))
        xVals.push(candX)
        cand.points.push([candX, valY])        
      })

      cand.yVals = yVals
      cand.xVals = xVals
    })
    
    return cands
  },

  // for each dim, add axis
  plotAxes() {
    const axesGrp = this.chartGrp.append('g')
                        .attr('class', 'axes')
 
    // // setup shared x scale and axis
    // this.xScale = d3.scalePoint()
    //                 .domain(this.dimNames)
    //                 .range([0, this.chartWidth])

    // const xAxis = d3.axisBottom(this.xScale)
    //                 .tickPadding(5)
 
    // axesGrp.append('g')
    //         .attr('id', 'xAxis')
    //         .attr('transform', this.myXY(0, this.chartHeight))
    //         // .call(xAxis)

    const yAxesGrp = axesGrp.append('g')
                      .attr('id', 'yAxes')

    const dims = this.$SelectedData.dims
    dims.forEach((dimObj) => {
      yAxesGrp.append('g')
              .attr('class', 'yAxis')
              .attr('id', 'yAxis' + dimObj.key)
              .attr('transform', this.myXY(this.chartWidth * dimObj.key / (this.nDims - 1), 0))
              .call(dimObj.yAxis)
    })

  },

  // for each dim, label each axis
  plotDimLabels() {
     const labelGrp = this.chartGrp.append('g')
                    .attr('class', 'dimLabels')

    this.dimNames.forEach((name, i) => {
      // calc x values - we already know xvals?
      const xPos = this.chartWidth * i / (this.nDims - 1)

      labelGrp.append('text')
                    .attr('class', 'dimLabel')
                    .attr('transform', this.myXY( xPos, this.chartHeight + 20))
                    .text(name)
                    
    })
  },

  // for each cand, plot path
  plotPaths() {
    let selectedCands = this.$SelectedData.cands

    // path generator to build line
    this.myLine = d3.line()
                    .curve(d3.curveMonotoneX)
    
    this.pathsGrp = this.chartGrp.append('g')
                        .attr('class', 'paths')

    selectedCands.forEach((cand, c) => {
      this.pathsGrp.append('path')
        .attr('d', this.myLine(cand.points))
        .attr('id', 'path' + c)
        .attr('class', 'path')
        .attr('stroke', cand.colour)
          .on('mouseover', () => this.flash(c, true))
          .on('mouseout', () => this.flash(c, false))
          .on('click', () => this.dim(c))
    })
    
  },

  moveAllPaths(dim, x) {
    let cands = this.$SelectedData.cands
    let candsL = cands.length
    
    for (var c=0; c<candsL; c++) {
      this.movePath(dim, x, c)
    }

  },

  movePath(path, x, cand) {
    // console.log('p,x,cand', path, x, cand)
    const points = this.$SelectedData.cands[cand].points
    points[path][0]  = x

    d3.select('#path' + cand)
       .transition()
       .duration(20)
        .attr('d', this.myLine(points))
  },

  // for each dim, plot circles
  plotCircles() {
    const dims = this.$SelectedData.dims

    this.circlesGrp = this.chartGrp.append('g')
                              .attr('class', 'circles')

    dims.forEach((dimO, dimN) => {
      // plot points on axis for dimension scores
      this.circlesGrp.append('g')
          .attr('class', 'circle' + dimN)
            .selectAll('circle.' + dimO.dimName)                        
            .data(d3.range(this.nCands))                           
              .enter()
              .append('circle')
                .attr('class', () => dimO.dimName)                
                .attr('id', (d, cand) => dimO.dimName + cand)                
                .attr('cx', () => this.chartWidth * dimN / (dims.length - 1))
                .attr('cy', (d, cand) =>  dimO.yVals[cand])
                .attr('r', '5')
                .attr('fill', dimO.dimColor)
    })
  },

  makeAxesDraggable() {
    var axisDrag = d3.drag()
                      .on('drag', moveAxis)
  
    this.svg.selectAll('.yAxis')
            .call(axisDrag)

    function moveAxis() {
      var x = d3.event.x

      d3.select(this)      
        .attr('transform', function () {
          return 'translate(' + x + ')'
      })

      const axisN = this.id.slice(5)  // id = yAxisN
      
      // send event to move circles
      EventBus.$emit('axisDragged', axisN)
    }
  },

  // move circles and paths
  axisDragged(i) {
    // select circles by class
    const cClass = '.' + this.dimNames[i]
    const x = d3.event.x

    d3.selectAll(cClass)
      .attr('cx', d3.event.x)

    // okay what about the paths?
    this.moveAllPaths(i, x)
  },

  dim(i) {
    this.dimPath(i, true)
    EventBus.$emit('checkdimButton', i)
  },

  flash(i, yesNo) {
    this.flashPath(i, yesNo)
    this.fatPath(i, yesNo)
    EventBus.$emit('flashButton', i, yesNo)
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

  myXY(x, y) {
    return 'translate(' + x + ',' + y + ')'
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

// need to refer to main.styl to change chart css!

</style>
