<template lang='pug'>

#graphic
  svg(id='mySvg')
    g(style='transform: translate(30px, 10px)')
      path(v-for='(line,i) in lines' :d='line'  @click="pclick(i)")
  p what {{ foo }}
</template>


<script>

import * as d3 from 'd3'

export default {
  name: 'vue-line-chart',
  
  data() {
    return {
      data: [100, 0, 78, 24, 36, 92],
      data2: [51, 29, 55, 17, 91, 65],
      lines: ['', ''],
      foo: 'basr'
    }
  },

  computed: {
    dimData() {
      return this.$store.getters.getDimData
    },
    candiData() {    
      return this.$store.getters.getCandiData
    },
    selectedCands() {    
      return this.$store.getters.selectedCands
    }

  },

  created() {
    this.main()
    this.foo = 'bar'
    // this.calculatePath()
  },
  
  methods: {
    main() {
      // get data from store
      const dimData = this.dimData
     
      // find max and min for each dim
      let stats = []
      const values = Object.values(dimData)
      values.forEach((v) => {
        stats.push(v.stats)
      })

      let mins = [], means = [], maxs = []
      stats.forEach(stat => {
        if (stat) {
          mins.push(stat.min)
          maxs.push(stat.max)
          means.push(stat.mean)
        }
      })

      console.log('min', mins)
      console.log('max', maxs)
     
      // set scales
      // const x = d3.scaleLinear()
      //             .range([0, 430])

      let a = d3.scaleOrdinal()
                .domain(['dave', 'tom', 'sue', 'jim'])
                .range([0,400])
      
      const y = d3.scaleLinear()
                  .range([maxs[0], mins[0]])

      d3.axisLeft().scale(y)
      d3.axisBottom().scale(a)

      // x.domain(d3.extent(this.data, (d, i) => i))
      y.domain([0, d3.max(this.data, d => d)])

      // draw axes
      // x-axis
    d3.select('#mySvg').append('g')
      .attr('transform', "translate(30," + 220 + ")")
      .call(d3.axisBottom(a))

    // plot?
    const path = d3.line()
                     .x((d, i) => a(i))
                     .y(d => y(d))

      this.lines[0] = path(this.data)
      this.lines[1] = path(this.data2)
    },



    pclick(lineNo) {
      alert(lineNo + ' clicked')
    },

    getScales() {
      const x = d3.scaleLinear()
                  .range([0, 430])
      
      const y = d3.scaleLinear()
                  .range([210, 0])
      
      d3.axisLeft().scale(x)
      d3.axisBottom().scale(y)
      
      x.domain(d3.extent(this.data, (d, i) => i))
      y.domain([0, d3.max(this.data, d => d)])
    
    // x-axis
    d3.select('#mySvg').append('g')
      .attr('transform', "translate(30," + 220 + ")")
      .call(d3.axisBottom(x))
    
    // y-axis
    d3.select('#mySvg').append("g")
      .attr('transform', "translate(30," + 10 + ")")
      .call(d3.axisLeft(y))

    d3.select('#mySvg').append("g")
      .attr('transform', "translate(116," + 10 + ")")
      .call(d3.axisLeft(y))

      return { x, y }
    },

    calculatePath() {
      const scale = this.getScales()  // getScales(dim)
      
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

#mySvg
  margin 25px
  background blue
  height 500px
  width 500px

path
  fill none
  stroke #76BF8A
  stroke-width 2px

</style>