<template lang="pug">
  
#payge  
  #gfx
    svg(id='mySvg')
  #list
    h1 candidates
    #candList 
      //- todo need to make this div scrollable
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
      //- button(@click='main') new palette

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
    svgHeightRatio: 0.95, svgWidthRatio: 0.8,  // fractions of window 
    margin: 60, // 2*30
    windowW: window.innerWidth, windowH: window.innerHeight,
    dimNames: [],   // could be computed from superdata
    candNames: [],  // could be computed from superdata
    unfaded: [], lit: [],   // todo get rid of these and change fade(i)
    nCands: 0, nLit: 0, nFaded: 0, nDims: 0,
    svgHeight: 0, svgWidth: 0, 
    chartHeight: 0, chartWidth: 0,
    svg:{}, chartGrp: {},
    yAxes: [], yScales: [],
    dimsAll: [], candsAll: [], pathsAll: [],
    superData: {dimsAll: [], candsAll: [], pathsAll: [] },  // computed?
  }
},

computed: {
  $DimData() {
    return this.$store.getters.getDimData
  },
  $DimMeta() {
    return this.$store.getters.getDimMeta
  },
  $SelectedCands() {
    return this.$store.getters.getSelectedCands
  },
  $CandiData() {
    return this.$store.getters.getCandiData
  },
},

