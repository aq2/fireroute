<template>
  <div>
    <svg width="500" height="270" id='mySvg'>
      <g style="transform: translate(0, 10px)">
        <path v-for='(line,i) in lines' :key='i' :d='line' @click="pclick(i)"/>
      </g>
    </svg>
      <p> what</p>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'vue-line-chart',
  data() {
    return {
      data: [0, 71, 78, 25, 36, 92],
      data2: [51, 29, 55, 17, 91, 65],
      data3: [29, 45, 72, 91, 65, 14],
      data4: [49, 15, 11, 2, 91, 65],
      lines: ['', '', ''],
      line: '',
      dims: ['nss', 'hons', 'ent', 'pro', 'foo', 'bar']
    }
  },
  created() {
    this.calculatePath()
  },
  mounted() {
    // draw axes
      // x-axis
      let x = this.getScales().x
      let a = d3.scaleOrdinal().domain(this.dims).range([0, 400])
      d3.select('#mySvg').append('g')
        .attr('transform', "translate(0," + 221 + ")")
        .call(d3.axisBottom(a))
  },
  methods: {
    getScales() {
      const x = d3.scaleTime().range([0, 430])
      const y = d3.scaleLinear().range([210, 0])
      d3.axisLeft().scale(x)
      // d3.axisBottom().scale(y)
      x.domain(d3.extent(this.data, (d, i) => i))
      y.domain([0, d3.max(this.data, d => d)])

      return { x, y }
    },
    calculatePath() {
      const scale = this.getScales()
      let a = d3.scaleOrdinal().domain(this.dims).range([0, 400])
      
      const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d))
      this.lines[0] = path(this.data)
      this.lines[1] = path(this.data2)
      this.lines[2] = path(this.data3)
      this.lines[3] = path(this.data4)
    },
    pclick(lineNo) {
      alert(lineNo + ' clicked')
    },
  },
};
</script>

<style lang="stylus" scoped>
svg
  margin 25px
  background blue

path
  fill: none
  stroke: #76BF8A
  stroke-width: 3px
</style>