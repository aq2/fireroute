<template lang="pug">

#links  
  button(id='welcomeBtn' @click='nextPage(0)')
    icon(name='home' scale=3)
    h1 {{pageTitle}}

  button(id='dataBtn' @click='nextPage(1)')
    icon(name='file-excel-o' scale=2.5)
    h1 {{pageTitle}}
  
  button(id='vizBtn' @click='nextPage(6)')
    icon(name='area-chart' scale=3)
    h1 {{pageTitle}}

</template>


<script>

import {EventBus} from './../main'

export default {

data() {
  return {
    currentPage: 0,
    pageTitle: 'Welcome to HyperDViz'
  }
},

created() {
  EventBus.$on('changePage', (newPage) => {
    this.currentPage = newPage
    switch(newPage) {
      case 0:
        this.deActivateAll()
        this.$('welcomeBtn').classList.add('active')
        this.pageTitle = 'Welcome to HyperDViz'
        break
      case 1:
        this.deActivateAll()
        this.$('dataBtn').classList.add('active')
        this.pageTitle = 'Get DataSet'
        break
      case 2:
        this.pageTitle = 'Get Data from CSV'        
        break
      case 3:
        // fb source
        break
      case 4:
        this.pageTitle = 'Dimension metaData'
        break
      case 5:
        // save2fb
        break
      case 6:
        this.pageTitle = 'Choose Viz Type'
        this.deActivateAll()
        this.$('vizBtn').classList.add('active')
        break
      case 7:
        this.pageTitle = 'Pareto Dominance Plot'
        this.deActivateAll()
        this.$('vizBtn').classList.add('active')
        break
      case 8:
        this.pageTitle = 'Parallel Coords Plot'
        this.deActivateAll()
        this.$('vizBtn').classList.add('active')
        break
      default:
        // dunno
    }
  })

},

mounted() {
  let el = this.$('welcomeBtn')
  el.classList.toggle('active')
},

methods: {
  $(ID) {
    return document.getElementById(ID)
  },

  deActivateAll() {
    this.$('welcomeBtn').classList.remove('active')
    this.$('dataBtn').classList.remove('active')
    this.$('vizBtn').classList.remove('active')
    
  },


  // what??
  nextPage(newPage) {
    EventBus.$emit('changePage', newPage)
  }
},

}
</script>


<style lang="stylus" scoped>

#links
  width 650px
  display flex
  // margin 0 auto
  // align right

#links > button
  display flex
  transition all 1s
  align-items center

button
  height 80px
  display flex
  color $g9
  padding 0.5rem 0 0 1rem
  border-radius 0.5rem
  min-width 80px



h1
  display none

.active
  // border 0
  color $g9
  flex-grow 1
  background $g3
  padding-left 1rem

.active h1
  margin 0
  color $g9
  padding-left 1rem
  display inline-block


</style>
