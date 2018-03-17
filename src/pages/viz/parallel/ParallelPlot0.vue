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
  EventBus.$on('dimPath', (i, yesNo) => {
    this.dimPath(i, yesNo)
  })
  EventBus.$on('flashPath', (i, yesNo) => {
    this.flashPath(i, yesNo)
  })
  EventBus.$on('fatPath', (i, yesNo) => {
    this.fatPath(i, yesNo)
  })
  EventBus.$on('foo', (i) => {
    this.moveOtherCircles(i)
  })
  this.main()
},


data() {
  return {
    dimNames: [],   // could be computed from superdata
    nDims: 0, nCands: 0,
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
    this.$store.dispatch('setSelectedData', allData)  // ??
    
    this.setupChart()
    this.plotCircles()
    this.plotPaths()

    this.testDrag()
  },

  initChart() {  // todo chart factory?
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

  calcCandsScales() {
    // for each cand, calc x/y from scales and candScores
    const cands = this.$SelectedData.cands
    this.nCands = cands.length
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
            .attr('transform', this.myXY(0, this.chartHeight))
            .call(xAxis)

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
              .attr('stroke-width', '5px')
              .on('mouseover', (d) => this.flash(c, true))
              .on('mouseout', (d) => this.flash(c, false))
              .on('click', (d) =>  this.dim(c))
    }) 
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

  testDrag() {
    // add a circle (or two) to drag
    var drag = d3.drag()
                .on('drag', moveBlackCircle)  // how to pass args?
    
    this.svg
      .append('circle')
      .attr('id', 'puck')
      .attr('r', 50)
      .attr('transform',  "translate(500,500)")
      .call(drag)
    
    this.svg
      .append('circle')
      .classed('follower', true)
      .attr('id', 'red')
      .attr('r', 100)
      .attr('transform',  "translate(500,700)")
      .attr('fill', 'red')

    this.svg
      .append('circle')
      .classed('follower', true)      
      .attr('id', 'blue')
      .attr('r', 75)
      .attr('transform',  "translate(500,100)")
      .attr('fill', 'blue')


    function moveBlackCircle(d) {
      // console.log(d3.event)
      var x = d3.event.x
      var y = d3.event.y

      var c1x = 500
      var c1y = 500

      var cYs = [700, 100]
      var c = -1

      d3.select(this)      
        .attr("transform", function (d) {
          // c1x = this.transform['baseVal']['0']['matrix']['e']  // really?
          // console.log('x', c1x, d3.event.dx)
          return "translate(" + x + ", " + c1y + ")"
        })

      // this.moveOtherCircles()
      // var blue = d3.select('#blue')
      // var blueY = 100
      // blue.attr("transform", this.myXY(x, blueY))

      // must send event - else confusion with 'this'
      EventBus.$emit('foo', 3, true)

      //qq - can't use this in normal vue fashion to call functions or get vars
      // var blue = d3.select('#blue')
      // var blueY = 100

      // blue.attr('transform', 'translate(' + d3.event.x + ',' + blueY +')')

    }


    // dunno how to do this with selectAll
    // plan B - loop over each circle, via id's?
    // var blue = d3.select('#blue')
    // var blueY = blue.transform['baseVal']['0']['matrix']['f']
    // console.log(blue, blueY)          

  },
    
  moveOtherCircles() {
    var blue = d3.select('#blue')
    var blueY = 100

    blue.attr('transform', this.myXY(d3.event.x, blueY))
  }

}

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
