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
    dataArray: [4, 13, 9, 12, 24, 6, 17],
    
    pathArray: [
      {x:0, y:17}, {x:1, y:5}, {x:2, y:28},
      {x:3, y:43}, {x:4, y:2}, {x:5, y:62}, {x:6 ,y:19}
    ]
  }
},

methods: {
  main() {
    var svg = d3.select('#mySvg')
    
    // path generator!
    var line = d3.line()
                  .x((d, i) => i*50)   // move each x 50px
                  .y(d => 200 - d*5)   // each y comes from da data
                  // .curve(d3.curveCardinal)

    // append path to svg
    svg.append('path')
        .attr('d', line(this.dataArray))
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', '3px')
  },
  oldMain() {
    // var svg = d3.select('#mySvg')
                
    // svg.selectAll('rect')
    //     .data(this.dataArray)
    //     .enter()
    //       .append('rect')
    //         .attr('height', d => d*10)
    //         .attr('width', '70')
    //         .attr('x', (d,i) => 80*i)
    //         .attr('y', d => 350 - d*10)
    //         .attr('fill', 'darkred')

    // svg.selectAll('circle')
    //     .data(this.dataArray)
    //     .enter()
    //       .append('circle')
    //       .attr('class', 'groupA')      // nothing to do with CSS - just id's them for d3
    //       .attr('cx', (d, i) => 100 + d*4 + i*100)
    //       .attr('cy', '400')
    //       .attr('r', d => d*4)

    // svg.selectAll('circle.groupB')
    //     .data(this.dataArray)
    //     .enter()
    //       .append('circle')
    //       .attr('class', 'groupB')      // see above
    //       .attr('cx', (d, i) =>  300 + d*2 + i*60)
    //       .attr('cy', '600')
    //       .attr('r', d => d*4)

    // var fixedX = 10
    // svg.selectAll('line')
    //   .data(this.dataArray)
    //   .enter().append('line')
    //     .attr('x1', fixedX)
    //     .attr('y1', (d, i) => 70 + (i*20))
    //     .attr('x2', (d, i) => fixedX + d*10)
    //     .attr('y2', (d, i) => 70 + i*20 + d*1.5)
    //     .attr('stroke', 'orange')
    //     .attr('stroke-width', '3px')
        

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
  height 800px
  width 1000px


</style>
