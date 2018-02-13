<template lang="pug">

#getFile
  input(type="file" id='browseFile' accept=".csv, text/csv" @change='readFile')
  label(id='browseLabel' for='browseFile')
    icon(name='upload' class='btnIcon' scale=1.2)
    span choose a file...
  
</template>


<script>

export default {
methods: {
  readFile(evt) {
    const file = evt.target.files[0]
    if (file) {
      const rdr = new FileReader()
      rdr.onload = e => {this.processFile(e.target.result)}
      rdr.readAsText(file)
    } else {
      alert('failed to load file')
    }
  }, 
  
  processFile(file) {
    const lines = file
                    .trim()       // remove last empty line
                    .split('\n')
                    .map(line => line.split(','))
  
    const dimNames = lines[0]
    
    // check valid file format/contents
    if (lines.length < 3 || this.badHeaders(dimNames)) {
      // todo deal with it properly
      alert('bad file format')
      return false
    }

    // parse the raw candidates from file
    const rawCands = lines.slice(1)    // remove first headers line
    const {candidates, alphas} = this.deStringVals(rawCands)
    const ignores = []

    // stick data in store
    const catMeta = {dimNames, alphas}
    const candMeta = {candidates, ignores}

    this.$store.dispatch('setDimMeta', catMeta)
    this.$store.dispatch('setCandMeta', candMeta)
    
    this.$router.push('/getmetadata')
  },


  deStringVals(rawStringedCandidates) {
    let candidates = []
    let alphas = []
    
    // todo use sets for alphas?
    rawStringedCandidates.forEach((line) => {
      let cand = []
      
      line.forEach((value, v) => {
        if (isNaN(value)) {
          if (!alphas.includes(v)) {
            alphas.push(v)
          }
          value = value.trim()
        } else {
          value = Number(value)
        }
        cand.push(value)
      })
      
      candidates.push(cand)
    })
    return {candidates, alphas}
  },


  badHeaders(headers) {
    const numericValues = headers.filter(h => !isNaN(h))
    // should this be a reduce? reduces down to true false
    return (numericValues === 0)
  }   
}
}

</script>


<style lang="stylus" scoped>

#getFile 
  width 200px

#browseFile 
  opacity 0
  z-index -1
  width 0.1px
  height 0.1px
  overflow hidden
  color transparent
  position absolute

label
  color $g9
  padding 0.5rem
  background blue
  animation throb linear 2s infinite
  link(0.5rem)
  position static
  width 12rem
  &:hover
    cursor pointer
    background lightblue

.btnIcon
  margin-right 1rem
  margin-bottom -2px


</style>
