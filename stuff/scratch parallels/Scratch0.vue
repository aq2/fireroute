<template lang="pug">
  
  #gfx
    p boo

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
    dataArray: [4, 13, 9, 12, 24, 6, 17]
  }
},

methods: {
  main() {
    var svg = d3.select('#gfx')
                .append('svg')
                .attr('height', '600')
                .attr('width', '600')
                .attr('id', 'mySvg')
                .style('background', '#447')
                

    svg.selectAll('rect')
        .data(this.dataArray)
        .enter().append('rect')
          .attr('height',d => d*10)
          .attr('width','70')
          .attr('x',(d,i) => 80*i)
          .attr('y',d => 350 - d*10)
          .attr('fill', 'darkred')

  }
} // end methods  

}
</script>




<style lang="stylus" scoped>

#gfx
  margin 1 rem
  // background green

  

.svg
  background-color blue
  border 1px dotted black

</style>
