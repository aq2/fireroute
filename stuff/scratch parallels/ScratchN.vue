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

computed: {
  dimData() {
    return this.$store.getters.getDimData
  }
  
},


data() {
  return {
    dataArray: [4, 62, 19],
    // dims: ['nss', 'hons', 'pro'],
    tom: [10, 2.7, 90],
    dick: [4, 2, 100],
    harry: [0, 3, 0],
    nss: [0, 10, 4],
    hons: [4, 85, 53]
  }
},

methods: {
  main() {
    // set size of svg 
    var svgHeight = 500
    var svgWidth = 500
    var margin = 60
    var svg = d3.select('#mySvg')
                .attr('height', svgHeight)
                .attr('width', svgWidth)

    var chartHeight = svgHeight - margin
    var chartWidth = svgWidth - margin

    // get da data
    let dims = []
    let mins = []
    let maxs = []
    let scores = []

    let yScales = []
    let yAxes = []

    Object.entries(this.dimData).forEach(([key, dimD]) => {
      console.log(key)
      console.log(dimD)
      if (dimD.crit) {
        dims.push(dimD.dimName)
        scores.push(dimD.scores)

        const min = dimD.stats.min
        const max = dimD.stats.max
        mins.push(min)
        maxs.push(max)

        var yScale = d3.scaleLinear()
                      .domain([min, max])               // change to min/max
                      .range([chartHeight, 0])
        yScales.push(yScale)
        var yAxis = d3.axisLeft(yScale)
        yAxes.push(yAxis)
      }
    })


    // setup shared x scale and axis
    var xScale = d3.scalePoint()
                    .domain(dims)
                    .range([0, chartWidth])

    var xAxis = d3.axisBottom(xScale)
                  .ticks(2).tickPadding(5)
    



    // put axes in a group, and shift a bit
    var axesGrp = svg.append('g')
                  .attr('transform', 'translate(' + (margin/2) + ',' + (margin/2) + ')')
                  // todo - must be better way!

    axesGrp.append('g')
            .call(xAxis)
            // move to bottom
            .attr('transform', 'translate(0,' + (chartHeight) + ')')

    // add axes in subgroups
    axesGrp.append('g')
            .call(yAxes[0])

    // okay start simple, add one axis dimension
    axesGrp.selectAll('circle')
        .data(this.nss)
        .enter()
          .append('circle')
          .attr('cx', (d,i) => { 
                                //  console.log(xScale(i)); 
                                //  return xScale(i)
                                return 0
                               })
          .attr('cy', (d) => {
                              // console.log('y,d', yScales+i(d), d)
                              // yScale(d) = pixel position  (exluding margins)
                              return yScales[0](d)
                             })
          .attr('r', '5')


      // add axes in subgroups
    axesGrp.append('g')
            .call(yAxes[1])
            .attr('transform', 'translate(' + ((chartWidth)/2) + ',' + 0 + ')')

    // okay start simple, add one axis dimension
    axesGrp.selectAll('circle.hons')                        // change
        .data(this.hons)                                    // change
        .enter()
          .append('circle')
          .each((d, i) =>  console.log('d' + i +' is', d))
          .attr('class', () => 'hons')                      // change
          .attr('cx', () => { 
                                return (chartWidth)/2   // change
                               })
          .attr('cy', (d) => {
                              return yScales[1](d)          // change
                             })
          .attr('r', '9')


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
