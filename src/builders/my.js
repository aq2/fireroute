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



export const bulb18 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEySURBVDhPtZK7LgVRFEBvvDqPQkIvRCHhA5SCRPgDPsCNzjN8gI7WPwgJITqFRKOVKESHXiF0rHXOGWaYyb25yV3Jyuy9z95zJnNOrR2sYH8Mm8Le5Rj+0oEXeIfZywZwG8/xDLdSTfrQXmecLdCDu+k5gS94iztJ42d0Ld9bSTc+4gHmdzM+xAfsstCIRXTnst2sveJCyEqYxhkcxk08xSpc20B7nXH2hxt8wiWs4yVWcYWraK8zzpYygu84GrIi4+iaPU3hT72OYQFrHkJDstPoRX/4bMgixtZck8qTm0SPdihk8Yfmd/cr12MYeuydClkO78g97oUsMo9+wVHSeA4zvJDO/LvZg+mZ4bG+4X7SuHDU8HemlDH8wLXkZ6q1hC/4Snq/WqYTT/A4xe2mVvsGdGI33Clb5N4AAAAASUVORK5CYII="

export const eye18 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEwSURBVDhP7dK9K0VxHMfxn8RgklgMShaTXJRMSimKwXRXi0H3TjdlxsBkYZFBIaQM8geQspDBwOBhkkgGj4sU7/c598itO9ysfOpVv/M9p+/v6YT//DrVGMQoxjGCPlShpKSwjXd8YA/rOMQn3rCMJhRNGSbwgjtcohM/0497XOMVrrIgNlnEKXphsxYY39XGwyg2e0APbuC2v5OFxTrksAlTgQO4pQ0L+RxhCM1wUs8yisu1mZnDdDwM7bBJogZmDWPxMMziOB6GMIlzeCMudQXGZ+s22beQj6tMox5ucxhRyrEDP+7GExphbNaGyugphC48owNnmEdB/HAJt/C8PIekWZJWXOECj5iCl1E0AziB2/EgVzGDLfhvWd+FKysp3kgGHvwCnN3/pgF/KyF8AaZ0RLnQyIOAAAAAAElFTkSuQmCC"