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
    dimNames: [],
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
  dims() {
    return this.$SelectedData.dims
  },
  nDims() {
    return this.dims.length
  },
  cands() {
    return this.$SelectedData.cands
  },
  nCands() {
    return this.cands.length
  }
},

methods: {
  main() {
    this.setupEventBus()
    this.setChartSize()
        
    this.calcDimsScales()
    // this.makeDimGroups()
    this.plotAxes()
    // this.plotDimLabels()

    this.calcCandsXYs()
    this.plotPaths()

    this.plotCircles() // done last to put them on top

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
    const svg = d3.select('#mySvg')
                  .attr('height', svgHeight)
                  .attr('width', svgWidth)
    
    // drawable area of chart, inside the margin
    svg.append('g')
      .attr('id', 'chart')
      .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },

  // for each dim, make scale, axis and x/y values
  calcDimsScales() {
    this.dims.forEach(dim => {  
        const {key, dimName, min, max, scores} = dim
        this.dimNames.push(dimName)

        dim.xValue = Math.round(this.chartWidth * key / (this.nDims - 1))

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        dim.yScale = yScale
        dim.yAxis = d3.axisLeft(yScale)
        dim.yVals = scores.map(c => Math.round(yScale(c)))
    })
  },

  // for each dim, add axis
  plotAxes() {
    const allDims = d3.select('#chart')
                      .append('g')
                      .attr('id', 'dimensions')

    this.dims.forEach((dim, i) => {
      allDims.append('g')
            .attr('id', 'dim' + i)
            .attr('class', 'dimGrp')
            .attr('transform', this.myXY(dim.xValue, 0))
            // .attr('x', dim.xValue)
            // .attr('y', 0)
              .append('g')
                .attr('id', 'yAxis' + dim.key)
                .attr('class', 'yAxis')
                .call(dim.yAxis)
                  .append('text')
                    .text(dim.dimName)
                    .attr('y', this.chartHeight + 25)
                    .attr('class', 'label')
                    .attr('text-anchor', () => {
                      if (i == 0) {
                        return 'start'
                      }
                      if (i == this.dims.length-1) {
                        return 'end'
                      }
                      return 'middle'
                    })
    })

  },

  // // for each dim, label each axis
  // plotDimLabels() {
  //   this.dimNames.forEach((name, i) => { 
  //     // const xPos = this.chartWidth * i / (this.nDims - 1)

  //     d3.select('#dim' + i)
  //       .append('label')
  //         .attr('id', 'label'+i)
  //         .attr('class', 'dimLabel')
  //         // .attr('transform', this.myXY( 100, this.chartHeight - 200))
  //         .attr('x', 300)
  //         .attr('y', 300)
  //         .text(name)
  //         .attr("font-size", "50px")
  //                .attr("fill", "red")   
  //   })
  // },

  // for each cand, calc x/y values - needs yScale
  calcCandsXYs() {
    this.cands.forEach((cand) => {
      cand.points = []
      const yVals = []
      const xVals = []

      cand.candScores.forEach((score,j) => {
        var valY = Math.round(this.dims[j].yScale(score))
        yVals.push(valY)
        var candX = Math.round(this.chartWidth * j / (this.nDims - 1))
        xVals.push(candX)
        cand.points.push([candX, valY])        
      })

      cand.yVals = yVals
      cand.xVals = xVals
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

  moveAllPaths(dim, x) {
    let candsL = this.cands.length
    
    for (var c=0; c<candsL; c++) {
      this.movePath(dim, x, c)
    }

  },

  movePath(path, x, cand) {
    const points = this.cands[cand].points
    points[path][0]  = x

    d3.select('#path' + cand)
       .transition()
       .duration(20)
        .attr('d', this.myLine(points))
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

  makeAxesDraggable() {
    // const axisDrag = d3.drag()
    //                   .on('drag', moveAxis)
  
  
    var dragDimGrp = d3.drag()
                       .on('drag', function(d, i) {
                          d3.select(this)
                            .attr("transform", "translate(" + d3.event.x + ")")
                        })


    d3.selectAll('.dimGrp')
    // d3.selectAll('.yAxis')
            .call(dragDimGrp)



    // function moveAxis() {
    //   var x = d3.event.x
    //   var dx = d3.event.dx
    //   console.log(x, dx, d3.event)
    //   console.log(this)
    //   d3.select(this) 
    //     .attr('transform', function () {
    //       return 'translate(' + (dx) + ',0)'
    //   })

    //   const axisN = this.id.slice(5)  // id = yAxisN
      
    //   // send event to move circles
    //   // EventBus.$emit('axisDragged', axisN)
    // }
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
