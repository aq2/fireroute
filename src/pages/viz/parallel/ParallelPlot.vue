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
  this.setupEventBus()
  this.setChartSize()
        
  this.calcDimsScales()
  this.plotAxes()

  this.calcCandsXYs()
  this.plotPaths()
  this.plotCircles()    // done last to put them on top
},

data() {
  return {
    svgHRatio: 0.99, svgWRatio: 0.83,  // fractions of window
    headerH: 100, margin: 60, // 2*30, 
    chartHeight: 0, chartWidth: 0,
    myLine: {}
  }
},

computed: {
  $SelectedData() {
    return this.$store.getters.getSelectedData
  },
  dims() {
    return this.$SelectedData.dims
  },
  cands() {
    return this.$SelectedData.cands
  },
  nCands() {
    return this.cands.length
  }
},

methods: {
  setupEventBus() {
    EventBus.$on('dimPath', (p, yesNo) => {
      this.dimPath(p, yesNo)
    })

    EventBus.$on('flashPath', (p, yesNo) => {
      this.flashPath(p, yesNo)
    })

    EventBus.$on('fatPath', (p, yesNo) => {
      this.fatPath(p, yesNo)
    })

    EventBus.$on('axisDragged', (dimN) => {
      this.axisDragged(dimN)
    })

    EventBus.$on('axisDropped', (dimN) => {
      this.axisDropped(dimN)
    })
  },

  // set svg and chart size
  setChartSize() {  
    const svgH = Math.round((window.innerHeight - this.headerH) * this.svgHRatio)
    const svgW = Math.round(window.innerWidth * this.svgWRatio)
    
    this.chartHeight = svgH - this.margin
    this.chartWidth = svgW - this.margin
    
    // the whole svg
    const svg = d3.select('#mySvg')
                  .attr('height', svgH)
                  .attr('width', svgW)
    
    // drawable area of chart, inside the margin
    svg.append('g')
      .attr('id', 'chart')
      .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },

  // for each dim, make scale, axis and x/y values
  calcDimsScales() {
    this.dims.forEach(dim => {  
        const {key, min, max, scores} = dim

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        dim.yScale = yScale
        dim.yAxis = d3.axisLeft(yScale)
        dim.yVals = scores.map(c => Math.round(yScale(c)))
        dim.xValue = Math.round(this.chartWidth * key / (this.dims.length - 1))
    })
  },

  // for each dim, add axis
  plotAxes() {
    const dims = this.dims
    let draggedN, 
        collided = false
    let leftN, rightN, xDrag
    let xRight, xLeft
    
    const allDims = d3.select('#chart')
                      .append('g')
                      .attr('id', 'dimensions')

    const dimAxisDrag = d3.drag()
                          .on('drag', moveAxis)
                          .on('start', startMoveAxis)
                          .on('end', endMoveAxis)

    dims.forEach((dim, i) => {
      allDims
        .append('g')
        .attr('id', 'dim' + i)
        .attr('transform', this.myXY(dim.xValue))
        .call(dimAxisDrag)
          .append('g')
          .attr('id', 'yAxis' + dim.key)
          .attr('class', 'yAxis')
          .call(dim.yAxis)
            .append('text')
            .text(dim.dimName)
            .attr('y', this.chartHeight + 25)
            .attr('class', 'label')
            .attr('text-anchor', () => { // todo improve
              if (i == 0) {return 'start'}
              if (i == this.dims.length-1) {return 'end'}
              return 'middle'
            })
    })

    // inner functions for closure - no access to vue.this
    function startMoveAxis() {
      draggedN = +this.id.slice(3)  // id = dimN, '+' converts to num
      leftN = draggedN - 1
      rightN = draggedN + 1
      xDrag = dims[draggedN].xValue
      xRight = dims[rightN].xValue
      xLeft = (draggedN == 0) ? 0: dims[leftN].xValue    
    }
    
    function moveAxis() {
      d3.select(this) 
        .attr('transform', function () {
          let x = d3.event.x
          // check for snap
          if (x < xLeft) {
            collided = true
            swapAxes(xDrag, xLeft)
          }
          return 'translate(' + d3.event.x + ')'
      })
      EventBus.$emit('axisDragged', draggedN)      
    }

    function endMoveAxis() {
      if (!collided) {
        // move back to original pos
        d3.select(this) 
          .transition()
            .duration(200)
            .ease(d3.easeBack)
            .attr('transform', function () {
              return 'translate(' + xDrag + ')'
            })

        let dropObj = {draggedN, xDrag}
        EventBus.$emit('axisDropped', dropObj)      
      }
    }

    function swapAxes(xDrag, xLeft) {
      console.log('collide', xDrag, xLeft)
    }

  },

  // for each cand, calc x/y values - needs yScale
  calcCandsXYs() {
    this.cands.forEach((cand) => {
      cand.points = []
      cand.yVals = []
      cand.xVals = []

      cand.candScores.forEach((score,j) => {
        var valY = Math.round(this.dims[j].yScale(score))
        cand.yVals.push(valY)
        var candX = Math.round(this.chartWidth * j / (this.dims.length - 1))
        cand.xVals.push(candX)
        cand.points.push([candX, valY])        
      })
    })
  },

  // for each cand, plot path
  plotPaths() {
    // path generator to build line
    this.myLine = d3.line()
                    .curve(d3.curveMonotoneX)
    
    const pathsGrp = d3.select('#chart').append('g')
                        .attr('class', 'paths')

    this.cands.forEach((cand, c) => {
      pathsGrp.append('path')
        .attr('d', this.myLine(cand.points))
        .attr('id', 'path' + c)
        .attr('class', 'path')
        .attr('stroke', cand.colour)
          .on('mouseover', () => this.flash(c, true))
          .on('mouseout', () => this.flash(c, false))
          .on('click', () => this.dim(c))
    })
  },

  // for each dim, plot circles
  plotCircles() {
   const cands = this.cands

    this.dims.forEach((dim, i) => {
      // plot points on axis for dimension scores
      d3.select('#dim' + i)
        .append('g')
          .attr('id', 'circle' + i)
            .selectAll('circle.' + dim.dimName)                        
            .data(d3.range(this.nCands))                           
              .enter()
              .append('circle')
                .attr('class', dim.dimName)                
                .attr('id', (d, cand) => dim.dimName + cand)
                .attr('cy', (d, cand) =>  dim.yVals[cand])
                .attr('r', '10')
                .attr('fill', (d, cand) => cands[cand].colour)
    })
  },

  // move circles and paths
  axisDragged(i) {
    this.moveAllPaths(i, d3.event.x)
  },

  // move circles and paths
  axisDropped(dropObj) {
    const {draggedN, xDrag} = dropObj
    this.moveAllPaths(draggedN, xDrag)
  },

  moveAllPaths(dim, x) {
    let candsL = this.cands.length
    
    for (var c=0; c<candsL; c++) {
      this.movePath(dim, x, c)
    }
  },

  movePath(dim, x, cand) {
    const points = this.cands[cand].points
    points[dim][0]  = x

    d3.select('#path' + cand)
        .attr('d', this.myLine(points))
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
    if (!y) {
      y = 0
    } 
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
