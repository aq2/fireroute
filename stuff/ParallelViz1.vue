<template lang='pug'>

svg
  g(style='transform: translate(0, 10px)')
    //- path(v-for='line in lines')
    path(:d='line')


</template>


<script>

import * as d3 from 'd3'

export default {
  name: 'vue-line-chart',
  
  data() {
    return {
      dataset: [
        [99, 71, 78, 25, 36, 92],
        [39, 21, 48, 65, 86, 42]
      ],
      // data[0]: [99, 71, 78, 25, 36, 92],
      // data: [99, 71, 78, 25, 36, 92],
      line: '',
      lines:['',''],
      liner: ''
    }
  },

  mounted() {
    this.calculatePath(0)
    // this.calculateAPath(1)
    // this.calculatePaths(2)
  },
  
  methods: {
    getScales(n) {
      const x = d3.scaleTime()
                  .range([0, 430])
      
      const y = d3.scaleLinear()
                  .range([210, 0])
      
      d3.axisLeft().scale(x)
      d3.axisBottom().scale(y)
      
      x.domain(d3.extent(this.dataset[n], (d, i) => i))
      y.domain([0, d3.max(this.dataset[n], d => d)])
      
      return { x, y }
    },

    calculatePath() {
      const scale = this.getScales()
      
      const path = d3.line()
                     .x((d, i) => scale.x(i))
                     .y(d => scale.y(d))
      
      this.liner  = path(this.dataset[0])
    },

    calculatePaths(n) {
      
      for (var j=0;j<n;j++) {
        const scale = this.getScales(j)
        const path = d3.line()
                     .x((d, i) => scale.x(i))
                     .y(d => scale.y(d))
        this.line[j] = path(this.dataset[j])
        // this.lines.push(this.line)
      }
    },


    calculateAPath(n) {
      const scale = this.getScales()
      
      const path = d3.line()
                     .x((d, i) => scale.x(i))
                     .y(d => scale.y(d))
      
      this.line = path(this.dataset[n])
    },

  },
}

</script>


<style lang="stylus" scoped>

svg
  margin 25px
  background blue
  height 800px
  width 500px

path
  fill black
  stroke #76BF8A
  stroke-width 2px

</style>