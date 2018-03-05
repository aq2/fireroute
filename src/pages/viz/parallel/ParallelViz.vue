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
  },
  selectedCands() {
    return this.$store.getters.getSelectedCands
  },
  candiData() {
    return this.$store.getters.getCandiData
  }  
},

methods: {
  // todo - could split into sep fns
  main() {
    //
    // set size of svg 
    const svgHeight = 800, svgWidth = 500
    const margin = 60  // ie 2*30
    
    const svg = d3.select('#mySvg')
                  .attr('height', svgHeight)
                  .attr('width', svgWidth)

    const chartHeight = svgHeight - margin
    const chartWidth = svgWidth - margin

    // drawable area of chart, inside the margin
    const chartGrp = svg.append('g')
                        .attr('class', 'chart')
                        .attr('transform', this.myXY(margin/2, margin/2))
    
    //
    // setup a yAxis for each dimension 
    let dims = [], dimScores = []
    let mins = [], maxs = []
    let yScales = [], yAxes = []
    let dimColors = []

    // fetch store data and set scales and axes for each dim
    Object.entries(this.dimData).forEach(([k, dimD]) => {
      if (dimD.crit) {
        dims.push(dimD.dimName)
        dimScores.push(dimD.scores)

        const min = dimD.stats.min
        const max = dimD.stats.max
        mins.push(min)
        maxs.push(max)

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([chartHeight, 0])
        
        yScales.push(yScale)
        
        const yAxis = d3.axisLeft(yScale)
        yAxes.push(yAxis)
        dimColors.push(this.randomColor()())
      }
    })
    // console.log('dC', dimColors)

    //
    // setup shared x scale and axis
    const xScale = d3.scalePoint()
                      .domain(dims)
                      .range([0, chartWidth])

    const xAxis = d3.axisBottom(xScale)
                    .tickPadding(5)
    
    // 
    // put axes in a group, and shift a bit to make margin
    const axesGrp = chartGrp.append('g')
                            .attr('class', 'axes')

    axesGrp.append('g')
            .attr('class', 'xAxis')
            .call(xAxis)
            .attr('transform', this.myXY(0, chartHeight))

    const yAxesGrp = axesGrp.append('g')
                    .attr('class', 'yAxes')

    //
    // add a new group for circles
    const circlesGrp = chartGrp.append('g')
                              .attr('class', 'circles')

    //
    // for each dim, add axis and plot circles
    dims.forEach((dim, j) => {
      // add an axis
      yAxesGrp.append('g')
              .attr('class', 'yAxis' + j)
              .call(yAxes[j])
              .attr('transform', this.myXY(chartWidth * j / (dims.length - 1), 0))

      // plot points on axis for dimension scores
      circlesGrp.selectAll('circle.' + dim)                        
        .data(dimScores[j])                                    
        .enter()
          // .each((d, i) =>  console.log('d' + i +' is', d))
          .append('circle')
          .attr('class', () => dim)                      
          .attr('cx', () => chartWidth*j/(dims.length - 1))
          .attr('cy', (d) => yScales[j](d))
          .attr('r', '4')
          .attr('fill', dimColors[j])
    })

    //
    // need to build up candScores from dimScores
    // probably some fancy map method, but i'll do it noobly
    let candScores = [], candNames = []
    let candXs = [], candYs = []   // not actually using candXs, but could...
    let selectedCands = this.selectedCands
    let candColors = []

    // get the candIDs for naming
    selectedCands.forEach((c) => {
      candNames.push(this.candiData[c].candID)
      candScores.push([])
      candColors.push(this.randomColor()())
    })
    
    // build candidate scores from dimScores
    dimScores.forEach((dimScore, dS) => {
      dimScore.forEach((score, n) => {
        candScores[n].push(score)
      })
      // var candX = chartWidth*dS/(dims.length - 1)
      // candXs.push(candX) 
    })

    // calculate x,y values for candScores
    candScores.forEach(scores => {
      let yVals = []
      scores.forEach((score, s) => {
        var valY = yScales[s](score)
        yVals.push(valY)
      })
      candYs.push(yVals)
    })

    // ok, what about the lines?
    // path generator to build line
    const line = d3.line()
                    .x((d, i) => (chartWidth*i/(dims.length - 1)))
                    .y(d => d)
                    // .curve(d3.curveOrdinal)
                    // .curve(d3.curveNatural)
                    // .curve(d3.curveBasis)
                    .curve(d3.curveMonotoneX)
                    // .curve(d3.curveCatmullRom)

    const pathsGrp = chartGrp.append('g')
                              .attr('class', 'paths')

    // append paths for each candidate
    selectedCands.forEach((cand, c) => {
      pathsGrp.append('path')
              .attr('d', line(candYs[c]))
              .attr('class', 'path' + c)
              .attr('fill', 'none')
              .attr('stroke', candColors[c])
              .attr('stroke-width', '2px')
    }) 

    console.log('rc', this.randomColor()())

  }, // end main

  myXY(x, y) {
    return 'translate(' + x + ',' + y + ')'
  },

  // Adapted from martin.ankerl.com
  randomColor() {
    var golden_ratio = 0.618033988749895
    var h = Math.random()

    function hue2rgb(p, q, t) {
      if (t < 0) t++
      if (t > 1) t--
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    var hslToRgb = function (h, s, l){
      var r, g, b

      if (s == 0) {
        r = g = b = l // achromatic
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s
        var p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }

      function mR(x) {
        return Math.round(x)
      }

      return '#'+mR(r*255).toString(16)+mR(g*255).toString(16)+mR(b*255).toString(16)
    }
    
    return function(){
      h += golden_ratio
      h %= 1

      var myS = d3.randomUniform(0.2, 0.9)()
      var myL = d3.randomUniform(0.2, 0.8)()

      // return hslToRgb(h, 0.5, 0.60)
      return hslToRgb(h, myS, myL)
    }
  },

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
