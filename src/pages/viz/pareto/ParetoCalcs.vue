<template lang="pug">
</template>


<script>

import {EventBus} from '../../../main'

export default {

computed: {
  candiData() {
    return this.$store.getters.getCandiData
  },
  
  candMeta() {
    return this.$store.getters.getCandMeta
  }
},

methods: {
  
  main() {
    const cands = this.candiData

    let allRankings = []
    cands.forEach(cand => {
      allRankings.push(cand.rankings)
    })

    // find infs and sups
    var candsWithDom = this.contest(allRankings, cands)

    // keep allSups for finding fronts later
    let allSups = []
    cands.forEach((cand) => {
      const sups = [...cand.sups]  // dereference it! avoid passing array by ref!
      allSups.push(sups)
    })
    let newFronts = this.buildFronts(allSups)

    newFronts.forEach((front, f) => {
      front.forEach(peer => {
        candsWithDom[peer].paretoFront = f
        candsWithDom[peer].peers = front
      })  
    })

    // keep fronts elsewhere...
    let candMeta = this.candMeta
    candMeta.fronts = newFronts

    // now store this stuff!
    this.$store.dispatch('setCandiData', candsWithDom)
    this.$store.dispatch('setCandMeta', candMeta)

    // send event to header to change page
    // EventBus.$emit('changePage', 8)    // qq
    EventBus.$emit('calcsDone')    // qq
  },

  contest(allRankings, cands) {
    var len = allRankings.length

    for (var a=0; a<len-1; a++) {
      var rankA = allRankings[a]

      for (var b=a+1; b<len; b++) {
        var rankB = allRankings[b]
        var dominator = this.compareCands(rankA, rankB)

        if (dominator == 'A') {
            // add B to A's inferiors
            cands[a].infs.push(b)
            // add A to B's superiors
            cands[b].sups.push(a)
          } else
          if (dominator == 'B') {
            cands[b].infs.push(a)
            cands[a].sups.push(b)
          }
      }
    }
    return cands
  },

  getLeader(ranksA, ranksB) {
    for (let d=0, len=ranksA.length; d<len; d++) {
      if (ranksA[d] > ranksB[d]) {  // B is better at first
        return [d, 'B']
      } else
      if (ranksA[d] < ranksB[d]) {  // A is better
        return [d, 'A']
      }
    }
    // must be all equal!
    return 'equal'
  },

  compareCands(rankA, rankB) {
    const [firstIdx, leader] = this.getLeader(rankA, rankB)
    const dominator = this.getDominator(firstIdx, leader, rankA, rankB)
    return dominator
  },

  getDominator(firstIdx, leader, ranksA, ranksB) {
    for (let i=firstIdx+1, len=ranksA.length; i<len; i++) {
      if (((ranksA[i] > ranksB[i]) && (leader == 'A')) 
      || ((ranksB[i] > ranksA[i]) && (leader == 'B'))) {
        // no dominance
        return false
      }  // todo what happens if they're equal?
    }
    return leader
  },

  // seems overly complicated? - recursion?
  buildFronts(allSups) {
    let fronts = []
    let allCands = new Set()
    
    for (let i=0, l=allSups.length; i<l; i++) {
      allCands.add(i)
    }

    while (allCands.size > 0) {
      let front = []
      let aCA = [...allCands]
    
      // find non-dominated candidates
      aCA.forEach(c => {
        if (allSups[c].length == 0) {
          front.push(c)
          allCands.delete(c)
        }
      })
      
      fronts.push(front)

      // remove front members from other sups
      front.forEach(f => {
        allCands.forEach(c => {
          const index = allSups[c].indexOf(f)
          if (index != -1) {
            allSups[c].splice(index, 1)
          }
        })
      })
    }  // end while
    return fronts
  },

},
created() {
  this.main()
}

}
</script>
