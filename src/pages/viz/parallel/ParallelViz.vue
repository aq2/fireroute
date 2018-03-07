<template lang="pug">
  
#payge  
  #gfx
    svg(id='mySvg')
  #list
    h1 candidates
    #candList
      .cand(v-for='(name,i) in candNames')
        button(:ID="'cand' + i" class='nameBtn'
                @click='eyeClicked(i)'
                @mouseover='flashPath(i, true)'
                @mouseout='flashPath(i, false)'
              ) {{name}}
          icon(name='eye' class='eye' scale=1.3)
         
        button(:ID="'bulb' + i" class='bulbBtn'
                @click='bulbClicked(i)'             
              )
          icon(name='lightbulb-o' class='bulb' scale=1.3)
      button(@click='fadeAll') fade all 
      button(@click='resetAll') reset all 

</template>


<script>

import * as d3 from 'd3'

export default {
name: 'scratch',

mounted() {
  this.main()
},

updated() {
  this.colorCandButtons()
},

data() {
  return {
    dimNames: [], candNames: [], candColors: [],
    unfaded: [], lit: [],
    nCands: 0, nLit: 0, nFaded: 0,
    windowW: window.innerWidth, windowH: window.innerHeight,
    svgHeight: 0, svgWidth: 0, margin: 60, // 2*30
    chartHeight: 0, chartWidth: 0,
    svg:{}, chartGrp: {}
  }
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
  },  
},