methods: {
  main() {
    this.initChart()
    this.initDimsAll()
    this.initCandsAll()
    this.setupChart()
    this.randomPalette(this.nCands)
    this.plotCircles()
    this.plotPaths()
    this.setChartEvents()
  },

  initChart() {
    // set size of svg 
    this.svgHeight = Math.round((this.windowH - 100) * this.svgHeightRatio)  // 100 = headerHeight
    this.svgWidth = Math.round(this.windowW * this.svgWidthRatio)
    this.chartHeight = this.svgHeight - this.margin
    this.chartWidth = this.svgWidth - this.margin

     // the whole svg
    this.svg = d3.select('#mySvg')
                  .attr('height', this.svgHeight)
                  .attr('width', this.svgWidth)
    
    // drawable area of chart, inside the margin
    this.chartGrp = this.svg
                        .append('g')
                          .attr('class', 'chart')
                          .attr('transform', this.myXY(this.margin/2, this.margin/2))
  },

  initDimsAll() {
    this.nDims = this.$DimMeta.crits.length

    var key = 0
    Object.values(this.$DimData).forEach((dimD) => {  
      if (dimD.crit) {
        const {dimName, scores} = dimD
        const {min, max} = dimD.stats

        const xValue = this.chartWidth * key / (this.nDims - 1)

        const yScale = d3.scaleLinear()
                          .domain([min, max])
                          .range([this.chartHeight, 0])
        
        const yAxis = d3.axisLeft(yScale)

        this.yAxes.push(yAxis)
        this.yScales.push(yScale)

        // const candYs = []
        const dimColor = this.randomColor()

        const dimObj = {key, dimName, scores, min, max, yScale, yAxis, dimColor, xValue}

        this.dimsAll.push(dimObj)
        this.dimNames.push(dimName)
        key++
      }
    })
    // console.log(this.dimsAll)
    this.superData.dimsAll = this.dimsAll
    this.superData.dimNames = this.dimNames
  },

  initCandsAll() {
    this.nCands = this.$SelectedCands.length

    // todo - sort out unfaded/lit with candObj
    for (var i=0, l=this.nCands; i<l; i++) {
      this.unfaded.push(true)
      this.lit.push(false)
    }

    Object.values(this.$SelectedCands).forEach((cand, i) => {
      const key = i
      const name = this.$CandiData[cand].candID
      const candScores = []
      // loop over scores to get ys - where to get scores from?
      const yVals = []
      const xVals = []
      Object.values(this.superData.dimsAll).forEach((dimObj, dS) => {
        dimObj.scores.forEach((score, n) => {
          if (i == n) {
            candScores.push(score)
            var valY = dimObj.yScale(score)
            yVals.push(valY)
          }
        })
        var candX = this.chartWidth * dS / (this.nDims - 1)
        xVals.push(candX) 
      })
      const lit = true
      const hidden = false
      const colour = ''

      const candObj = {key, name, candScores, yVals, xVals, colour, lit, hidden}
      this.candsAll.push(candObj)
    })
    this.superData.candsAll = this.candsAll
  },

  setupChart() {
    // setup axes
    this.axesGrp = this.chartGrp.append('g')
                        .attr('class', 'axes')
 
    // setup shared x scale and axis
    this.xScale = d3.scalePoint()
                      .domain(this.dimNames)
                      .range([0, this.chartWidth])

    this.xAxis = d3.axisBottom(this.xScale)
                    .tickPadding(5)
 
    this.axesGrp.append('g')
            .attr('id', 'xAxis')
            .call(this.xAxis)
            .attr('transform', this.myXY(0, this.chartHeight))

    this.yAxesGrp = this.axesGrp.append('g')
                    .attr('class', 'yAxes')

    // todo - enter()?   // use superData instead??
    Object.values(this.superData.dimsAll).forEach((dimObj) => {
       this.yAxesGrp.append('g')
              .attr('class', 'yAxis' + dimObj.key)
              .call(dimObj.yAxis)
              .attr('transform', this.myXY(this.chartWidth * dimObj.key / (this.nDims - 1), 0))
    })

    // add a new group for circles
    this.circlesGrp = this.chartGrp.append('g')
                              .attr('class', 'circles')

    // and then the paths
    this.pathsGrp = this.chartGrp.append('g')
                              .attr('class', 'paths')
  },

  plotCircles() {
    // for each dim, plot circles
    Object.values(this.superData.dimsAll).forEach((dimO, dimN) => {
      // plot points on axis for dimension scores
      var dimCircles = this.circlesGrp.append('g')
                        .attr('class', 'circle' + dimN)
      dimCircles.selectAll('circle.' + dimO.dimName)                        
        .data(dimO.scores)                           
        .enter()
          .append('circle')
          .attr('class', () => dimO.dimName)                
          .attr('id', (d, cand) => dimO.dimName + cand)                
          .attr('cx', () => this.chartWidth*dimN/(this.dimNames.length - 1.0))
          .attr('cy', (d) =>  dimO.yScale(d))
          .attr('r', '5')
          .attr('fill', dimO.dimColor)
    })
  },

  plotPaths() {

    //
    // need to build up candScores from dimScores
    let candScores = [] //, candNames = []
    let selectedCands = this.$SelectedCands

    // get the candIDs for naming
    selectedCands.forEach((c) => {
      this.candNames.push(this.$CandiData[c].candID)
      candScores.push([])
      // this.candColors.push(this.randomColor())     // qq
    })
    
    // ok, what about the lines?
    // path generator to build line
    const line = d3.line()
                    .x((d, i) => (this.chartWidth*i/(this.nDims - 1)))
                    .y(d => d)
                    .curve(d3.curveMonotoneX)

    // append paths for each candidate - todo use enter() etc?
    this.superData.candsAll.forEach((candO, c) => {
      var ys = candO.yVals
      this.pathsGrp.append('path')
              .attr('d', line(ys))  // yVals - for some reason wanna feed this this superdata
              .attr('class', 'path')
              .attr('id', 'path' + c)
              .attr('fill', 'none')
              .attr('stroke', candO.colour)  // todo eh?
              // .attr('stroke', this.candColors[c])  // todo eh?
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
      .style('opacity', '1')      
  },

  fadePath(i) {
    var id = '#path' + i
    d3.select(id)
      .style('stroke-width', '3')
      .style('stroke-dasharray', ('8, 8'))
      .style('opacity', '0.5')
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

  // make palette of n colors 'evenly' thru hue wheel
  randomPalette() {
    var n = this.nCands
    var slice = 360/n
    var h = [], s = [], l = []
    this.candColors = []

    // numbers to tweak - should s = f(l) or vv? qq
    const minS = 0.7, maxS = 1
    const minL = 0.2, maxL = 0.7

    for (var i=0; i<n; i++) {
      // h.push(slice * i * d3.randomUniform(0.9, 1.1)())
      h.push(slice * i * d3.randomUniform(0.9, 1.1)())
      s.push(d3.randomUniform(minS, maxS)() * 100)
      l.push(d3.randomUniform(minL, maxL)() * 100)
    }
    d3.shuffle(h)
    
    h.forEach((hue, i) => {
      // this.candColors.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
      this.superData.candsAll[i].colour = 'hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)'
    })
  },

  colorCandButtons() {
    this.superData.candsAll.forEach((cand, c) => {
      let candBtn = this.$('cand' + c)
      let bulbBtn = this.$('bulb' + c)
      candBtn.style.background = cand.colour
      bulbBtn.style.background = cand.colour
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
