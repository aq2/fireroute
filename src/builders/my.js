import * as d3 from 'd3'

// make palette of n colors 'evenly' thru hue wheel
export function randomPalette(n) {
  // var n = this.nCands
  var slice = 360/n
  var h = [], s = [], l = []
  var palette = []

  // numbers to tweak - should s = f(l) or vv? qq
  const minS = 0.7, maxS = 1
  const minL = 0.2, maxL = 0.7

  const mR = Math.round

  for (var i=0; i<n; i++) {
    h.push(mR(slice * i * d3.randomUniform(0.9, 1.1)()))
    s.push(mR(d3.randomUniform(minS, maxS)() * 100))
    l.push(mR(d3.randomUniform(minL, maxL)() * 100))
  }
  d3.shuffle(h)
  
  h.forEach((hue, i) => {
    palette.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
  })
  return palette
}


export function $(ID) {
  return document.getElementById(ID)
}