methods: {
  main() {
    this.initData()
    this.setChartSize()
    this.drawParallel()
    this.setChartEvents()
  },

  initData() {
    this.nCands = this.selectedCands.length
    for (var i=0, l=this.nCands; i<l; i++) {
      this.unfaded.push(true)
      this.lit.push(false)
    }
  },

  setChartSize() {
    // set size of svg 
    this.svgHeight = Math.round((this.windowH - 100) * 0.95)
    this.svgWidth = Math.round(this.windowW * 0.68)
    this.chartHeight = this.svgHeight - this.margin
    this.chartWidth = this.svgWidth - this.margin

    // the whole svg
    this.svg = d3.select('#mySvg')
                  .attr('height', this.svgHeight)
                  .attr('width', this.svgWidth)

    // drawable area of chart, inside the margin
    this.chartGrp = this.svg.append('g')
                        .attr('class', 'chart')
                        .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },


   // todo - could split into sep fns
  drawParallel() {
    // setup a yAxis for each dimension 
    let dims = [], dimScores = []
    let mins = [], maxs = []
    let yScales = [], yAxes = []
    let dimColors = []

    // fetch store data and set scales and axes for each dim
    Object.entries(this.dimData).forEach(([k, dimD]) => {
      if (dimD.crit) {
        this.dimNames.push(dimD.dimName)
        dimScores.push(dimD.scores)

        const min = dimD.stats.min
        const max = dimD.stats.max
        mins.push(min)
        maxs.push(max)

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        yScales.push(yScale)
        
        const yAxis = d3.axisLeft(yScale)
        yAxes.push(yAxis)
        dimColors.push(this.randomColor())
      }
    })

    // setup shared x scale and axis
    const xScale = d3.scalePoint()
                      .domain(this.dimNames)
                      .range([0, this.chartWidth])

    const xAxis = d3.axisBottom(xScale)
                    .tickPadding(5)
    
    // put axes in a group, and shift a bit to make margin
    const axesGrp = this.chartGrp.append('g')
                        .attr('class', 'axes')

    axesGrp.append('g')
            .attr('id', 'xAxis')
            .call(xAxis)
            .attr('transform', this.myXY(0, this.chartHeight))

    const yAxesGrp = axesGrp.append('g')
                    .attr('class', 'yAxes')

    // add a new group for circles
    const circlesGrp = this.chartGrp.append('g')
                              .attr('class', 'circles')

    // for each dim, add axis and plot circles
    this.dimNames.forEach((dim, j) => {
      // add an axis
      yAxesGrp.append('g')
              .attr('class', 'yAxis' + j)
              .call(yAxes[j])
              .attr('transform', this.myXY(this.chartWidth * j / (this.dimNames.length - 1), 0))

      // plot points on axis for dimension scores
      circlesGrp.selectAll('circle.' + dim)                        
        .data(dimScores[j])                                    
        .enter()
          // .each((d, i) =>  console.log('d' + i +' is', d))
          .append('circle')
          .attr('class', () => dim)                      
          .attr('cx', () => this.chartWidth*j/(this.dimNames.length - 1))
          .attr('cy', (d) => yScales[j](d))
          .attr('r', '4')
          .attr('fill', dimColors[j])
    })

    //
    // need to build up candScores from dimScores
    let candScores = [] //, candNames = []
    let candXs = [], candYs = []   // not actually using candXs, but could...
    let selectedCands = this.selectedCands

    // get the candIDs for naming
    selectedCands.forEach((c) => {
      this.candNames.push(this.candiData[c].candID)
      candScores.push([])
      this.candColors.push(this.randomColor())
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
                    .x((d, i) => (this.chartWidth*i/(this.dimNames.length - 1)))
                    .y(d => d)
                    // .curve(d3.curveOrdinal)
                    // .curve(d3.curveNatural)
                    // .curve(d3.curveBasis)
                    .curve(d3.curveMonotoneX)
                    // .curve(d3.curveCatmullRom)

    const pathsGrp = this.chartGrp.append('g')
                              .attr('class', 'paths')

    // append paths for each candidate
    selectedCands.forEach((cand, c) => {
      pathsGrp.append('path')
              .attr('d', line(candYs[c]))
              .attr('class', 'path')
              .attr('id', 'path' + c)
              .attr('fill', 'none')
              .attr('stroke', this.candColors[c])
              .attr('stroke-width', '4px')
    }) 
  }, 

  setChartEvents() {
    d3.selectAll('path')
      .on('mouseover', () => {
        const pathID = d3.event.srcElement.id
        var p = pathID.slice(4)
        this.flashEye(p, true)
        this.flashPath(p, true)
      })
      .on('mouseout', () => {
        const pathID = d3.event.srcElement.id
        var p = pathID.slice(4)
        this.flashEye(p, false)
        this.flashPath(p, false)
      })
      .on('click', () => {
        const pathID = d3.event.srcElement.id
        var p = pathID.slice(4)
        this.bulbClicked(p)
        // this.flashPath(p, false)
      })

  },



  eyeClicked(i) {
    if (this.unfaded[i]) {
      this.fadeEye(i)
      this.fadePath(i)
      this.unfaded[i] = false
      this.nFaded++
      // might have to unlite if in solo
      if (this.lit[i]) {
        this.unLightBulb(i)
        this.lit[i] = false
        this.nLit--
      }
    } else {
      // todo if all faded, should lightbulb etc
      this.lightEye(i)
      this.lightPath(i)
      this.unfaded[i] = true
      if (this.nFaded <= this.nCands) {
        this.lightBulb(i)
        this.nLit++
      }
      this.nFaded--
      // might have to light it if in solo mode
      if (this.nLit > 0) {
        this.lightBulb(i)
        this.lit[i] = true
        this.nLit++
      }
    }
  },

  bulbClicked(i) {
    // when do i fade all others?
    if (this.lit[i]) {
      this.unLightBulb(i)
      this.fadeEye(i)
      this.fadePath(i)
      this.lit[i] = false
      this.unfaded[i] = false
      this.nLit--
    } else {
      this.lightBulb(i)
      this.lightEye(i)
      this.lightPath(i)
      this.lit[i] = true
      this.unfaded[i] = true
      this.nLit++
      if (this.nLit < 2) {
        // need to fade all eyes/paths, apart from i of course!
        this.fadeAllEyes()
        this.lightEye(i)
        this.fadeAllPaths()
        this.lightPath(i)
        for (var j=0, l=this.nCands; j<l; j++) {
          this.unfaded[j] = true
        }
        this.unfaded[i] = true
        this.lit[i] = false
      }
    }
  },
  
  fadeEye(i) {
    this.changeButton(i, 0.5, true)  // dotted=true
  },

  lightEye(i) {
    this.changeButton(i, 1, false)  // dotted=false    
  },

  fadeAll() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadeEye(i)
      this.unfaded[i] = false
      this.fadePath(i)
      this.unLightBulb(i)
      this.lit[i] = false
    }
    this.nLit = 0
    this.nFaded = this.nCands
  },
    
  resetAll() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.lightEye(i)
      this.unfaded[i] = true
      this.lightPath(i)
      this.unLightBulb(i)
      this.lit[i] = false
    }
    this.nLit = 0
  },

  fadeAllEyes() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadeEye(i)
    }
  },

  fadeAllPaths() {
    for (var i=0, l=this.nCands; i<l; i++) {
      this.fadePath(i)
    }
  },

  lightPath(i) {
    var id = '#path' + i
    d3.select(id)
      .style('stroke-width', '4')    
      .style('stroke-dasharray', ('0, 0'))
  },

  fadePath(i) {
    var id = '#path' + i
    d3.select(id)
      .style('stroke-width', '2')
      .style('stroke-dasharray', ('5, 5'))
  },

  flashPath(i, yesNo) {
    var id = '#path' + i
    d3.select(id).classed('flash', yesNo)
  },

   flashEye(i, yesNo) {
    var id = '#cand' + i
    d3.select(id).classed('flash', yesNo)
  },

  changeButton(i, opac, dotted) {
    var btn = 'cand' + i
    this.$(btn).style.opacity = opac
    this.$(btn).style.border = '3px solid transparent'         
    if (dotted) {
      this.$(btn).style.border = '3px dotted #567'    
    } 
  },

  lightBulb(i) {
    this.$('bulb'+i).style.opacity = '1'    
  },

  unLightBulb(i) {
    // this.$('bulb'+i).style.background = this.candColors[i]
    this.$('bulb'+i).style.opacity = '0.33'    
  },

  myXY(x, y) {
    return 'translate(' + x + ',' + y + ')'
  },

  randomColor() {
    // todo may be better to evenly distribute (with minor randomness),
    // then shuffle the colors throughout pallete,
    // so this function will either return whole pallete
    // or random unchosen one
    var h = d3.randomUniform()() * 360
    var myS = d3.randomUniform(0.2, 1)() * 100
    var myL = d3.randomUniform(0.3, 1)() * 100
    // console.log('hsv', Math.round(h), Math.round(myS), Math.round(myL))
    return 'hsl(' + h + ', ' + myS +'%, ' + myL + '%)'
    // }
  },

  colorCandButtons() {
    this.selectedCands.forEach((cand, c) => {
      let candBtn = this.$('cand' + c)
      let bulbBtn = this.$('bulb' + c)
      candBtn.style.background = this.candColors[c]
      bulbBtn.style.background = this.candColors[c]
    })
  },

  $(ID) {
    return document.getElementById(ID)
  },

} // end methods  

}
</script>


<style lang="stylus" scoped>

#payge
  margin 1rem
  display flex

svg
  background-color $g3
  // position fixed

#list
  background $g5
  padding 1rem
  overflow-y auto

button
  color $g0
  margin-bottom 0.5rem
  border 3px solid transparent
  box-sizing border-box
  padding 0.5rem
  margin-right 0.25rem

.nameBtn
  width 180px

button:hover
  background-color $g2

.eye, .bulb
  color $g0
  background none

.eye
  margin-left 0.5rem
  // margin-top 15px

.bulbBtn
  opacity 0.3

// need to refer to main.styl to change chart css!

</style>
