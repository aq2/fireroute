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
    dataArray: [4, 13, 14, 24, 29, 32, 34, 62, 71, 82, 94, 99],
    dataMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    crvTypes: [d3.curveCardinal, d3.curveBasis, d3.curveLinear, d3.curveStep, d3.curveNatural]
  }
},

methods: {
  main() {
    var height = 800
    var width = 1050
   

    // set size of svg 
    var svg = d3.select('#mySvg')
                .attr('height', height)
                .attr('width', width)
    
    // when d is 0, y=height : when d=100, y=0
    var y = d3.scaleLinear().domain([0,136]).range([height-50, 0])
   
    // axes - add scale to axis defn
    var yAxis = d3.axisLeft(y)
                  .ticks(6)
                    .tickPadding(10)
                    .tickSize(10)

    // parse time as months 
    var parseMonth = d3.timeParse('%m')
    var x = d3.scaleTime()
              .domain([
                d3.min(this.dataMonth, d => parseMonth(d)), 
                d3.max(this.dataMonth, d => parseMonth(d))
              ])
              .range([0, width - 80]) 

    var xAxis = d3.axisBottom(x)


    // loop through curve types
    for (var j=0; j<1; j++) {
      
      // generate the area chart, setting 'schema'
      var area = d3.area()
                  .x((d,i) => x(parseMonth(this.dataMonth[i])))
                  .y0(height)
                  .y1(d => y(d))
                  .curve(this.crvTypes[j])

      // add a new group - call it grp
      var grp = svg.append('g')
                    .attr('transform', 'translate(' + (30+(j*140)) + ', -20)')
                    .attr('class', 'grp' + j)

      // add axis in another subgroup
      grp.append('g')
          .attr('class', 'axis y')
          .call(yAxis)

      grp.append('g')
          .attr('transform', 'translate(0,' + (height) + ')')
          .attr('class', 'axis x')
          .call(xAxis)

      // add area path to grp, defining the datasource for the 'schema'
      grp.append('path')
          .attr('d', area(this.dataArray))   // area is the generator, dataArray is d data
          .attr('fill', 'none')
          .attr('stroke', 'black')
          .attr('stroke-width', 3)

      // add circles to grp
      grp.selectAll('circle.grpcircle'+j)
          .data(this.dataArray)
          .enter()
            .append('circle')
              .attr('class', () => 'grpcircle' + j )
              .attr('cx',(d,i) => x(parseMonth(this.dataMonth[i])))
              .attr('cy',d => y(d))
              .attr('r','7')
    }

  } // end main

} // end methods  

}
</script>


<style lang="stylus" scoped>

#gfx
  margin 1 rem
  background green

svg
  background-color blue
  border 2px dotted black

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
