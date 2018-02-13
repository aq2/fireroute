<template lang="pug">
  
#header
  #buttons1(v-show='vizPage')
    #toggleSidebar
      .tooltip(@click='toggleSidebar')
        button
          icon(v-if='sidebarOpen' name='chevron-circle-left' scale=2) 
          icon(v-else name='chevron-circle-right' scale=2)
          span(class='tooltiptext tooltip-right') click to toggle sidebar    

  #headerLinks
    HeaderLinks

  #candInfo(v-if='vizPage')
    CandInfo  
    //- todo based on page number?
  
  #buttons2
    #search
      button(@click='search')
        icon(name='search' scale=2)
    #help
      button(@click='help' class='tooltip')
        span(class='tooltiptext tooltip-left') what do i do?
        icon(name='question-circle' scale=2)

    #fullscreen-toggle 
      button(@click='toggleFullScreen' class='tooltip')
        span(class='tooltiptext tooltip-left') toggle fullscreen
        icon(name='window-restore' scale=2)


</template>


<script>

import {EventBus} from './../main'
import HeaderLinks from './HeaderLinks'
import CandInfo from './../sidebar/components/CandInfo'

export default {
components: {
  CandInfo,
  HeaderLinks
},

data() {
  return {
    vizPage: false,
    sidebarOpen: true
  }
},

methods: {
  toggleSidebar() {
    EventBus.$emit('sidebarToggled')
    this.sidebarOpen = !this.sidebarOpen
  },
  
  toggleFullScreen() {
    const d = document
    if (!d.fullscreenElement && !d.mozFullScreenElement &&
        !d.webkitFullscreenElement && !d.msFullscreenElement) {
      this.goFullScreen()
    } else {
      this.unFullScreen()
    }
  },
  
  goFullScreen() {
    var el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
    } else
    if (el.msRequestFullscreen) {
      el.msRequestFullscreen()
    } else 
    if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen()
    } else 
    if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
  },

  unFullScreen() {
    const d = document
    if (d.exitFullscreen) {
      d.exitFullscreen()
    } else 
    if (d.msExitFullscreen) {
      d.msExitFullscreen()
    } else 
    if (d.mozCancelFullScreen) {
      d.mozCancelFullScreen()
    } else 
    if (d.webkitExitFullscreen) {
      d.webkitExitFullscreen()
    }  
  },

  help() {
    // todo!      
  },

  search() {
    // todo
  }

  },  
  created() {
    EventBus.$on('fullScreen', () => {
      this.goFullScreen()
    })
    EventBus.$on('changePage', (pageNo) => {
      this.vizPage = (pageNo > 6)
    })
  }
}

</script>


<style lang="stylus" scoped>

#header
  height 82px
  display flex
  background $g3
  border-bottom 2px solid $g2
  justify-content space-between

#candInfo
  min-width 800px


#fullscreen-toggle
  margin 0

button
  height 80px
  min-width 80px

#buttons1, #buttons2
  display flex

</style>
