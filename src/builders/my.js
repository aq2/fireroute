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

  for (var i=0; i<n; i++) {
    // h.push(slice * i * d3.randomUniform(0.9, 1.1)())
    h.push(slice * i * d3.randomUniform(0.9, 1.1)())
    s.push(d3.randomUniform(minS, maxS)() * 100)
    l.push(d3.randomUniform(minL, maxL)() * 100)
  }
  d3.shuffle(h)
  
  h.forEach((hue, i) => {
    // this.candColors.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
    palette.push('hsl(' + h[i] + ', ' + s[i] +'%, ' + l[i] + '%)')
  })
  return palette
}


export function $(ID) {
  return document.getElementById(ID)
}