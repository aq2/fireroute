//region
  //  nameClicked(i) {
  //   const cand = this.cands[i]
  //   const faded = cand.faded
  //   if (faded) {
  //     this.unfadeName(i)
  //     this.unfadePath(i)
  //     this.unfaded--
  //   } else {
  //     this.fadeName(i)
  //     this.fadePath(i)
  //     this.unfaded++      
  //   }

  // },



  // eyeClicked(i) {
  //   this.fadeEye(i)
  //   // qq but lost in mouseout!
  // },

  // eyeClickedO(i) {
  //   if (this.unfaded[i]) {
  //     this.fadeEye(i)
  //     this.fadePath(i)
  //     this.unfaded[i] = false
  //     this.nFaded++
  //     // might have to unlite if in solo
  //     if (this.lit[i]) {
  //       this.unLightBulb(i)
  //       this.lit[i] = false
  //       this.nLit--
  //     }
  //   } else {
  //     // todo if all faded, should lightbulb etc
  //     this.lightEye(i)
  //     this.lightPath(i)
  //     this.unfaded[i] = true
  //     if (this.nFaded <= this.nCands) {
  //       this.lightBulb(i)
  //       this.nLit++
  //     }
  //     this.nFaded--
  //     // might have to light it if in solo mode
  //     if (this.nLit > 0) {
  //       this.lightBulb(i)
  //       this.lit[i] = true
  //       this.nLit++
  //     }
  //   }
  // },

  // bulbClicked(i) {
  //   // when do i fade all others?
  //   if (this.lit[i]) {
  //     this.unLightBulb(i)
  //     this.fadeEye(i)
  //     this.fadePath(i)
  //     this.lit[i] = false
  //     this.unfaded[i] = false
  //     this.nLit--
  //   } else {
  //     this.lightBulb(i)
  //     this.lightEye(i)
  //     this.lightPath(i)
  //     this.lit[i] = true
  //     this.unfaded[i] = true
  //     this.nLit++
  //     if (this.nLit < 2) {
  //       // need to fade all eyes/paths, apart from i of course!
  //       this.fadeAllEyes()
  //       this.lightEye(i)
  //       this.fadeAllPaths()
  //       this.lightPath(i)
  //       for (var j=0, l=this.nCands; j<l; j++) {
  //         this.unfaded[j] = true
  //       }
  //       this.unfaded[i] = true
  //       this.lit[i] = false
  //     }
  //   }
  // },

  // fadeName(i) {
  //   const cand = this.$SelectedData.cands[i]
  //   cand.faded = true
  //   this.changeButton(i, 0.5, true)  // dotted=true
  // },

  // unfadeName(i) {
  //   const cand = this.$SelectedData.cands[i]
  //   cand.faded = false
  //   this.changeButton(i, 1, false)  // dotted=false    
  // },

  // lightEye(i) {
  //   this.changeButton(i, 1, false)  // dotted=false    
  // },

  // fadeAll() {
  //   for (var i=0, l=this.nCands; i<l; i++) {
  //     this.fadeEye(i)
  //     this.unfaded[i] = false
  //     this.fadePath(i)
  //     this.unLightBulb(i)
  //     this.lit[i] = false
  //   }
  //   this.nLit = 0
  //   this.nFaded = this.nCands
  // },

  // resetAll() {
  //   for (var i=0, l=this.nCands; i<l; i++) {
  //     this.lightEye(i)
  //     this.unfaded[i] = true
  //     this.lightPath(i)
  //     this.unLightBulb(i)
  //     this.lit[i] = false
  //   }
  //   this.nLit = 0
  // },

  // fadeAllEyes() {
  //   for (var i=0, l=this.nCands; i<l; i++) {
  //     this.fadeEye(i)
  //   }
  // },

  // fadeAllPaths() {
  //   for (var i=0, l=this.nCands; i<l; i++) {
  //     this.fadePath(i)
  //   }
  // },

  // unfadePath(i) {
  //   var id = '#path' + i
  //   d3.select(id)
  //     .style('stroke-width', '4')    
  //     .style('stroke-dasharray', ('0, 0'))
  //     .style('opacity', '1')      
  // },

  // fadePath(i) {
  //   // should send a message
  //   EventBus.$emit('fadePath', i)

  //   var id = '#path' + i
  //   d3.select(id)
  //     .style('stroke-width', '3')
  //     .style('stroke-dasharray', ('8, 8'))
  //     .style('opacity', '0.5')

  // },

  // flashPath(i, yesNo) {
  //   EventBus.$emit('flashPath', i, yesNo)
  //   // var id = '#path' + i
  //   // d3.select(id).classed('flash', yesNo)
  // },

  // flashEye(i, yesNo) {
  //   var id = '#cand' + i
  //   d3.select(id).classed('flash', yesNo)
  // },

  // changeButton(i, opac, dotted) {
  //   var btn = 'cand' + i
  //   my.$(btn).style.opacity = opac
  //   my.$(btn).style.border = '3px solid transparent'         
  //   if (dotted) {
  //     my.$(btn).style.border = '3px dotted #567'    
  //   } 
  // },

  // lightBulb(i) {
  //   my.$('bulb'+i).style.opacity = '1'    
  // },

  // unLightBulb(i) {
  //   // my.$('bulb'+i).style.background = this.candColors[i]
  //   my.$('bulb'+i).style.opacity = '0.33'    
  // },
  //endregion