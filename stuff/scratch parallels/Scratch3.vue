<template lang="pug">
  
  #gfx
    //- p boo
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
    var width = 800
   
    var svg = d3.select('#mySvg')
                .attr('height', height)
                .attr('width', width)
    
    for (var j=0; j<6; j++) {
    
      var area = d3.area()
                  .x((d,i) => i*20)
                  .y0(height)
                  .y1(d => height - d*8)
                  .curve(this.crvTypes[j])

      var grp = svg.append('g')
                    .attr('transform', 'translate(' + j*140 + ', 0)')
                    .attr('class', 'grp' + j)

      grp.append('path')
          .attr('d', area(this.dataArray))   // area is the generator, dataArray is d data
          .attr('fill', 'none')
          .attr('stroke', 'black')
          .attr('stroke-width', 3)

      grp.selectAll('circle.grpcircle'+j)
          .data(this.dataArray)
          .enter()
            .append('circle')
              .attr('class', () => 'grpcircle' + j )
              .attr('cx',(d,i) => i*20)
              .attr('cy',d => height - d*8)
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
  // height 800px
  // width 1000px

g.grp3 circle,
g.grp2 path
  fill none
  stroke orange

.grpcircle4
  stroke white-space
  fill yellow
  stroke-width 2

</style>
