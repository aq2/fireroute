<template lang='pug'>

#graphic
  svg
    g(style='transform: translate(0, 10px)')
      path(v-for='(line,i) in lines' :d='line'  @click="pclick(i)")
  p what
</template>


<script>

import * as d3 from 'd3'

export default {
  name: 'vue-line-chart',
  
  data() {
    return {
      data: [98, 72, 78, 24, 36, 92],
      data2: [51, 29, 55, 17, 91, 65],
      lines: ['', '']
      
    }
  },

  mounted() {
    this.calculatePath()
  },
  
  methods: {
    pclick(lineNo) {
      alert(lineNo + ' clicked')
    },

    getScales() {
      const x = d3.scaleTime()
                  .range([0, 430])
      
      const y = d3.scaleLinear()
                  .range([210, 0])
      
      d3.axisLeft().scale(x)
      d3.axisBottom().scale(y)
      
      x.domain(d3.extent(this.data, (d, i) => i))
      y.domain([0, d3.max(this.data, d => d)])
      
      return { x, y }
    },

    calculatePath() {
      const scale = this.getScales()
      
      const path = d3.line()
                     .x((d, i) => scale.x(i))
                     .y(d => scale.y(d))

      this.lines[0] = path(this.data)
      this.lines[1] = path(this.data2)
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
  fill none
  stroke #76BF8A
  stroke-width 2px

</style>