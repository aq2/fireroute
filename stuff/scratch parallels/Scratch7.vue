<template lang="pug">
  
  #gfx
    svg(id='mySvg')

</template>


<script>

import * as d3 from 'd3'

export default {
name: 'scratch',

mounted() {
  this.main()
},

data() {
  return {
    dataArray: [4, 62, 19],
    dims: ['faith', 'hope', 'charity'],
    tom: [10, 2.7, 90],
    dick: [4, 2, 100],
    harry: [0, 3, 0]
  }
},

methods: {
  main() {
    // set size of svg 
    var height = 500
    var width = 500
    var margin = 60
    var svg = d3.select('#mySvg')
                .attr('height', height)
                .attr('width', width)

    // setup x axis
    var xScale = d3.scaleOrdinal()
                    .domain(this.dims)
                    .range([0, (width-margin)/2, (width-margin)])
    
    // var xScale = d3.scalePoint()
    //                 .domain(this.dims)
    //                 .range([0, width-margin])

    var xAxis = d3.axisBottom(xScale)
                  .ticks(2).tickPadding(5)
    

    // setup y axis
    var yScales = []
    var yScale1 = d3.scaleLinear()
                   .domain([0, 100])
                   .range([height - margin, 0])
    var yAxis = d3.axisLeft(yScale1)

    var yScale2 = d3.scaleLinear()
                   .domain([2, 3])
                   .range([height - margin, 0])
    var yAxis2 = d3.axisLeft(yScale2)
    


    // put axes in a group, and shift a bit
    var axesGrp = svg.append('g')
                  .attr('transform', 'translate(' + (margin/2) + ',' + (margin/2) + ')')
                  // todo - must be better way!

    // add axes in subgroups
    axesGrp.append('g')
            .call(yAxis)
            .call(yAxis2)

    axesGrp.append('g')
            .call(xAxis)
            // move to bottom
            .attr('transform', 'translate(0,' + (height-margin) + ')')


    // okay start simple, add a circle
    axesGrp.selectAll('circle')
        .data(this.tom)
        .enter()
          .append('circle')
          .attr('cx', (d,i) => { console.log(xScale(i)); return xScale(i)})
          .attr('cy', (d,i) => {
                              // console.log('y,d', yScales+i(d), d)
                              // yScale(d) = pixel position  (exluding margins)
                              return yScale1(d)
                             })
          .attr('r', '5')


    // // lines!
    // // path generator!
    // var line = d3.line()
    //               .x((d, i) => xScale(i))
    //               .y(d => yScale(d))   // each y comes from da data
    //               // .curve(d3.curveStep)

    // // append path to group
    // axesGrp.append('path')
    //     .attr('d', line(this.tom))
    //     .attr('fill', 'none')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', '3px')


     

     
    

  } // end main

} // end methods  

}
</script>


<style lang="stylus" scoped>

#gfx
  margin 1 rem
  // background green

svg
  background-color blue
  // border 2px dotted black

// these don't seem to work
// would need to use other d3 method
g.grp3 circle,
g.grp2 path
  fill none
  stroke orange

.grpcircle4
  stroke white-space
  fill yellow
  stroke-width 2

g.tick
  stroke red
  fill red


</style>
