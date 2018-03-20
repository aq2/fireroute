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
    this.plotDimLabels()

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

  // // for each dim, make an svg group to hold axis, circles and label
  // makeDimGroups() {
  //   const dimGrp = d3.select('#chart')
  //                     .append('g')
  //                     .attr('id', 'dimensions')
    
  //   this.dims.forEach((dim, i) => {
  //     dimGrp.append('g')
  //       .attr('id', 'dimensions' + i)
  //       .attr('class', 'dimGrp')
  //   })
  // },

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
              .append('g')
                .attr('id', 'yAxis' + dim.key)
                .attr('class', 'yAxis')
                // .attr('transform', this.myXY(this.chartWidth * dim.key / (this.nDims - 1), 0))
                .call(dim.yAxis)
    })

  },

  // for each dim, label each axis
  plotDimLabels() {
    this.dimNames.forEach((name, i) => { 
      const xPos = this.chartWidth * i / (this.nDims - 1)

      d3.select('#dim' + i)
        .append('label')
          .attr('id', 'label'+i)
          .attr('class', 'dimLabel')
          .attr('transform', this.myXY( xPos, this.chartHeight + 20))
          .text(name)                    
    })
  },

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
                // .attr('cx', () => {
                //   console.log(dim.xValue)
                //   return 44
                //   // return dim.xValue
                //   })
                .attr('cy', (d, cand) =>  dim.yVals[cand])
                .attr('r', '10')
                .attr('fill', (d, cand) => cands[cand].colour)
    })
  },

  makeAxesDraggable() {
    // const axisDrag = d3.drag()
    //                   .on('drag', moveAxis)
  
    
    // var drag = d3.drag()
    //     .on("drag", function(d,i) {
    //         var xx = d3.event.x
    //         xx += d3.event.dx
    //         var ddx = d3.event.dx
    //         // d.y += d3.event.dy
    //         d3.select(this).attr("transform", function(d,i){
    //             return "translate(" + [ ddx,0 ] + ")"
    //         })
    //     });

    // var myDrag  = d3.drag()
    //                 .on('drag', dragged)

    //   function dragged(d) {
    //     //  d3.select(this).attr("x", d.x = d3.event.x)
    //     //     // .attr("cy", d.y = d3.event.y);
    //         d3.select(this).attr("transform", function(d,i){
    //             return "translate(" + [ d.x,0 ] + ")"
    //         })
    //   }


    // var dragcontainer = d3.drag()
    //                       .on("drag", function(d, i) {
    //                         d3.select(this)
    //                           .attr("transform", "translate(" + (d.x = d3.event.x) + ")")
    //                         })


    // d3.selectAll('.dimGrp')
    // // d3.selectAll('.yAxis')
    //         .call(dragcontainer)



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
